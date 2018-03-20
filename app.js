/* eslint-disable semi */

var express = require('express')
var find = require('array-find')
var slug = require('slug')
var bodyParser = require('body-parser')
var multer = require('multer')
var fs = require('fs');

express()
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', index)
  //.use(notFound)
  .listen(8000)



function index(req, res) {
  //res.status(404).render('not-found.ejs')
  res.render('index.ejs')
}
