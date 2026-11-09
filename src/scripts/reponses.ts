// Réponses de l'étudiant aux questions des TP, enregistrées dans son navigateur (localStorage).
// Le site est statique : aucune réponse n'est envoyée à un serveur. Pour les rendre,
// l'étudiant les exporte depuis la page « Mes réponses » (PDF, Markdown ou sauvegarde JSON).

const CLE = 'systemes-embarques:reponses:v1';
const TAILLE_MAX_REPONSE = 20000; // caractères par réponse
const ID_VALIDE = /^[a-z0-9][a-z0-9.\-]{0,63}$/;

export interface Reponse {
	texte: string;
	maj: string; // date ISO de la dernière modification
	page?: string; // chemin de la page de la question
	label?: string; // numéro affiché, ex. « Q2.3 »
}

export interface Etudiant {
	nom: string;
	prenom: string;
	groupe: string;
}

export interface Carnet {
	version: 1;
	etudiant: Etudiant;
	reponses: Record<string, Reponse>;
}

function vide(): Carnet {
	return { version: 1, etudiant: { nom: '', prenom: '', groupe: '' }, reponses: {} };
}

function chaine(valeur: unknown, max: number): string {
	return typeof valeur === 'string' ? valeur.slice(0, max) : '';
}

// Les données relues (stockage ou fichier importé) ne sont jamais utilisées telles quelles :
// on ne garde que les champs attendus, avec des types et des tailles contrôlés.
function nettoyer(donnees: unknown): Carnet {
	const carnet = vide();
	if (!donnees || typeof donnees !== 'object') return carnet;
	const d = donnees as Record<string, unknown>;
	const e = (d.etudiant && typeof d.etudiant === 'object' ? d.etudiant : {}) as Record<string, unknown>;
	carnet.etudiant = { nom: chaine(e.nom, 80), prenom: chaine(e.prenom, 80), groupe: chaine(e.groupe, 80) };
	const reponses = d.reponses && typeof d.reponses === 'object' ? (d.reponses as Record<string, unknown>) : {};
	for (const [id, valeur] of Object.entries(reponses)) {
		if (!ID_VALIDE.test(id) || !valeur || typeof valeur !== 'object') continue;
		const v = valeur as Record<string, unknown>;
		const maj = chaine(v.maj, 40);
		const texte = chaine(v.texte, TAILLE_MAX_REPONSE);
		if (Number.isNaN(Date.parse(maj)) || texte.trim() === '') continue;
		carnet.reponses[id] = { texte, maj, page: chaine(v.page, 200), label: chaine(v.label, 20) };
	}
	return carnet;
}

export function lire(): Carnet {
	try {
		const brut = localStorage.getItem(CLE);
		return brut ? nettoyer(JSON.parse(brut)) : vide();
	} catch {
		return vide();
	}
}

function ecrire(carnet: Carnet): boolean {
	try {
		localStorage.setItem(CLE, JSON.stringify(carnet));
		return true;
	} catch {
		return false; // navigation privée, stockage plein ou bloqué
	}
}

// Renvoie la date d'enregistrement, ou null si le navigateur refuse d'enregistrer.
export function enregistrerReponse(id: string, texte: string, infos: { page?: string; label?: string }): string | null {
	if (!ID_VALIDE.test(id)) return null;
	const carnet = lire();
	const maj = new Date().toISOString();
	if (texte.trim() === '') delete carnet.reponses[id];
	else carnet.reponses[id] = { texte: texte.slice(0, TAILLE_MAX_REPONSE), maj, page: infos.page, label: infos.label };
	return ecrire(carnet) ? maj : null;
}

export function enregistrerEtudiant(etudiant: Etudiant): boolean {
	const carnet = lire();
	carnet.etudiant = {
		nom: etudiant.nom.slice(0, 80),
		prenom: etudiant.prenom.slice(0, 80),
		groupe: etudiant.groupe.slice(0, 80),
	};
	return ecrire(carnet);
}

export function exporterJSON(): string {
	return JSON.stringify({ ...lire(), application: 'systemes-embarques', exporteLe: new Date().toISOString() }, null, 2);
}

export interface BilanImport {
	ajoutees: number;
	misesAJour: number;
	ignorees: number;
}

// Fusionne une sauvegarde : pour chaque question, la réponse la plus récente l'emporte.
export function importerJSON(json: string): BilanImport | null {
	let donnees: unknown;
	try {
		donnees = JSON.parse(json);
	} catch {
		return null;
	}
	if (!donnees || typeof donnees !== 'object' || !('reponses' in (donnees as object))) return null;
	const entrant = nettoyer(donnees);
	const carnet = lire();
	const bilan: BilanImport = { ajoutees: 0, misesAJour: 0, ignorees: 0 };
	for (const [id, reponse] of Object.entries(entrant.reponses)) {
		const actuelle = carnet.reponses[id];
		if (!actuelle) {
			carnet.reponses[id] = reponse;
			bilan.ajoutees++;
		} else if (Date.parse(reponse.maj) > Date.parse(actuelle.maj)) {
			carnet.reponses[id] = reponse;
			bilan.misesAJour++;
		} else {
			bilan.ignorees++;
		}
	}
	if (!carnet.etudiant.nom && !carnet.etudiant.prenom) carnet.etudiant = entrant.etudiant;
	return ecrire(carnet) ? bilan : null;
}

export function effacerTout(): boolean {
	try {
		localStorage.removeItem(CLE);
		return true;
	} catch {
		return false;
	}
}

export function stockageDisponible(): boolean {
	try {
		const cle = `${CLE}:test`;
		localStorage.setItem(cle, '1');
		localStorage.removeItem(cle);
		return true;
	} catch {
		return false;
	}
}
