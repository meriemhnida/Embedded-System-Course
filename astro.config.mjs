// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://meriemhnida.github.io',
	base: '/Embedded-System-Course',
	// Anciennes adresses : les liens déjà partagés restent valides.
	// La destination doit inclure la base du site.
	redirects: {
		// ancien dossier atelier-1 du chapitre 2
		'/parcours/atelier-1/01-mcu-mpu-carte': '/Embedded-System-Course/parcours/chapitre-2/01-mcu-mpu-carte/',
		'/parcours/atelier-1/02-presentation': '/Embedded-System-Course/parcours/chapitre-2/02-presentation/',
		'/parcours/atelier-1/01-presentation': '/Embedded-System-Course/parcours/chapitre-2/02-presentation/',
		// ancienne organisation en trois TP, réunis dans le TP1
		'/parcours/chapitre-2/tp1/02-sorties-numeriques': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex01-led-integree/',
		'/parcours/chapitre-2/tp1/03-entrees-numeriques': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex03-bouton-poussoir/',
		'/parcours/chapitre-2/tp1/04-analogique-pwm': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex05-potentiometre-pwm/',
		'/parcours/chapitre-2/tp1/05-defi-rendu': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex05-potentiometre-pwm/',
		'/parcours/chapitre-2/tp2/01-presentation': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex06-capteur-dht22/',
		'/parcours/chapitre-2/tp2/02-acquisition': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex06-capteur-dht22/',
		'/parcours/chapitre-2/tp2/03-signalisation-rvb': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex07-led-rvb/',
		'/parcours/chapitre-2/tp2/04-bouton-lcd': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex09-bouton-lcd/',
		'/parcours/chapitre-2/tp2/05-alarme-defi': '/Embedded-System-Course/parcours/chapitre-2/tp1/ex10-avertisseur-sonore/',
		'/parcours/chapitre-2/tp3/01-presentation': '/Embedded-System-Course/parcours/chapitre-3/01-consignes/',
		'/parcours/chapitre-2/tp3/02-analyse-risques': '/Embedded-System-Course/parcours/chapitre-3/03-analyse-risques/',
		'/parcours/chapitre-2/tp3/03-surete': '/Embedded-System-Course/parcours/chapitre-3/04-surete/',
		'/parcours/chapitre-2/tp3/04-cybersecurite': '/Embedded-System-Course/parcours/chapitre-3/05-cybersecurite/',
		'/parcours/chapitre-2/tp3/05-donnees-recette': '/Embedded-System-Course/parcours/chapitre-3/06-donnees-recette/',
		// la partie sécurité du TP1 est devenue le chapitre 3
		'/parcours/chapitre-2/tp1/securite/01-consignes': '/Embedded-System-Course/parcours/chapitre-3/01-consignes/',
		'/parcours/chapitre-2/tp1/securite/02-cahier-des-charges': '/Embedded-System-Course/parcours/chapitre-3/02-cahier-des-charges/',
		'/parcours/chapitre-2/tp1/securite/03-analyse-risques': '/Embedded-System-Course/parcours/chapitre-3/03-analyse-risques/',
		'/parcours/chapitre-2/tp1/securite/04-surete': '/Embedded-System-Course/parcours/chapitre-3/04-surete/',
		'/parcours/chapitre-2/tp1/securite/05-cybersecurite': '/Embedded-System-Course/parcours/chapitre-3/05-cybersecurite/',
		'/parcours/chapitre-2/tp1/securite/06-donnees-recette': '/Embedded-System-Course/parcours/chapitre-3/06-donnees-recette/',
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
						{ label: '4. Concevoir avec le modèle en V', slug: 'parcours/chapitre-2/04-modele-en-v' },
						{
							// Un seul TP : une page par exercice.
							label: 'TP1 · De la LED au contrôleur de température',
							collapsed: true,
							items: [
								{ label: 'Présentation', slug: 'parcours/chapitre-2/tp1/01-presentation' },
								{ label: 'Exercice 1 · LED intégrée', slug: 'parcours/chapitre-2/tp1/ex01-led-integree' },
								{ label: 'Exercice 2 · Clignotement', slug: 'parcours/chapitre-2/tp1/ex02-clignotement' },
								{ label: 'Exercice 3 · Bouton-poussoir', slug: 'parcours/chapitre-2/tp1/ex03-bouton-poussoir' },
								{ label: 'Exercice 4 · Interrupteur et liaison série', slug: 'parcours/chapitre-2/tp1/ex04-interrupteur-serie' },
								{ label: 'Exercice 5 · Potentiomètre et PWM', slug: 'parcours/chapitre-2/tp1/ex05-potentiometre-pwm' },
								{ label: 'Exercice 6 · Capteur DHT22', slug: 'parcours/chapitre-2/tp1/ex06-capteur-dht22' },
								{ label: 'Exercice 7 · LED RVB', slug: 'parcours/chapitre-2/tp1/ex07-led-rvb' },
								{ label: 'Exercice 8 · Couleur selon la température', slug: 'parcours/chapitre-2/tp1/ex08-couleur-temperature' },
								{ label: 'Exercice 9 · Bouton et écran LCD', slug: 'parcours/chapitre-2/tp1/ex09-bouton-lcd' },
								{ label: 'Exercice 10 · Avertisseur sonore', slug: 'parcours/chapitre-2/tp1/ex10-avertisseur-sonore' },
								{ label: 'Exercice 11 · Unités et programme final', slug: 'parcours/chapitre-2/tp1/ex11-unites-programme-final' },
							],
						},
					],
				},
				{
					label: 'Chapitre 3 : Sécurité des systèmes embarqués',
					items: [
						{ label: 'Consignes et mise à l’épreuve', slug: 'parcours/chapitre-3/01-consignes' },
						{ label: 'Cahier des charges et montage', slug: 'parcours/chapitre-3/02-cahier-des-charges' },
						{ label: 'A. Analyse des risques', slug: 'parcours/chapitre-3/03-analyse-risques' },
						{ label: 'B. Sûreté de fonctionnement', slug: 'parcours/chapitre-3/04-surete' },
						{ label: 'C. Cybersécurité', slug: 'parcours/chapitre-3/05-cybersecurite' },
						{ label: 'D. Données et recette', slug: 'parcours/chapitre-3/06-donnees-recette' },
					],
				},
				{ label: 'Examen Blanc', slug: 'examen-blanc' },
				{ label: 'Mon parcours', link: '/mon-parcours/' },
				{ label: 'Mes réponses', link: '/mes-reponses/' },
			],
		}),
	],
});
