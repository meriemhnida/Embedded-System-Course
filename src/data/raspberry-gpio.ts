// Les 40 broches du connecteur GPIO, telles qu'elles figurent dans les schémas du cours
// (diapositives sur les broches d'alimentation, les broches PWM, WiringPi, I2C, SPI et UART).
export type Famille = 'alim5' | 'alim33' | 'masse' | 'i2c' | 'spi' | 'uart' | 'pwm' | 'gpio';

export const familles: { id: Famille; nom: string; couleur: string }[] = [
	{ id: 'alim5', nom: 'Alimentation 5 V', couleur: '#dc2626' },
	{ id: 'alim33', nom: 'Alimentation 3,3 V', couleur: '#b45309' },
	{ id: 'masse', nom: 'Masse (Ground)', couleur: '#334155' },
	{ id: 'i2c', nom: 'I2C (synchrone)', couleur: '#2563eb' },
	{ id: 'spi', nom: 'SPI (synchrone)', couleur: '#db2777' },
	{ id: 'uart', nom: 'UART (asynchrone)', couleur: '#7c3aed' },
	{ id: 'pwm', nom: 'PWM', couleur: '#0f766e' },
	{ id: 'gpio', nom: 'GPIO simple', couleur: '#4d7c0f' },
];

export interface Broche {
	n: number; // numéro de la broche sur le connecteur (1 à 40)
	gpio?: number; // numéro GPIO
	wpi?: number; // numéro WiringPi
	court: string; // étiquette courte affichée sur le schéma
	fonction: string; // fonction principale
	familles: Famille[]; // la première donne la couleur
	autres?: string[]; // autres fonctions indiquées sur les schémas du cours
}

const p = (n: number, gpio: number | undefined, wpi: number | undefined, court: string, fonction: string, f: Famille[], autres?: string[]): Broche => ({
	n, gpio, wpi, court, fonction, familles: f, autres,
});
const alim5 = (n: number) => p(n, undefined, undefined, '5V', 'Alimentation 5 volts', ['alim5']);
const alim33 = (n: number) => p(n, undefined, undefined, '3V3', 'Alimentation 3,3 volts', ['alim33']);
const gnd = (n: number) => p(n, undefined, undefined, 'GND', 'Masse (Ground, 0 V)', ['masse']);

export const broches: Broche[] = [
	alim33(1),
	alim5(2),
	p(3, 2, 8, 'SDA', 'SDA du bus I2C1 : transmet les données', ['i2c'], ['UART : CTS (Clear To Send)']),
	alim5(4),
	p(5, 3, 9, 'SCL', 'SCL du bus I2C1 : envoie le signal d’horloge', ['i2c'], ['UART : RTS (Request To Send)']),
	gnd(6),
	p(7, 4, 7, 'GCLK0', 'GPCLK0', ['gpio'], ['UART : TXD (Transmit)']),
	p(8, 14, 15, 'TXD', 'TXD de l’UART : émission de données', ['uart']),
	gnd(9),
	p(10, 15, 16, 'RXD', 'RXD de l’UART : réception de données', ['uart']),
	p(11, 17, 0, '', 'GPIO 17', ['gpio', 'spi'], ['SPI1 : CE1', 'UART : RTS (Request To Send)']),
	p(12, 18, 1, 'PWM0', 'PWM0', ['pwm', 'spi'], ['SPI1 : CE0', 'PCM CLK']),
	p(13, 27, 2, '', 'GPIO 27', ['gpio']),
	gnd(14),
	p(15, 22, 3, '', 'GPIO 22', ['gpio']),
	p(16, 23, 4, '', 'GPIO 23', ['gpio']),
	alim33(17),
	p(18, 24, 5, '', 'GPIO 24', ['gpio']),
	p(19, 10, 12, 'MOSI', 'MOSI du bus SPI0 : le Pi envoie des données vers le périphérique', ['spi'], ['UART : CTS (Clear To Send)']),
	gnd(20),
	p(21, 9, 13, 'MISO', 'MISO du bus SPI0 : le périphérique envoie des données vers le Pi', ['spi'], ['UART : RXD (Receive)']),
	p(22, 25, 6, '', 'GPIO 25', ['gpio']),
	p(23, 11, 14, 'SCLK', 'SCLK du bus SPI0 : le Pi génère l’horloge', ['spi'], ['UART : RTS (Request To Send)']),
	p(24, 8, 10, 'CE0', 'CE0 du bus SPI0 : le Pi choisit un périphérique (Chip Enable)', ['spi'], ['UART : TXD (Transmit)']),
	gnd(25),
	p(26, 7, 11, 'CE1', 'CE1 du bus SPI0 : le Pi choisit un périphérique (Chip Enable)', ['spi'], ['UART : RTS (Request To Send)']),
	p(27, 0, 30, 'ID_SD', 'ID_SD (EEPROM SDA) : bus I2C0 réservé à l’identification des cartes HAT', ['i2c'], ['UART : TXD (Transmit)']),
	p(28, 1, 31, 'ID_SC', 'ID_SC (EEPROM SCL) : bus I2C0 réservé à l’identification des cartes HAT', ['i2c'], ['UART : RXD (Receive)']),
	p(29, 5, 21, 'GCLK1', 'GPCLK1', ['gpio'], ['UART : RXD (Receive)']),
	gnd(30),
	p(31, 6, 22, 'GCLK2', 'GPCLK2', ['gpio'], ['UART : CTS (Clear To Send)']),
	p(32, 12, 26, 'PWM0', 'PWM0', ['pwm'], ['UART : TXD (Transmit)']),
	p(33, 13, 23, 'PWM1', 'PWM1', ['pwm'], ['UART : RXD (Receive)']),
	gnd(34),
	p(35, 19, 24, 'MISO', 'MISO du bus SPI1', ['spi', 'pwm'], ['PWM1', 'PCM FS']),
	p(36, 16, 27, '', 'GPIO 16', ['gpio', 'spi'], ['SPI1 : CE2', 'UART : CTS (Clear To Send)']),
	p(37, 26, 25, '', 'GPIO 26', ['gpio']),
	p(38, 20, 28, 'MOSI', 'MOSI du bus SPI1', ['spi'], ['PCM DIN']),
	gnd(39),
	p(40, 21, 29, 'SCLK', 'SCLK du bus SPI1', ['spi'], ['PCM DOUT']),
];

// Ce que le cours dit de chaque famille.
export const roles: Record<Famille, { texte: string[]; lien?: { texte: string; href: string } }> = {
	alim5: { texte: ['Broches d’alimentation 5 V : les broches 2 et 4.'] },
	alim33: { texte: ['Broches d’alimentation 3,3 V : les broches 1 et 17.'] },
	masse: { texte: ['Broches Ground (V0 ou masse) : les broches 6, 9, 14, 20, 25, 30, 34 et 39.'] },
	i2c: {
		texte: [
			'Communication série synchrone, sur deux fils : SDA (données) et SCL (horloge).',
			'GPIO 2 et 3 : bus I2C principal pour les périphériques. GPIO 0 et 1 : I2C dédié à l’identification des cartes HAT.',
		],
		lien: { texte: 'La page I2C', href: '/Embedded-System-Course/parcours/chapitre-3/05-synchrone-i2c/' },
	},
	spi: {
		texte: [
			'Communication série synchrone, sur quatre fils : MOSI, MISO, SCLK et CE0 / CE1.',
			'Le Pi dispose de deux bus repérés sur le schéma du cours : SPI0 et SPI1.',
		],
		lien: { texte: 'La page SPI', href: '/Embedded-System-Course/parcours/chapitre-3/06-synchrone-spi/' },
	},
	uart: {
		texte: ['Communication série asynchrone, sur deux fils : TX (émission) et RX (réception).'],
		lien: { texte: 'La page UART', href: '/Embedded-System-Course/parcours/chapitre-3/07-asynchrone-uart/' },
	},
	pwm: { texte: ['Broche PWM : le cours repère les broches GPIO 12, 13, 18 et 19 (PWM0 et PWM1).'] },
	gpio: {
		texte: [
			'Entrée/sortie numérique à usage général : 0 volt (état bas) ou 3,3 volts (état haut).',
			'En entrée (INPUT), elle lit un signal : bouton, capteur, interrupteur. En sortie (OUTPUT), elle en envoie un : allumer une LED, activer un relais, un moteur.',
		],
	},
};
