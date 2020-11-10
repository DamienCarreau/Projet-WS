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

  document.getElementById("txt").innerHTML = "Catégorie : "+res;

  getCategories(res,"");

  $('#target').on('click', function () {
      getCategories(res,document.getElementById("req").value)
  });
});

function getCategories(res,value){
    //La requête SPARQL à proprement parler
  var querySPARQL=""+
    'SELECT ?isValueOf ?trad1 ?trad2\n'+
    'WHERE {\n'+
    '    { ?isValueOf skos:broader <http://dbpedia.org/resource/Category:'+res+'>.\n'+
    '    ?isValueOf rdfs:label ?trad1.\n'+
    '    FILTER (lang(?trad1) = "en").\n';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(substr(str(?isValueOf),38),"'+document.getElementById("req").value+'","i")\n';
    querySPARQL += '}UNION\n'+
    '    { ?isValueOf <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:'+res+'>.\n'+
    '    ?isValueOf rdfs:label ?trad2.\n'+
    '    FILTER (lang(?trad2) = "en").\n';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(?isValueOf,"'+document.getElementById("req").value+'","i")\n';
    querySPARQL += '}}\nORDER BY (?isValueOf)';
    

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://dbpedia.org/sparql";

  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";

  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = function(){
    if (req.readyState == 4) {
      document.getElementById("categories").innerHTML = "<p>Catégories liées</p>";
      document.getElementById("ingredientsLies").innerHTML = "<p>Ingredients et plats liés à cette catégorie</p>";

      var doc = JSON.parse(req.responseText);

      var categories = $("#categories");
      var lies = $('#ingredientsLies');
      $.each(doc.results.bindings,
        function (index, element) {
        	try{
        		var d = $('<div>');
		        d.append($('<a>',{
		          "text": element.trad1.value,
		          "href": "?request="+(element.isValueOf.value).substr(37)
		        }));
		        categories.append(d);
        	}catch(e){}
        	try{
        		var d = $('<div>');
		        lies.append($('<div>',{
	              "text": element.trad2.value
	            }));
        	}catch(e){} 
        });
   }
  };   // the handler
  req.send(null);
}