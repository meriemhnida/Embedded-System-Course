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
const RENOMMAGES: Record<string, string> = {
	'parcours/atelier-1/01-mcu-mpu-carte/': 'parcours/chapitre-2/01-mcu-mpu-carte/',
	'parcours/atelier-1/02-presentation/': 'parcours/chapitre-2/02-presentation/',
};

function migrer(p: Progression): boolean {
	const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
	let modifiee = false;
	for (const [ancien, nouveau] of Object.entries(RENOMMAGES)) {
		const a = base + ancien;
		const n = base + nouveau;
		if (p.valides[a]) {
			if (!p.valides[n]) p.valides[n] = p.valides[a];
			delete p.valides[a];
			modifiee = true;
		}
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
