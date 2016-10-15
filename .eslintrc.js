module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "flowtype",
  ],
  "rules": {
    "no-console": 0,
    "no-underscore-dangle": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 0,
    "flowtype/define-flow-type": 1,
    "flowtype/use-flow-type": 1,
    "flowtype/valid-syntax": 1,
  },
  "env": {
    "browser": true,
    "es6": true,
    "mocha": true,
    "node": true,
  },
  "settings": {
    "import/resolver": {
      "node": {
        "moduleDirectory": [
          "node_modules",
          "src",
        ],
      },
    },
  },
};
