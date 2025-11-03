const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "!lib/**/*.d.ts",
    "!lib/models/index.ts",
    "!**/__tests__/**",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/__tests__/auth.test.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(bson|mongodb))",
  ],
};

module.exports = createJestConfig(customJestConfig);
