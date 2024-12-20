
module.exports = {
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!mysql2)", 
  ],
  extensionsToTreatAsEsm: [".js"],
  globals: {
    "babel-jest": {
      useESModules: true, 
    },
  },
};
