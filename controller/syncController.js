const configService = require('./../services/configService');
const photoService = require('./../services/photoService');
const fs = require('fs');

function synchronizeFiles() {
  fs.readdir(configService.config.photosPath, function(err, items) {
    items = items.filter(item => {
      return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(item);
    });

    items.forEach(filename => {
      photoService.addNewPhoto(filename);
    })
  });
}

exports.get = function(req, res) {
  synchronizeFiles();
  res.send('ok');
};
