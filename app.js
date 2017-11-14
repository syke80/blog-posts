const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const Promise = require('mpromise');

const PHOTOS_PATH = '../fileserver/original/';
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
//mongoose.connect('mongodb://localhost/blog');

let dbURL = 'mongodb://localhost/blog';
let dbAuth = {
    useMongoClient: true,
    user: 'syke',
    pass: 'mongoJELSZO123'
}

mongoose.connect(dbURL, dbAuth);

let db = mongoose.connection;

db.once('open', () => {
    console.log('Db connected');
});

db.on('error', error => {
    console.log(error);
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

let BlogPost = require('./models/BlogPost');
let Photo = require('./models/Photo');


app.get('/posts', (req, res) => {
  let page = parseInt(req.param('page')) || DEFAULT_PAGE;
  let limit = parseInt(req.param('limit')) || DEFAULT_LIMIT;

  BlogPost.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('photos')
    .exec((error, blogPosts) => {
      let response = {
        items: blogPosts,
        pagination: {
          page: page,
          limit: limit
        }
      }
      res.send(response);
    });
});

app.get('/photos', (req, res) => {
  let page = parseInt(req.param('page')) || DEFAULT_PAGE;
  let limit = parseInt(req.param('limit')) || DEFAULT_LIMIT;

  Photo.find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .exec((error, photos) => {
      let response = {
        items: photos,
        pagination: {
          page: page,
          limit: limit
        }
      }
      res.send(response);
    });
});

function checkIfPostExist(postId) {
  var promise = new Promise;
  BlogPost.findById(postId, (err, post) => {
    if (err) {
      promise.reject();
      return;
    }

    promise.fulfill();
  });
  return promise;
}

app.put('/movephoto', (req, res) => {
  let filename = req.body.photo;
  let postId = req.body.postId;

  if (!filename || !postId) {
    res.status(400).send('photo and postId parameters must be set');

    return;

  }

  checkIfPostExist(postId)
    .catch( () => {
        res.status(404).send('');
    })
    .then( () => {
      Photo.findOne({'filename': filename}, function(err, photo) {
        if (err) {
          console.log(err);

          res.status(404).send('');

          return;
        }

        // TODO: null result should be handled
        removePhotoFromAllPosts(photo._id, postId).then( () => {
          addPhotoToPost(photo._id, postId).then( () => {
            res.send('');
          });
        });
      });
  });
});

app.put('/removephoto', (req, res) => {
  let filename = req.body.photo;

  Photo.findOne({'filename': filename}, function(err, photo) {
    if (err) {
      console.log(err);

      res.status(404).send('');

      return;
    }

    // TODO: null result should be handled
    removePhotoFromAllPosts(photo._id, postId).then( () => {
      addNewPost(photo);
    });

    res.send('');
  });
});

const glob = require('glob');
const fs = require('fs');

function addNewPost(photo) {
  let newPost = new BlogPost({
    title: '',
    date: photo.date,
    photos: [photo]
  });

  newPost.save();
}

function addNewPhoto(filename) {
  fs.stat(PHOTOS_PATH + filename, (err, stat) => {
    let newPhoto = new Photo({
      filename: filename,
      date: stat.ctime
    });
    newPhoto.save((err) => {
      if (err) {
        console.log('Error saving photo', err);
        return;
      }

      addNewPost(newPhoto);
    } );
  })
}

function addPhotoToPost(photoId, postId) {
  var promise = new Promise;

  BlogPost.findById(postId, function(err, post) {
    if (err) {
      console.log(err);
      promise.reject();
      return;
    }
    
    // TODO: can we use set() (ES6) instead of array
    if (post.photos.indexOf(photoId) === -1) {
      post.photos.push(photoId);
    }

    console.log('saving post@add (post, photos)', post._id, post.photos);
    post.save( () => {
      promise.fulfill();
    });
  });

  return promise;
}

function removePhotoFromAllPosts(photoId, postIdToSkip) {
  var promise = new Promise;

  BlogPost.find({'photos': photoId}, function(err, posts) {
    if (err) {
      console.log(err);
      promise.reject();
      return;
    }

    posts.forEach( (post) => {
      if (post._id === mongoose.Types.ObjectId(postIdToSkip)) {
        return;
      }

      var index = post.photos.indexOf(mongoose.Types.ObjectId(photoId));
      if (index !== -1) {
        post.photos.splice(index, 1);
      }

      if (post.photos.length === 0) {
        console.log('removing empty post@removeFromAll (post, photos, photo)', post._id, post.photos, photoId);
        post.remove();
      }
      else {
        console.log('saving post@removeFromAll (post, photos)', post._id, post.photos);
        post.save();
      }
    });

    promise.fulfill();
  });
  
  return promise;
}

function synchronizeFiles() {
  fs.readdir(PHOTOS_PATH, function(err, items) {
    items = items.filter(item => {
      return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(item);
    });

    items.forEach(filename => {
      addNewPhoto(filename);
    })
  });
}

app.get('/reset/', (req, res) => {
  Photo.remove().exec();
  BlogPost.remove().exec();
  res.send('ok');
});

app.get('/sync/', (req, res) => {
  synchronizeFiles();
  res.send('ok');
});

app.listen(3001, function() {
    console.log('App listening on 3001');
});
