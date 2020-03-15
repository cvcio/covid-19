module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended'],
	parserOptions: {
		parser: 'babel-eslint',
	},
	rules: {
		// 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'space-before-function-paren': ['error', 'always'],
		'arrow-parens': 0,
		'generator-star-spacing': 0,
		'no-mixed-spaces-and-tabs': 0,
		indent: [2, 'tab'],
		'no-tabs': 0,
		semi: ['error', 'always'],
		'no-unused-vars': 0,
		quotes: ['error', 'single']
	},
};
