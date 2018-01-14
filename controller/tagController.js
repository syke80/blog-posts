const Tag = require('./../models/tag');
const TagService = require('./../services/tagService');

exports.get = function(req, res) {
  Tag.find({})
    .sort({name: 1})
    .exec((error, tags) => {
      res.send(tags);
    });
};

exports.post = function(req, res) {
  let name = req.body.name;

  if (!name) {
    res.send('Name must be set', 400);
  }

  TagService.add(name)
    .then( savedTag => {
      res.send(savedTag);
    })
    .catch( (e) => {
      console.log(e);
      res.send({}, 500);
    });
};
