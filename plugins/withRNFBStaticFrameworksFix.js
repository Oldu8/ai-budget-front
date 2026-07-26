const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Fixes: "include of non-modular header inside framework module 'RNFBApp...'"
// react-native-firebase pods must build as static libraries even when the
// project otherwise uses `use_frameworks! :linkage => :static` (set via
// expo-build-properties). Documented fix: https://rnfirebase.io/#altering-cocoapods-static-frameworks-if-needed
const PRE_INSTALL_HOOK = `
pre_install do |installer|
  installer.pod_targets.each do |pod|
    if pod.name.start_with?('RNFB')
      def pod.build_type
        Pod::BuildType.static_library
      end
    end
  end
end
`;

module.exports = function withRNFBStaticFrameworksFix(config) {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const contents = fs.readFileSync(podfilePath, 'utf8');
      if (!contents.includes("pod.name.start_with?('RNFB')")) {
        fs.writeFileSync(podfilePath, `${contents}\n${PRE_INSTALL_HOOK}`);
      }
      return config;
    },
  ]);
};
