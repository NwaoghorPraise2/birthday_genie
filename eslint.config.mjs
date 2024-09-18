import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import path from 'path';


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
    ...tseslint.configs.recommendedTypeChecked,
  ],
  rules: {
    "no-console": "error",
    quotes: ["error", "single", {allowTemplateLiterals: true}],
  },
}); 