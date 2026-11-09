// Extrait la liste ordonnée des leçons du parcours depuis la barre latérale de Starlight.
// Les pages rangées dans un sous-groupe (un TP) reçoivent le préfixe de ce groupe :
// « Présentation » dans « TP1 · De la LED au contrôleur… » devient « TP1 · Présentation ».
// Un sous-groupe d'un TP, s'il en existe un, cumule les préfixes :
// « A. Étape » dans le sous-groupe « Bilan » du TP1 devient « TP1 · Bilan · A. Étape ».
export interface Lecon {
	label: string;
	href: string;
	chapitre: string; // groupe de premier niveau, ex. « Chapitre 2 : … »
	groupe: string; // sous-groupe (TP ou partie d'un TP) ou, à défaut, le chapitre
	prefixe: string; // nom court du sous-groupe, ex. « TP1 » ou « TP1 · Bilan »
}

interface EntreeSidebar {
	type: string;
	label: string;
	href?: string;
	entries?: EntreeSidebar[];
}

export function leconsDuParcours(entrees: EntreeSidebar[], chapitre = '', groupe = '', prefixe = ''): Lecon[] {
	const lecons: Lecon[] = [];
	for (const entree of entrees) {
		if (entree.type === 'link' && entree.href && entree.href.includes('/parcours/')) {
			lecons.push({
				label: prefixe ? `${prefixe} · ${entree.label}` : entree.label,
				href: entree.href,
				chapitre,
				groupe: groupe || chapitre,
				prefixe,
			});
		} else if (entree.type === 'group' && entree.entries) {
			if (!chapitre) {
				// groupe de premier niveau : un chapitre
				lecons.push(...leconsDuParcours(entree.entries, entree.label));
			} else if (!groupe) {
				// sous-groupe d'un chapitre : un TP, « TP1 · Titre » donne le préfixe « TP1 »
				lecons.push(...leconsDuParcours(entree.entries, chapitre, entree.label, entree.label.split(' · ')[0]));
			} else {
				// sous-groupe d'un TP : « Bilan » donne « TP1 · Bilan »
				const sousGroupe = `${prefixe} · ${entree.label}`;
				lecons.push(...leconsDuParcours(entree.entries, chapitre, sousGroupe, sousGroupe));
			}
		}
	}
	return lecons;
}
