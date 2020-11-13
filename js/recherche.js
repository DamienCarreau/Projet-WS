$('document').ready(function() {

    var data = getData();

    getAlimentsPlats(data);

    // Gestion du bouton Recherche
    $('#target').on('click', function () {
        location.search = "?data=" + document.getElementById("req").value;
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
        return "";
    }
    return res;
}

/**
 * Récupère les infos et les affiches
 */
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

    // endpoint
    var baseURL = "http://dbpedia.org/sparql";

    // Construction de la requète
    var queryURL = baseURL + "?" + "query=" + encodeURIComponent(querySPARQL) + "&format=json";

    //On crée notre requête AJAX
    var req = new XMLHttpRequest();
    req.open("GET", queryURL, true);
    req.onreadystatechange = serializeData;
    req.send(null);

    // Analyse et affiche la réponse
    function serializeData(){
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
    }
}

