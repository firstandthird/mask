module.exports = function(grunt) {

  require('fatjs')(grunt, {
    name: 'mask',
    //filename: '',
    //fullFilename: ''
    bowerExclude: [
      'jquery'
    ]
  });

};
