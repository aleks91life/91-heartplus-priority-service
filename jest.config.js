const fs = require('fs');
const defaultSetupPath = './src/__tests__/setup.ts';
// Add a __tests__/setup.ts file in packages for package-specific test setup.
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: '((\\.)(test|spec))\\.(t|j)sx?$',
    setupFilesAfterEnv: [
        __dirname + '/src/__tests__/setup.ts',
        fs.existsSync(defaultSetupPath) ? defaultSetupPath : '',
    ].filter(Boolean),
    globals: {
        'ts-jest': {
            diagnostics: { warnOnly: true },
        },
    },
};
