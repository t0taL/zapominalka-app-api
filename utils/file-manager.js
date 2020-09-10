const fs = require('fs');
const path = require('path');


class FileManager {
  static removeUnusedImageFile(imageUrl) {
    const fileName = imageUrl.split('fileName=')[1];

    fs.unlink(path.join(__dirname, '../images', fileName), (err) => {
      if (err) {
        console.log(err);
      }
      return;
    })
  }
}


module.exports = FileManager;
