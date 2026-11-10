// Composants de la carte Raspberry Pi 5, tels qu'ils sont nommés dans le cours (diapositive « Comprendre la carte
// Raspberry »). Les descriptions ne reprennent que ce que disent les diapositives ; pour compléter une fiche, il
// suffit d'ajouter des lignes à `points`.
export type Categorie = 'traitement' | 'connectique' | 'alimentation' | 'sansfil' | 'commande';

export interface Element {
	id: string;
	label: string; // nom tel qu'il figure sur la diapositive
	categorie: Categorie;
	titre: string;
	resume: string;
	points: string[];
	repere: string; // où le trouver sur le schéma
	lien?: { texte: string; href: string };
}

export const categories: { id: Categorie; nom: string; couleur: string }[] = [
	{ id: 'traitement', nom: 'Traitement et mémoire', couleur: '#7c3aed' },
	{ id: 'connectique', nom: 'Connectique', couleur: '#2563eb' },
	{ id: 'alimentation', nom: 'Alimentation', couleur: '#dc2626' },
	{ id: 'sansfil', nom: 'Sans fil', couleur: '#0e7490' },
	{ id: 'commande', nom: 'Commande et signalisation', couleur: '#a16207' },
];

const base = '/Embedded-System-Course/parcours/chapitre-3/';

export const elements: Record<string, Element> = {
	gpio: {
		id: 'gpio',
		label: 'Ports GPIO',
		categorie: 'connectique',
		titre: 'Ports GPIO (General Purpose Input/Output)',
		resume: 'Les broches d’entrée/sortie à usage général de la carte.',
		points: [
			'Lire des signaux (INPUT) : boutons, capteurs, interrupteurs.',
			'Envoyer des signaux (OUTPUT) : allumer une LED, activer des relais, des moteurs.',
			'Ce sont de simples entrées/sorties numériques : 0 volt (état bas) ou 3,3 volts (état haut).',
			'Pour communiquer avec des composants plus intelligents (capteur de température, écran, module GPS), il faut des protocoles de communication : I2C, SPI, UART.',
		],
		repere: 'Le long du bord supérieur de la carte : 40 broches sur deux rangées.',
		lien: { texte: 'Explorer les 40 broches', href: `${base}03-broches-gpio/` },
	},
	memoire: {
		id: 'memoire',
		label: 'Mémoire',
		categorie: 'traitement',
		titre: 'Mémoire (RAM)',
		resume: 'La mémoire de la carte.',
		points: ['Le Raspberry Pi 5 est disponible avec 2, 4, 8 ou 16 Go de RAM.'],
		repere: 'Puce noire en haut au centre, sous les broches GPIO.',
	},
	ventilateur: {
		id: 'ventilateur',
		label: 'Ventilateur',
		categorie: 'commande',
		titre: 'Ventilateur',
		resume: 'Le connecteur du ventilateur de la carte.',
		points: [],
		repere: 'En haut, à droite des broches GPIO, au-dessus de la puce Southbridge.',
	},
	southbridge: {
		id: 'southbridge',
		label: 'Southbridge',
		categorie: 'traitement',
		titre: 'Southbridge',
		resume: 'Le circuit désigné « Southbridge » dans le cours.',
		points: [],
		repere: 'Puce carrée à droite de la mémoire, sous le connecteur du ventilateur.',
	},
	wifi: {
		id: 'wifi',
		label: 'WiFi/Bluetooth',
		categorie: 'sansfil',
		titre: 'WiFi / Bluetooth',
		resume: 'La connectivité sans fil de la carte : WiFi et Bluetooth.',
		points: [],
		repere: 'Boîtier métallique en haut à gauche de la carte.',
	},
	cpu: {
		id: 'cpu',
		label: 'Microprocesseur',
		categorie: 'traitement',
		titre: 'Microprocesseur (CPU)',
		resume: 'Le processeur de la carte : Broadcom 2712ZPKFSB00C1t.',
		points: [
			'Processeur quadricœur Cortex-A76 cadencé à 2,4 GHz.',
			'Il est accompagné d’un GPU VideoCore VII.',
			'Le Raspberry Pi 5 prend en charge le PCIe.',
			'Le Raspberry Pi 5 date de 2023.',
		],
		repere: 'Grande puce métallique au centre de la carte.',
	},
	usb: {
		id: 'usb',
		label: 'Ports USB',
		categorie: 'connectique',
		titre: 'Ports USB',
		resume: 'Les ports USB de la carte.',
		points: [],
		repere: 'Côté droit, pile du haut.',
	},
	usb3: {
		id: 'usb3',
		label: 'Ports USB 3',
		categorie: 'connectique',
		titre: 'Ports USB 3',
		resume: 'Les ports USB 3 de la carte.',
		points: [],
		repere: 'Côté droit, pile du milieu (intérieur bleu).',
	},
	pcie: {
		id: 'pcie',
		label: 'Bus PCIe',
		categorie: 'connectique',
		titre: 'Bus PCIe',
		resume: 'Le connecteur du bus PCIe.',
		points: ['Le Raspberry Pi 5 prend en charge le PCIe.'],
		repere: 'Sur le bord gauche de la carte.',
	},
	bouton: {
		id: 'bouton',
		label: 'Bouton Power',
		categorie: 'commande',
		titre: 'Bouton Power',
		resume: 'Le bouton d’alimentation (power) de la carte.',
		points: [],
		repere: 'Sur le bord gauche, sous le connecteur PCIe.',
	},
	led: {
		id: 'led',
		label: 'Led d’état',
		categorie: 'commande',
		titre: 'LED d’état',
		resume: 'La LED qui indique l’état de la carte.',
		points: [],
		repere: 'Sur le bord gauche, sous le bouton Power.',
	},
	ethernet: {
		id: 'ethernet',
		label: 'Ethernet Gigabit',
		categorie: 'connectique',
		titre: 'Ethernet Gigabit',
		resume: 'La prise Ethernet Gigabit de la carte.',
		points: [],
		repere: 'Côté droit, pile du bas.',
	},
	usbc: {
		id: 'usbc',
		label: 'USB-C Alim.',
		categorie: 'alimentation',
		titre: 'USB-C : alimentation',
		resume: 'Le connecteur USB-C qui sert à alimenter la carte.',
		points: [],
		repere: 'En bas à gauche de la carte.',
	},
	batterie: {
		id: 'batterie',
		label: 'Connecteur batterie',
		categorie: 'alimentation',
		titre: 'Connecteur batterie',
		resume: 'Le connecteur pour brancher une batterie.',
		points: [],
		repere: 'En bas, à droite du connecteur USB-C.',
	},
	serie: {
		id: 'serie',
		label: 'Port série',
		categorie: 'connectique',
		titre: 'Port série',
		resume: 'Le port série de la carte.',
		points: ['La communication série asynchrone s’appelle UART : elle est étudiée dans une page de ce chapitre.'],
		repere: 'En bas, entre les deux sorties HDMI.',
		lien: { texte: 'La communication asynchrone : UART', href: `${base}07-asynchrone-uart/` },
	},
	hdmi: {
		id: 'hdmi',
		label: 'Sortie Vidéo HDMI',
		categorie: 'connectique',
		titre: 'Sortie vidéo HDMI',
		resume: 'Les sorties vidéo HDMI de la carte.',
		points: ['La carte en compte deux, repérées HDMI 0 et HDMI 1.'],
		repere: 'En bas, de part et d’autre du port série.',
	},
	camlcd: {
		id: 'camlcd',
		label: 'Ports Caméra afficheurs LCD',
		categorie: 'connectique',
		titre: 'Ports caméra et afficheurs LCD',
		resume: 'Les connecteurs pour une caméra ou un afficheur LCD.',
		points: ['La carte en compte deux, repérés CAM/DISP.'],
		repere: 'En bas, à droite des sorties HDMI.',
	},
	poe: {
		id: 'poe',
		label: 'PoE',
		categorie: 'alimentation',
		titre: 'PoE (Power over Ethernet)',
		resume: 'Le connecteur PoE de la carte.',
		points: [],
		repere: 'En bas à droite, à gauche de la prise Ethernet.',
	},
};

// Ordre de la visite guidée : le cœur de la carte, puis le tour du bord, dans le sens des aiguilles d'une montre.
export const ordre = [
	'cpu', 'memoire', 'southbridge', 'gpio', 'ventilateur', 'usb', 'usb3', 'ethernet', 'poe', 'camlcd',
	'hdmi', 'serie', 'batterie', 'usbc', 'led', 'bouton', 'pcie', 'wifi',
];
