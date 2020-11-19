/**
 * Récupère les infos et les affiches
 */
function getAlimentsPlats(filter, onResult) {

    var queryRecherche =
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
        '     FILTER (lang(?res) = "en" && regex(?res, "' + filter + '", "i")). ' +
        ' } ORDER BY (?res) ';

    queryData(queryRecherche, onResult);
}

// Analyse et affiche la réponse
function serializeData(values) {
    console.log(values);

    var resultList = document.querySelector("#listAll");

    resultList.innerHTML = ""; //<p>Liste des plats et ingredients</p>";

    for (var i = 0; i < values.length; i++) {
        var link = document.createElement("a");
        try {
            link.innerHTML = values[i].res.value;
            link.setAttribute("href", "./food.html?data=" + (values[i].value.value).substr(28));
        } catch (e) {
            link.innerHTML = values[i].res.value;
            link.setAttribute("href", "./categories.html?data=" + (values[i].x.value).substr(37));
        }
        resultList.appendChild(link);
    }
}



// initialisation de la page, recherche des aliments correspondant au filtre
getAlimentsPlats(getParameter(), serializeData);