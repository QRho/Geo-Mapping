// Store our API endpoint inside queryUrl

// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +

//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02"

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";



// Perform a GET request to the query URL

d3.json(link, function(data) {

  // Once we get a response, send the data.features object to the createFeatures function

  createFeatures(data.features);

  console.log(data.features);

});



function createFeatures(earthquakeData) {



  // Define a function we want to run once for each feature in the features array

  // Give each feature a popup describing the place and time of the earthquake

  function onEachFeature(feature, layer) {

    layer.bindPopup('<h4>Place: ' + feature.properties.place + 

    '</h4><h4>Date: ' + new Date(feature.properties.time) + 

    '</h4><h4>Magnitude: ' + feature.properties.mag, {maxWidth: 400})

}



  // Create a GeoJSON layer containing the features array on the earthquakeData object

  var earthquakeLayer = L.geoJSON(earthquakeData, {

    onEachFeature: onEachFeature,

    pointToLayer: function(feature, latlng) {

        let radius = feature.properties.mag * 5;



        if (feature.properties.mag > 5) {

            fillcolor = '#f06b6b';

        }

        else if (feature.properties.mag >= 4) {

            fillcolor = '#f0936b';

        }

        else if (feature.properties.mag >= 3) {

            fillcolor = '#f3ba4e';

        }

        else if (feature.properties.mag >= 2) {

            fillcolor = '#f3db4c';

        }

        else if (feature.properties.mag >= 1) {

            fillcolor = '#e1f34c';

        }

        else  fillcolor = '#b7f34d';



        return L.circleMarker(latlng, {

            radius: radius,

            color: 'black',

            fillColor: fillcolor,

            fillOpacity: 1,

            weight: 1

        });

    }

});  



  // Sending our earthquakes layer to the createMap function

  createMap(earthquakeLayer);

}



function getColor(mag) {

  return mag > 5  ? '#f06b6b' :

         mag > 4  ? '#f0936b' :

         mag > 3  ? '#f3ba4e' :

         mag > 2  ? '#f3db4c' :

         mag > 1  ? '#e1f34c' :

                    '#b7f34d';

}



var legend = L.control({ position: "bottomleft" });



legend.onAdd = function(myMap) {

var div = L.DomUtil.create("div", "legend");

magnitude = [0, 1, 2, 3, 4, 5],

labels = [];



for (var i = 0; i < magnitude.length; i++) {

    div.innerHTML +=

        '<i style="background:' + getColor(magnitude[i] + 1) + '"></i> ' +

        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');

}



return div;

};



function createMap(earthquakes) {



  // Define streetmap, darkmap and satellitemap layers

  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY

  });



  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY

  });



  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {

    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",

    maxZoom: 18,

    id: "mapbox.satellite",

    accessToken: API_KEY

  });



  // Define a baseMaps object to hold our base layers

  var baseMaps = {

    "Street Map": streetmap,

    "Dark Map": darkmap,

    "Satellite Map": satellitemap

  };



  // Create our map, giving it the streetmap and earthquakes layers to display on load

  var myMap = L.map("map", {

    center: [37.09, -95.71],

    zoom: 4,

    layers: [satellitemap, earthquakes]

  });



legend.addTo(myMap);



  // Create overlay object to hold our overlay layer

  var overlayMaps = {

    Earthquakes: earthquakes

  };



  // Create a layer control

  // Pass in our baseMaps and overlayMaps

  // Add the layer control to the map

  L.control.layers(baseMaps, overlayMaps, {

    collapsed: false

  }).addTo(myMap);

}