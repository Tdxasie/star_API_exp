const request = require('request')

let idligne = "0003"
let precision = "Temps+r%C3%A9el"
let iddir = "0"
let idarret = "1112"
var apiUrl = 'data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-circulation-passages-tr&rows=2&refine.precision=${precision}&refine.idligne=${idligne}&refine.sens=${iddir}&refine.idarret=${idarret}&timezone=Europe%2FBerlin'
var username = 'pierre.garnier1618@gmail.com'
var password = 'OTyooQuijabCeg4'
var url = "http://${username}:${password}@${apiUrl}"

request(url, function (err, response, body) {
  if(err){
    let erreur = JSON.parse(err)
    console.log(err)
  } else {
    let pass = JSON.parse(body)
    console.log(pass)
  }
});
