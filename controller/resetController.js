const BlogPost = require('./../models/blogPost');
const Photo = require('./../models/photo');

exports.get = function(req, res) {
  Photo.remove().exec();
  BlogPost.remove().exec();
  res.send('ok');
};
