// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://meriemhnida.github.io',
	base: '/Embedded-System-Course',
	integrations: [
		starlight({
			title: 'Systèmes Embarqués',
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
					label: 'Atelier 1 : Carte Arduino',
					items: [
						{ label: 'Carte, MCU ou MPU ?', slug: 'parcours/atelier-1/01-mcu-mpu-carte' },
						{ label: 'Présentation', slug: 'parcours/atelier-1/02-presentation' },
					],
				},
				{ label: 'Mon parcours', link: '/mon-parcours/' },
			],
		}),
	],
});
