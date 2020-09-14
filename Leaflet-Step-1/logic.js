// function to determine marker size based on magnitude
function markerSize(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 5;
}
// function to determine color of marker based on magnitude
function getColor(magnitude) {

  if (magnitude <= 1) {
    return '#fef0d9';
  }
  if (magnitude <= 2) {
    return '#fdd49e';
  }
  if (magnitude <= 3) {
    return '#fdbb84';
  }
  if (magnitude <= 4) {
    return '#fc8d59';
  }
  if (magnitude <= 5) {
    return '#ef6548';
  }
  if (magnitude <= 6) {
    return '#d7301f';
  }
  if (magnitude <= 7) {
    return '#990000';
  }
}

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// pin data to circle marker and popup tip
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
      "</h3><p>" + "Magnitude:  " + feature.properties.mag + "</p>" +
      "</h3><p>" + "URL for Event:  " + new URL(feature.properties.url) + "</p>");

  }
  // Give each feature a marker circle size and color based on the magnitude of the earthquake
  function pointtolayer(feature, latlng) {
    var circle = L.circleMarker(latlng, {
      stroke: true,
      fillOpacity: 1,
      color: getColor(feature.properties.mag),
      fillColor: getColor(feature.properties.mag),
      radius: markerSize(feature.properties.mag)
      // weight: 0.5
    });
    return circle
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointtolayer
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
// ****************************************************************************
function createMap(earthquakes) {

  var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW1vb3JtZWllciIsImEiOiJja2VjMzhmYngwMGRnMnhrZWh3c3VxM29sIn0.axN4oWAKGmuFRd-NsVxJGQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    // accessToken: API_KEY
  })

  var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW1vb3JtZWllciIsImEiOiJja2VjMzhmYngwMGRnMnhrZWh3c3VxM29sIn0.axN4oWAKGmuFRd-NsVxJGQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v9',
    tileSize: 512,
    zoomOffset: -1,
    // accessToken: API_KEY
  })
  // *************************************************************************
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquake: earthquakes

  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
      magnitude = [0, 1, 2, 3, 4, 5, 6],
      colors = [
        "#fef0d9",
        "#fdd49e",
        "#fdbb84",
        "#fc8d59",
        "#ef6548",
        "#d7301f",
        "#990000"
      ];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);


}
