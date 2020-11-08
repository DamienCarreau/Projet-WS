# Projet-WS

Projet de Web Sémantique 4IF, INSA Lyon

## Auteurs

* Antoine Mandin
* Damien Carreau
* Alexandre Bonhomme
* Pierre-Louis Jallerat
* Enzo Boscher
* Mickeal Ben Said

## Navigatation

### Paramètres

`type`

* `"food"`
* `"productor"` ?
* `"country"` ?
* ... ?

`uri`

* lien total de l'uri
  * ex : `http://dbpedia.org/resource/Meat`

# Fichiers

## Javascript

### aliment.js

`findFoodInformations(String uri, function(JsonObject) onResult)`

```
{
    generalInformations : {
        + label
        + abstract
        ? alias 
        ? thumbnail
        + descendingTypes : [
            + label
            + link
        ]
    }, composition : {
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
    }, origin : {
        ? region (Jamais vue)
        + countries : [
            + label
            ? link
        }
        + productors : [
            + label
            + link
        ]
    }, usage : {
        ? servingSize
        ? servingTemperature
        + receipes : [
            + label
            + link
        ]
        + ingredients : [
            + label
            + link
        ]
    }
}
```



