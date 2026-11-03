// Extrait la liste ordonnée des leçons du parcours depuis la barre latérale de Starlight.
// Les pages rangées dans un sous-groupe (un TP) reçoivent le préfixe de ce groupe :
// « Présentation » dans « TP1 · Entrées et sorties » devient « TP1 · Présentation ».
export interface Lecon {
	label: string;
	href: string;
	chapitre: string; // groupe de premier niveau, ex. « Chapitre 2 : … »
	groupe: string; // sous-groupe (TP) ou, à défaut, le chapitre
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
			});
		} else if (entree.type === 'group' && entree.entries) {
			if (!chapitre) {
				lecons.push(...leconsDuParcours(entree.entries, entree.label));
			} else {
				lecons.push(...leconsDuParcours(entree.entries, chapitre, entree.label, entree.label.split(' · ')[0]));
			}
		}
	}
	return lecons;
}
