function createEarth(earthQuakeData){

    function quakeMarker(feature) {

        return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
            radius: markerSize(feature.properties.mag)
        });
    } 

   // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        const popupMsg = feature.properties.title + "<br> with a magnitutde of: <br>" + feature.properties.mag + "<br> The Date of the Quake was:<br>" + new Date(feature.properties.time) 
        layer.bindPopup(popupMsg);
    }

    const earthquakes = L.geoJSON(earthQuakeData, {
        EarthFeature : onEachFeature,
        EarthMarker : quakeMarker
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

    function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });


        const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
        const baseMaps = {
            "Street Map": streetmap,
            "Night Map" : darkmap
        };

        // Create an overlayMaps object to hold the bikeStations layer
        var overlayMaps = {
            EarthQuakes: earthquakes
        };

        // Create the map object with options
        var map = L.map("map-id", {
            center: [40.73, -74.0059],
            zoom: 12,
            layers: [streetmap, earthquakes]
        });

        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);
    }
   



// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
(async function(){
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
    const earthQuakeData = await d3.json(url)
    createEarth(earthQuakeData.features);
})()