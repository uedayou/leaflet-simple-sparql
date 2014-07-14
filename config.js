var endpoint = "http://ja.dbpedia.org/sparql";
var query = (function () {/*
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
select * where {
?uri rdfs:label ?title;
geo:lat ?lat;
geo:long ?long.
}
limit 1000
*/}).toString().match(/\n([\s\S]*)\n/)[1];

var maxZoom = 19;
var baseUrl = "http://j.tile.openstreetmap.jp/{z}/{x}/{y}.png";
var baseAttribution = 'Map data &copy; OpenStreetMap contributors, Tiles Courtesy of OpenStreetMap Japan';
var subdomains = '1234';
var clusterOptions = {showCoverageOnHover: false, maxClusterRadius: 50};
var labelColumn = "title";
var labelLatitude = "lat";
var labelLongitude = "long";
var opacity = 1.0;