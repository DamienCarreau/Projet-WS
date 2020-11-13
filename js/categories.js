$('document').ready(function () {

  var search;
  var res = null,
  tmp = [];
  location.search
          .substr(1)
          .split("&")
          .forEach(function (item) {
              tmp = item.split("=");
              if (tmp[0] === "data")
                  res = decodeURIComponent(tmp[1]);
          });      
  if (res === null) {
      alert("La recherche n'a pas été spécifié");
      return;
  }
  

  document.getElementById("txt").innerHTML = "Catégorie : "+res;

  if (res) getCategories(res,"");

  $('#target').on('click', function () {
    document.location.href = "./recherche.html?data=" + document.getElementById("req").value;
  });
});

function getCategories(res,value){
  console.log(res)
    //La requête SPARQL à proprement parler
  var querySPARQL=""+
    'SELECT ?isValueOf\n'+
    'WHERE {\n'+
    '    { ?isValueOf skos:broader <http://dbpedia.org/resource/Category:'+res+'>\n';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(substr(str(?isValueOf),38),"'+document.getElementById("req").value+'","i")\n';
    querySPARQL += '}UNION\n'+
    '    { ?isValueOf <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:'+res+'>\n';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(?isValueOf,"'+document.getElementById("req").value+'","i")\n';
    querySPARQL += '}}\nORDER BY (?isValueOf)';
  
    

  // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
  var baseURL="http://dbpedia.org/sparql";

  // On construit donc notre requête à partir de cette baseURL
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";
  console.log(queryURL)
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

      document.getElementById("loader").style.display = "none";

      $.each(doc.results.bindings,
        function (index, element) {
          if((element.isValueOf.value).search("Category") !== -1){
            var d = $('<div>');
            d.append($('<a>',{
              "text": (element.isValueOf.value).substr(37),
              "href": "?data="+(element.isValueOf.value).substr(37)
            }));
            categories.append(d);
          }else{
            lies.append($('<a>',{
              "text": (element.isValueOf.value).substr(28),
              "href": "./food.html?data="+(element.isValueOf.value).substr(28)
            }));
          }
        });
   }
  };   // the handler
  req.send(null);
}