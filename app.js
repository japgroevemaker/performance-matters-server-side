/* eslint-disable semi */

var fetch = require('node-fetch')
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
  .post('/search', search)
  //.use(notFound)
  .listen(8000)



function index(req, res) {
  //res.status(404).render('not-found.ejs')
  console.log('executed at localhost:8000')
  res.render('index.ejs')
}


function search(req, res) {
  api.searchParm = req.body.zoekTerm;
  console.log(api.searchParm);
  api.request().then(function () {
    res.render('results.ejs', {results: api.data})
  })
}

// SOURCE CAS BURGGRAAF ADAM NET
const api = {
  data: null,
  apiBasisUrl: "https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=",
  apiEndUrl: "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
  searchParm: null,
  sparqlquery: null,
  sparqlqueryFun() {
    var temp = `
      PREFIX dc: <http://purl.org/dc/elements/1.1/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>

      SELECT ?cho ?title ?img ?endDate ?creator ?provenance ?description WHERE {
       ?cho dc:type ?type .
          ?cho dc:title ?title .
          ?cho dc:creator ?creator .
          ?cho dct:provenance ?provenance .
          ?cho dc:description ?description .
        ?cho foaf:depiction ?img .
        ?cho sem:hasEndTimeStamp ?endDate .

        FILTER REGEX(?title, '${this.searchParm}', 'i')
    }`;
    return temp;
  },
  request() {
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {

    _this.sparqlquery = _this.sparqlqueryFun();
    _this.sparqlquery = encodeURIComponent(_this.sparqlquery);
    const url = `${_this.apiBasisUrl}${_this.sparqlquery}${_this.apiEndUrl}`;
    fetch(url)
  	.then(function (resp) {
      return resp.json();
    }).then(function(content) {
       _this.data = content;
       resolve();
  	}) .catch(function(error) {
  		// if there is any error you will catch them here
  		console.log(error);
  	});
  });
    return promise;
  }
};
