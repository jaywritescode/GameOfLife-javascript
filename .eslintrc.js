module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            2,
            {"VariableDeclarator": {"var": 2, "let": 2, "const": 3}}
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single",
            {"avoidEscape": true}
        ],
        "semi": [
            "warn",
            "always"
        ]
    }
};
