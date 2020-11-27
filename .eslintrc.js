module.exports = {
	root: true,
	env: {
		node: true,
		browser: true
	},
	extends: [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		// allow debugger during development
		'space-before-function-paren': ['error', 'always'],
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'no-mixed-spaces-and-tabs': 0,
		// tabs
		indent: [2, 'tab'],
		'no-tabs': 0,
		semi: ['error', 'always']
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
