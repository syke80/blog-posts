const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const Photo = require('./models/photo');

exports.put = function(req, res) {
  let data = req.body;

  if (req.params.id) {
    res.send('Id must be set', 500);
  }

  PhotoService.update(req.params.id, data)
    .then( () => {
      res.send('');
    })
    .catch( (e) => {
      console.log(e);
      res.send('', 500);
    });
};

exports.get = function(req, res) {
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
};
