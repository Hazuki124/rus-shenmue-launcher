// https://www.electron.build/configuration/configuration#afterpack
exports.default = async function() {
  const fs = require('fs');
  const path = require('path');
  const buildDir = path.resolve(__dirname, 'release');

  // prepare filenames to github release
  fs.readdir(buildDir, function(err, files) {
    // files is array of filenames (basename form)
    if (!(files && files.length)) return;
    for (let i = 0, len = files.length; i < len; i++) {
      const filePath = files[i];
      const oldFilePath = path.join(buildDir, filePath);
      const newFilePath = path.join(buildDir, filePath.split(' ').join('-'));

      fs.renameSync(oldFilePath, newFilePath);
    }
  });
};
