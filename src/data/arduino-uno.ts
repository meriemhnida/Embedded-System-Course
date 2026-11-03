export type Categorie = 'numerique' | 'pwm' | 'analogique' | 'alimentation' | 'masse' | 'communication' | 'special' | 'composant';

export interface Element {
	id: string;
	label: string;
	categorie: Categorie;
	titre: string;
	resume: string;
	points: string[];
	code?: string;
	astuce?: string;
	attention?: string;
}

export const categories: { id: Categorie; nom: string; couleur: string }[] = [
	{ id: 'numerique', nom: 'Numérique', couleur: '#3b82f6' },
	{ id: 'pwm', nom: 'Numérique PWM (~)', couleur: '#8b5cf6' },
	{ id: 'analogique', nom: 'Entrée analogique', couleur: '#10b981' },
	{ id: 'communication', nom: 'Communication', couleur: '#f59e0b' },
	{ id: 'alimentation', nom: 'Alimentation', couleur: '#ef4444' },
	{ id: 'masse', nom: 'Masse (GND)', couleur: '#475569' },
	{ id: 'special', nom: 'Spécial', couleur: '#94a3b8' },
	{ id: 'composant', nom: 'Composants de la carte', couleur: '#0f766e' },
];

const GND = (id: string): Element => ({
	id,
	label: 'GND',
	categorie: 'masse',
	titre: 'GND : la masse (0 V)',
	resume: 'La masse, le 0 V de référence du montage.',
	points: [
		'Toutes les tensions du montage sont mesurées par rapport à la masse.',
		'Les trois broches GND sont reliées entre elles : utilise celle qui est la plus proche de ton montage.',
		'Chaque composant (LED, capteur, bouton) doit avoir un chemin de retour vers GND pour que le courant circule.',
	],
	astuce: 'Un montage qui ne fonctionne pas vient souvent d’une masse oubliée.',
});

const pwm = (n: number, freq: string, extra: string[] = []): Element => ({
	id: `d${n}`,
	label: `~${n}`,
	categorie: 'pwm',
	titre: `D${n} : broche numérique PWM`,
	resume: `Entrée/sortie numérique, avec PWM (≈ ${freq}).`,
	points: [
		'Broche numérique : elle lit ou écrit HAUT (5 V) ou BAS (0 V).',
		`Le symbole ~ indique qu’elle sait faire de la PWM (fréquence ≈ ${freq}) avec analogWrite(), valeur de 0 à 255.`,
		...extra,
	],
	code: `pinMode(${n}, OUTPUT);\nanalogWrite(${n}, 128);  // luminosité ≈ 50 %`,
	astuce: 'La PWM simule une tension variable : pratique pour régler la luminosité d’une LED ou la vitesse d’un moteur.',
});

const num = (n: number, extra: string[] = []): Element => ({
	id: `d${n}`,
	label: String(n),
	categorie: 'numerique',
	titre: `D${n} : broche numérique`,
	resume: 'Entrée/sortie numérique : HAUT (5 V) ou BAS (0 V).',
	points: [
		'Se configure avec pinMode() en INPUT, INPUT_PULLUP ou OUTPUT.',
		'En sortie : digitalWrite() envoie 5 V ou 0 V. En entrée : digitalRead() lit 0 ou 1.',
		'Courant maximal conseillé : 20 mA par broche. Une LED a donc besoin d’une résistance.',
		...extra,
	],
	code: `pinMode(${n}, OUTPUT);\ndigitalWrite(${n}, HIGH);`,
});

const ana = (n: number, extra: string[] = []): Element => ({
	id: `a${n}`,
	label: `A${n}`,
	categorie: 'analogique',
	titre: `A${n} : entrée analogique`,
	resume: 'Lit une tension de 0 à 5 V et la convertit en nombre de 0 à 1023.',
	points: [
		'Un convertisseur analogique-numérique (ADC) de 10 bits transforme la tension en valeur de 0 à 1023.',
		'Chaque pas vaut environ 4,9 mV (5 V ÷ 1024).',
		`Peut aussi servir de broche numérique ordinaire (numéro ${14 + n}).`,
		...extra,
	],
	code: `int valeur = analogRead(A${n});  // 0 à 1023`,
	astuce: 'Idéal pour un potentiomètre, un capteur de lumière (LDR) ou de température analogique.',
});

export const elements: Record<string, Element> = {
	// ---------- En-tête du haut ----------
	scl: {
		id: 'scl', label: 'SCL', categorie: 'communication', titre: 'SCL : horloge du bus I²C',
		resume: 'Ligne d’horloge du bus I²C (identique à A5).',
		points: [
			'Le bus I²C relie plusieurs composants (écran, capteur, horloge) avec seulement 2 fils : SDA et SCL.',
			'SCL transporte l’horloge qui rythme les échanges.',
			'Sur la UNO R3, cette broche est reliée à A5.',
		],
		code: '#include <Wire.h>\nWire.begin();',
	},
	sda: {
		id: 'sda', label: 'SDA', categorie: 'communication', titre: 'SDA : données du bus I²C',
		resume: 'Ligne de données du bus I²C (identique à A4).',
		points: [
			'SDA transporte les données dans les deux sens, en suivant l’horloge SCL.',
			'Chaque composant du bus possède une adresse : on peut en brancher plusieurs sur les mêmes 2 fils.',
			'Sur la UNO R3, cette broche est reliée à A4.',
		],
		code: '#include <Wire.h>\nWire.begin();',
	},
	aref: {
		id: 'aref', label: 'AREF', categorie: 'special', titre: 'AREF : référence analogique',
		resume: 'Tension de référence de l’ADC (5 V par défaut).',
		points: [
			'L’ADC compare la tension mesurée à une référence : par défaut 5 V.',
			'On peut fournir une autre référence (plus basse) sur AREF pour mesurer plus finement de petites tensions.',
		],
		code: 'analogReference(EXTERNAL);',
		attention: 'Ne branche une tension sur AREF que si tu as appelé analogReference(EXTERNAL), et ne dépasse jamais 5 V.',
	},
	gnd1: GND('gnd1'),
	d13: num(13, ['SCK : horloge du bus SPI.', 'Reliée à la LED intégrée « L » de la carte (constante LED_BUILTIN) : pratique pour un premier test sans rien brancher.']),
	d12: num(12, ['MISO : « Master In, Slave Out », ligne de données du bus SPI.']),
	d11: pwm(11, '490 Hz', ['MOSI : « Master Out, Slave In », ligne de données du bus SPI.']),
	d10: pwm(10, '490 Hz', ['SS : « Slave Select », sélection du composant sur le bus SPI.']),
	d9: pwm(9, '490 Hz'),
	d8: num(8),
	d7: num(7),
	d6: pwm(6, '980 Hz'),
	d5: pwm(5, '980 Hz'),
	d4: num(4),
	d3: pwm(3, '490 Hz', ['Peut aussi déclencher une interruption externe (INT1) avec attachInterrupt().']),
	d2: num(2, ['Peut déclencher une interruption externe (INT0) : le programme réagit immédiatement à un changement, par exemple l’appui sur un bouton.']),
	d1: {
		id: 'd1', label: 'TX', categorie: 'communication', titre: 'D1 / TX : émission série',
		resume: 'Émet les données de la liaison série (UART).',
		points: [
			'TX (Transmit) envoie les données vers l’ordinateur ou un autre module.',
			'Elle est partagée avec le port USB : c’est ce qui permet d’afficher du texte dans le moniteur série.',
		],
		code: 'Serial.begin(9600);\nSerial.println("Bonjour");',
		attention: 'Évite de brancher quelque chose sur D0 et D1 si tu utilises le moniteur série.',
	},
	d0: {
		id: 'd0', label: 'RX', categorie: 'communication', titre: 'D0 / RX : réception série',
		resume: 'Reçoit les données de la liaison série (UART).',
		points: [
			'RX (Receive) reçoit les données venant de l’ordinateur ou d’un autre module.',
			'Elle est partagée avec le port USB, comme D1.',
			'Pour croiser deux cartes : TX de l’une va sur RX de l’autre.',
		],
		code: 'if (Serial.available()) {\n  char c = Serial.read();\n}',
		attention: 'Débranche ce qui est relié à D0 avant de téléverser un programme : il peut bloquer le transfert.',
	},

	// ---------- Alimentation (bas) ----------
	nc: {
		id: 'nc', label: '—', categorie: 'special', titre: 'Broche non connectée',
		resume: 'Réservée pour un usage futur.',
		points: ['Cette broche ne fait rien sur la UNO R3. Elle existe pour la compatibilité des shields.'],
	},
	ioref: {
		id: 'ioref', label: 'IOREF', categorie: 'special', titre: 'IOREF : tension des entrées-sorties',
		resume: 'Indique aux shields la tension utilisée par la carte (5 V).',
		points: [
			'Un shield adapté lit cette broche pour savoir s’il travaille en 5 V ou en 3,3 V.',
			'Tu n’as normalement pas à t’en servir directement.',
		],
	},
	reset: {
		id: 'reset', label: 'RESET', categorie: 'special', titre: 'RESET : redémarrer la carte',
		resume: 'Mettre cette broche à GND redémarre le programme.',
		points: [
			'Quand RESET passe à BAS (0 V), le microcontrôleur redémarre : le programme repart de setup().',
			'C’est exactement ce que fait le bouton rouge de la carte.',
			'Sert aussi à ajouter un bouton reset externe sur un shield.',
		],
	},
	v33: {
		id: 'v33', label: '3V3', categorie: 'alimentation', titre: '3,3 V : sortie 3,3 volts',
		resume: 'Alimente des composants en 3,3 V (50 mA max).',
		points: [
			'Fournit 3,3 V, nécessaires à certains capteurs et modules (Wi-Fi, Bluetooth, etc.).',
			'Courant maximal : 50 mA seulement.',
		],
		attention: 'Ne relie jamais cette broche au 5 V : tu détruirais le composant 3,3 V.',
	},
	v5: {
		id: 'v5', label: '5V', categorie: 'alimentation', titre: '5 V : sortie 5 volts',
		resume: 'Alimente capteurs, boutons et LEDs en 5 V.',
		points: [
			'Fournit une tension régulée de 5 V, issue de l’USB ou du régulateur de la carte.',
			'C’est cette broche que l’on relie au côté « haut » d’un capteur ou d’un potentiomètre.',
			'Le courant disponible dépend de l’alimentation : quelques centaines de mA en USB.',
		],
		astuce: 'Pour un gros moteur ou un ruban de LEDs, utilise une alimentation séparée.',
		attention: 'Ne branche pas d’alimentation externe sur cette broche sans savoir ce que tu fais.',
	},
	gnd2: GND('gnd2'),
	gnd3: GND('gnd3'),
	vin: {
		id: 'vin', label: 'VIN', categorie: 'alimentation', titre: 'VIN : entrée d’alimentation externe',
		resume: 'Reçoit 7 à 12 V pour alimenter la carte.',
		points: [
			'Permet d’alimenter la carte avec une pile ou un bloc secteur (7 à 12 V recommandés).',
			'Quand la carte est alimentée par la prise jack, VIN affiche la tension de la prise.',
			'Le régulateur de la carte transforme cette tension en 5 V.',
		],
		attention: 'Ne dépasse pas 12 V en continu : le régulateur chauffe.',
	},

	// ---------- Analogiques ----------
	a0: ana(0),
	a1: ana(1),
	a2: ana(2),
	a3: ana(3),
	a4: ana(4, ['Sert aussi de ligne SDA du bus I²C.']),
	a5: ana(5, ['Sert aussi de ligne SCL du bus I²C.']),

	// ---------- Composants ----------
	usb: {
		id: 'usb', label: 'USB', categorie: 'composant', titre: 'Port USB type B',
		resume: 'Alimente la carte et téléverse le programme.',
		points: [
			'Relie la carte à l’ordinateur par un câble USB.',
			'Fait trois choses : alimenter la carte en 5 V, téléverser ton programme, et ouvrir une liaison série (moniteur série).',
		],
	},
	jack: {
		id: 'jack', label: 'DC', categorie: 'composant', titre: 'Prise jack d’alimentation',
		resume: 'Alimentation externe de 7 à 12 V.',
		points: [
			'Prise 2,1 mm, centre positif, pour un bloc secteur ou une batterie.',
			'La tension passe par le régulateur avant d’alimenter le microcontrôleur.',
			'Utile quand la carte fonctionne sans ordinateur.',
		],
	},
	mcu: {
		id: 'mcu', label: 'ATmega328P', categorie: 'composant', titre: 'Microcontrôleur ATmega328P',
		resume: 'Le cerveau de la carte : il exécute ton programme.',
		points: [
			'Microcontrôleur 8 bits de Microchip (ex-Atmel), cadencé à 16 MHz.',
			'Mémoire Flash de 32 Ko : ton programme. SRAM de 2 Ko : les variables. EEPROM de 1 Ko : données conservées hors tension.',
			'Il pilote toutes les broches d’entrée-sortie.',
		],
	},
	rst: {
		id: 'rst', label: 'RESET', categorie: 'composant', titre: 'Bouton RESET',
		resume: 'Redémarre le programme depuis le début.',
		points: [
			'Un appui relie la broche RESET à GND : la carte redémarre.',
			'Le programme repart de setup() et les variables sont réinitialisées.',
		],
	},
	quartz: {
		id: 'quartz', label: '16 MHz', categorie: 'composant', titre: 'Quartz 16 MHz',
		resume: 'L’horloge qui cadence le microcontrôleur.',
		points: [
			'Un cristal de quartz vibre 16 millions de fois par seconde.',
			'Chaque vibration rythme le travail du processeur : l’ATmega328P exécute ainsi jusqu’à 16 millions d’opérations élémentaires par seconde.',
		],
	},
	reg: {
		id: 'reg', label: 'Régulateur', categorie: 'composant', titre: 'Régulateur de tension 5 V',
		resume: 'Transforme 7–12 V en 5 V stables.',
		points: [
			'Reçoit la tension de la prise jack ou de VIN et fournit 5 V stables aux composants.',
			'L’excédent d’énergie est dissipé en chaleur : plus la tension d’entrée est élevée, plus il chauffe.',
		],
	},
	ledl: {
		id: 'ledl', label: 'L', categorie: 'composant', titre: 'LED « L » (LED_BUILTIN)',
		resume: 'LED intégrée, reliée à la broche D13.',
		points: [
			'S’allume quand D13 est à HAUT.',
			'Permet de tester un programme sans rien brancher, comme l’exemple Blink.',
		],
		code: 'pinMode(LED_BUILTIN, OUTPUT);\ndigitalWrite(LED_BUILTIN, HIGH);',
	},
	ledtx: {
		id: 'ledtx', label: 'TX / RX', categorie: 'composant', titre: 'LED TX et RX',
		resume: 'Clignotent quand des données circulent sur la liaison série.',
		points: [
			'TX clignote quand la carte envoie des données, RX quand elle en reçoit.',
			'Elles clignotent aussi pendant le téléversement d’un programme.',
		],
	},
	ledon: {
		id: 'ledon', label: 'ON', categorie: 'composant', titre: 'LED « ON »',
		resume: 'Allumée : la carte est alimentée.',
		points: ['Si elle est éteinte alors que la carte est branchée, vérifie le câble ou l’alimentation.'],
	},
	usbchip: {
		id: 'usbchip', label: 'ATmega16U2', categorie: 'composant', titre: 'Convertisseur USB-série (ATmega16U2)',
		resume: 'Fait le lien entre le port USB et l’ATmega328P.',
		points: [
			'L’ordinateur parle USB, le microcontrôleur parle série (UART).',
			'Cette petite puce traduit entre les deux : c’est elle qui rend possible le téléversement et le moniteur série.',
		],
	},
	icsp: {
		id: 'icsp', label: 'ICSP', categorie: 'composant', titre: 'Connecteur ICSP',
		resume: 'Programmation directe du microcontrôleur (bus SPI).',
		points: [
			'Six broches qui donnent accès au bus SPI et à la ligne RESET.',
			'Servent à programmer le microcontrôleur sans passer par l’USB, par exemple pour installer un bootloader.',
		],
	},
};

/** Ordre de la visite guidée. */
export const ordre: string[] = [
	'usb', 'usbchip', 'jack', 'reg', 'ledon', 'mcu', 'quartz', 'rst', 'ledl', 'ledtx', 'icsp',
	'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'd11', 'd12', 'd13',
	'gnd1', 'aref', 'sda', 'scl',
	'ioref', 'nc', 'reset', 'v33', 'v5', 'gnd2', 'gnd3', 'vin',
	'a0', 'a1', 'a2', 'a3', 'a4', 'a5',
];
