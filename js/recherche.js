$('document').ready(function () {

  getAlimentsPlats("");

  $('#target').on('click', function () {
      getAlimentsPlats(document.getElementById("req").value);
  });
});

function getAlimentsPlats(value){

  //La requête SPARQL à proprement parler
  var querySPARQL=
  'PREFIX dbo: <http://dbpedia.org/ontology/> '+
  'SELECT DISTINCT ?res ?value ?x '+
  'WHERE { '+
  '     { '+
  '          { '+ 
  '            ?value dbo:ingredient ?ingredient. '+
  '            ?value rdfs:label ?res. '+
  '            ?ingredient rdfs:label ?toCheck. '+
  '          } UNION { '+
  '            ?plat dbo:ingredient ?value. '+
  '            ?value rdfs:label ?res. '+
  '            BIND (?res AS ?toCheck) '+
  '          } '+
  '          FILTER (lang(?res) = "en"). '+
  '          FILTER (regex(?toCheck, "Apple", "i")). '+
  '     }UNION{ '+
  '          { '+
  '             ?x skos:broader <http://dbpedia.org/resource/Category:Foods>. '+
  '          } UNION { '+
  '             ?y  skos:broader <http://dbpedia.org/resource/Category:Foods>. '+
  '             ?x  skos:broader ?y. '+
  '          } UNION { '+
  '             ?a  skos:broader <http://dbpedia.org/resource/Category:Foods>. '+
  '             ?b  skos:broader ?a. '+
  '             ?x  skos:broader ?b. '+
  '          } '+
  '          ?x rdfs:label ?res. '+
  '          FILTER (lang(?res) = "en") '+
  '     } ';
  if(value.length !== 0)
    querySPARQL += 'FILTER regex(?res,"'+document.getElementById("req").value+'","i")\n';
  querySPARQL +=
  '}ORDER BY (?res) ';

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
          try{
            div.append($('<a>',{
              "text": element.res.value+" - "+(element.value.value).substr(28),
              "href": "./food.html?data="+(element.value.value).substr(28)
            }));
          }catch(e){}
          try{
            div.append($('<a>',{
              "text": element.res.value+" - "+(element.x.value).substr(37),
              "href": "./categories.html?data="+(element.x.value).substr(37)
            }));
          }catch(e){}
        });
    }
  };   // the handler
  req.send(null);
}