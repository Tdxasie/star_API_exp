const fetch = require("node-fetch");

module.exports = class StarInteract {

  constructor() {
    this.username = 'pierre.garnier1618@gmail.com'
    this.password = 'OTyooQuijabCeg4'
  }

  async getData(passtxt) {
    let apiUrlLignes = 'data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-topologie-lignes-td&rows=-1&sort=id&exclude.nomfamillecommerciale=Spéciale';
    let urlLignes = 'http://' + this.username + ':' + this.password + '@' + apiUrlLignes;

    let response = await fetch(urlLignes);
    let json = await response.json();

    let data = {};
    data.lignes = [];

    for (let i = 0; i < json.records.length; i++) {
      let ligne = {};
      ligne.id = json.records[i].fields.id;
      ligne.nomcourt = json.records[i].fields.nomcourt;
      //nom des directions
      ligne["0"] = json.records[i].fields.nomlong.split(/\s<>\s|\s->\s/).slice(-1)[0].split(/\(|\)/).slice(1)[0];
      ligne["1"] = json.records[i].fields.nomlong.split(/\s<>\s|\s->\s/).slice(0)[0].split(/\(|\)/).slice(1)[0]

      data.lignes.push(ligne);
    };

    //pour le handling du passtxt
    if (passtxt !== undefined){
      data.pass = passtxt;
    } else {
      data.pass = null
    }

    return data;

  }


  async getArrets(idligne, iddir) {
    let apiArrets = 'data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-topologie-dessertes-td&rows=-1&sort=ordre&refine.idligne=' + idligne;
    let urlArrets = 'http://' + this.username + ':' + this.password + '@' + apiArrets;

    let response = await fetch(urlArrets);
    let json = await response.json();

    let stops = {};
    stops["0"] = [];
    stops["1"] = [];

    for (let i = 0; i < json.records.length; i++) {
      let arret = {};
      if (json.records[i].fields.idparcours.split("-")[1] == "A") {
        arret.nom = json.records[i].fields.nomarret;
        arret.id = json.records[i].fields.idarret;
        stops["0"].push(arret);
      } else if (json.records[i].fields.idparcours.split("-")[1] == "B") {
        arret.nom = json.records[i].fields.nomarret;
        arret.id = json.records[i].fields.idarret;
        stops["1"].push(arret);
      }
    };

    let data = await this.getData();

    data.arrets = stops;

    data.last = {
      idligne : idligne,
      iddir : iddir
    }

    return data;

  }

  async getPasses(idligne, iddir, idarret, precision) {

    let apiUrl = 'data.explore.star.fr/api/records/1.0/search/?dataset=tco-bus-circulation-passages-tr&rows=20&sort=-arrivee&refine.precision=' + precision + '&refine.idligne=' + idligne + '&refine.sens=' + iddir + '&refine.idarret=' + idarret + '&timezone=Europe%2FBerlin';
    let url = 'http://' + this.username + ':' + this.password + '@' + apiUrl;

    let response = await fetch(url);
    let json = await response.json();
    // let passtxt = 'Arrivée du C3 prévue à ' + json.records[0].fields.arrivee + 'à l\'arret Vitré Danton, direction Henri Fréville';
    // return passtxt;
    return json;
  }

  async hitsCheck(idligne, iddir, idarret, precision) {
    let json = await this.getPasses(idligne, iddir, idarret, precision);
    if (json.nhits == 0) {
      let json = await this.getPasses(idligne, iddir, idarret, "Applicable");
      console.log('Affichage de la valeur théorique');
      return (pass => {if (pass === undefined) {throw "Données non disponibles"} else {return pass}})(this.passToHour(json));
    } else {
      console.log('Affichage de la valeur temps réel');
      return (pass => {if (pass === undefined) {throw "Données non disponibles"} else {return pass}})(this.passToHour(json));
    }
  }

  passToHour(json) {
    let passTime = /\d+:\d+:\d+/.exec(json.records[0].fields.arrivee);
    return passTime[0];
  }


}



//love
