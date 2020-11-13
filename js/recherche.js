$('document').ready(function() {

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
        res = "";
    }

    getAlimentsPlats(res);

    $('#target').on('click', function () {
    location.search = "?data=" + document.getElementById("req").value;
    });
});

function getAlimentsPlats(value) {

    //La requête SPARQL à proprement parler
    var querySPARQL =
        'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
        'SELECT DISTINCT ?res ?value ?x ' +
        'WHERE { ' +
        '     { ' +
        '          { ' +
        '            ?value dbo:ingredient ?ingredient. ' +
        '          } UNION { ' +
        '            ?plat dbo:ingredient ?value. ' +
        '          } ' +
        '          ?value rdfs:label ?res. ' +
        '     }UNION{ ' +
        '          { ' +
        '             ?x skos:broader <http://dbpedia.org/resource/Category:Foods>. ' +
        '          } UNION { ' +
        '             ?y  skos:broader <http://dbpedia.org/resource/Category:Foods>. ' +
        '             ?x  skos:broader ?y. ' +
        '          } UNION { ' +
        '             ?a  skos:broader <http://dbpedia.org/resource/Category:Foods>. ' +
        '             ?b  skos:broader ?a. ' +
        '             ?x  skos:broader ?b. ' +
        '          } ' +
        '          ?x rdfs:label ?res. ' +
        '     } ' +
        '     FILTER (lang(?res) = "en" && regex(?res, "' + value + '", "i")). ' +
        ' } ORDER BY (?res) ';

    // On prépare l'URL racine (aussi appelé ENDPOINT) pour interroger DBPedia (ici en français)
    var baseURL = "http://dbpedia.org/sparql";

    // On construit donc notre requête à partir de cette baseURL
    var queryURL = baseURL + "?" + "query=" + encodeURIComponent(querySPARQL) + "&format=json";

    //On crée notre requête AJAX
    var req = new XMLHttpRequest();
    req.open("GET", queryURL, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            document.getElementById("listAll").innerHTML = "<p>Liste des plats et ingredients</p>";
            var doc = JSON.parse(req.responseText);

            var div = $("#listAll");
            $.each(doc.results.bindings,
                function(index, element) {
                    try {
                        div.append($('<a>', {
                            "text": element.res.value,
                            "href": "./food.html?data=" + (element.value.value).substr(28)
                        }));
                    } catch (e) {}
                    try {
                        div.append($('<a>', {
                            "text": element.res.value,
                            "href": "./categories.html?data=" + (element.x.value).substr(37)
                        }));
                    } catch (e) {}
                });
        }
    }; // the handler
    req.send(null);
}