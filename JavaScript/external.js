require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Track",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "dojo/domReady!"

], function(Map, MapView, BasemapToggle, Track, FeatureLayer,Graphic, GraphicsLayer, Editor, Expand){
    var map = new Map({
      basemap: "topo-vector",
  });
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-97.9414, 29.8833],
    zoom: 13
  });
  var basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "satellite"
  });
  //view.ui.add(basemapToggle, "bottom-right");

  //parks renderer
  var parksRenderer = {
    type: "simple",
    symbol: {
      color: "green",
      type: "simple-fill",
      style: "solid",
      outline:{
        style: "solid",
        color: "blue",
        width: 3
      }
    }
  };

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
    opacity: 0.2,
    outFields: ["ADDRESS", "ACRES", "HrsOper"],
    popupTemplate: popupParks
  });
  map.add(parksLayer);

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
  map.add(trailsLayer);

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

              // Create a list zip codes in NY
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

  // listen to click event on the zip code list
  listNode.addEventListener("click", onListClickHandler);

  function onListClickHandler(event) {
    const target = event.target;
    const resultId = target.getAttribute("data-result-id");

    // get the graphic corresponding to the clicked zip code
    const result =
      resultId && graphics && graphics[parseInt(resultId, 10)];

    if (result) {
      // open the popup at the centroid of zip code polygon
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

  var track = new Track({
    view: view  //assigns tracker to current map view
  });
  view.ui.add(track, "top-left"); //adds tracker to top-right of view
  view.when(function () {  //loads tracker function when view loads
    track.start();  //starts tracker
  });
  //Create the edotor
  let editor = new Editor({
  view: view
  // Pass in any other additional property as needed
});
// Add widget to top-right of the view
//view.ui.add(editor, "top-right");
  //Problem popups
  var popProblems = {
    title:"{HazardType}" ,
    content:
      "<b>Trail Issue:</b> {HazardType}<br> <b>Status:</b> {Status}<br> <b>Comments:</b> {Description}<br> <b>Priority:</b> {Priority}"
  }
  //*** ADD ***//
  var myPointsFeatureLayer = new FeatureLayer({
    //*** Replace with your URL ***//
    url: "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/Trail_Conditions/FeatureServer",
    outFields:["HazardType", "Status", "Description", "Priority"],
    popupTemplate:popProblems
  });
  map.add(myPointsFeatureLayer)

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

  view.ui.add([basemapExpand, editorExpand], "bottom-left");
});


// WeatherBallon ///////////////////////////////////////////////////////////////
function weatherBalloon( cityID ) {
  var key = '4f65582b38d251b7b07af44b50464e8a';
  fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)//fetches stream of weather data
  .then(function(resp) { return resp.json() }) //convert data to JSON
  .then(function(data) {
    drawWeather(data);
    console.log(data);
  })
  .catch(function() {
    //catch any errors
  });
}

window.onload = function(){
  weatherBalloon( 4726491 );
}

function drawWeather( d ) {
	var celcius = Math.round(parseFloat(d.main.temp)-273.15);
	var fahrenheit = Math.round(((parseFloat(d.main.temp)-273.15)*1.8)+32);
	var description = d.weather[0].description;

	document.getElementById('description').innerHTML = description;
	document.getElementById('temp').innerHTML = fahrenheit + '&deg;';
	document.getElementById('location').innerHTML = d.name;

	if( description.indexOf('rain') > 0 ) {
  	document.getElementById("weather").className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	document.getElementById("weather").className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	document.getElementById("weather").className = 'sunny';
  }
}

function getDaysAgo(days) {
    return Math.floor((Date.now() / 1000) - (86400 * days))
}

async function getDataForDaysAgo(days) {
    let daysAgo = getDaysAgo(days)
    const apiURL = `http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=${daysAgo}&appid=5ffab1cda2c6b2750c78515f41421805`
    const apiResponse = await fetch(apiURL)
    const responseJson = await apiResponse.json()
    var total = 0
    responseJson.hourly.forEach(hour => {

        total += hour.rain
          if (isNaN(total)){
            total = 0
          }

    });
    console.log(`getDataForDaysAgo(${days}) returns ${total}`)
    return total
}

async function getDataSums() {
    var data1 = await getDataForDaysAgo(5)
    var data2 = await getDataForDaysAgo(4)
    var data3 = await getDataForDaysAgo(3)
    var data4 = await getDataForDaysAgo(2)
    var data5 = await getDataForDaysAgo(1)
    return data1 + data2 + data3 + data4 + data5;
}

getDataSums().then(result => {
    var totalRainInches = parseFloat((result)*25.4); //converts to mm to inches
      document.getElementById('precip5day').innerHTML = "Five Day Rain Totals:"
      document.getElementById('precipValue').innerHTML = totalRainInches.toFixed(2) + "&Prime;"
    if (totalRainInches <= 0.50){
      document.getElementById('conditions').innerHTML = "Hiking and mountain biking should be okay"
    } else if (totalRainInches < 3 ){
      document.getElementById('conditions').innerHTML = "Do to recent rain avtivity, use best judgement when hiking or mountain biking"
    } else if (totalRainInches > 7 ){
      document.getElementById('conditions').innerHTML = "Due to heavy rainfall, trails should not be used"
    }else {
      document.getElementById('conditions').innerHTML = "Something broke :("
    }
});
