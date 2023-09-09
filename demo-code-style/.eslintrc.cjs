/* eslint-env node */
module.exports = {
	extends: [
		'eslint:recommended', // eslint 的默认规则
		'plugin:@typescript-eslint/recommended', // typescript-eslint 的规则
		'standard', // 引入社区规范 standard 的规则
		'prettier' // 确保在最后面
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	root: true,
	rules: {
		'prettier/prettier': 'error' // 对于不符合prettier报eslint错误
	}
}
