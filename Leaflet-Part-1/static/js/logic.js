// Store the API endpoint as a queryURL - SIGNIFICANT EARTHQUAKES IN THE PAST 30 DAYS
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//Perform a GET request to the query URL
d3.json(url).then(function (data) {
    // Console log the data retrieved
    console.log(data);
    // Once we get a response, send the data.features object to the createFeatures function. 
    //Objective: Store the "feature" list data
    createFeatures(data.features);
});

// Create a function where the data markers will reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. 
// Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
function markerSize(magnitude) {
    return magnitude * 3000;
};

// Function to determine the marker color by depth - Typical Values [0, 1000]
function chooseColor(depth) {
    if (depth < 10) return "#73e600";
    else if (depth < 30) return "#e6e600";
    else if (depth < 50) return "#ff6600";
    else if (depth < 70) return "#ff0000";
    else if (depth < 90) return "#b30000";
    else if (depth < 300) return "#660000";
    else if (depth < 700) return "#330000";
    else return "#000000";
}

function createFeatures (earthquakeData) { 
    // Define a function that will run for each feature in the features array:
    
    // Give each feature a popup that describes the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        //Point to layer used to alter markers
        pointToLayer: function(feature, latlng) {

            // Determine the style of markers based on properties
            var markers = {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),                
                fillOpacity: 0.7,
                color: "black",
                stroke: true,
                weight: 0.5
            }
            return L.circle(latlng,markers);
        }
    });

 //Send our earthquakes layer to the createMap function
 createMap(earthquakes);
}


//CREATING THE MAP
function createMap(earthquakes) {

    //Create the map using L.map
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [earthquakes]
    });

    // Create tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

  
    // Add legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [-10, 10, 30, 50, 70, 90, 300, 700];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
        legend.addTo(myMap)
};


