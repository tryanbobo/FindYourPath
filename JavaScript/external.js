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


//WORKS Provies a json of hourly weather data for (1)24 hr period starting 5 days ago.


const fiveDaysAgo = Math.floor((Date.now() / 1000)-432000);
const fivedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + fiveDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData5(){
  const response5 = await fetch(fivedayURL)
  const histData5 = await response5.json();
  var total5 = 0
  for (var i in histData5.hourly){
    total5 += histData5.hourly[i].humidity;
  };
  //console.log(total5);
}
//getData5();


const fourDaysAgo = Math.floor((Date.now() / 1000)-345600);
const fourdayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + fourDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData4(){
  const response4 = await fetch(fourdayURL)
  const histData4 = await response4.json();
  var total4 = 0;
  for (var i in histData4.hourly){
    total4 += histData4.hourly[i].humidit
  };
  //console.log(total4);
}
//getData4();


const threeDaysAgo = Math.floor((Date.now() / 1000)-259200);
const threedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + threeDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData3(){
  const response3 = await fetch(threedayURL);
  const histData3 = await response3.json();
  var total3 = 0;
  for (var i in histData3.hourly){
    total3 += histData3.hourly[i].humidity;
  };
  //console.log(total3)
}
//getData3();

const twoDaysAgo = Math.floor((Date.now() / 1000)-172800);
const twodayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + twoDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData2(){
  const response2 = await fetch(twodayURL);
  const histData2 = await response2.json();
  var total2 = 0;
  for (var i in histData2.hourly){
    total2 += histData2.hourly[i].humidity;
  };
  console.log('total2: ');
  console.log(total2);
  return total2;
}
//getData2();

const oneDaysAgo = Math.floor((Date.now() / 1000)-86400);
const onedayURL = "http://api.openweathermap.org/data/2.5/onecall/timemachine?lat=29.8833&lon=-97.9414&dt=" + oneDaysAgo +"&appid=5ffab1cda2c6b2750c78515f41421805"
async function getData1(){
  const response1 = await fetch(onedayURL);
  const histData1 = await response1.json();
  var total1 = 0;
  for (var i in histData1.hourly){
    total1 += histData1.hourly[i].humidity;
  };
  console.log('total1: ');
  console.log(total1);
  return total1;
}
//getData1();

//var total1and2 = getData1() + getData2();

var totalHumidity =  getData1().value + getData2().value;
console.log(totalHumidity);
console.log(typeof totalHumidity);



function drawDayTotals( r ){

  document.getElementById('precip').innerHTML = r

};


/*
function drawRain () {
  var rainAccumulation5 = 0
  for (var i in histData5.hourly){
    rainAccumulation5 += histData5.hourly[i].humidity
  };

  var rainAccumulation4 = 0
  for (var i in histData4.hourly){
    rainAccumulation4 += histData4.hourly[i].humidity
  };

  var rainAccumulation3 = 0
  for (var i in histData3.hourly){
    rainAccumulation3 += histData3.hourly[i].humidity
  };

  var rainAccumulation2 = 0
  for (var i in histData2.hourly){
    rainAccumulation2 += histData2.hourly[i].humidity
  };

  var rainAccumulation1 = 0
  for (var i in histData1.hourly){
    rainAccumulation1 += histData1.hourly[i].humidity
  };

  const total5DayRain = Sum([rainAccumulation5, rainAccumulation4, rainAccumulation3, rainAccumulation2, rainAccumulation1]);
  console.log(total5DayRain)
};
drawRain();
*/
