/**
 * queryData
 * @param {String} querySPARQL la query SparQL  
 * @param {function(JsonArray)} onResult fonction appelée lorsque le résultat arrive 
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

/**
 * Retourne le paramètre data passé en paramètre de l'url.
 * Si aucun paramètre, retourn la chaine nul : ""
 */
function getParameter(){
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
        return "";
    }
    return res;
}

// Gestion du bouton Recherche
function recherche(){
    document.location.href = "./recherche.html?data=" + document.getElementById("req").value;
}