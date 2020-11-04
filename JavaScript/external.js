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

  //add trails feature layer(line) NOT WORKING
  var trailsLayer = new FeatureLayer({
    url:
      "https://services1.arcgis.com/M68M8H7oABBFs1Pf/arcgis/rest/services/CoSM_ParkTrail_22oct2020/FeatureServer"
  });
  //map.add(trailsLayer);

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
  	document.body.className = 'rainy';
  } else if( description.indexOf('cloud') > 0 ) {
  	document.body.className = 'cloudy';
  } else if( description.indexOf('sunny') > 0 ) {
  	document.body.className = 'sunny';
  }
}

//Attempt at historical weather data api request.
/*
function rainCondition( cityID ) {
  var key = "4f65582b38d251b7b07af44b50464e8a";
  var lat = "29.8833";
  var long = "-97.9414"
  fetch("http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=" + lat + "&lon=" + long +".9&dt=1586468027&appid=" + key)
  .then(function(resp) {return resp.json() })
  .then(funtion(data) {
    console.log(data);
  });
  .catch(function(){
  });
}

$.getJSON('http://openweathermap.org/data/2.1/find/city?lat=13.3428&lon=-6.2661&cnt=10&callback=?', function(data) { console.log(data); });
*/
