const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const StarInteract = require('./StarInteract.js');
const path = require('path');
//const XLMHttpRequest = require("xmlhttprequest").XLMHttpRequest;

const app = express();
const api = new StarInteract();

app.use(express.static('public'));
// app.use(express.static(path.join('public', "js")));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  api.getData()
    .then(data => res.render('index', {
      data : JSON.stringify(data),
      pass : data.pass,
      error: null
    }))
    .catch(err => console.log(err));
});

app.post('/dir', (req, res) => {
  let idligne = req.body.dropligne;
  let iddir = req.body.dropdir;

  api.getArrets(idligne, iddir)
    .then(data => res.render('index', {
      data : JSON.stringify(data),
      pass : data.pass,
      error: null
    }))
    .catch(err => console.log(err));

});

app.post('/', (req, res) => {

  let idligne = req.body.dropligne;
  let iddir = req.body.dropdir;
  let idarret = req.body.droparret;
  let precision = "Temps+r%C3%A9el";


  api.hitsCheck(idligne, iddir, idarret, precision)
    .then(passtxt => api.getData(passtxt))
    .then(data => res.render('index', {
      data : JSON.stringify(data),
      pass : data.pass,
      error: null
    }))
    .catch(err => {
      api.getData()
        .then(data => res.render('index', {
          data : JSON.stringify(data),
          pass : null,
          error: true
        }))
    })

});

app.listen(3000, '0.0.0.0', function() {
  console.log('getPass listening on port 3000!')
});
