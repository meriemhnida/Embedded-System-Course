// Extrait la liste ordonnée des leçons du parcours depuis la barre latérale de Starlight.
export interface Lecon {
	label: string;
	href: string;
}

interface EntreeSidebar {
	type: string;
	label: string;
	href?: string;
	entries?: EntreeSidebar[];
}

export function leconsDuParcours(entrees: EntreeSidebar[]): Lecon[] {
	const lecons: Lecon[] = [];
	for (const entree of entrees) {
		if (entree.type === 'link' && entree.href && entree.href.includes('/parcours/')) {
			lecons.push({ label: entree.label, href: entree.href });
		} else if (entree.type === 'group' && entree.entries) {
			lecons.push(...leconsDuParcours(entree.entries));
		}
	}
	return lecons;
}
