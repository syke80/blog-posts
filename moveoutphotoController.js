const postService = require('./services/postService');
const photoService = require('./services/photoService');
const Photo = require('./models/Photo');

exports.put = function(req, res) {
  let filename = req.body.photo,
      photo;

  photoService.findByFilename(filename)
  .then( (photoFound) => {
    photo = photoFound;
    // TODO: null result should be handled
    return photoService.removePhotoFromAllPosts(photo._id)
  })
  .then( () => {
    return postService.deleteEmptyPosts();
  })
  .then( () => {
    return postService.addNewPost(photo);
  })
  .then( () => {
    res.send('');
  })
  .catch( (e) => {
    console.log('error', e);
    res.send('Something went wrong', 500);
  })
};
