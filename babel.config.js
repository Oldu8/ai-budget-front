module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // NativeWind v4 — только в presets, не в plugins
    ],
    plugins: [require.resolve("expo-router/babel")],
  };
};
