# Leaflet Simple SPARQL

[leaflet-simple-csv] で、SPARQLエンドポイントを使えるようにしました。

## デモ

<http://uedayou.net/leaflet-simple-sparql/>

## 使い方

config.js の endpoint に SPARQLエンドポイントを、query に SPARQLクエリを入力してください。
queryは、/* ... */ の中に記述してください。

	var endpoint = "http://ja.dbpedia.org/sparql";
	var query = (function () {/*
	PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	select * where {
		?link rdfs:label ?title;
		geo:lat ?lat;
		geo:long ?long.
	}
	limit 1000
	*/}).toString().match(/\n([\s\S]*)\n/)[1];

SPARQLクエリは、lat変数に緯度、long変数に経度が入力されるように記述してください。

その他は、leaflet-simple-csvと同じです。[leaflet-simple-csv] を参照してください。

SPARQLエンドポイントは、CORS(Cross-Origin Resource Sharing)に対応したもののみ利用できます。

## 利用ライブラリ

- [leaflet-simple-csv]
- [leaflet]
- [Leaflet.markercluster]
- [jQuery]
- [Bootstrap]
- [bootstrap-modal]
- [SPARQL Timeliner]

## 注意

config.js は必ず UTF8 で保存してください。
サーバによっては、SPARQLクエリに2つ以上の空白またはタブ文字が入るとエラーが起こる可能性あります。


[leaflet-simple-csv]:https://github.com/perrygeo/leaflet-simple-csv
[leaflet]:http://leafletjs.com/
[Leaflet.markercluster]:https://github.com/Leaflet/Leaflet.markercluster
[jQuery]:http://jquery.com/
[Bootstrap]:http://getbootstrap.com/
[bootstrap-modal]:https://github.com/jschr/bootstrap-modal
[SPARQL Timeliner]:http://uedayou.net/SPARQLTimeliner/
