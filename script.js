/**
 * Récupération de données depuis DBPedia dès qu'on clique sur le bouton
 * Puis affichage des données récupérées sur la page
 */
document.getElementById("target").onclick = function() {
	var uri = "http://dbpedia.org/ontology/Food";

  var value = document.getElementById("req").value;

  //La requête SPARQL à proprement parler
	var querySPARQL=""+
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
	req.onreadystatechange = myCode;   // the handler
	req.send(null);        

	function myCode() {
	   if (req.readyState == 4) {
        document.getElementById("result").innerHTML = "";
	      var doc = JSON.parse(req.responseText);

        var div = $("#result");
        $.each(doc.results.bindings,
          function (index, element) {
            div.append($('<div>',{
              "text": (element.l.value)
            }));
          });
	   }
	}
};