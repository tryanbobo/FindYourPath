require([ //add required tools and features used in map
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/Legend",
  "esri/widgets/Track",
  "esri/widgets/Compass",
  "esri/widgets/Popup",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Directions",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "dojo/domReady!"

], function(Map, MapView, BasemapToggle, DistanceMeasurement2D, Legend, Track, Compass, Popup, FeatureLayer,Graphic, GraphicsLayer, Directions, Editor, Expand){ //call neccicary arcgis js api tools.
    var map = new Map({
      basemap: "topo-vector", //add default basemap
  });
  //assign map container, view, and starting location
  var view = new MapView({
    container: "viewDiv",
    map: map,
    popup: {
            dockEnabled: false,
            dockOptions: {
              // Disables the dock button from the popup
              buttonEnabled: false,
              // Ignore the default sizes that trigger responsive docking
              breakpoint: false
            }
          },
    center: [-97.9515, 29.8890],
    zoom: 14

  });

  //add basemap toggle to switch from topo-vector to satellite
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });

  //view.ui.add(basemapToggle, "bottom-right");
  var trailsDiff = new FeatureLayer({
    url:
      "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Trail_Difficulty_Rating/FeatureServer",
    content:
      "<b>Trail Difficulty:</b> {Trail_Diff}"
  });
  map.add(trailsDiff, 1);

  var legend = new Legend({
    view: view,
    layerInfos: [{
      layer: trailsDiff,
      title: "International Mountain Bike Association"
    }]
  });

// Routing And Navigation

var directionsWidget = new Directions({
        view: view,
        routeServiceUrl:"https://utility.arcgis.com/usrsvcs/appservices/io4S0BRoPlMFNkO6/rest/services/World/Route/NAServer/Route_World",

      });

      /*view.ui.add(directionsWidget, {
        position: "bottom-left",
        index: 2,

      });
*/




  //parks renderer
  var parksRenderer = {
    type: "simple",
    symbol: {
      color: "#135219",
      type: "simple-fill",
      style: "solid",
      outline:{
        style: "solid",
        color: "#424141",
        width: 3
      }
    }
  };
  //assign Parks popup template
  var popupParks = {
    title: "{NAME}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "ADDRESS",
            label: "Address"
          },
          {
            fieldName: "ACRES",
            label: "Acres",
            format: {
              digitSeparator: true,
              places: 2
            }
          },
          {
            fieldName: "HrsOper",
            label: "Hours of Operation"
          }
        ]
      }
    ]
  };
  //add parks feature layer(line)
  var parksLayer = new FeatureLayer({
    url:
      "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/CoSM_CityPark_22oct2020/FeatureServer",
    renderer: parksRenderer,
    opacity: 0.3,
    outFields: ["ADDRESS", "ACRES", "HrsOper"],
    popupTemplate: popupParks
  });
  map.add(parksLayer, 0);
  //assign Trails popup template
  var popupTrails = {
    title: "{NAME}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "TYPE",
            label: "Type"
          },
          {
            fieldName: "LENGTH_MIL",
            label: "Length",
            format: {
              digitSeparator: true,
              places: 2
            }
          },
          {
            fieldName: "PARK",
            label: "Park"
          }
        ]
      }
    ]
  };

  //add trails feature layer(line)
  var trailsLayer = new FeatureLayer({
    url:
      "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/CoSM_ParkTrail_22oct2020/FeatureServer",
      outFields: ["TYPE", "LENGTH_MIL", "PARK"],
      popupTemplate: popupTrails
  });
  map.add(trailsLayer, 0);

 //Create trail query side bar
  const listNode = document.getElementById("trail_graphics");

  let graphics;

  view.whenLayerView(trailsLayer).then(function (layerView) {
    layerView.watch("updating", function (value) {
      if (!value) {
        // wait for the layer view to finish updating

        // query all the features available for drawing.
        layerView
          .queryFeatures({
            geometry: view.extent,
            returnGeometry: true,
            orderByFields: ["PARK"]
          })
          .then(function (results) {
            graphics = results.features;

            const fragment = document.createDocumentFragment();

            graphics.forEach(function (result, index) {
              const attributes = result.attributes;
              const name = attributes.NAME;

              // Create a list of trails
              const li = document.createElement("li");
              li.classList.add("panel-result");
              li.tabIndex = 0;
              li.setAttribute("data-result-id", index);
              li.textContent = name;

              fragment.appendChild(li);
            });
            // Empty the current list
            listNode.innerHTML = "";
            listNode.appendChild(fragment);
          })
          .catch(function (error) {
            console.error("query failed: ", error);
          });
      }
    });
  });

  // listen to click event on the trails list
  listNode.addEventListener("click", onListClickHandler);

  function onListClickHandler(event) {
    const target = event.target;
    const resultId = target.getAttribute("data-result-id");

    // get the graphic corresponding to the clicked trail
    const result =
      resultId && graphics && graphics[parseInt(resultId, 10)];

    if (result) {
      // open the popup at the centroid of trail line
      // and set the popup's features which will populate popup content and title.
      view
        .goTo(result.geometry.extent.expand(2))
        .then(function () {
          view.popup.open({
            features: [result],
            location: result.geometry.centroid
          });
        })
        .catch(function (error) {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
    }
  }
  // Collapsible
 var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
 coll[i].addEventListener("click", function() {
   this.classList.toggle("active");
   var content = this.nextElementSibling;
   if (content.style.display === "block") {
     content.style.display = "none";
   } else {
     content.style.display = "block";
   }
 });
}
  //add compass to show direction while tracking user
  var compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-left");

  var track = new Track({
    view: view  //assigns tracker to current map view
  });
  view.ui.add(track, "top-left"); //adds tracker to top-right of view
  view.when(function () {  //loads tracker function when view loads
    track.start();  //starts tracker
  });

  // add the DistanceMeasurement2D widget to the map
  var measurementWidget = new DistanceMeasurement2D({
    view: view,
    unit: "feet"
  });
  //view.ui.add(measurementWidget, "top-left");

  //Create the edotor
  let editor = new Editor({
    view: view
  });

//view.ui.add(editor, "top-right");
  //Problem popup template
  var popProblems = {
    title:"Trail Report" ,
    content:
      "<b>Trail Issue:</b> {HazardType}<br> <b>Status:</b> {Status}<br> <b>Comments:</b> {Description}<br> <b>Priority:</b> {Priority}"
  }
  //add hosted feature service used to store and edit tail edits.
  var myPointsFeatureLayer = new FeatureLayer({
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Trail_Conditions/FeatureServer",
    outFields:["HazardType", "Status", "Description", "Priority"],
    popupTemplate:popProblems
  });
  map.add(myPointsFeatureLayer)
  //add basemapToggle, editor, and measure tools to expand tool at bottum left of view.
  var basemapExpand = new Expand({
    view: view,
    content: basemapToggle,
    expandIconClass: "esri-icon-basemap",
    mode: "floating"
  });

  var editorExpand = new Expand({
    view: view,
    content: editor,
    expandIconClass: "esri-icon-edit",
    mode: "floating"
  });

  var measureExpand = new Expand({
    view: view,
    content: measurementWidget,
    expandIconClass: "esri-icon-measure",
    mode: "floating"
  });

  var legendExpand = new Expand({
    view: view,
    content: legend,
    expandIconClass: "esri-icon-legend",
    mode: "floating"
  });
  var directionsExpand = new Expand({
    view: view,
    content: directionsWidget,
    expandIconClass: "esri-icon-directions2",
    mode: "floating"
    });

  view.ui.add([editorExpand, basemapExpand, measureExpand, legendExpand], "top-left");
  view.ui.add([editorExpand], "bottom-left");
  view.ui.add([directionsExpand], "bottom-right");

});

// WeatherBallon ///////////////////////////////////////////////////////////////
//function that takes in cityID/ retrieves weather data
function weatherBalloon( cityID ) {
  var key = '4f65582b38d251b7b07af44b50464e8a';
  fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)//api call -- fetches current of weather data
  .then(function(resp) { return resp.json() }) //convert data to JSON
  .then(function(data) {
    drawWeather(data); //applies recieved data to drawWeather function
    console.log(data);
  })
  .catch(function() { //catch any errors

  });
}

window.onload = function(){
  weatherBalloon( 4726491 ); //call function with cityID
}

function drawWeather( d ) {

	var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);//convertes temp to fahrenheit and reduces dicimal points
	var description = d.weather[0].description;
  //adds current weather fetches to html elements
	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = fahrenheit + '&deg; F';
	document.getElementById('location').innerHTML = d.name + ', TX';
  //condition that is used to change css style (background) based on the weather conditions
  //...this broke when moving to the drop-down
	if( description.indexOf('rain') > 0 ) {
  	   document.h1.className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	    document.h1.className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	    document.h1.className = 'sunny';
  }
}

//converts current unix date from miliseconds to seconds and subtracts seconds from variable daysAgo
function getDaysAgo(days) {
    return Math.floor((Date.now() / 1000) - (86400 * days)) //returns date of privious 5 days from now.
}
//fetchs historic hourly weather data for rain.
async function getDataForDaysAgo(days) {
    let daysAgo = getDaysAgo(days) //nest getDaysAgo function to variable
    const apiURL = `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=${daysAgo}&appid=5ffab1cda2c6b2750c78515f41421805` //calls historic weather api using privious days
    const apiResponse = await fetch(apiURL)  //fetch data
    const responseJson = await apiResponse.json() //converts data to json
    var total = 0
    console.log(responseJson);

    responseJson.hourly.forEach(hour => { //loops through each 1hr record of 24
          //if no rain is recorded, rain data is not available. system reprots: NaN
          if (hour.rain){ //check for rain values
                total += hour.rain['1h'] //add available rain measurements to total
              }


        //otherwise sum all available rain values.
          //total += hour.rain

    });
    console.log(`getDataForDaysAgo(${days}) returns ${total}`) //logs total rain values for each 24hr period
    return total
}
//call above fetch function with appropriate historic 'daysAgo'
async function getDataSums() {
    var data1 = await getDataForDaysAgo(5)
    var data2 = await getDataForDaysAgo(4)
    var data3 = await getDataForDaysAgo(3)
    var data4 = await getDataForDaysAgo(2)
    var data5 = await getDataForDaysAgo(1)
    return data1 + data2 + data3 + data4 + data5; //returns sum of 5 day rain values
}

getDataSums().then(result => { //waits for getDataSums and return result
    var totalRainInches = parseFloat((result)/25.4); //converts to mm to inches
      document.getElementById('precip5day').innerHTML = "Five Day Precipication Accumulation:"
      document.getElementById('precipValue').innerHTML = totalRainInches.toFixed(2) + "&Prime;"
    //proof of concept conditional statment that gives recommendations for trail use
    //based on 5 day rain totals and writes to index.html file
    if (totalRainInches <= 0.15){
      document.getElementById('conditions').innerHTML = "Hiking and mountain biking should be okay"
    } else if (totalRainInches < 3 ){
      document.getElementById('conditions').innerHTML = "Due to recent rain activity, use best judgement when hiking or mountain biking"
    } else if (totalRainInches < 7 ){
      document.getElementById('conditions').innerHTML = "Due to heavy rainfall, trails should not be used"
    } else if (totalRainInches > 7){
      document.getElementById('conditions').innerHTML = "Due to catastrophic rainfall, all trials are closed"
    }else {
      document.getElementById('conditions').innerHTML = "Something broke :("
    }
});
