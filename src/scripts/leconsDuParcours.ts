// Extrait la liste ordonnée des leçons du parcours depuis la barre latérale de Starlight.
// Les pages rangées dans un sous-groupe (un TP) reçoivent le préfixe de ce groupe :
<<<<<<< HEAD
// « Présentation » dans « TP1 · De la LED au contrôleur… » devient « TP1 · Présentation ».
// Un sous-groupe d'un TP (la partie sécurité) cumule les préfixes :
// « A. Analyse des risques » devient « TP1 · Partie sécurité · A. Analyse des risques ».
=======
// « Présentation » dans « TP1 · Entrées et sorties » devient « TP1 · Présentation ».
>>>>>>> 0bb7b8852d3da41e642573f946f09ed4ef5ee63f
export interface Lecon {
	label: string;
	href: string;
	chapitre: string; // groupe de premier niveau, ex. « Chapitre 2 : … »
<<<<<<< HEAD
	groupe: string; // sous-groupe (TP ou partie d'un TP) ou, à défaut, le chapitre
	prefixe: string; // nom court du sous-groupe, ex. « TP1 » ou « TP1 · Partie sécurité »
=======
	groupe: string; // sous-groupe (TP) ou, à défaut, le chapitre
>>>>>>> 0bb7b8852d3da41e642573f946f09ed4ef5ee63f
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
<<<<<<< HEAD
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
				// sous-groupe d'un TP : « Partie sécurité » donne « TP1 · Partie sécurité »
				const sousGroupe = `${prefixe} · ${entree.label}`;
				lecons.push(...leconsDuParcours(entree.entries, chapitre, sousGroupe, sousGroupe));
=======
			});
		} else if (entree.type === 'group' && entree.entries) {
			if (!chapitre) {
				lecons.push(...leconsDuParcours(entree.entries, entree.label));
			} else {
				lecons.push(...leconsDuParcours(entree.entries, chapitre, entree.label, entree.label.split(' · ')[0]));
>>>>>>> 0bb7b8852d3da41e642573f946f09ed4ef5ee63f
			}
		}
	}
	return lecons;
}
