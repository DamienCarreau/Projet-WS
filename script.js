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

  var uri = "http://dbpedia.org/ontology/Food";

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
  req.onreadystatechange = myCode;   // the handler
  req.send(null);        

  function myCode() {
     if (req.readyState == 4) {
        document.getElementById("result").innerHTML = "";
        var doc = JSON.parse(req.responseText);

        var div = $("#result");
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
  }
});