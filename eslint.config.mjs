import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {languageOptions: { globals: globals.node },},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-ex-assign": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-useless-escape": "off"
    }
  },
];


// export default [
//   {
//     rules: {
//       "no-ex-assign": "off",
//       "@typescript-eslint/no-unused-vars": "off"
//     }
//   },
//   {languageOptions: { globals: globals.node },},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
// ];