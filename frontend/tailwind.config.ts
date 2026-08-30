export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}', './src/styles/**/*.css'],
	safelist: [
		// Custom button styles
		'btn-primary-orange',
		'btn-navy',
		'button-secondary',
		// Custom badge styles
		'badge-verified-navy',
		'badge-orange-tag',
		// Custom card styles
		'card-kazilink',
		// Animation utilities
		'animate-fade-in',
		'animate-pulse-glow',
		'animate-impulse',
		'animate-float',
	],
	theme: {
		extend: {
			colors: {
				ink: '#17221b',
				moss: '#2f6b4f',
				clay: '#d86b45',
				paper: '#f7f3ea',
				kazilink: {
					navy: '#0A2540',
					'navy-dark': '#051829',
					'navy-light': '#153B64',
					'navy-surface': '#0E2E4E',
					orange: '#FF6B00',
					'orange-hover': '#E55F00',
					'orange-light': '#FFF4EB',
					border: '#E2E8F0',
					'slate-bg': '#F8FAFC',
				},
			},
			fontFamily: {
				display: ['Georgia', 'serif'],
				sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
