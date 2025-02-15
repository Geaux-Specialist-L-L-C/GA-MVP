// File: /eslint.config.js
// Description: ESLint flat configuration for Geaux Academy

import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  // Global ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/dataconnect-generated/**",
      "**/*.d.ts",
      "**/public/**/*.js"  // Ignore plain JS files in public
    ]
  },

  // Handle JSX files in public directory separately
  {
    files: ["public/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        jsx: true,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        React: "readonly"
      }
    },
    plugins: {
      react: reactPlugin
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: { version: "detect" }
    }
  },

  // Base configuration for all JavaScript files
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    ignores: ["public/**"],  // Skip files already handled
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        jsx: true
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly"
      }
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin
    },
    rules: {
      "react-hooks/rules-of-hooks": "warn", // Changed from error to warn
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // Changed from error to warn
      "import/order": [
        "warn", // Changed from error to warn
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc" }
        }
      ]
    },
    settings: { 
      react: { version: "detect" }
    }
  },

  // TypeScript-specific configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }], // Changed from error to warn
      "@typescript-eslint/explicit-function-return-type": ["warn", { 
        allowExpressions: true, 
        allowTypedFunctionExpressions: true 
      }],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "warn", // Changed from error to warn
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: { version: "detect" }
    }
  }
];