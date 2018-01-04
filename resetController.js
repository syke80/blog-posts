const BlogPost = require('./models/BlogPost');
const Photo = require('./models/Photo');

exports.get = function(req, res) {
  Photo.remove().exec();
  BlogPost.remove().exec();
  res.send('ok');
};
