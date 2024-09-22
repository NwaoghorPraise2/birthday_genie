import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import path from 'path';
import eslintConfigPrettier from 'eslint-config-prettier';


export default tseslint.config({
  languageOptions: {
    parserOptions: {
    project: true,
    tsconfigRootDir: path.dirname(new URL(import.meta.url).pathname),
    },
  },
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked, eslintConfigPrettier
  ],
  rules: {
    "no-console": "error",
    "no-useless-catch":0,
    "@typescript-eslint/no-unsafe-call": 0,
    quotes: ["error", "single", {allowTemplateLiterals: true}],
  },
}); 