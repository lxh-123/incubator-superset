module.exports = {
  testRegex: '\\/spec\\/.*_spec\\.jsx?$',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/spec/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/spec/__mocks__/fileMock.js',
  },
  setupTestFrameworkScriptFile: '<rootDir>/spec/helpers/shim.js',
  testURL: 'http://localhost',
};