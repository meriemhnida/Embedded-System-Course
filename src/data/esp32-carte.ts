// Composants de la carte ESP32 DevKit (module ESP32-WROOM-32, 30 broches), telle qu'elle figure sur le schéma
// de brochage du cours. Pour compléter une fiche, il suffit d'ajouter des lignes à `points`.
export type Categorie = 'traitement' | 'sansfil' | 'alimentation' | 'communication' | 'commande' | 'connectique';

export interface Element {
	id: string;
	label: string;
	categorie: Categorie;
	titre: string;
	resume: string;
	points: string[];
	repere: string;
	lien?: { texte: string; href: string };
}

export const categories: { id: Categorie; nom: string; couleur: string }[] = [
	{ id: 'traitement', nom: 'Traitement et mémoire', couleur: '#7c3aed' },
	{ id: 'sansfil', nom: 'Sans fil', couleur: '#0e7490' },
	{ id: 'alimentation', nom: 'Alimentation', couleur: '#dc2626' },
	{ id: 'communication', nom: 'Liaison avec l’ordinateur', couleur: '#2563eb' },
	{ id: 'commande', nom: 'Commande et signalisation', couleur: '#a16207' },
	{ id: 'connectique', nom: 'Broches', couleur: '#86198f' },
];

const base = '/Embedded-System-Course/parcours/chapitre-6/';

export const elements: Record<string, Element> = {
	module: {
		id: 'module',
		label: 'Module ESP32-WROOM-32',
		categorie: 'traitement',
		titre: 'Le module ESP32-WROOM-32',
		resume: 'Le cœur du système : sous le capot métallique se trouvent la puce ESP32 et sa mémoire.',
		points: [
			'La puce ESP32-D0WDQ6 : microcontrôleur 32 bits double cœur (processeur Xtensa, jusqu’à 240 MHz), 520 Ko de SRAM.',
			'Une mémoire flash de 4 Mo, qui contient le programme.',
			'Un quartz qui cadence le microcontrôleur.',
			'Le capot métallique est un blindage : il protège les circuits radio des perturbations.',
			'Autres modules de la famille : ESP32-WROOM-32D (puce ESP32-D0WD), ESP32-WROVER-IB (ESP32-D0WD + PSRAM additionnelle).',
		],
		repere: 'Le grand rectangle métallique, en haut de la carte.',
		lien: { texte: 'La famille ESP32', href: `${base}02-presentation-esp32/` },
	},
	antenne: {
		id: 'antenne',
		label: 'Antenne Wi-Fi / Bluetooth',
		categorie: 'sansfil',
		titre: 'L’antenne Wi-Fi et Bluetooth',
		resume: 'Une antenne gravée directement sur le circuit imprimé (antenne PCB).',
		points: [
			'Elle émet et reçoit les ondes du Wi-Fi 802.11 b/g/n et du Bluetooth (Classic et BLE), sans module externe.',
			'C’est l’avantage majeur de l’ESP32 sur l’Arduino UNO : la connectivité est native.',
			'Évitez de placer du métal ou un plan de masse sous l’antenne : la portée diminuerait.',
		],
		repere: 'Le motif en zigzag tout en haut de la carte.',
		lien: { texte: 'Pourquoi l’ESP32 ?', href: `${base}01-pourquoi-esp32/` },
	},
	ledpower: {
		id: 'ledpower',
		label: 'LED POWER',
		categorie: 'alimentation',
		titre: 'La LED d’alimentation (POWER)',
		resume: 'Une LED rouge qui s’allume dès que la carte est alimentée.',
		points: ['Premier réflexe de dépannage : si elle est éteinte, la carte n’est pas alimentée (câble, port USB).'],
		repere: 'Sous le module, à gauche.',
	},
	led2: {
		id: 'led2',
		label: 'LED GPIO 2',
		categorie: 'commande',
		titre: 'La LED intégrée (GPIO 2)',
		resume: 'Une LED bleue reliée à la broche GPIO 2.',
		points: [
			'GPIO 2 est souvent utilisé comme LED intégrée sur certaines cartes ESP32.',
			'Elle permet un premier programme sans aucun câblage : pinMode(2, OUTPUT); puis digitalWrite(2, HIGH);',
			'Essayez le bouton « Programme Blink » sous la carte.',
		],
		repere: 'Sous le module, à droite.',
		lien: { texte: 'Les broches GPIO', href: `${base}04-broches-gpio/` },
	},
	regulateur: {
		id: 'regulateur',
		label: 'Régulateur 3,3 V',
		categorie: 'alimentation',
		titre: 'Le régulateur de tension (AMS1117-3.3)',
		resume: 'Il abaisse le 5 V du port USB (ou de la broche VIN) à 3,3 V, la tension de travail de l’ESP32.',
		points: [
			'Toutes les broches de l’ESP32 travaillent en 3,3 V : niveau haut = 3,3 V, et non 5 V comme sur l’Arduino UNO.',
			'La broche 3V3 de la carte donne accès à cette tension pour alimenter un capteur.',
			'Un signal de 5 V appliqué sur une broche peut endommager l’ESP32.',
		],
		repere: 'Le composant à trois pattes, en bas à gauche.',
	},
	usbserie: {
		id: 'usbserie',
		label: 'Convertisseur USB-série',
		categorie: 'communication',
		titre: 'Le convertisseur USB-série (CP2102)',
		resume: 'Il traduit l’USB de l’ordinateur en liaison série (UART0) pour l’ESP32.',
		points: [
			'C’est par lui que passent le téléversement du programme et les messages du moniteur série (Serial.print).',
			'Il est relié aux broches TX0 (GPIO 1) et RX0 (GPIO 3) : on évite d’y brancher autre chose.',
			'Certaines cartes utilisent un autre convertisseur (CH340) : il faut alors installer le pilote correspondant sur l’ordinateur.',
		],
		repere: 'La petite puce carrée, en bas à droite.',
		lien: { texte: 'L’UART', href: `${base}07-communication/` },
	},
	usb: {
		id: 'usb',
		label: 'Port micro-USB',
		categorie: 'alimentation',
		titre: 'Le port micro-USB',
		resume: 'Il alimente la carte en 5 V et la relie à l’ordinateur.',
		points: [
			'Un seul câble suffit : alimentation, téléversement du programme et moniteur série.',
			'Utilisez un câble USB de données : certains câbles ne servent qu’à la charge et la carte n’est alors pas détectée.',
			'Essayez le bouton « Simuler un téléversement » sous la carte.',
		],
		repere: 'En bas, au centre, entre les boutons EN et BOOT.',
	},
	en: {
		id: 'en',
		label: 'Bouton EN',
		categorie: 'commande',
		titre: 'Le bouton EN (Enable)',
		resume: 'Il redémarre le microcontrôleur : le programme reprend depuis le début (reset).',
		points: [
			'Il agit comme la broche EN : à l’état bas, l’ESP32 s’arrête ; relâché, il redémarre.',
			'Utile pour relancer le programme sans débrancher la carte, et revoir les messages de setup() dans le moniteur série.',
			'Cliquez sur le bouton EN du schéma pour voir le redémarrage.',
		],
		repere: 'En bas à gauche, à côté du port USB.',
	},
	boot: {
		id: 'boot',
		label: 'Bouton BOOT',
		categorie: 'commande',
		titre: 'Le bouton BOOT',
		resume: 'Relié à GPIO 0, il place l’ESP32 en mode téléchargement quand on redémarre en le maintenant enfoncé.',
		points: [
			'En général, l’IDE Arduino passe automatiquement la carte en mode téléchargement.',
			'Si le téléversement reste bloqué sur « Connecting… », maintenez BOOT enfoncé jusqu’au début de l’écriture.',
			'Une fois le programme lancé, il peut servir de bouton-poussoir : digitalRead(0) vaut LOW quand il est enfoncé.',
		],
		repere: 'En bas à droite, à côté du port USB.',
	},
	broches: {
		id: 'broches',
		label: 'Broches (30)',
		categorie: 'connectique',
		titre: 'Les 30 broches de la carte',
		resume: '15 broches de chaque côté : 25 GPIO, l’alimentation (VIN, 3V3), deux masses (GND) et EN.',
		points: [
			'Le microcontrôleur ESP32 compte 34 GPIO programmables ; cette carte en rend 25 accessibles.',
			'Chaque broche cumule plusieurs fonctions : entrée/sortie numérique, ADC, DAC, PWM, tactile, I2C, SPI, UART.',
			'Le brochage interactif détaille chacune d’elles.',
		],
		repere: 'Les deux rangées de part et d’autre de la carte.',
		lien: { texte: 'Les broches GPIO', href: `${base}04-broches-gpio/` },
	},
};

export const ordre = ['module', 'antenne', 'broches', 'usb', 'regulateur', 'usbserie', 'ledpower', 'led2', 'en', 'boot'];
