/*
  TP1, partie sécurité — Nœud de surveillance sécurisé — CODE DE DÉPART
  Développement d'applications embarquées — Arduino UNO / Wokwi

  Ce programme compile et fonctionne déjà : il mesure, affiche et émet des trames.
  Il ne respecte pas encore le cahier des charges. Cherchez les marqueurs TODO :
    TODO B1 à B4 : étape B, sûreté de fonctionnement
    TODO C1 à C5 : étape C, cybersécurité
    TODO D1 à D3 : étape D, données et indicateurs

  Câblage (fourni par diagram.json)
    D2   DHT22, broche de données (nommée SDA dans Wokwi)
    D3~  LED RVB : bleu   (anode commune, résistance 220 ohms)
    D4   Contact d'ouverture du boîtier (interrupteur coulissant : broche 1 -> D4, broche 2 -> GND)
    D5~  LED RVB : vert
    D6   Bouton d'acquittement (vers GND)
    D7   Interrupteur d'unité °C / °F (broche 1 -> D7, broche 2 -> GND)
    D8   Buzzer (+)
    D11~ LED RVB : rouge
    A4/A5  Écran LCD 16x2 I2C (SDA / SCL), adresse 0x27

  Moniteur série : 115200 bauds. Trames de télémétrie : '$', événements : '#', réponses : OK / ERR.
*/
#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <EEPROM.h>
#include <avr/wdt.h>

// 1 : commandes de test (injection de fautes) disponibles. 0 : firmware de production.
#define MODE_TEST 1

// ===================== Broches =====================
const uint8_t PIN_DHT = 2;
const uint8_t PIN_BLEU = 3;
const uint8_t PIN_BOITIER = 4;
const uint8_t PIN_VERT = 5;
const uint8_t PIN_BOUTON = 6;
const uint8_t PIN_UNITE = 7;
const uint8_t PIN_BUZZER = 8;
const uint8_t PIN_ROUGE = 11;
const bool ANODE_COMMUNE = true;  // LED RVB de Wokwi : anode commune par défaut

// ===================== Paramètres =====================
const unsigned long PERIODE_ACQ_MS = 2000;   // DHT22 : une mesure toutes les 2 s au plus
const unsigned long PERIODE_TEL_MS = 10000;  // télémétrie périodique
const unsigned long PERIODE_LCD_MS = 500;
const unsigned long ANTI_REBOND_MS = 30;
const uint8_t ECHECS_AVANT_DEFAUT = 3;       // lectures invalides consécutives
const float SEUIL_FROID = 10.0;              // °C
const float ECART_PREALERTE = 2.0;           // pré-alerte à (seuil - 2 °C)
const float HYSTERESIS = 1.0;                // °C
const float SAUT_MAX = 5.0;                  // °C entre deux mesures : au-delà, mesure suspecte
const float SEUIL_MIN = 25.0;
const float SEUIL_MAX = 60.0;
const float SEUIL_DEFAUT = 40.0;
const unsigned long DUREE_SESSION_MS = 120000UL;
const unsigned long VERROU_BASE_MS = 30000UL;
const uint8_t ESSAIS_LIBRES = 3;
const uint8_t LIGNE_MAX = 32;
const uint8_t TAILLE_JOURNAL = 16;
const uint8_t TAILLE_HISTO = 30;             // moyenne glissante sur 30 mesures (1 min)

// ===================== Types =====================
const uint8_t TH_FROID = 0, TH_NORMAL = 1, TH_PREALERTE = 2, TH_ALARME = 3;

const uint8_t ETAT_NORMAL = 0, ETAT_FROID = 1, ETAT_PREALERTE = 2, ETAT_ALARME = 3,
              ETAT_ALARME_ACQ = 4, ETAT_DEFAUT_CAPTEUR = 5, ETAT_INTRUSION = 6;

const uint8_t EVT_DEMARRAGE = 0, EVT_CONFIG_USINE = 1, EVT_CONFIG_CORROMPUE = 2,
              EVT_CONNEXION_OK = 3, EVT_CONNEXION_KO = 4, EVT_VERROUILLAGE = 5,
              EVT_DECONNEXION = 6, EVT_SESSION_EXPIREE = 7, EVT_SEUIL_MODIFIE = 8,
              EVT_PIN_MODIFIE = 9, EVT_COMMANDE_REFUSEE = 10, EVT_LIGNE_INVALIDE = 11,
              EVT_DEFAUT_CAPTEUR = 12, EVT_CAPTEUR_RETABLI = 13, EVT_MESURE_SUSPECTE = 14,
              EVT_ALARME = 15, EVT_FIN_ALARME = 16, EVT_ACQUITTEMENT = 17,
              EVT_OUVERTURE_BOITIER = 18, EVT_FERMETURE_BOITIER = 19,
              EVT_INTRUSION_ACQUITTEE = 20, EVT_TEST = 21;

struct Config {
  uint16_t magic;
  uint8_t version;
  float seuilAlarme;    // °C
  char pin[7];          // 4 à 6 chiffres, complété par des '\0'
  uint8_t pinUsine;     // 1 tant que le PIN d'usine n'a pas été changé
  uint8_t echecs;       // échecs d'authentification consécutifs (persistant)
  uint8_t crc;          // CRC-8 de tous les octets qui précèdent
};

struct Evenement {
  uint32_t t;           // ms depuis le démarrage
  uint8_t code;
  int16_t valeur;
};

struct Stats {
  unsigned long mesures, echecs, suspectes, excursions, dureeAlarmeMs;
  float tMin, tMax;
  int16_t histo[TAILLE_HISTO];  // dixièmes de °C
  uint8_t histoNb, histoPos;
};

const uint16_t CONFIG_MAGIC = 0x5345;  // "SE"
const uint8_t CONFIG_VERSION = 1;
const int CONFIG_ADRESSE = 0;

// ===================== Variables globales =====================
DHT dht(PIN_DHT, DHT22);
LiquidCrystal_I2C lcd(0x27, 16, 2);

Config config;
Evenement journal[TAILLE_JOURNAL];
uint8_t journalDebut = 0, journalNb = 0;
uint16_t journalPerdus = 0;
Stats stats;

float temperature = NAN, humidite = NAN;
float derniereTemperature = NAN;
bool mesureValide = false;
bool mesureSuspecte = false;
uint8_t echecsConsecutifs = 0;
bool defautCapteur = false;
bool defautAcquitte = false;

uint8_t thermique = TH_NORMAL;
bool alarmeAcquittee = false;
unsigned long debutAlarme = 0;

bool boitierOuvert = false;
bool intrusion = false;

bool sessionOuverte = false;
unsigned long derniereActivite = 0;
bool verrouActif = false;
unsigned long finVerrou = 0;

uint8_t etat = ETAT_NORMAL;
bool telemetrieImmediate = true;
uint16_t sequence = 0;

unsigned long tAcquisition = 0, tTelemetrie = 0, tLcd = 0, tBip = 0;
bool buzzerActif = false;

char ligne[LIGNE_MAX + 1];
uint8_t lgLigne = 0;
bool ligneRejetee = false;

char lcdLigne1[17] = "", lcdLigne2[17] = "";

#if MODE_TEST
unsigned long finInjectionDefaut = 0;
bool injectionActive = false;
#endif

// ===================== Outils (fournis) =====================
// CRC-8/MAXIM (polynôme 0x31, forme réfléchie 0x8C). Vérification : "123456789" -> 0xA1
uint8_t crc8(const uint8_t *donnees, size_t n) {
  uint8_t crc = 0x00;
  while (n--) {
    uint8_t octet = *donnees++;
    for (uint8_t i = 0; i < 8; i++) {
      const uint8_t melange = (crc ^ octet) & 0x01;
      crc >>= 1;
      if (melange) crc ^= 0x8C;
      octet >>= 1;
    }
  }
  return crc;
}

// CRC-16/CCITT-FALSE (polynôme 0x1021, init 0xFFFF). Vérification : "123456789" -> 0x29B1
uint16_t crc16(const char *texte) {
  uint16_t crc = 0xFFFF;
  while (*texte) {
    crc ^= (uint16_t)(uint8_t)(*texte++) << 8;
    for (uint8_t i = 0; i < 8; i++) {
      crc = (crc & 0x8000) ? (uint16_t)((crc << 1) ^ 0x1021) : (uint16_t)(crc << 1);
    }
  }
  return crc;
}

bool est(const char *mot, const __FlashStringHelper *reference) {
  return strcmp_P(mot, (PGM_P)reference) == 0;
}

void enMajuscules(char *s) {
  for (; *s; s++) *s = toupper(*s);
}

// Délai écoulé sans risque de débordement de millis() (49,7 jours)
bool echu(unsigned long echeance, unsigned long maintenant) {
  return (long)(maintenant - echeance) >= 0;
}

// ===================== Journal d'audit (fourni) =====================
const __FlashStringHelper *nomEvenement(uint8_t code) {
  switch (code) {
    case EVT_DEMARRAGE: return F("DEMARRAGE");
    case EVT_CONFIG_USINE: return F("CONFIG_USINE");
    case EVT_CONFIG_CORROMPUE: return F("CONFIG_CORROMPUE");
    case EVT_CONNEXION_OK: return F("CONNEXION_OK");
    case EVT_CONNEXION_KO: return F("CONNEXION_KO");
    case EVT_VERROUILLAGE: return F("VERROUILLAGE");
    case EVT_DECONNEXION: return F("DECONNEXION");
    case EVT_SESSION_EXPIREE: return F("SESSION_EXPIREE");
    case EVT_SEUIL_MODIFIE: return F("SEUIL_MODIFIE");
    case EVT_PIN_MODIFIE: return F("PIN_MODIFIE");
    case EVT_COMMANDE_REFUSEE: return F("COMMANDE_REFUSEE");
    case EVT_LIGNE_INVALIDE: return F("LIGNE_INVALIDE");
    case EVT_DEFAUT_CAPTEUR: return F("DEFAUT_CAPTEUR");
    case EVT_CAPTEUR_RETABLI: return F("CAPTEUR_RETABLI");
    case EVT_MESURE_SUSPECTE: return F("MESURE_SUSPECTE");
    case EVT_ALARME: return F("ALARME");
    case EVT_FIN_ALARME: return F("FIN_ALARME");
    case EVT_ACQUITTEMENT: return F("ACQUITTEMENT");
    case EVT_OUVERTURE_BOITIER: return F("OUVERTURE_BOITIER");
    case EVT_FERMETURE_BOITIER: return F("FERMETURE_BOITIER");
    case EVT_INTRUSION_ACQUITTEE: return F("INTRUSION_ACQUITTEE");
    case EVT_TEST: return F("TEST");
    default: return F("INCONNU");
  }
}

void journaliser(uint8_t code, int16_t valeur) {
  const uint8_t i = (journalDebut + journalNb) % TAILLE_JOURNAL;
  if (journalNb < TAILLE_JOURNAL) {
    journalNb++;
  } else {  // journal plein : on écrase le plus ancien, et on le compte
    journalDebut = (journalDebut + 1) % TAILLE_JOURNAL;
    journalPerdus++;
  }
  journal[i].t = millis();
  journal[i].code = code;
  journal[i].valeur = valeur;
  Serial.print(F("# EVT "));
  Serial.print(nomEvenement(code));
  Serial.print(' ');
  Serial.println(valeur);
}

void afficherJournal() {
  Serial.print(F("OK journal : "));
  Serial.print(journalNb);
  Serial.print(F(" evenements, "));
  Serial.print(journalPerdus);
  Serial.println(F(" ecrases"));
  for (uint8_t k = 0; k < journalNb; k++) {
    const Evenement &e = journal[(journalDebut + k) % TAILLE_JOURNAL];
    Serial.print(F("  "));
    Serial.print(e.t / 1000.0, 3);
    Serial.print(F(" s  "));
    Serial.print(nomEvenement(e.code));
    Serial.print(' ');
    Serial.println(e.valeur);
  }
}

// ===================== Configuration en EEPROM =====================
uint8_t crcConfig(const Config &c) {
  // CRC de tous les octets situés avant le champ crc
  return crc8(reinterpret_cast<const uint8_t *>(&c), offsetof(Config, crc));
}

void configUsine() {
  memset(&config, 0, sizeof(config));
  config.magic = CONFIG_MAGIC;
  config.version = CONFIG_VERSION;
  config.seuilAlarme = SEUIL_DEFAUT;
  strcpy(config.pin, "0000");
  config.pinUsine = 1;
  config.echecs = 0;
}

void sauverConfig() {
  config.crc = crcConfig(config);
  EEPROM.put(CONFIG_ADRESSE, config);  // put() n'écrit que les octets modifiés (usure)
}

void chargerConfig() {
  EEPROM.get(CONFIG_ADRESSE, config);
  // TODO C4 (SEC-4) : la configuration lue n'est pas vérifiée !
  //   Vérifier magic, version, CRC (crcConfig), bornes du seuil et fin du PIN (pin[6] == '\0').
  //   Si elle est invalide : journaliser EVT_CONFIG_USINE (EEPROM vierge, magic == 0xFFFF)
  //   ou EVT_CONFIG_CORROMPUE, puis configUsine() et sauverConfig().
  if (config.magic != CONFIG_MAGIC) {
    journaliser(EVT_CONFIG_USINE, 0);
    configUsine();
    sauverConfig();
  }
}

// ===================== Sorties : LED RVB et buzzer (fournies) =====================
void couleur(bool r, bool v, bool b) {
  // digitalWrite (et non analogWrite) : pas de conflit avec tone(), qui utilise le Timer2 (broches 3 et 11)
  digitalWrite(PIN_ROUGE, (r != ANODE_COMMUNE) ? HIGH : LOW);
  digitalWrite(PIN_VERT, (v != ANODE_COMMUNE) ? HIGH : LOW);
  digitalWrite(PIN_BLEU, (b != ANODE_COMMUNE) ? HIGH : LOW);
}

void bip(unsigned long maintenant, unsigned int frequence, unsigned long periode, unsigned long duree) {
  if (!buzzerActif || maintenant - tBip >= periode) {
    tBip = maintenant;
    tone(PIN_BUZZER, frequence, duree);  // non bloquant
    buzzerActif = true;
  }
}

void silence() {
  if (buzzerActif) {
    noTone(PIN_BUZZER);
    buzzerActif = false;
  }
}

void appliquerSorties(unsigned long maintenant) {
  const bool lent = (maintenant / 500) % 2;    // 1 Hz
  const bool rapide = (maintenant / 125) % 2;  // 4 Hz
  switch (etat) {
    case ETAT_NORMAL: couleur(false, true, false); silence(); break;
    case ETAT_FROID: couleur(false, false, true); silence(); break;
    case ETAT_PREALERTE: couleur(true, true, false); silence(); break;  // jaune
    case ETAT_ALARME: couleur(lent, false, false); bip(maintenant, 1000, 600, 300); break;
    case ETAT_ALARME_ACQ: couleur(true, false, false); silence(); break;
    case ETAT_DEFAUT_CAPTEUR:  // magenta clignotant
      couleur(lent, false, lent);
      if (defautAcquitte) silence(); else bip(maintenant, 800, 5000, 150);
      break;
    case ETAT_INTRUSION: couleur(rapide, rapide, rapide); bip(maintenant, 2000, 250, 125); break;
  }
}

void autotest() {  // test des voyants au démarrage
  couleur(true, false, false); delay(150);
  couleur(false, true, false); delay(150);
  couleur(false, false, true); delay(150);
  couleur(false, false, false);
  tone(PIN_BUZZER, 1500, 100);
  delay(120);
}

// ===================== Acquisition et sûreté =====================
uint8_t evaluerThermique(float t, uint8_t precedent) {
  // TODO B1 (SÛR-2) : version sans hystérésis. Utiliser « precedent » pour qu'un état
  //   ne soit quitté qu'après un retour de HYSTERESIS °C sous (ou au-dessus) de son seuil.
  (void)precedent;
  const float sA = config.seuilAlarme;
  if (t >= sA) return TH_ALARME;
  if (t >= sA - ECART_PREALERTE) return TH_PREALERTE;
  if (t < SEUIL_FROID) return TH_FROID;
  return TH_NORMAL;
}

void ajouterHistorique(float t) {
  stats.histo[stats.histoPos] = (int16_t)(t * 10.0 + (t >= 0 ? 0.5 : -0.5));
  stats.histoPos = (stats.histoPos + 1) % TAILLE_HISTO;
  if (stats.histoNb < TAILLE_HISTO) stats.histoNb++;
  if (stats.mesures - stats.echecs == 1 || t < stats.tMin) stats.tMin = t;
  if (stats.mesures - stats.echecs == 1 || t > stats.tMax) stats.tMax = t;
}

void mettreAJourThermique(float t, unsigned long maintenant) {
  const uint8_t nouvel = evaluerThermique(t, thermique);
  if (nouvel == thermique) return;
  if (nouvel == TH_ALARME) {
    journaliser(EVT_ALARME, (int16_t)(t * 10));
    stats.excursions++;
    debutAlarme = maintenant;
    alarmeAcquittee = false;
  } else if (thermique == TH_ALARME) {
    journaliser(EVT_FIN_ALARME, (int16_t)(t * 10));
    stats.dureeAlarmeMs += maintenant - debutAlarme;
    alarmeAcquittee = false;
  }
  thermique = nouvel;
}

void acquerir(unsigned long maintenant) {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
#if MODE_TEST
  if (injectionActive) {
    if (echu(finInjectionDefaut, maintenant)) injectionActive = false;
    else { h = NAN; t = NAN; }
  }
#endif
  stats.mesures++;
  if (isnan(h) || isnan(t)) {
    stats.echecs++;
    mesureValide = false;
    // TODO B2 (SÛR-1) : compter les échecs consécutifs (echecsConsecutifs). Au 3e
    //   (ECHECS_AVANT_DEFAUT), passer defautCapteur à true et journaliser EVT_DEFAUT_CAPTEUR.
    return;
  }
  // TODO B2 (SÛR-1) : remettre le compteur à zéro ; si le capteur était en défaut,
  //   lever le défaut et journaliser EVT_CAPTEUR_RETABLI.

  // TODO D2 (DATA-2) : contrôle de vraisemblance. Si l'écart avec derniereTemperature
  //   dépasse SAUT_MAX, compter la mesure suspecte, mettre mesureSuspecte à true et
  //   journaliser EVT_MESURE_SUSPECTE (une seule fois par série). La mesure reste utilisée.
  temperature = t;
  humidite = h;
  derniereTemperature = t;
  mesureValide = true;
  ajouterHistorique(t);
  mettreAJourThermique(t, maintenant);
}

uint8_t calculerEtat() {
  if (intrusion) return ETAT_INTRUSION;
  if (defautCapteur) return ETAT_DEFAUT_CAPTEUR;
  switch (thermique) {
    case TH_ALARME: return alarmeAcquittee ? ETAT_ALARME_ACQ : ETAT_ALARME;
    case TH_PREALERTE: return ETAT_PREALERTE;
    case TH_FROID: return ETAT_FROID;
    default: return ETAT_NORMAL;
  }
}

const __FlashStringHelper *nomEtat(uint8_t e) {
  switch (e) {
    case ETAT_NORMAL: return F("NORMAL");
    case ETAT_FROID: return F("FROID");
    case ETAT_PREALERTE: return F("PREALERTE");
    case ETAT_ALARME: return F("ALARME");
    case ETAT_ALARME_ACQ: return F("ALARME_ACQ");
    case ETAT_DEFAUT_CAPTEUR: return F("DEFAUT_CAPTEUR");
    case ETAT_INTRUSION: return F("INTRUSION");
    default: return F("INCONNU");
  }
}

const __FlashStringHelper *libelleLCD(uint8_t e) {
  switch (e) {
    case ETAT_NORMAL: return F("NORMAL");
    case ETAT_FROID: return F("FROID");
    case ETAT_PREALERTE: return F("PRE-ALERTE");
    case ETAT_ALARME: return F("ALARME !");
    case ETAT_ALARME_ACQ: return F("ALARME ACQ.");
    case ETAT_DEFAUT_CAPTEUR: return F("DEF. CAPTEUR");
    case ETAT_INTRUSION: return F("INTRUSION !");
    default: return F("?");
  }
}

// ===================== Entrées : bouton et boîtier =====================
bool appuiBouton(unsigned long maintenant) {
  static uint8_t stable = HIGH, brutPrecedent = HIGH;
  static unsigned long tChangement = 0;
  const uint8_t brut = digitalRead(PIN_BOUTON);
  if (brut != brutPrecedent) {
    brutPrecedent = brut;
    tChangement = maintenant;
  }
  if (maintenant - tChangement >= ANTI_REBOND_MS && brut != stable) {
    stable = brut;
    return stable == LOW;  // front descendant = appui
  }
  return false;
}

void acquittementLocal() {
  // TODO B3 (SÛR-3) : en ETAT_ALARME, acquitter (alarmeAcquittee = true) et journaliser
  //   EVT_ACQUITTEMENT. En ETAT_DEFAUT_CAPTEUR, couper les bips (defautAcquitte = true).
  //   Une intrusion ne s'acquitte jamais avec le bouton.
}

void fermerSession(uint8_t evenement) {
  if (!sessionOuverte) return;
  sessionOuverte = false;
  journaliser(evenement, 0);
}

void surveillerBoitier(unsigned long maintenant) {
  // TODO C5 (SEC-5) : boîtier fermé = D4 relié à GND = LOW ; ouvert ou fil coupé = HIGH.
  //   Filtrer les rebonds (50 ms). À l'ouverture : boitierOuvert = true, intrusion = true,
  //   journaliser EVT_OUVERTURE_BOITIER et fermer la session. À la fermeture : journaliser
  //   EVT_FERMETURE_BOITIER (l'intrusion reste active jusqu'à ACQUITTER).
  (void)maintenant;
}

// ===================== Authentification =====================
bool formatPinValide(const char *p) {
  const size_t n = strlen(p);
  if (n < 4 || n > 6) return false;
  for (size_t i = 0; i < n; i++) {
    if (!isdigit(p[i])) return false;
  }
  return true;
}

// Comparaison en temps constant : la durée ne dépend pas de la position de la 1re différence
bool pinEgal(const char *saisi, const char *attendu) {
  if (strlen(saisi) > 6) return false;
  char tampon[7];
  memset(tampon, 0, sizeof(tampon));
  strncpy(tampon, saisi, 6);
  uint8_t difference = 0;
  for (uint8_t i = 0; i < 7; i++) difference |= (uint8_t)(tampon[i] ^ attendu[i]);
  return difference == 0;
}

bool verrouille(unsigned long maintenant) {
  if (verrouActif && echu(finVerrou, maintenant)) verrouActif = false;
  return verrouActif;
}

void refuser(const char *commande, const __FlashStringHelper *raison) {
  Serial.print(F("ERR "));
  Serial.println(raison);
  journaliser(EVT_COMMANDE_REFUSEE, (int16_t)commande[0]);  // on ne journalise jamais un secret
}

void connexion(const char *pin) {
  const unsigned long maintenant = millis();
  // TODO C2 (SEC-1) : refuser toute tentative pendant un verrouillage (verrouille()).
  //   En cas d'échec : config.echecs++, sauverConfig(), journaliser EVT_CONNEXION_KO ;
  //   à partir de ESSAIS_LIBRES échecs, verrouiller VERROU_BASE_MS << (echecs - ESSAIS_LIBRES)
  //   (8 min au plus) et journaliser EVT_VERROUILLAGE. En cas de succès : remettre echecs à 0.
  if (pin != NULL && formatPinValide(pin) && pinEgal(pin, config.pin)) {
    sessionOuverte = true;
    derniereActivite = maintenant;
    journaliser(EVT_CONNEXION_OK, 0);
    if (config.pinUsine) Serial.println(F("OK session ouverte. PIN d'usine : changez-le (PIN <ancien> <nouveau>)"));
    else Serial.println(F("OK session ouverte"));
    return;
  }
  journaliser(EVT_CONNEXION_KO, 0);
  Serial.println(F("ERR PIN incorrect"));
}

void changerPin(const char *ancien, const char *nouveau) {
  // TODO C3 (SEC-3) : vérifier l'ancien PIN (sinon : échec d'authentification et fermeture
  //   de session), exiger 4 à 6 chiffres, refuser les PIN triviaux (1111, 1234, 4321...)
  //   et l'ancien PIN, puis enregistrer (config.pinUsine = 0) et journaliser EVT_PIN_MODIFIE.
  (void)ancien;
  (void)nouveau;
  refuser("PIN", F("changement de PIN non implemente"));
}

// ===================== Commandes =====================
bool lireDecimal(const char *s, float &valeur) {
  // TODO C1 (SEC-2) : accepter uniquement 1 ou 2 chiffres, éventuellement suivis
  //   de '.' et d'un chiffre (35 ou 35.5). Refuser tout le reste ("35abc", "-5", "1e3"...).
  //   Interdit : atof(), qui renvoie 35 pour "35abc" et 0 pour "abc" sans signaler d'erreur.
  (void)s;
  (void)valeur;
  return false;
}

void changerSeuil(const char *texte) {
  float valeur;
  if (texte == NULL || !lireDecimal(texte, valeur)) {
    refuser("SEUIL", F("format attendu : SEUIL 35 ou SEUIL 35.5"));
    return;
  }
  // TODO C1 (SEC-2) : refuser une valeur hors de [SEUIL_MIN ; SEUIL_MAX].
  config.seuilAlarme = valeur;
  sauverConfig();
  journaliser(EVT_SEUIL_MODIFIE, (int16_t)(valeur * 10));
  Serial.print(F("OK seuil d'alarme = "));
  Serial.println(valeur, 1);
}

void acquitter() {
  if (intrusion) {
    if (boitierOuvert) {
      refuser("ACQUITTER", F("refermer le boitier avant d'acquitter"));
      return;
    }
    intrusion = false;
    journaliser(EVT_INTRUSION_ACQUITTEE, 0);
  }
  if (thermique == TH_ALARME && !alarmeAcquittee) {
    alarmeAcquittee = true;
    journaliser(EVT_ACQUITTEMENT, 1);
  }
  Serial.println(F("OK acquitte"));
}

void afficherEtat() {
  Serial.print(F("OK etat="));
  Serial.print(nomEtat(etat));
  Serial.print(F(" T="));
  if (mesureValide) Serial.print(temperature, 1); else Serial.print(F("--"));
  Serial.print(F("C H="));
  if (mesureValide) Serial.print(humidite, 1); else Serial.print(F("--"));
  Serial.print(F("% seuil="));
  Serial.print(config.seuilAlarme, 1);
  Serial.print(F("C session="));
  Serial.print(sessionOuverte ? F("oui") : F("non"));
  Serial.print(F(" boitier="));
  Serial.print(boitierOuvert ? F("ouvert") : F("ferme"));
  Serial.print(F(" uptime="));
  Serial.print(millis() / 1000);
  Serial.println(F("s"));
}

void afficherStats() {
  // TODO D3 (DATA-3) : afficher le nombre de mesures, d'échecs (et leur taux en %),
  //   de mesures suspectes, Tmin, Tmax, la moyenne des stats.histoNb dernières mesures
  //   (stats.histo, en dixièmes de °C), le nombre d'alarmes et leur durée cumulée.
  Serial.print(F("OK mesures="));
  Serial.println(stats.mesures);
}

void afficherAide() {
  Serial.println(F("OK commandes : AIDE, ETAT, STATS, CONNEXION <pin>"));
  if (sessionOuverte) {
    Serial.println(F("   session : DECONNEXION, PIN <ancien> <nouveau>, SEUIL <valeur>, JOURNAL, ACQUITTER"));
#if MODE_TEST
    Serial.println(F("   tests   : TEST CAPTEUR | TEST BLOCAGE | TEST CORROMPRE"));
#endif
  }
}

#if MODE_TEST
void commandeTest(const char *quoi) {
  char mot[12] = "";
  if (quoi != NULL) {
    strncpy(mot, quoi, sizeof(mot) - 1);
    enMajuscules(mot);
  }
  if (est(mot, F("CAPTEUR"))) {
    injectionActive = true;
    finInjectionDefaut = millis() + 10000;
    journaliser(EVT_TEST, 1);
    Serial.println(F("OK lectures du capteur forcees en echec pendant 10 s"));
  } else if (est(mot, F("BLOCAGE"))) {
    journaliser(EVT_TEST, 2);
    Serial.println(F("OK blocage volontaire : le chien de garde doit redemarrer la carte"));
    Serial.flush();
    while (true) {
    }
  } else if (est(mot, F("CORROMPRE"))) {
    const int adresse = CONFIG_ADRESSE + offsetof(Config, seuilAlarme);
    EEPROM.write(adresse, EEPROM.read(adresse) ^ 0x01);  // un bit modifié, CRC non recalculé
    journaliser(EVT_TEST, 3);
    Serial.println(F("OK un bit de la configuration a ete modifie en EEPROM. Redemarrer : TEST BLOCAGE"));
  } else {
    refuser("TEST", F("usage : TEST CAPTEUR | TEST BLOCAGE | TEST CORROMPRE"));
  }
}
#endif

bool nombreArguments(uint8_t attendu, const char *a1, const char *a2) {
  const uint8_t n = (a1 != NULL) + (a2 != NULL);
  return n == attendu;
}

void traiterCommande(char *texte) {
  char *cmd = strtok(texte, " ");
  if (cmd == NULL) return;
  char *a1 = strtok(NULL, " ");
  char *a2 = strtok(NULL, " ");
  char *enTrop = strtok(NULL, " ");
  enMajuscules(cmd);
  if (enTrop != NULL) {
    refuser(cmd, F("trop d'arguments"));
    return;
  }

  // ----- Commandes publiques -----
  if (est(cmd, F("AIDE")) && nombreArguments(0, a1, a2)) { afficherAide(); return; }
  if (est(cmd, F("ETAT")) && nombreArguments(0, a1, a2)) { afficherEtat(); return; }
  if (est(cmd, F("STATS")) && nombreArguments(0, a1, a2)) { afficherStats(); return; }
  if (est(cmd, F("CONNEXION")) && nombreArguments(1, a1, a2)) { connexion(a1); return; }

  // ----- Commandes réservées à une session authentifiée -----
  if (!sessionOuverte) {
    refuser(cmd, F("commande inconnue ou session requise"));  // on ne dévoile pas la liste
    return;
  }
  derniereActivite = millis();
  if (est(cmd, F("DECONNEXION")) && nombreArguments(0, a1, a2)) {
    fermerSession(EVT_DECONNEXION);
    Serial.println(F("OK session fermee"));
    return;
  }
  if (est(cmd, F("PIN")) && nombreArguments(2, a1, a2)) { changerPin(a1, a2); return; }
  // TODO C3 (SEC-3) : tant que config.pinUsine vaut 1, refuser toutes les commandes suivantes.
  if (est(cmd, F("SEUIL")) && nombreArguments(1, a1, a2)) { changerSeuil(a1); return; }
  if (est(cmd, F("JOURNAL")) && nombreArguments(0, a1, a2)) { afficherJournal(); return; }
  if (est(cmd, F("ACQUITTER")) && nombreArguments(0, a1, a2)) { acquitter(); return; }
#if MODE_TEST
  if (est(cmd, F("TEST")) && nombreArguments(1, a1, a2)) { commandeTest(a1); return; }
#endif
  refuser(cmd, F("commande inconnue ou arguments invalides"));
}

// Lecture non bloquante d'une ligne : 32 caractères imprimables au plus, sinon la ligne est rejetée.
void lireConsole() {
  while (Serial.available() > 0) {
    const char c = (char)Serial.read();
    if (c == '\r' || c == '\n') {
      if (ligneRejetee) {
        journaliser(EVT_LIGNE_INVALIDE, lgLigne);
        Serial.println(F("ERR ligne rejetee (trop longue ou caractere interdit)"));
      } else if (lgLigne > 0) {
        ligne[lgLigne] = '\0';
        traiterCommande(ligne);
      }
      lgLigne = 0;
      ligneRejetee = false;
    } else if (c < 0x20 || c > 0x7E) {
      ligneRejetee = true;  // caractère de contrôle ou non ASCII
    } else if (lgLigne < LIGNE_MAX) {
      ligne[lgLigne++] = c;
    } else {
      ligneRejetee = true;  // jamais d'écriture au-delà du tampon
    }
  }
}

void gererSession(unsigned long maintenant) {
  if (sessionOuverte && maintenant - derniereActivite > DUREE_SESSION_MS) {
    fermerSession(EVT_SESSION_EXPIREE);
    Serial.println(F("# session expiree"));
  }
}

// ===================== Télémétrie =====================
const __FlashStringHelper *qualite() {
  if (defautCapteur) return F("DEFAUT");
  if (!mesureValide) return F("INVALIDE");
  if (mesureSuspecte) return F("SUSPECT");
  return F("OK");
}

void envoyerTelemetrie() {
  // TODO D1 (DATA-1) : construire la trame complète, par exemple
  //   $TEL,<sequence>,<millis>,<temperature>,<humidite>,<etat>,<qualite>*<CRC16 en 4 chiffres hexa>
  //   Le CRC porte sur les caractères entre '$' et '*'. Utiliser dtostrf() pour les réels :
  //   le printf de l'AVR ne gère pas %f. Incrémenter sequence à chaque trame.
  Serial.print(F("$TEL,"));
  Serial.print(temperature, 1);
  Serial.print(',');
  Serial.println(nomEtat(etat));
}

// ===================== Écran LCD (fourni) =====================
void afficherLCD() {
  char l1[17], l2[17];
  if (mesureValide) {
    const bool fahrenheit = (digitalRead(PIN_UNITE) == HIGH);  // interrupteur vers la droite
    const float valeur = fahrenheit ? temperature * 9.0 / 5.0 + 32.0 : temperature;
    char tTxt[8], hTxt[6];
    dtostrf(valeur, 5, 1, tTxt);
    dtostrf(humidite, 3, 0, hTxt);
    snprintf_P(l1, sizeof(l1), PSTR("T:%s%c%c H:%s%%"), tTxt, (char)223, fahrenheit ? 'F' : 'C', hTxt);
  } else {
    strcpy_P(l1, PSTR("T: --.-   H: --%"));
  }
  snprintf_P(l2, sizeof(l2), PSTR("%-13S%s"), (PGM_P)libelleLCD(etat), sessionOuverte ? "[M]" : "   ");
  if (strcmp(l1, lcdLigne1) != 0) {  // on ne réécrit que ce qui change : pas de scintillement
    lcd.setCursor(0, 0);
    lcd.print(l1);
    strcpy(lcdLigne1, l1);
  }
  if (strcmp(l2, lcdLigne2) != 0) {
    lcd.setCursor(0, 1);
    lcd.print(l2);
    strcpy(lcdLigne2, l2);
  }
}

// ===================== Programme principal =====================
void setup() {
  const uint8_t causeReset = MCUSR;  // à lire avant toute autre chose
  MCUSR = 0;
  wdt_disable();  // après un reset par le chien de garde, celui-ci reste actif

  pinMode(PIN_ROUGE, OUTPUT);
  pinMode(PIN_VERT, OUTPUT);
  pinMode(PIN_BLEU, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_BOUTON, INPUT_PULLUP);
  pinMode(PIN_BOITIER, INPUT_PULLUP);
  pinMode(PIN_UNITE, INPUT_PULLUP);
  couleur(false, false, false);

  Serial.begin(115200);
  Serial.println(F("# Noeud de surveillance securise - tapez AIDE"));
  journaliser(EVT_DEMARRAGE, causeReset);  // bits de MCUSR : 0 PORF, 1 EXTRF, 2 BORF, 3 WDRF
  if (causeReset & _BV(WDRF)) Serial.println(F("# Redemarrage provoque par le chien de garde"));

  chargerConfig();
  // TODO C2 (SEC-1) : si config.echecs >= ESSAIS_LIBRES, le verrouillage doit reprendre au démarrage.

  dht.begin();
  lcd.init();
  lcd.backlight();
  autotest();

  const unsigned long maintenant = millis();
  tAcquisition = maintenant - PERIODE_ACQ_MS + 1000;  // première mesure 1 s après le démarrage
  tTelemetrie = maintenant;
  tLcd = maintenant;
  // TODO B4 (SÛR-4) : activer le chien de garde (2 s) en toute fin de setup().
}

void loop() {
  // TODO B4 (SÛR-4) : réarmer le chien de garde, ici et nulle part ailleurs.
  const unsigned long maintenant = millis();

  lireConsole();
  surveillerBoitier(maintenant);
  if (appuiBouton(maintenant)) acquittementLocal();

  if (maintenant - tAcquisition >= PERIODE_ACQ_MS) {
    tAcquisition += PERIODE_ACQ_MS;
    acquerir(maintenant);
  }
  gererSession(maintenant);

  const uint8_t nouvelEtat = calculerEtat();
  if (nouvelEtat != etat) {
    etat = nouvelEtat;
    telemetrieImmediate = true;  // transmission sur changement d'état
  }
  if (telemetrieImmediate || maintenant - tTelemetrie >= PERIODE_TEL_MS) {
    envoyerTelemetrie();
    tTelemetrie = maintenant;
    telemetrieImmediate = false;
  }

  appliquerSorties(maintenant);
  if (maintenant - tLcd >= PERIODE_LCD_MS) {
    tLcd = maintenant;
    afficherLCD();
  }
}
