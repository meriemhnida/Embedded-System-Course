// Les 30 broches de la carte ESP32 DevKit (module ESP32-WROOM-32), telles qu'elles figurent sur le schéma de
// brochage du cours : 15 broches à gauche, 15 à droite, numérotées de 15 (en haut, côté antenne) à 1 (en bas,
// côté port USB).
export type Famille =
	| 'entree'
	| 'gpio'
	| 'boot'
	| 'adc1'
	| 'adc2'
	| 'dac'
	| 'pwm'
	| 'touch'
	| 'i2c'
	| 'spi'
	| 'uart'
	| 'alim'
	| 'masse'
	| 'enable';

export const familles: { id: Famille; nom: string; couleur: string }[] = [
	{ id: 'entree', nom: 'Entrée seule', couleur: '#4c1d95' },
	{ id: 'gpio', nom: 'GPIO entrée/sortie', couleur: '#86198f' },
	{ id: 'adc1', nom: 'ADC1', couleur: '#ea580c' },
	{ id: 'adc2', nom: 'ADC2', couleur: '#c2410c' },
	{ id: 'dac', nom: 'DAC', couleur: '#a16207' },
	{ id: 'pwm', nom: 'PWM', couleur: '#0f766e' },
	{ id: 'touch', nom: 'Tactile (Touch)', couleur: '#15803d' },
	{ id: 'i2c', nom: 'I2C', couleur: '#c026d3' },
	{ id: 'spi', nom: 'SPI', couleur: '#1d4ed8' },
	{ id: 'uart', nom: 'UART', couleur: '#d97706' },
	{ id: 'boot', nom: 'Broche de démarrage', couleur: '#ca8a04' },
	{ id: 'alim', nom: 'Alimentation', couleur: '#dc2626' },
	{ id: 'masse', nom: 'Masse (GND)', couleur: '#334155' },
	{ id: 'enable', nom: 'Enable (EN)', couleur: '#059669' },
];

export interface Broche {
	id: string; // identifiant unique, ex. « g-34 » ou « gnd-g »
	cote: 'gauche' | 'droite';
	position: number; // 15 en haut, 1 en bas
	gpio?: number;
	serigraphie: string; // ce qui est imprimé sur la carte : D34, VP, TX0…
	principal: string; // étiquette affichée par défaut (comme sur le schéma du cours)
	familles: Famille[]; // la première donne la couleur
	etiquettes: Partial<Record<Famille, string>>; // étiquette affichée quand une famille est mise en évidence
	fonction: string; // résumé en une phrase
	remarques?: string[];
}

const b = (
	id: string,
	cote: 'gauche' | 'droite',
	position: number,
	gpio: number | undefined,
	serigraphie: string,
	principal: string,
	f: Famille[],
	etiquettes: Partial<Record<Famille, string>>,
	fonction: string,
	remarques?: string[],
): Broche => ({ id, cote, position, gpio, serigraphie, principal, familles: f, etiquettes, fonction, remarques });

export const broches: Broche[] = [
	// Côté gauche, de haut en bas
	b('en', 'gauche', 15, undefined, 'EN', 'ENABLE', ['enable'], {}, 'Broche EN (Enable) : remet le microcontrôleur à zéro (reset), comme le bouton EN.', [
		'Mise à l’état bas (0 V), elle arrête le microcontrôleur ; quand elle remonte, le programme redémarre depuis le début.',
	]),
	b('g-36', 'gauche', 14, 36, 'VP', 'GPIX 36', ['entree', 'adc1'], { entree: 'Entrée seule', adc1: 'ADC1_0' }, 'Entrée seule, reliée à l’ADC1 (canal 0).'),
	b('g-39', 'gauche', 13, 39, 'VN', 'GPIX 39', ['entree', 'adc1'], { entree: 'Entrée seule', adc1: 'ADC1_3' }, 'Entrée seule, reliée à l’ADC1 (canal 3).'),
	b('g-34', 'gauche', 12, 34, 'D34', 'GPIX 34', ['entree', 'adc1'], { entree: 'Entrée seule', adc1: 'ADC1_6' }, 'Entrée seule, reliée à l’ADC1 (canal 6).'),
	b('g-35', 'gauche', 11, 35, 'D35', 'GPIX 35', ['entree', 'adc1'], { entree: 'Entrée seule', adc1: 'ADC1_7' }, 'Entrée seule, reliée à l’ADC1 (canal 7).'),
	b('g-32', 'gauche', 10, 32, 'D32', 'GPIO 32', ['gpio', 'adc1', 'touch', 'pwm'], { adc1: 'ADC1_4', touch: 'Touch 9', pwm: 'PWM' }, 'Entrée/sortie numérique, entrée analogique (ADC1, canal 4) et broche tactile (Touch 9).'),
	b('g-33', 'gauche', 9, 33, 'D33', 'GPIO 33', ['gpio', 'adc1', 'touch', 'pwm'], { adc1: 'ADC1_5', touch: 'Touch 8', pwm: 'PWM' }, 'Entrée/sortie numérique, entrée analogique (ADC1, canal 5) et broche tactile (Touch 8).'),
	b('g-25', 'gauche', 8, 25, 'D25', 'GPIO 25', ['gpio', 'dac', 'adc2', 'pwm'], { dac: 'DAC1', adc2: 'ADC2_8', pwm: 'PWM' }, 'Entrée/sortie numérique et sortie analogique DAC1.'),
	b('g-26', 'gauche', 7, 26, 'D26', 'GPIO 26', ['gpio', 'dac', 'adc2', 'pwm'], { dac: 'DAC2', adc2: 'ADC2_9', pwm: 'PWM' }, 'Entrée/sortie numérique et sortie analogique DAC2.'),
	b('g-27', 'gauche', 6, 27, 'D27', 'GPIO 27', ['gpio', 'adc2', 'touch', 'pwm'], { adc2: 'ADC2_7', touch: 'Touch 7', pwm: 'PWM' }, 'Entrée/sortie numérique, entrée analogique (ADC2, canal 7) et broche tactile (Touch 7).'),
	b('g-14', 'gauche', 5, 14, 'D14', 'GPIO 14', ['gpio', 'adc2', 'touch', 'pwm', 'spi'], { adc2: 'ADC2_6', touch: 'Touch 6', pwm: 'PWM', spi: 'HSPI CLK' }, 'Entrée/sortie numérique, ADC2 (canal 6), Touch 6 et horloge du bus HSPI.'),
	b('g-12', 'gauche', 4, 12, 'D12', 'GPIO 12', ['boot', 'gpio', 'adc2', 'touch', 'pwm', 'spi'], { adc2: 'ADC2_5', touch: 'Touch 5', pwm: 'PWM', spi: 'HSPI MISO', boot: 'Démarrage' }, 'Entrée/sortie numérique, ADC2 (canal 5), Touch 5 et MISO du bus HSPI.', [
		'Broche de démarrage : son niveau au moment du reset choisit la tension de la mémoire flash. Elle doit être à l’état bas au démarrage, sinon la carte peut refuser de démarrer.',
	]),
	b('g-13', 'gauche', 3, 13, 'D13', 'GPIO 13', ['gpio', 'adc2', 'touch', 'pwm', 'spi'], { adc2: 'ADC2_4', touch: 'Touch 4', pwm: 'PWM', spi: 'HSPI MOSI' }, 'Entrée/sortie numérique, ADC2 (canal 4), Touch 4 et MOSI du bus HSPI.'),
	b('gnd-g', 'gauche', 2, undefined, 'GND', 'GND', ['masse'], {}, 'Masse (GND, 0 V) : la référence commune de tous les composants.'),
	b('vin', 'gauche', 1, undefined, 'VIN', 'VIN', ['alim'], {}, 'Entrée d’alimentation VIN : on peut y amener 5 V quand la carte n’est pas alimentée par le port USB.', [
		'Cette tension passe par le régulateur de la carte, qui la ramène à 3,3 V pour le module ESP32.',
	]),

	// Côté droit, de haut en bas
	b('g-23', 'droite', 15, 23, 'D23', 'GPIO 23', ['gpio', 'spi', 'pwm'], { spi: 'VSPI MOSI', pwm: 'PWM' }, 'Entrée/sortie numérique et MOSI du bus VSPI.'),
	b('g-22', 'droite', 14, 22, 'D22', 'GPIO 22', ['gpio', 'i2c', 'pwm'], { i2c: 'SCL', pwm: 'PWM' }, 'Entrée/sortie numérique et SCL du bus I2C (horloge).'),
	b('g-1', 'droite', 13, 1, 'TX0', 'GPIO 1', ['uart', 'gpio'], { uart: 'TX0' }, 'TX0 : émission de l’UART0, reliée au convertisseur USB-série.', [
		'L’UART0 sert au téléversement du programme et au moniteur série (Serial) : on évite de brancher un composant sur cette broche.',
	]),
	b('g-3', 'droite', 12, 3, 'RX0', 'GPIO 3', ['uart', 'gpio'], { uart: 'RX0' }, 'RX0 : réception de l’UART0, reliée au convertisseur USB-série.', [
		'L’UART0 sert au téléversement du programme et au moniteur série (Serial) : on évite de brancher un composant sur cette broche.',
	]),
	b('g-21', 'droite', 11, 21, 'D21', 'GPIO 21', ['gpio', 'i2c', 'pwm'], { i2c: 'SDA', pwm: 'PWM' }, 'Entrée/sortie numérique et SDA du bus I2C (données).'),
	b('g-19', 'droite', 10, 19, 'D19', 'GPIO 19', ['gpio', 'spi', 'pwm'], { spi: 'VSPI MISO', pwm: 'PWM' }, 'Entrée/sortie numérique et MISO du bus VSPI.'),
	b('g-18', 'droite', 9, 18, 'D18', 'GPIO 18', ['gpio', 'spi', 'pwm'], { spi: 'VSPI SCK', pwm: 'PWM' }, 'Entrée/sortie numérique et SCK (horloge) du bus VSPI.'),
	b('g-5', 'droite', 8, 5, 'D5', 'GPIO 5', ['boot', 'gpio', 'spi', 'pwm'], { spi: 'VSPI CS', pwm: 'PWM', boot: 'Démarrage' }, 'Entrée/sortie numérique et CS (sélection du périphérique) du bus VSPI.', [
		'Broche de démarrage : elle émet un signal au moment du reset. Utilisable sans problème une fois le programme lancé.',
	]),
	b('g-17', 'droite', 7, 17, 'TX2', 'GPIO 17', ['gpio', 'uart', 'pwm'], { uart: 'TX2', pwm: 'PWM' }, 'Entrée/sortie numérique et TX2 : émission de l’UART2, libre pour un module (GPS, GSM…).'),
	b('g-16', 'droite', 6, 16, 'RX2', 'GPIO 16', ['gpio', 'uart', 'pwm'], { uart: 'RX2', pwm: 'PWM' }, 'Entrée/sortie numérique et RX2 : réception de l’UART2, libre pour un module (GPS, GSM…).'),
	b('g-4', 'droite', 5, 4, 'D4', 'GPIO 4', ['gpio', 'adc2', 'touch', 'pwm'], { adc2: 'ADC2_0', touch: 'Touch 0', pwm: 'PWM' }, 'Entrée/sortie numérique, ADC2 (canal 0) et broche tactile (Touch 0).'),
	b('g-2', 'droite', 4, 2, 'D2', 'GPIO 2', ['boot', 'gpio', 'adc2', 'touch', 'pwm'], { adc2: 'ADC2_2', touch: 'Touch 2', pwm: 'PWM', boot: 'Démarrage', gpio: 'LED intégrée' }, 'Entrée/sortie numérique, ADC2 (canal 2), Touch 2. Sur cette carte, elle commande la LED bleue intégrée.', [
		'GPIO 2 est souvent utilisée comme LED intégrée sur les cartes ESP32.',
		'Broche de démarrage : elle doit rester à l’état bas (ou non connectée) pour pouvoir téléverser un programme.',
	]),
	b('g-15', 'droite', 3, 15, 'D15', 'GPIO 15', ['boot', 'gpio', 'adc2', 'touch', 'pwm', 'spi'], { adc2: 'ADC2_3', touch: 'Touch 3', pwm: 'PWM', spi: 'HSPI CS', boot: 'Démarrage' }, 'Entrée/sortie numérique, ADC2 (canal 3), Touch 3 et CS du bus HSPI.', [
		'Broche de démarrage : à l’état bas au reset, elle coupe les messages de démarrage envoyés sur le moniteur série.',
	]),
	b('gnd-d', 'droite', 2, undefined, 'GND', 'GND', ['masse'], {}, 'Masse (GND, 0 V) : la référence commune de tous les composants.'),
	b('3v3', 'droite', 1, undefined, '3V3', '3.3V', ['alim'], {}, 'Sortie 3,3 V du régulateur : pour alimenter capteurs et modules en 3,3 V.', [
		'Les broches de l’ESP32 travaillent en 3,3 V : un signal de 5 V peut les endommager.',
	]),
];

// Ce que le cours dit de chaque famille.
export const roles: Record<Famille, { texte: string[]; lien?: { texte: string; href: string } }> = {
	entree: {
		texte: [
			'Broches en lecture seule (GPI) : GPIO 34, 35, 36 et 39. Elles ne peuvent jamais être configurées en sortie : pinMode(pin, OUTPUT) ✗.',
			'Elles peuvent lire des signaux numériques (digitalRead) et analogiques (analogRead), car elles sont reliées à l’ADC1.',
			'Elles n’ont pas de résistance de tirage interne : INPUT_PULLUP est sans effet.',
		],
		lien: { texte: 'Les broches GPIO', href: '/Embedded-System-Course/parcours/chapitre-6/04-broches-gpio/' },
	},
	gpio: {
		texte: [
			'Broche d’entrée/sortie numérique programmable : 0 (LOW, 0 V) ou 1 (HIGH, 3,3 V).',
			'En entrée, elle lit un bouton ; en sortie, elle commande une LED ou un relais.',
		],
		lien: { texte: 'Les broches GPIO', href: '/Embedded-System-Course/parcours/chapitre-6/04-broches-gpio/' },
	},
	adc1: {
		texte: [
			'ADC1 : convertisseur analogique-numérique. Il convertit une tension entre 0 et 3,3 V en une valeur de 0 à 4095 (12 bits).',
			'L’ADC1 reste utilisable quand le Wi-Fi est actif : c’est lui qu’on choisit pour un objet connecté.',
		],
		lien: { texte: 'L’ADC', href: '/Embedded-System-Course/parcours/chapitre-6/05-adc/' },
	},
	adc2: {
		texte: [
			'ADC2 : second convertisseur analogique-numérique, 0 à 4095 (12 bits).',
			'Attention : l’ADC2 est utilisé par le pilote Wi-Fi. Quand le Wi-Fi est actif, analogRead() échoue sur ces broches.',
		],
		lien: { texte: 'L’ADC', href: '/Embedded-System-Course/parcours/chapitre-6/05-adc/' },
	},
	dac: {
		texte: [
			'DAC : convertisseur numérique-analogique. Il convertit une valeur numérique (0 à 255, 8 bits) en tension entre 0 et 3,3 V.',
			'DAC1 → GPIO 25, DAC2 → GPIO 26. Applications : génération de signaux analogiques, tension variable, sortie audio.',
		],
		lien: { texte: 'DAC et PWM', href: '/Embedded-System-Course/parcours/chapitre-6/06-dac-pwm/' },
	},
	pwm: {
		texte: ['Toutes les broches qui peuvent agir comme sorties peuvent produire un signal PWM. Les GPIO 34 à 39 ne le peuvent pas.'],
		lien: { texte: 'DAC et PWM', href: '/Embedded-System-Course/parcours/chapitre-6/06-dac-pwm/' },
	},
	touch: {
		texte: [
			'Broche tactile capacitive : elle détecte le contact d’un doigt, sans bouton physique.',
			'touchRead() renvoie une valeur qui baisse quand on touche la broche (ou un fil relié à elle).',
		],
		lien: { texte: 'Les broches tactiles', href: '/Embedded-System-Course/parcours/chapitre-6/08-broches-tactiles/' },
	},
	i2c: {
		texte: ['Communication I2C sur deux fils : GPIO 21 = SDA (Serial Data, les données), GPIO 22 = SCL (Serial Clock, l’horloge).'],
		lien: { texte: 'I2C, SPI et UART', href: '/Embedded-System-Course/parcours/chapitre-6/07-communication/' },
	},
	spi: {
		texte: [
			'Communication SPI synchrone entre un maître (l’ESP32) et un esclave (le périphérique).',
			'Deux bus par défaut : VSPI (MOSI 23, MISO 19, SCK 18, CS 5) et HSPI (MOSI 13, MISO 12, SCK 14, CS 15).',
		],
		lien: { texte: 'I2C, SPI et UART', href: '/Embedded-System-Course/parcours/chapitre-6/07-communication/' },
	},
	uart: {
		texte: [
			'Communication série asynchrone TX/RX, sans horloge partagée : les deux appareils s’accordent sur la vitesse (baud rate) et le format.',
			'UART0 (TX0, RX0) est reliée au port USB ; UART2 (TX2 = GPIO 17, RX2 = GPIO 16) est libre pour un module.',
		],
		lien: { texte: 'I2C, SPI et UART', href: '/Embedded-System-Course/parcours/chapitre-6/07-communication/' },
	},
	boot: {
		texte: [
			'Broche de démarrage (strapping) : l’ESP32 lit son niveau au moment du reset pour choisir son mode de démarrage.',
			'Utilisable dans un programme, mais un composant qui la force à un niveau peut empêcher le démarrage ou le téléversement.',
		],
	},
	alim: { texte: ['Broches d’alimentation : VIN (entrée 5 V) et 3V3 (sortie 3,3 V du régulateur).'] },
	masse: { texte: ['Masse (GND) : deux broches, une de chaque côté de la carte.'] },
	enable: { texte: ['EN (Enable) : remise à zéro du microcontrôleur, comme le bouton EN de la carte.'] },
};

// Défis du mode « Trouvez la bonne broche » : toute broche de la liste est acceptée.
export const defis: { consigne: string; gpios: number[]; explication: string }[] = [
	{
		consigne: 'Choisissez une broche qui peut seulement lire un signal (entrée seule).',
		gpios: [34, 35, 36, 39],
		explication: 'Les GPIO 34, 35, 36 et 39 sont des entrées seules : jamais de pinMode(pin, OUTPUT).',
	},
	{
		consigne: 'Le Wi-Fi est activé. Choisissez une broche pour lire un potentiomètre.',
		gpios: [32, 33, 34, 35, 36, 39],
		explication: 'Avec le Wi-Fi actif, seul l’ADC1 fonctionne : GPIO 32, 33, 34, 35, 36 ou 39.',
	},
	{
		consigne: 'Choisissez une broche qui produit une vraie tension analogique (DAC).',
		gpios: [25, 26],
		explication: 'DAC1 → GPIO 25 et DAC2 → GPIO 26.',
	},
	{
		consigne: 'Où brancher la ligne de données SDA d’un écran I2C ?',
		gpios: [21],
		explication: 'GPIO 21 est la broche SDA (Serial Data) ; GPIO 22 est SCL.',
	},
	{
		consigne: 'Choisissez une broche tactile pour un bouton sans contact mécanique.',
		gpios: [4, 2, 15, 13, 12, 14, 27, 33, 32],
		explication: 'Neuf broches tactiles sur cette carte : Touch 0, 2 à 9 (GPIO 4, 2, 15, 13, 12, 14, 27, 33, 32).',
	},
	{
		consigne: 'Quelle broche commande la LED bleue intégrée à la carte ?',
		gpios: [2],
		explication: 'Sur cette carte, la LED intégrée est reliée à GPIO 2.',
	},
	{
		consigne: 'Choisissez la broche d’horloge (SCK) du bus VSPI.',
		gpios: [18],
		explication: 'VSPI : MOSI 23, MISO 19, SCK 18, CS 5.',
	},
	{
		consigne: 'Choisissez une broche pour faire varier une LED en PWM, sans risque pour le démarrage ni pour le téléversement.',
		gpios: [32, 33, 25, 26, 27, 14, 13, 23, 22, 21, 19, 18, 17, 16, 4],
		explication: 'Toute sortie convient, sauf les broches de démarrage (2, 5, 12, 15) et l’UART0 (1 et 3), qu’on évite par prudence.',
	},
];
