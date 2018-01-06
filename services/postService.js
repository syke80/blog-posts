const BlogPost = require('../models/blogPost');

exports.addNewPost = function(photo) {
  let newPost = new BlogPost({
    title: '',
    date: photo.date,
    photos: [photo],
    tags: []
  });

  newPost.save();
}

exports.checkIfPostExist = function(postId) {
  var promise = new Promise( (resolve, reject) => {
    BlogPost.findById(postId, (err, post) => {
      if (err) {
        console.log(err);
        reject();
      }
      else {
        resolve();
      }
    });
  });

  return promise;
}

exports.update = function(id, data) {
  return BlogPost.findByIdAndUpdate(id, { $set: data }).exec();
}

exports.deleteEmptyPosts = function() {
  return BlogPost.deleteMany({'photos': {$size: 0}}).exec();
}

exports.addPhotoToPost = function(photoId, postId) {
  var promise = new Promise( (resolve, reject) => {

    BlogPost.findById(postId, function (err, post) {
      if (err) {
        console.log(err);
        reject();
        return;
      }

      // TODO: can we use set() (ES6) instead of array
      if (post.photos.indexOf(photoId) === -1) {
        post.photos.push(photoId);
      }

      console.log('saving post@add (post, photos)', post._id, post.photos);
      post.save(() => {
        resolve();
      });
    });
  });

  return promise;
}

