// Progression de l'étudiant, stockée dans son navigateur (localStorage).
// Le site étant statique, ces données ne sont visibles que sur cet appareil.

const CLE = 'systemes-embarques:parcours:v1';

export type Action = 'valide' | 'annule' | 'reinitialise';

export interface Entree {
	href: string;
	label: string;
	action: Action;
	date: string;
}

export interface Progression {
	valides: Record<string, string>; // href -> date de validation
	journal: Entree[];
}

function vide(): Progression {
	return { valides: {}, journal: [] };
}

// Pages déplacées : la progression déjà enregistrée suit la page à sa nouvelle adresse.
// Une ancienne page découpée en plusieurs pages valide chacune d'elles ; une page supprimée
// sans équivalent (liste vide) est simplement retirée.
const RENOMMAGES: Record<string, string[]> = {
	'parcours/atelier-1/01-mcu-mpu-carte/': ['parcours/chapitre-2/01-mcu-mpu-carte/'],
	'parcours/atelier-1/02-presentation/': ['parcours/chapitre-2/02-presentation/'],
	// ancienne organisation en trois TP, réunis dans le TP1
	'parcours/chapitre-2/tp1/02-sorties-numeriques/': [
		'parcours/chapitre-2/tp1/ex01-led-integree/',
		'parcours/chapitre-2/tp1/ex02-clignotement/',
	],
	'parcours/chapitre-2/tp1/03-entrees-numeriques/': [
		'parcours/chapitre-2/tp1/ex03-bouton-poussoir/',
		'parcours/chapitre-2/tp1/ex04-interrupteur-serie/',
	],
	'parcours/chapitre-2/tp1/04-analogique-pwm/': ['parcours/chapitre-2/tp1/ex05-potentiometre-pwm/'],
	'parcours/chapitre-2/tp1/05-defi-rendu/': [],
	'parcours/chapitre-2/tp2/01-presentation/': [],
	'parcours/chapitre-2/tp2/02-acquisition/': ['parcours/chapitre-2/tp1/ex06-capteur-dht22/'],
	'parcours/chapitre-2/tp2/03-signalisation-rvb/': [
		'parcours/chapitre-2/tp1/ex07-led-rvb/',
		'parcours/chapitre-2/tp1/ex08-couleur-temperature/',
	],
	'parcours/chapitre-2/tp2/04-bouton-lcd/': ['parcours/chapitre-2/tp1/ex09-bouton-lcd/'],
	'parcours/chapitre-2/tp2/05-alarme-defi/': [
		'parcours/chapitre-2/tp1/ex10-avertisseur-sonore/',
		'parcours/chapitre-2/tp1/ex11-unites-programme-final/',
	],
	// l'ancienne partie sécurité a laissé place aux attaques sur les capteurs : seule la page d'analyse de risques
	// (méthode STRIDE) subsiste ; les autres pages sont retirées de la progression
	'parcours/chapitre-2/tp3/01-presentation/': [],
	'parcours/chapitre-2/tp3/02-analyse-risques/': ['parcours/chapitre-3/08-methode-stride/'],
	'parcours/chapitre-2/tp3/03-surete/': [],
	'parcours/chapitre-2/tp3/04-cybersecurite/': [],
	'parcours/chapitre-2/tp3/05-donnees-recette/': [],
	'parcours/chapitre-2/tp1/securite/01-consignes/': [],
	'parcours/chapitre-2/tp1/securite/02-cahier-des-charges/': [],
	'parcours/chapitre-2/tp1/securite/03-analyse-risques/': ['parcours/chapitre-3/08-methode-stride/'],
	'parcours/chapitre-2/tp1/securite/04-surete/': [],
	'parcours/chapitre-2/tp1/securite/05-cybersecurite/': [],
	'parcours/chapitre-2/tp1/securite/06-donnees-recette/': [],
	'parcours/chapitre-3/01-consignes/': [],
	'parcours/chapitre-3/02-cahier-des-charges/': [],
	'parcours/chapitre-3/03-analyse-risques/': ['parcours/chapitre-3/08-methode-stride/'],
	'parcours/chapitre-3/04-surete/': [],
	'parcours/chapitre-3/05-cybersecurite/': [],
	'parcours/chapitre-3/06-donnees-recette/': [],
	// le chapitre 3 a gagné une page d'introduction aux menaces et une page de mesures transversales : ses pages sont renumérotées
	'parcours/chapitre-3/01-attaque-avant-numerisation/': ['parcours/chapitre-3/02-attaque-avant-numerisation/'],
	'parcours/chapitre-3/02-position-distance/': ['parcours/chapitre-3/03-position-distance/'],
	'parcours/chapitre-3/03-son-vibrations/': ['parcours/chapitre-3/04-son-vibrations/'],
	'parcours/chapitre-3/04-images-empreintes/': ['parcours/chapitre-3/05-images-empreintes/'],
	'parcours/chapitre-3/05-couches/': ['parcours/chapitre-3/06-couches/'],
	'parcours/chapitre-3/06-se-defendre/': ['parcours/chapitre-3/07-se-defendre/'],
	'parcours/chapitre-3/07-methode-stride/': ['parcours/chapitre-3/08-methode-stride/'],
	'parcours/chapitre-3/08-retenir-references/': ['parcours/chapitre-3/10-retenir-references/'],
};

function migrer(p: Progression): boolean {
	const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
	let modifiee = false;
	for (const [ancien, nouveaux] of Object.entries(RENOMMAGES)) {
		const a = base + ancien;
		if (!p.valides[a]) continue;
		for (const nouveau of nouveaux) {
			const n = base + nouveau;
			if (!p.valides[n]) p.valides[n] = p.valides[a];
		}
		delete p.valides[a];
		modifiee = true;
	}
	return modifiee;
}

export function lire(): Progression {
	try {
		const brut = localStorage.getItem(CLE);
		if (!brut) return vide();
		const donnees = JSON.parse(brut);
		const p: Progression = {
			valides: donnees.valides && typeof donnees.valides === 'object' ? donnees.valides : {},
			journal: Array.isArray(donnees.journal) ? donnees.journal : [],
		};
		if (migrer(p)) ecrire(p);
		return p;
	} catch {
		return vide();
	}
}

function ecrire(progression: Progression): void {
	try {
		localStorage.setItem(CLE, JSON.stringify(progression));
	} catch {
		// Stockage indisponible (navigation privée, données bloquées) : on ignore.
	}
}

function ajouter(p: Progression, href: string, label: string, action: Action): void {
	p.journal.push({ href, label, action, date: new Date().toISOString() });
}

export function valider(href: string, label: string): Progression {
	const p = lire();
	if (!p.valides[href]) {
		p.valides[href] = new Date().toISOString();
		ajouter(p, href, label, 'valide');
		ecrire(p);
	}
	return p;
}

export function basculer(href: string, label: string): Progression {
	const p = lire();
	if (p.valides[href]) {
		delete p.valides[href];
		ajouter(p, href, label, 'annule');
	} else {
		p.valides[href] = new Date().toISOString();
		ajouter(p, href, label, 'valide');
	}
	ecrire(p);
	return p;
}

// Remet la progression à zéro, mais conserve le journal des actions.
export function reinitialiser(): Progression {
	const p = lire();
	p.valides = {};
	ajouter(p, '', 'Parcours réinitialisé', 'reinitialise');
	ecrire(p);
	return p;
}
