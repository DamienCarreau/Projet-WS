$('document').ready(function () {
  var search;
  var res = null,
  tmp = [];
  location.search
          .substr(1)
          .split("&")
          .forEach(function (item) {
              tmp = item.split("=");
              if (tmp[0] === "request")
                  res = decodeURIComponent(tmp[1]);
          });
  if (res === null) {
      alert("La recherche n'a pas été spécifié");
      return;
  }

  getCategories(res);
  getAlimentsPlats("");

  $('#target').on('click', function () {
      getAlimentsPlats(document.getElementById("req").value);
  });
  // document.getElementById("target").onclick = alert("ok");//getAlimentsPlats(document.getElementById("req").value);
});

function getCategories(res){
    //La requête SPARQL à proprement parler
  var querySPARQL=""+
    'SELECT ?property ?isValueOf\n'+
    'WHERE {\n'+
    '    { ?isValueOf ?property <http://dbpedia.org/resource/Category:'+res+'> }\n'+
    '}';

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://dbpedia.org/sparql";

  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";

  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = function(){
    if (req.readyState == 4) {
      document.getElementById("categories").innerHTML = "";
      var doc = JSON.parse(req.responseText);

      var div = $("#categories");
      $.each(doc.results.bindings,
        function (index, element) {
          if((element.property.value).search("broader") !== -1){
            var d = $('<div>');
            d.append($('<a>',{
              "text": (element.isValueOf.value).substr(37),
              "href": "?request="+(element.isValueOf.value).substr(37)
            }));
            div.append(d);
          }
        });
   }
  };   // the handler
  req.send(null);
}

function getAlimentsPlats(value){

  //La requête SPARQL à proprement parler
  var querySPARQL=
    'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> \n'+
    'SELECT ?l WHERE {\n'+
    '    ?c a dbpedia-owl:Food.\n'+
    '    ?c rdfs:label ?l.\n'+
    'FILTER (lang(?l) = "fr"';
  if(value.length !== 0)
    querySPARQL += '&& regex(?l,"'+document.getElementById("req").value+'","i")';
  querySPARQL += ')}';

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://dbpedia.org/sparql";

  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";

  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = function(){
    if (req.readyState == 4) {
      document.getElementById("alimentsPlats").innerHTML = "";
      var doc = JSON.parse(req.responseText);

      var div = $("#alimentsPlats");
      $.each(doc.results.bindings,
        function (index, element) {
          div.append($('<div>',{
            "text": (element.l.value)
          }));
        });
    }
  };   // the handler
  req.send(null);
}