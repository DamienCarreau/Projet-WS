var uri = 'http://dbpedia.org/resource/Fruit';


var basePrefixes = "" +
    'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
    'PREFIX dbr: <http://dbpedia.org/resource/> ' +
    'PREFIX dbp: <http://dbpedia.org/property/> ' +
    'PREFIX dbdt: <http://dbpedia.org/datatype/> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ';

function findInformation() {
    //La requête SPARQL à proprement parler

    //(GROUP_CONCAT(?personName;SEPARATOR=",") AS ?list)
    var querySPARQL1 = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?abstract ' +
        '?thumbnail ' +
        '(GROUP_CONCAT(?productorName;SEPARATOR=",") AS ?productors) ' +

        'WHERE { ' +
        '  <' + uri + '> rdfs:label ?label . ' +
        '  <' + uri + '> dbo:abstract ?abstract . ' +
        '  OPTIONAL { ' +
        '    <' + uri + '> dbo:thumbnail ?thumbnail . ' +
        '    <' + uri + '> dbo:product ?productor . ' +
        '    ?productor dbo:product ?productorName . ' +
        '  } ' +
        '  FILTER(lang(?abstract) = "en" && lang(?label) = "en")' +
        '} ' +
        'LIMIT 100';

    queryData(querySPARQL1, function(results) {
        console.log(results);
        var resPlace = document.getElementById("result_place");
        resPlace.innerText = JSON.stringify(results);
    })
}

/**
 * findReceipes Trouve 10 recettes dans lesquelles l'ingrédient est.
 * @param {int} offset indice du premier ingrédient, 0 par défaut
 */
function findReceipes(offset = 0) {
    //La requête SPARQL à proprement parler
    var querySPARQL1 = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?receipe ' +

        'WHERE { ' +
        '  ?receipe dbo:ingredient <' + uri + '> . ' +
        '  ?receipe rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT 10';

    queryData(querySPARQL1, function(results) {
        console.log(results);
        var resPlace = document.getElementById("result_place");
        resPlace.innerText = JSON.stringify(results);
    })
}

/**
 * queryData
 * @param {String} querySPARQL la query SparQL  
 * @param {function(JsonObject)} onResult fonction appelée lorsque le résultat arrive 
 */
function queryData(querySPARQL, onResult) {
    //On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
    var baseURL = "http://dbpedia.org/sparql";

    // On construit donc notre requête à partir de cette baseURL
    var queryURL = baseURL + "?" + "query=" + encodeURIComponent(querySPARQL) + "&format=json";

    console.log("query data : QUERY = \n*******\n" + querySPARQL + "\n********");

    //On crée notre requête AJAX
    var req = new XMLHttpRequest();
    req.open("GET", queryURL, true);
    req.onreadystatechange = myCode; // the handler
    req.send(null);

    function myCode() {
        if (req.readyState == 4) {
            // Parse the result into JSON
            var val = JSON.parse(req.responseText);
            // Return only the results' array
            onResult(val.results.bindings);
        }
    }
}

console.log("end of file aliment");