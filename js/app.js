var basemap = new L.TileLayer(baseUrl, {maxZoom: 19, attribution: baseAttribution, subdomains: subdomains, opacity: opacity});

var center = new L.LatLng(0, 0);

var map = new L.Map('map', {center: center, zoom: 2, maxZoom: maxZoom, layers: [basemap]});

var popupOpts = {
    autoPanPadding: new L.Point(5, 50),
    autoPan: true
};

var hits = 0;
var total = 0;
var filterString;
var markers = new L.MarkerClusterGroup();
var dataJson;

var typeAheadSource = [];

var points = L.geoJson(null, {
    onEachFeature: function (feature, layer) {
        var popup = '<div class="popup-content"><table class="table table-striped table-bordered table-condensed">';
        for (var clave in feature.properties) {
            var title = clave;
            var attr = feature.properties[clave];
            if (title == labelColumn) {
                layer.bindLabel(feature.properties[clave], {className: 'map-label'});
            }
            if (typeof attr === 'string' && attr.indexOf('http') === 0) {
                attr = '<a target="_blank" href="' + attr + '">'+ attr + '</a>';
            }
            if (attr) {
                popup += '<tr><th>'+title+'</th><td>'+ attr +'</td></tr>';
            }
        }
        popup += "</table></popup-content>";
        layer.bindPopup(popup, popupOpts);
    },
    filter: function(feature, layer) {
        total += 1;
        if (!filterString) {
            hits += 1;
            return true;
        }
        var hit = false;
        var lowerFilterString = filterString.toLowerCase().strip();
        $.each(feature.properties, function(k, v) {
            var value = v.toLowerCase();
            if (value.indexOf(lowerFilterString) !== -1) {
                hit = true;
                hits += 1;
                return false;
            }
        });
        return hit;
    }
});


function ArrayToSet(a) {
    var temp = {};
    for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
    var r = [];
    for (var k in temp)
        r.push(k);
    return r;
}

if(typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

map.addLayer(markers);


_getProperties = function(data) {
    var props = {};
    jQuery.each(data, function(key, value) {
        props[key] = value.value;

        var item = value.value.replace(/"/g,'');
        if (item.indexOf("http") !== 0 && isNaN(parseFloat(item))) {
            typeAheadSource.push(item);
            var words = item.split(/\W+/);
            for (var k = words.length - 1; k >= 0; k--) {
                typeAheadSource.push(words[k]);
            }
        }
    });
    return props;
}

_convSparqlJsonToGeoJson = function(data) {
    var json = {};
    json["type"] = "Feature";
    json["properties"] = _getProperties(data);
    json["geometry"] = {"type" :"Point"};
    json["geometry"]["coordinates"] = [data[labelLongitude].value, data[labelLatitude].value];
    return json;
}

addSparqlJsonMarkers = function() {
    hits = 0;
    total = 0;
    filterString = document.getElementById('filter-string').value;

    if (filterString) {
        $("#clear").fadeIn();
    } else {
        $("#clear").fadeOut();
    }

    map.removeLayer(markers);
    points.clearLayers();

    markers = new L.MarkerClusterGroup(clusterOptions);
    points.addData(dataJson);
    markers.addLayer(points);

    map.addLayer(markers);
    try {
        var bounds = markers.getBounds();
        if (bounds) {
            map.fitBounds(bounds);
        }
    } catch(err) {
        // pass
    }
    if (total > 0) {
        $('#search-results').html("Showing " + hits + " of " + total);
    }
    return false;
};

$(document).ready( function() {
    $('body').modalmanager('loading').find('.modal-scrollable').off('click.modalmanager');    
    qr = sendQuery(endpoint, query);
    qr.fail(
        function (xhr, textStatus, thrownError) {
            $('body').modalmanager('removeLoading');
            alert("Error: A '" + textStatus+ "' occurred.");
        }
    );
    qr.done(
        function (json) {
            dataJson = [];
            for(var i=0;i<json.results.bindings.length;i++) {
                dataJson.push(_convSparqlJsonToGeoJson(json.results.bindings[i]));
            }
            typeAheadSource = ArrayToSet(typeAheadSource);
            $('#filter-string').typeahead({source: typeAheadSource});

            $('body').modalmanager('removeLoading');
            $('body').removeClass('modal-open');
            addSparqlJsonMarkers();
        }
    );

    $("#clear").click(function(evt){
        evt.preventDefault();
        $("#filter-string").val("").focus();
        addSparqlJsonMarkers();
    });

});
