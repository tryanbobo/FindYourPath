require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Track",
  "esri/layers/FeatureLayer"

], function(Map, MapView, BasemapToggle, Track, FeatureLayer){
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
  view.ui.add(basemapToggle, "bottom-right");

  //parks renderer
  var parksRenderer = {
    type: "simple",
    symbol: {
      color: "green",
      type: "simple-fill",
      style: "solid",
      outline:{
        style: "solid",
        color: "grey",
        width: 3
      }
    }
  };
  //add parks feature layer(line)
  var parksLayer = new FeatureLayer({
    url:
      "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/CoSM_CityPark_22oct2020/FeatureServer",
    renderer: parksRenderer,
    opacity: 0.2
  });
  map.add(parksLayer);

  var popupTrails = {
    title: "{NAME}",

    content:
      "<b>Type:</b> {TYPE}<br> <b>Length:</b> {LENGTH_MIL} miles<br> <b>Park:</b> {PARK}"
  }

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
        /*if (total += hour.humidity = "NaN"){
          total = 0
        }else(
          return total += hour.humidity
        )*/
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
    var totalRainInches = Math.round(parseFloat(result)*25.4);
    /*var trailConditions = ""
     if (totalRainInches = "NaN"){
      totalRainInches = 0;
    }else if (totalRainInches <= 1){
      trailConditions = "Trail conditions are..."
    }else{
      trailConditions = "It's getting crazy"
    }*/
    document.getElementById('precip').innerHTML = "Five Day Precipication Accumulation: " + totalRainInches + "&Prime;"

})

console.log( 34 + 4)
