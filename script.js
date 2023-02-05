// boolean variable to determine if the user wants the weather in fahrenheit or celsius.
var fahrenheit = true;
// save the F value when displaying celsius in order to convert btwn F and C without rounding errors
var savedFahr;

//function to determine the weather by zip code
function weatherBYZIP(){
    zip = document.getElementById("search").value;
    //uses weather api that fetches data using the inputted zip code.
    const weather = fetch("https://api.openweathermap.org/data/2.5/weather?zip="+zip+",us&appid=8314393c09be58a0efed7852aaa25d8c&units=imperial")
    weather.then(function(resp) { return resp.json() }) // Convert data to json
    .then(function(data) {
        elementChange(data);
    }).catch(function(){
      alert("Could not get Weather Data")
    })
}

//function to determine the weather by city and state
function weatherByCity()
{
    city = document.getElementById("searchCity").value;
    var select = document.getElementById("state")
    var state = select.options[select.selectedIndex].text;
    //checks to see if user selected a state
    if (state == "State"){
      alert("Invalid State")
    } else {
      //uses weather api to fetch data using inputted city and state
      const weather = fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+","+state+",us&appid=8314393c09be58a0efed7852aaa25d8c&units=imperial")
      weather.then(function(resp) { return resp.json() }) // Convert data to json
      .then(function(data) {
          elementChange(data);
      }).catch(function(){
        alert("Could not get Weather Data")
      })
    }
    
}

//function to capitalize the first letter of the string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//function that checks if the elements change and updates the values.
function elementChange(data) {
  // If we have called the api, update html
  if (data.name) {
    const icon = data.weather[0].icon;
    document.getElementById("city").innerHTML = "Weather in "+data.name;
    if (fahrenheit)
    {
        document.getElementById("temp").innerHTML = Math.ceil(data.main.temp) +"°F";
    } else 
    {
      savedFahr = Math.ceil(data.main.temp);
      let cel =Math.ceil(fToC(savedFahr))
      document.getElementById("temp").innerHTML = cel +"°C";

    }
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
    document.getElementById("description").innerHTML= capitalizeFirstLetter(data.weather[0].description);
    document.getElementById("humid").innerHTML = "Humidity: "+ data.main.humidity +"%";
    document.getElementById("wind").innerHTML = "Wind Speed: "+ Math.ceil(data.wind.speed)+" MPH"
  }
}

//function that converts from fahrenheit to celsius
function fToC(fahrenheit) {
    var fTemp = fahrenheit;
    var fToCel = (fTemp - 32) * 5 / 9;
    return fToCel;
}

//changes the temperature displayed depening on if the user wants fahrenheit or celcius
function fTempChange() {
    if (fahrenheit == true) {
        var currTemp = parseInt(document.getElementById("temp").innerHTML, 10);
        if (!isNaN(currTemp))
        {
          savedFahr = currTemp;
          var converted = fToC(currTemp);
          document.getElementById("temp").innerHTML = Math.ceil(converted) + "°C";
        }
        fahrenheit = false;
    } else if (fahrenheit == false) {
      if (!isNaN(savedFahr)){
        document.getElementById("temp").innerHTML = savedFahr + "°F";
      }
        fahrenheit = true;
    }
}

//function that determines is the search is made using the zip code or city and state
function zipOrCity()
{
  zipStr= document.getElementById("search").value;
  cityStr=document.getElementById("searchCity").value;
  if(zipStr != "")
  {
    const reg = new RegExp("[0-9]{5}")
    if (reg.test(zipStr))
    {
      weatherBYZIP();
    } else {
      alert("Invaild Zip Code")
    }
  } else if (cityStr != ""){
    weatherByCity()
  } else {
    alert("There is no input")
  }
}

//allows the user to submit the input by pressing the enter key
document.addEventListener("keyup", function(event) {
  if (event.code === 'Enter' || event.code == 'NumpadEnter') {
      zipOrCity();
  }
});