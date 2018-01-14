const Tag = require('../models/tag');

exports.add = function(name) {
  var promise = new Promise( (resolve, reject) => {
    let newTag = new Tag({
      name: name
    });

    newTag.save( (err, savedTag) => {
      resolve(savedTag);
    });
  });

  return promise;
}
