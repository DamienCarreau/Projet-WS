/**
 * queryData
 * @param {String} querySPARQL la query SparQL  
 * @param {function(JsonObject)} onResult fonction appelée lorsque le résultat arrive 
 */
export function queryData(querySPARQL, onResult) {
    //On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
    var baseURL = "http://dbpedia.org/sparql";

    // On construit donc notre requête à partir de cette baseURL
    var queryURL = baseURL + "?" + "query=" + encodeURIComponent(querySPARQL) + "&format=json";

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