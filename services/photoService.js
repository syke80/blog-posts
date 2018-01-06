const fs = require('fs');

const configService = require('./configService');
const postService = require('./postService');
const Photo = require('../models/photo');
const BlogPost = require('../models/blogPost');

exports.removePhotoFromAllPosts = function(photoId) {
  return BlogPost.update({}, { $pull: {'photos': photoId } }, { multi: true }).exec();
}

exports.findByFilename = function(filename) {
  return Photo.findOne({'filename': filename}).exec();
}

exports.update = function(id, data) {
  return Photo.findByIdAndUpdate(id, { $set: data }).exec();
}

exports.addNewPhoto = function(filename) {
  fs.stat(configService.config.photosPath + filename, (err, stat) => {
    let newPhoto = new Photo({
      filename: filename,
      date: stat.mtime
    });

    newPhoto.save((err) => {
      if (err) {
        console.log('Error saving photo', err);
        return;
      }

      postService.addNewPost(newPhoto);
    } );
  })
}
