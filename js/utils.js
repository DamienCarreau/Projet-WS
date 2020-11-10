/**
 * readURL
 * Lit les paramètre de l'URL et retourne les infos
 * @returns {JsonObject} les informations {type,uri}
 */
function readURL() {
    var mUrl = new URL(document.location.href);
    var result = {};

    result.type = mUrl.searchParams.get("type");
    result.uri = mUrl.searchParams.get("uri");

    return result;
}