/**
 * Récupère les infos et les affiches
 */
function getCategories(res, onResult) {

    var queryCategories =
        'SELECT ?isValueOf ' +
        'WHERE { ' +
        '    { ' +
        '       ?isValueOf skos:broader <http://dbpedia.org/resource/Category:' + res + '> ' +
        '    } UNION {' +
        '       ?isValueOf <http://purl.org/dc/terms/subject> <http://dbpedia.org/resource/Category:' + res + '> ' +
        '    } ' +
        '} ORDER BY (?isValueOf)';

    queryData(queryCategories, onResult);
}

/**
 * Gère l'affichage des données
 */
function serializeData(values) {

    console.log(values);

    var categorieLiees = document.querySelector("#categories");
    var ingredientsLies = document.querySelector("#ingredientsLies");

    categorieLiees.innerHTML = "<p>Linked categories</p>";
    ingredientsLies.innerHTML = "<p>Linked products</p>";

    document.getElementById("loader").style.display = "none";

    for (var i = 0; i < values.length; i++) {
        var link = document.createElement("a");
        if ((values[i].isValueOf.value).search("Category") !== -1) {
            link.innerHTML = (values[i].isValueOf.value).substr(37);
            link.setAttribute("href", "?data=" + (values[i].isValueOf.value).substr(37));
            categorieLiees.appendChild(link);
        } else {
            link.innerHTML = (values[i].isValueOf.value).substr(28);
            link.setAttribute("href", "./food.html?data=" + (values[i].isValueOf.value).substr(28));
            ingredientsLies.appendChild(link);
        }
    }
}

// initialisation de la page, recherche des catégories correspondant au filtre
getCategories(getParameter(), serializeData);