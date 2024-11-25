// jest.config.js or jest.config.mjs
export default {
    transform: {
        "^.+\\.jsx?$": "babel-jest", // Use babel-jest to transform JS/JSX files
    },
    testEnvironment: "jest-environment-jsdom", // Specify the JSDOM environment
};
