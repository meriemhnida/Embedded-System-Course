// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://meriemhnida.github.io',
	base: '/Embedded-System-Course',
	integrations: [
		starlight({
			title: 'Embedded System Course',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/meriemhnida/Embedded-System-Course' },
			],
		}),
	],
});