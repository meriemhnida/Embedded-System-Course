// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://meriemhnida.github.io',
	base: '/Embedded-System-Course',
	// Anciennes adresses du chapitre 2 (dossier atelier-1) : les liens déjà partagés restent valides.
	// La destination doit inclure la base du site.
	redirects: {
		'/parcours/atelier-1/01-mcu-mpu-carte': '/Embedded-System-Course/parcours/chapitre-2/01-mcu-mpu-carte/',
		'/parcours/atelier-1/02-presentation': '/Embedded-System-Course/parcours/chapitre-2/02-presentation/',
		'/parcours/atelier-1/01-presentation': '/Embedded-System-Course/parcours/chapitre-2/02-presentation/',
	},
	integrations: [
		starlight({
			title: 'Systèmes Embarqués',
			// Interface de Starlight en français (recherche, sommaire, navigation…)
			defaultLocale: 'root',
			locales: {
				root: { label: 'Français', lang: 'fr' },
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{
					label: 'Chapitre 1 : Introduction',
					items: [
						{ label: '1. Qu’est-ce qu’un système embarqué ?', slug: 'parcours/chapitre-1/01-systeme-embarque' },
						{ label: '2. Microcontrôleur ou microprocesseur ?', slug: 'parcours/chapitre-1/02-microcontroleur' },
						{ label: '3. Capteurs et actionneurs', slug: 'parcours/chapitre-1/03-capteurs-actionneurs' },
						{ label: '4. De l’objet au cloud : la chaîne IoT', slug: 'parcours/chapitre-1/04-chaine-iot' },
						{ label: '5. Découvrir la carte Arduino UNO', slug: 'parcours/chapitre-1/05-arduino-uno' },
						{ label: '6. Atelier 1 : première LED', slug: 'parcours/chapitre-1/06-atelier-led' },
						{ label: '7. Atelier 2 : bouton-poussoir', slug: 'parcours/chapitre-1/07-atelier-bouton' },
						{ label: '8. Exercice : interrupteur coulissant', slug: 'parcours/chapitre-1/08-exercice-interrupteur' },
						{ label: '9. Exercice : LED et potentiomètre', slug: 'parcours/chapitre-1/09-exercice-potentiometre' },
					],
				},
				{
					label: 'Chapitre 2 : Carte Arduino et travaux pratiques',
					items: [
						{ label: '1. Carte, MCU ou MPU ?', slug: 'parcours/chapitre-2/01-mcu-mpu-carte' },
						{ label: '2. Présentation de la carte', slug: 'parcours/chapitre-2/02-presentation' },
						{ label: '3. Guide des travaux pratiques', slug: 'parcours/chapitre-2/03-guide-tp' },
						{
							label: 'TP1 · Entrées et sorties',
							collapsed: true,
							items: [
								{ label: 'Présentation', slug: 'parcours/chapitre-2/tp1/01-presentation' },
								{ label: 'A. Sorties numériques', slug: 'parcours/chapitre-2/tp1/02-sorties-numeriques' },
								{ label: 'B. Entrées numériques', slug: 'parcours/chapitre-2/tp1/03-entrees-numeriques' },
								{ label: 'C. Analogique et PWM', slug: 'parcours/chapitre-2/tp1/04-analogique-pwm' },
								{ label: 'D. Défi et rendu', slug: 'parcours/chapitre-2/tp1/05-defi-rendu' },
							],
						},
						{
							label: 'TP2 · Contrôleur de température',
							collapsed: true,
							items: [
								{ label: 'Présentation', slug: 'parcours/chapitre-2/tp2/01-presentation' },
								{ label: 'A. Acquisition (DHT22)', slug: 'parcours/chapitre-2/tp2/02-acquisition' },
								{ label: 'B. Signalisation RVB', slug: 'parcours/chapitre-2/tp2/03-signalisation-rvb' },
								{ label: 'C. Bouton et écran LCD', slug: 'parcours/chapitre-2/tp2/04-bouton-lcd' },
								{ label: 'D. Alarme et défi', slug: 'parcours/chapitre-2/tp2/05-alarme-defi' },
							],
						},
						{
							label: 'TP3 · Nœud de surveillance sécurisé',
							collapsed: true,
							items: [
								{ label: 'Présentation', slug: 'parcours/chapitre-2/tp3/01-presentation' },
								{ label: 'A. Analyse de risques', slug: 'parcours/chapitre-2/tp3/02-analyse-risques' },
								{ label: 'B. Sûreté de fonctionnement', slug: 'parcours/chapitre-2/tp3/03-surete' },
								{ label: 'C. Cybersécurité', slug: 'parcours/chapitre-2/tp3/04-cybersecurite' },
								{ label: 'D. Données et recette', slug: 'parcours/chapitre-2/tp3/05-donnees-recette' },
							],
						},
					],
				},
				{ label: 'Mon parcours', link: '/mon-parcours/' },
				{ label: 'Mes réponses', link: '/mes-reponses/' },
			],
		}),
	],
});
