require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Track",
  "esri/layers/FeatureLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/support/FeatureSet",
  "esri/Graphic",
  "esri/widgets/Directions",

], function(Map, MapView, BasemapToggle, Track, FeatureLayer, RouteTask, RouteParameters, FeatureSet, Graphic, Directions){
    var map = new Map({
      basemap: "streets-navigation-vector",
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
  view.ui.add(basemapToggle, "bottom-right");

// RouteTask

var routeTask = new RouteTask({
         url: "https://utility.arcgis.com/usrsvcs/appservices/io4S0BRoPlMFNkO6/rest/services/World/Route/NAServer/Route_World/solve"
      });

      view.on("click", function(event){
            if (view.graphics.length === 0) {
              addGraphic("start", event.mapPoint);
            } else if (view.graphics.length === 1) {
              addGraphic("finish", event.mapPoint);
              getRoute();
            } else {
              view.graphics.removeAll();
              addGraphic("start",event.mapPoint);
            }
          });

          function addGraphic(type, point) {
          var graphic = new Graphic({
            symbol: {
              type: "simple-marker",
              color: (type === "start") ? "white" : "black",
              size: "8px"
            },
            geometry: point
          });
          view.graphics.add(graphic);
        }

        function getRoute() {

        var routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: view.graphics.toArray()
          }),
          returnDirections: true
        });

        routeTask.solve(routeParams).then(function(data) {

          data.routeResults.forEach(function(result) {
            result.route.symbol = {
              type: "simple-line",
              color: [5, 150, 255],
              width: 3
            };
            view.graphics.add(result.route);
          });
        });
      }

      function getRoute() {

        var routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: view.graphics.toArray()
          }),
          returnDirections: true
        });

        routeTask.solve(routeParams).then(function(data) {

          data.routeResults.forEach(function(result) {
            result.route.symbol = {
              type: "simple-line",
              color: [5, 150, 255],
              width: 3
            };
            view.graphics.add(result.route);
          });



          var directions = document.createElement("ol");
          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = 0;
          directions.style.paddingTop = "15px";



          var features = data.routeResults[0].directions.features;
          features.forEach(function(result,i){
            var direction = document.createElement("li");
            direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
            directions.appendChild(direction);
          });



          view.ui.empty("top-right");
          view.ui.add(directions, "top-right");
        });
      }


      var directionsWidget = new Directions({
        view: view,
        routeServiceUrl:"https://utility.arcgis.com/usrsvcs/appservices/io4S0BRoPlMFNkO6/rest/services/World/Route/NAServer/Route_World"
      });

      view.ui.add(directionsWidget, {
        position: "top-right",
        index: 2
      });


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


  var track = new Track({
    view: view  //assigns tracker to current map view
  });
  view.ui.add(track, "top-left"); //adds tracker to top-right of view
  view.when(function () {  //loads tracker function when view loads
    track.start();  //starts tracker
  });
});

// WeatherBallon ///////////////////////////////////////////////////////////////
function weatherBalloon( cityID ) {
  var key = '4f65582b38d251b7b07af44b50464e8a';
  fetch('https://api.openweathermap.org/data/2.5/weather?id=' + cityID+ '&appid=' + key)//fetches stream of weather data
  .then(function(resp) { return resp.json() }) //convert data to JSON
  .then(function(data) {
    drawWeather(data);
    //console.log(data);
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
  	document.body.className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	document.body.className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	document.body.className = 'sunny';
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
      document.getElementById('precip5day').innerHTML = "Five Day Precipication Accumulation:"
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
