module.exports = {
  root: true, // .eslintrc.jsがプロジェクトのルートに配置させているか（指定がないと上位階層へ設定ファイルを探索される）
  parser: "@typescript-eslint/parser", // ESLintにTypeScriptを理解させる
  parserOptions: {},
  plugins: [
    "@typescript-eslint", // ESLintのTypeScriptプラグインのルールを適用できる様にする（/eslint-pluginは省略可）
  ],
  extends: [
    "eslint:recommended", // ESLintのJavaScriptルールセットを適用
    "plugin:@typescript-eslint/eslint-recommended", // eslint:recommendedに含まれるルールを型チェックでカバーできるものは無効化
    "plugin:@typescript-eslint/recommended", // 型チェックが不要なルールを適用
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // 型チェックが必要なルールを適用
    "prettier",
    "prettier/@typescript-eslint", // eslint-config-prettierがv8.0.0以上の場合不要です
  ],
};
