const BlogPost = require('./models/blogPost');
const PostService = require('./services/postService');

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

exports.get = function(req, res) {
  let page = parseInt(req.query.page) || DEFAULT_PAGE;
  let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

  BlogPost.find({})
    .sort({date: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('photos')
//    .populate('tags')
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
};

exports.put = function(req, res) {
  let id = req.params.postId;

  if (!id) {
    res.send('Id must be set', 400);
  }

  PostService.update(id, req.body)
    .then( () => {
      res.send({});
    })
    .catch( (e) => {
      console.log(e);
      res.send({}, 500);
    });
};

exports.putTag = function(req, res) {
  let postId = req.params.postId;

  if (!postId) {
    res.send('Id must be set in the url', 400);
  }

  if (!req.body.tag) {
    res.send('Tag must be set in the body', 400);
  }

  res.send({});

  // TODO:
  // get an id (create new if needed)
  // insert to post's tag array

/*
  PostService.update(postId, req.body)
    .then( () => {
      res.send({});
    })
    .catch( (e) => {
      console.log(e);
      res.send({}, 500);
    });
    */
};
