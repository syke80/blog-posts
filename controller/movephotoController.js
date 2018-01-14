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

  // checkIfPostExist - ha invalid a post akkor bad request
  // megkeresni a photo-t
  // removeolni mindenhonnan
  // torolni az ures postokat (removeolas utan lehet h ures lett)
  // berakni a post-ba

  postService.checkIfPostExist(postId)
    let photoId;

    photoService.findByFilename(filename)
    .then( (photo) => {
      // TODO: null result should be handled
      photoId = photo._id;
      return photoService.removePhotoFromAllPosts(photoId);
    })
    .then( () => {
      return postService.addPhotoToPost(photoId, postId);
    })
    .then( () => {
      return postService.deleteEmptyPosts();
    })
    .then( () => {
      res.send('');
    })
    .catch( () => {
      res.status(404).send('Something went wrong.');
    })
};
