// eslint.config.mts
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    // bloc 1 : général
    {
        files: ["**/*.{ts,js}"],
        ignores: ["node_modules", "build"],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2023,
                sourceType: "module",
            },
            globals: globals.node,
        }
    },

    // bloc 2 : règles Node + TypeScript
    {
        extends: [
            ...tseslint.configs.recommended, // remplace "plugin:@typescript-eslint/recommended"
        ],

        rules: {
            "no-console": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "prefer-const": "off",
            "semi": ["error"],
            "quotes": ["error", "double"],
        }
    }
);