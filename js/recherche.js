$('document').ready(function () {

  getAlimentsPlats("");

  $('#target').on('click', function () {
      getAlimentsPlats(document.getElementById("req").value);
  });
});

function getAlimentsPlats(value){

  //La requête SPARQL à proprement parler
  var querySPARQL=
  'PREFIX dbo: <http://dbpedia.org/ontology/>\n'+
  'SELECT DISTINCT ?res ?plat\n'+
  'WHERE {{\n'+
  '?plat dbo:ingredient ?ingredient.\n'+
  '?ingredient rdfs:label ?res.\n'+
  'FILTER (lang(?res) = "en").\n'+
  '} UNION {\n'+
  '?plat dbo:ingredient ?ingredient.\n'+
  '?plat rdfs:label ?res.\n'+
  'FILTER (lang(?res) = "en").\n'+
  '}\n';
  if(value.length !== 0)
    querySPARQL += 'FILTER regex(?res,"'+document.getElementById("req").value+'","i")\n';
  querySPARQL += '}\nORDER BY (?res)';

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://dbpedia.org/sparql";

  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";

  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = function(){
    if (req.readyState == 4) {
      document.getElementById("listAll").innerHTML = "<p>Liste des plats et ingredients</p>";
      var doc = JSON.parse(req.responseText);

      var div = $("#listAll");
      $.each(doc.results.bindings,
        function (index, element) {
          div.append($('<a>',{
            "text": element.res.value,
            "href": "./food.html?data="+(element.plat.value).substr(28)
          }));
        });
    }
  };   // the handler
  req.send(null);
}
