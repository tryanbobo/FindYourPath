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
//need to create a loop that runs through (5) 24hr periods gets json and adds resulting precip to each other.
/*
//unix time stamp right now in seconds
const rightNow = Math.floor(Date.now() / 1000);
const fiveDaysAgo = Math.floor((Date.now() / 1000)-432000);
const key3 = "0a61a8d5e2c8a4d55eeff773162e3649"
const fivedayURL = "http://history.openweathermap.org/data/2.5/history/city?lat=29.8833&&lon=-97.9414&type=hour&start=" + rightNow + "&end=" + fiveDaysAgo + "&appid=" + key3;
async function getData(){
  const response = await fetch(fivedayURL)
  const histData = await response.json();
  console.log(histData);
}
getData();
*/

//WORKS Provies a json of hourly weather data for (1)24 hr period starting 5 days ago.
const fiveDaysAgo = Math.floor((Date.now() / 1000)-432000);
const fivedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + fiveDaysAgo +"&appid=3991389dd7ddbf7746915724989bb78a"
async function getData5(){
  const response5 = await fetch(fivedayURL)
  const histData5 = await response5.json();
  console.log(histData5);
}
getData5();

const fourDaysAgo = Math.floor((Date.now() / 1000)-345600);
const fourdayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + fourDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData4(){
  const response4 = await fetch(fourdayURL)
  const histData4 = await response4.json();
  console.log(histData4);
}
getData4();

const threeDaysAgo = Math.floor((Date.now() / 1000)-259200);
const threedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + threeDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData3(){
  const response3 = await fetch(fourdayURL)
  const histData3 = await response3.json();
  console.log(histData3);
}
getData3();

const twoDaysAgo = Math.floor((Date.now() / 1000)-172800);
const twodayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + twoDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData2(){
  const response2 = await fetch(fourdayURL)
  const histData2 = await response2.json();
  console.log(histData2);
}
getData2();

const oneDaysAgo = Math.floor((Date.now() / 1000)-86400);
const onedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + oneDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData1(){
  const response1 = await fetch(fourdayURL)
  const histData1 = await response1.json();
  console.log(histData1);
}
getData1();


/*
function fiveDayPrecip(){
  var fiveDaysAgo = Math.floor((Date.now() / 1000)-432000);
  console.log(fiveDaysAgo);
  var key2 = "3991389dd7ddbf7746915724989bb78a";
  fetch("http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + fiveDaysAgo +"&appid=" + key2)
    .then(function(resp2) { return resp2.json() })
    .then(function(data1)
      console.log(data1);
  })
  .catch(function(){

  })
  }
  window.onload = function(){
    fiveDayPrecip();
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
