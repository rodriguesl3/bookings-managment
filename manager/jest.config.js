module.exports = {
	verbose: true,
	collectCoverage: true,
	modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/__mocks__'],
	roots: ['<rootDir>/__tests__'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/'],
	testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
	moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
