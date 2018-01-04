/*
TODO: values should be assigned from env file, or system environment

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

example: https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
*/

require('dotenv').load();

exports.config = {
  photosPath: process.env.PHOTOS_PATH
}