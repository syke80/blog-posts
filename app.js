const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const postsController = require('./postsController');
const photosController = require('./photosController');
const syncController = require('./syncController');
const resetController = require('./resetController');
const moveoutphotoController = require('./moveoutphotoController');
const movephotoController = require('./movephotoController');


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




// TODO: should be put
app.get('/sync/', syncController.get);
app.get('/reset/', resetController.get);
app.get('/photos', photosController.get);
app.put('/posts/:postId', postsController.put);
app.put('/posts/:postId/tag', postsController.putTag);
app.get('/posts', postsController.get);
app.put('/movephoto', movephotoController.put);
app.put('/moveoutphoto', moveoutphotoController.put);


app.listen(3001, function() {
    console.log('App listening on 3001');
});
