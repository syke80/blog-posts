const photoService = require('./../services/photoService');
const postService = require('./../services/postService');
const Photo = require('./../models/photo');

exports.put = function(req, res) {
  let filename = req.body.photo;
  let postId = req.body.postId;

  if (!filename || !postId) {
    res.status(400).send('photo and postId parameters must be set');

    return;

  }

  postService.checkIfPostExist(postId)
    let photoId;

    photoService.findByFilename(filename)
    .then( (photo) => {
      // TODO: null result should be handled
      photoId = photo._id;
      return postService.addPhotoToPost(photoId, postId);
    })
    .then( () => {
      return postService.removePhotoFromOtherPosts(photoId, postId);
    })
    .then( () => {
      return postService.deleteEmptyPosts();
    })
    .then( () => {
      res.send('');
    })
    .catch( (err) => {
      console.log(err);
      res.status(404).send('Something went wrong.');
    })
};
