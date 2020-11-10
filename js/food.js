var basePrefixes = "" +
    'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
    'PREFIX dbr: <http://dbpedia.org/resource/> ' +
    'PREFIX dbp: <http://dbpedia.org/property/> ' +
    'PREFIX dbdt: <http://dbpedia.org/datatype/> ' +
    'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
    'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
    'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ';

/*
STRUCTURE DU RESULTAT : 
generalInformations 
    {
        + label
        + abstract
        ? alias 
        ? thumbnail
        + descendingTypes [
            + label
            + link
        ]
    }
composition 
    {
        ? betacaroteneUg
        ? calciumMg
        ? calories
        ? carbs
        ? fat
        ? fiber
        ? ironMg
        ? kj
        ? magnesiumMg
        ? phosphorusMg
        ? protein
        ? sodiumMg
        ? sugars
        ? vitaUg
        ? vitb6Mg
        ? vitcMg
        ? viteMg
        ? vitkUg
        ? water
        ? zincMg
    }
origin 
    {
        ? region (Jamais vue)
        + countries [
            + label
            ? link
        }
        + productors [
            + label
            + link
        ]
    }
usage 
    {
        ? servingSize
        ? servingTemperature
        + receipes [
            + label
            + link
        ]
        + ingredients [
            + label
            + link
        ]
    }
*/

/**
 * findFoodInformations
 * Retourne l'ensemble des informations sur le produit (en tant que nourriture)
 * @param {String} uri URI du produit en question 
 * @param {function(JsonObject)} onResult fonction appelée lorsque le résultat est trouvé 
 */
function findFoodInformations(uri, onResult) {
    var count = 0;
    var totalCount = 4;
    var finalResult = {};

    findGeneralInformations(uri, function(result) {
        count += 1;
        finalResult.generalInformations = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findComposition(uri, function(result) {
        count += 1;
        finalResult.composition = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findOrigin(uri, function(result) {
        count += 1;
        finalResult.origin = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });


    findUsage(uri, function(result) {
        count += 1;
        finalResult.usage = result;
        if (count == totalCount) {
            onResult(finalResult);
        }
    });
}

/**
 * findGeneralInformations
 * Trouve les informations générales sur le produits
 *  {
 *      + label
 *      + abstract
 *      ? alias 
 *      ? thumbnail
 *      + descendingTypes [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé à la fin de la requete.
 */
function findGeneralInformations(uri, onResult) {
    var queryBasics = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?alias ' +
        '?abstract ' +
        '?thumbnail ' +
        'WHERE { ' +
        '  <' + uri + '> rdfs:label ?label . ' +
        '  <' + uri + '> dbo:abstract ?abstract . ' +
        '  OPTIONAL { ' +
        '    <' + uri + '> dbo:thumbnail ?thumbnail . ' +
        '  } ' +
        '  OPTIONAL { ' +
        '    <' + uri + '> dbo:alias ?alias . ' +
        '    FILTER(lang(?alias) = "en") ' +
        '  } ' +
        '  FILTER(lang(?abstract) = "en" && lang(?label) = "en")' +
        '} ' +
        'LIMIT 1';

    var queryTypeOf = basePrefixes +
        'SELECT ' +
        '?label ' +
        '?link ' +
        'WHERE { ' +
        '  ?link dbo:type <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'LIMIT 20';

    var finalResult = null;
    queryData(queryBasics, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        finalResult = result[0];
        if (finalResult == undefined) {
            finalResult = {};
        }
        queryData(queryTypeOf, function(result) {
            finalResult.descendingTypes = result;
            onResult(finalResult);
        });
    });
}

/**
 * findComposition
 * Trouve les informations sur la composition / les valeurs nutritives
 * {
 *      ? betacaroteneUg
 *      ? ... (voir sur docs)
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé à la fin de la requete.
 */
function findComposition(uri, onResult) {
    var queryCompposition = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  OPTIONAL { <' + uri + '> dbp:betacaroteneUg ?betacaroteneUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:calciumMg ?calciumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:calories ?calories . }' +
        '  OPTIONAL { <' + uri + '> dbp:carbs ?carbs . }' +
        '  OPTIONAL { <' + uri + '> dbp:fat ?fat . }' +
        '  OPTIONAL { <' + uri + '> dbp:fiber ?fiber . }' +
        '  OPTIONAL { <' + uri + '> dbp:ironMg ?ironMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:kj ?kj . }' +
        '  OPTIONAL { <' + uri + '> dbp:magnesiumMg ?magnesiumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:phosphorusMg ?phosphorusMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:sodiumMg ?sodiumMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:sugars ?sugars . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitaUg ?vitaUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitb6Mg ?vitb6Mg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitcMg ?vitcMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:viteMg ?viteMg . }' +
        '  OPTIONAL { <' + uri + '> dbp:vitkUg ?vitkUg . }' +
        '  OPTIONAL { <' + uri + '> dbp:water ?water . }' +
        '  OPTIONAL { <' + uri + '> dbp:zincMg ?zincMg . }' +
        '} ' +
        'LIMIT 1';

    queryData(queryCompposition, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        onResult(result[0]);
    })
}

/**
 * findOrigin
 * Trouve les informations sur l'origine du prodtui
 * {
 *      ? region (Jamais vue)
 *      + countries [
 *          + label
 *          ? link
 *      }
 *      + productors [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelée à l'arrivée du resultat 
 */
function findOrigin(uri, onResult) {

    var queryRegion = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  <' + uri + '> dbo:region ?region . ' +
        '} ' +
        'LIMIT 1';


    var queryCountries = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        ' { ' +
        '  <' + uri + '> dbo:country ?link . ' +
        '  ?link rdfs:label ?label ' +
        '  FILTER(lang(?label) = "en") ' +
        ' } UNION { ' +
        '  <' + uri + '> dbp:country ?label ' +
        ' } ' +
        '} ' +
        'LIMIT 50';


    var queryProductors = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  ?link dbo:product <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en") ' +
        '} ' +
        'LIMIT 50';

    var finalResult = null;
    queryData(queryRegion, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        finalResult = result[0];
        if (finalResult == undefined) {
            finalResult = {};
        }
        queryData(queryCountries, function(result) {
            finalResult.countries = result;

            queryData(queryProductors, function(result) {
                finalResult.productors = result;
                onResult(finalResult);
            });
        });
    });
}

/**
 * findUsage
 * Trouve les "usages" du produit
 * {
 *      ? servingSize
 *      ? servingTemperature
 *      + receipes [
 *          + label
 *          + link
 *      ]
 *      + ingredients [
 *          + label
 *          + link
 *      ]
 * }
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelée à l'arrivée du resultat 
 */
function findUsage(uri, onResult) {
    var queryServingData = basePrefixes +
        'SELECT * ' +
        'WHERE { ' +
        '  OPTIONAL { <' + uri + '> dbo:servingSize ?servingSize . } ' +
        '  OPTIONAL { <' + uri + '> dbo:servingTemperature ?servingTemperature . } ' +
        '} ' +
        'LIMIT 1';

    var finalResult = null;
    queryData(queryServingData, function(result) {
        // on Result return the array of results or we only want 
        // the first row.
        finalResult = result[0];
        if (finalResult == undefined) {
            finalResult = {};
        }
        findReceipes(uri, function(result) {
            finalResult.receipes = result;
            findIngredients(uri, function(result) {
                finalResult.ingredients = result;
                onResult(finalResult);
            });
        });
    });
}

/**
 * findReceipes
 * Trouve les recettes qui utilisent le produit
 * [
 *      + label
 *      + link
 * ]
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé au résultat 
 * @param {Integer} offset (Optionnel) Indice de la première recette à trouver (0 par défaut)
 * @param {Integer} limit (Optionnel) Nombre maximal de recettes à retourner (20 par défaut)
 */
function findReceipes(uri, onResult, offset = 0, limit = 20) {
    var queryReceipes = basePrefixes +
        'SELECT ' +
        ' * ' +

        'WHERE { ' +
        '  ?link dbo:ingredient <' + uri + '> . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT ' + limit;

    queryData(queryReceipes, onResult);

}

/**
 * findIngredients
 * Trouve les ingrédients du produit
 * [
 *      + label
 *      + link
 * ]
 * @param {String} uri URI de l'objet en question
 * @param {function(JsonObject)} onResult fonction appelé au résultat 
 * @param {Integer} offset (Optionnel) Indice du premier ingrédient à trouver (0 par défaut)
 * @param {Integer} limit (Optionnel) Nombre maximal d'ingrédients à retourner (20 par défaut)
 */
function findIngredients(uri, onResult, offset = 0, limit = 20) {
    var queryIngredients = basePrefixes +
        'SELECT ' +
        ' * ' +

        'WHERE { ' +
        '  <' + uri + '> dbo:ingredient  ?link . ' +
        '  ?link rdfs:label ?label . ' +
        '  FILTER(lang(?label) = "en")' +
        '} ' +
        'OFFSET ' + offset + ' ' +
        'LIMIT ' + limit;

    queryData(queryIngredients, onResult);
}


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

function goToObject(object) {
    document.location.href = "./index.html?data=" + object;
}

function extractResourceName(link) {
    return link.substring(link.lastIndexOf("/") + 1);
}

function populatePage(values) {
    console.log(values);
    // Name 
    document.title = values.generalInformations.label.value;

    var titleStr = values.generalInformations.label.value;
    if (values.generalInformations.alias != undefined) {
        titleStr += " (or " + values.generalInformations.alias.value + ")";
    }
    document.querySelector("h1").innerText = titleStr;

    // Image (thumbnail)
    document.querySelector("#thumbnail").src = values.generalInformations.thumbnail.value;

    // Description (abstract)
    document.querySelector("#description").innerText = values.generalInformations.abstract.value;

    // List of types
    typeList = document.querySelector("#types_list");
    var empty = true;
    for (var i = 0; i < values.generalInformations.descendingTypes.length; i++) {
        var type = values.generalInformations.descendingTypes[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(type.link.value);
        link.textContent = type.label.value;
        el.appendChild(link);
        typeList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#types_title").innerText = "";
    }

    // Composition
    compoList = document.querySelector("#composition");
    var empty = true;
    for (var compoType in values.composition) {
        if (compoType != undefined) {
            var el = document.createElement("li");
            console.log(compoType);
            var comp = compoType + ": " + values.composition[compoType].value;
            el.innerText = comp;
            compoList.appendChild(el);
            empty = false;
        }
    }
    if (empty) {
        document.querySelector("#composition_title").innerText = "";
    }

    // Origin 
    // Region
    var regionName = values.origin.region;
    if (regionName != undefined) {
        document.querySelector("#region").innerText = regionName.value;
    }

    // Countries
    countriesList = document.querySelector("#countries_list");
    empty = true;
    for (var i = 0; i < values.origin.countries.length; i++) {
        var country = values.origin.countries[i];
        var el = document.createElement("li");
        if (country.link != undefined) {
            var link = document.createElement("a");
            // TODO page for a contry -- 
            // link.href = "./food.html?data=" + extractResourceName(country.link.value);
            link.textContent = country.label.value;
            el.appendChild(link);
        } else {
            el.textContent = country.label.value;
        }
        countriesList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#countries_title").innerText = "";
    }

    // Productors
    productorsList = document.querySelector("#productors_list");
    empty = true;
    for (var i = 0; i < values.origin.productors.length; i++) {
        var productor = values.origin.productors[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        // TODO page for a productor -- 
        // link.href = "./food.html?data=" + extractResourceName(productor.link.value);
        link.textContent = productor.label.value;
        el.appendChild(link);
        productorsList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#productors_title").innerText = "";
    }

    // Usage
    // Serving info
    var servingInfo = "";
    var servingSize = values.usage.servingSize;
    if (servingSize != undefined) {
        servingInfo += "Serving size : " + servingSize.value + "g\n";
    }
    var servingTemperature = values.usage.servingTemperature;
    if (servingTemperature != undefined) {
        servingInfo += "Serving temperature : " + servingTemperature.value;
    }
    if (servingInfo != "") {
        document.querySelector("#serving").innerText = servingInfo.trim();
    }

    // Receipes
    receipesList = document.querySelector("#receipes_list");
    empty = true;
    for (var i = 0; i < values.usage.receipes.length; i++) {
        var receipe = values.usage.receipes[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(receipe.link.value);
        link.textContent = receipe.label.value;
        el.appendChild(link);
        receipesList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#receipes_title").innerText = "";
    }

    // Ingredients
    ingredientsList = document.querySelector("#ingredients_list");
    empty = true;
    for (var i = 0; i < values.usage.ingredients.length; i++) {
        var ingredient = values.usage.ingredients[i];
        var el = document.createElement("li");
        var link = document.createElement("a");
        link.href = "./food.html?data=" + extractResourceName(ingredient.link.value);
        link.textContent = ingredient.label.value;
        el.appendChild(link);
        ingredientsList.appendChild(el);
        empty = false;
    }
    if (empty) {
        document.querySelector("#ingredients_title").innerText = "";
    }
}

var data = new URL(document.location.href).searchParams.get("data");

if (data != undefined) {
    var uri = 'http://dbpedia.org/resource/' + data;

    findFoodInformations(uri, populatePage);
}