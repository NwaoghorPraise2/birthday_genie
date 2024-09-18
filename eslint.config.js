import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   eslint.configs.recommended,
//   ...tseslint.configs.recommended,
// );

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },

  files: ['**/*.ts'],
  extends: [
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  rules: {
    "no-console": "error",
    quotes: ["error", "single", {allowTemplateLiterals: true}],
  },
});