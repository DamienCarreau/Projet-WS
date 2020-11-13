$('document').ready(function () {

  var data = getData();
  console.log(data);
  
  document.getElementById("txt").innerHTML = "Catégorie : "+data;

  getCategories(data,"");

  $('#target').on('click', function () {
    document.location.href = "./recherche.html?data=" + document.getElementById("req").value;
  });
});

/**
 * Retourne le paramètre data passé en paramètre de la methode.
 */
function getData(){
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
  return res;
}

/**
 * Récupère les infos et les affiches
 */
function getCategories(res,value){

  var querySPARQL =
    'SELECT ?isValueOf '+
    'WHERE { '+
    '    { ?isValueOf skos:broader <http://dbpedia.org/resource/Category:'+res+'> ';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(substr(str(?isValueOf),38),"'+document.getElementById("req").value+'","i") ';

    querySPARQL += '}UNION '+
    '    { ?isValueOf <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:'+res+'> ';
    if(value.length !== 0)
      querySPARQL += 'FILTER regex(?isValueOf,"'+document.getElementById("req").value+'","i") ';

    querySPARQL += '}} ORDER BY (?isValueOf)';
  
    

  // endpoint
  var baseURL="http://dbpedia.org/sparql";

  // construction de la requete
  var queryURL = baseURL + "?" + "query="+ encodeURIComponent(querySPARQL) + "&format=json";
  
  //On crée notre requête AJAX
  var req = new XMLHttpRequest();
  req.open("GET", queryURL, true);
  req.onreadystatechange = serializeData;
  req.send(null);

  /**
   * Gère l'affichage des données
   */
  function serializeData(){
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
  }
}