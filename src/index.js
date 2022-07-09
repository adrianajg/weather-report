// import 'regenerator-runtime/runtime';
// import axios from 'axios';

const STATE = {
  currTemp: 60,
};

let tempText = document.getElementById('temp-now');
let highTempText = document.getElementById('hi-temp');
let lowTempText = document.getElementById('low-temp');

const findLatAndLong = (query) => {
  let latitude;
  let longitude;
  console.log('entered findLatAndLong');
  axios
    .get('https://adrianajg-weather-app-api.herokuapp.com/location', {
      params: {
        q: query,
      },
    })
    .then((response) => {
      // console.log(response);
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;

      // console.log(latitude);

      let cityState = response.data[0].display_name.split(/[, ]+/);
      let city = `${cityState[0]}`;
      let state = `${cityState[3]} ${cityState[4]}`;

      // console.log(city)

      let displayCity = document.getElementById('city');
      displayCity.textContent = city;

      let displayState = document.getElementById('state');
      displayState.textContent = state;

      // console.log(latitude)

      return [latitude, longitude];
    })
    .then((response) => {
      // console.log('entered nested call')
      console.log(response);
      axios
        .get('https://adrianajg-weather-app-api.herokuapp.com/weather', {
          params: {
            lat: response[0],
            lon: response[1],
          },
        })
        .then((response) => {
          console.log(response);

          let currTempKelvin = response.data.current.temp;

          // let currTempCel = Math.round(currTempKelvin - 273.15);

          let currTempFar = convertKelvinToCelcius(currTempKelvin);

          displayRealTemp(currTempFar);

          let highTempKelvin = response.data.daily[0].temp.max;
          highTempText.textContent = convertKelvinToCelcius(highTempKelvin);

          let lowTempKelvin = response.data.daily[0].temp.min;
          lowTempText.textContent = convertKelvinToCelcius(lowTempKelvin);

          realTempColor();

          let conditions = response.data.current.weather[0].description;
          displayRealConditions(conditions);
        })
        .catch((error) => {
          console.log(error);
        });
    })
    // .then((response) => {
    //   // console.log(response);
    //   latitude = response.data[0].lat;
    //   longitude = response.data[0].lon;
    // })
    .catch((error) => {
      console.log(`Error retrieving latitude and longitude for ${query}`);
    });
};

// findLatAndLong('Charlotte, NC');

const convertKelvinToCelcius = (temp) => {
  let tempCel = Math.round(temp - 273.15);

  let tempFar = Math.round(tempCel * 1.8 + 32);

  return tempFar;
};

const displayRealTemp = (temp) => {
  tempText.textContent = `${temp} °F`;
};

const displayRealConditions = (weather) => {
  let backgroundWeather = document.getElementById('page2-conditions');

  let video = document.getElementById('bgvid-2');
  console.log('before weather');
  console.log(weather);

  if (weather.toLowerCase().includes('clouds')) {
    if (
      weather.toLowerCase().includes('scattered clouds') ||
      weather.toLowerCase().includes('few clouds') ||
      weather.toLowerCase().includes('broken clouds')
    ) {
      backgroundWeather.setAttribute('src', './assets/partly-cloudy.mp4');
    } else {
      backgroundWeather.setAttribute('src', './assets/RooftopClouds.mp4');
    }
  } else if (
    weather.toLowerCase().includes('snow') ||
    weather.toLowerCase().includes('sleet')
  ) {
    backgroundWeather.setAttribute('src', './assets/snow.mp4');
  } else if (weather.toLowerCase().includes('thunderstorm')) {
    backgroundWeather.setAttribute('src', './assets/lightning.mp4');
  } else if (
    weather.toLowerCase().includes('rain') ||
    weather.toLowerCase().includes('drizzle')
  ) {
    backgroundWeather.setAttribute('src', './assets/rain.mp4');
  } else {
    backgroundWeather.setAttribute('src', './assets/sunny.mp4');
  }

  console.log(backgroundWeather);
  video.load();
  video.play();
};

const registerEventHandlers = () => {
  let submitButton = document.getElementById('submit-location');
  submitButton.addEventListener('click', updateCityName);

  let inputBox = document.getElementById('curr-loc');
  inputBox.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      document.getElementById('submit-location').click();
    }
  });

  let upArrow = document.getElementById('up-arrow');
  upArrow.addEventListener('click', incTemp);

  let downArrow = document.getElementById('down-arrow');
  downArrow.addEventListener('click', decTemp);

  let sunnyIcon = document.getElementById('sunny');
  sunnyIcon.addEventListener('click', displayChosenSunny);

  let cloudyIcon = document.getElementById('cloudy');
  cloudyIcon.addEventListener('click', displayChosenCloudy);

  let rainIcon = document.getElementById('rain');
  rainIcon.addEventListener('click', displayChosenRain);

  let stormIcon = document.getElementById('storm');
  stormIcon.addEventListener('click', displayChosenStorm);

  let snowIcon = document.getElementById('snow');
  snowIcon.addEventListener('click', displayChosenSnow);

  let dropDownState = document.getElementById('choose-state');
  dropDownState.addEventListener('change', displayChosenState);

  let resetButton = document.getElementById('reset-location');
  resetButton.addEventListener('click', resetChosenLocation);
};

const updateCityName = () => {
  let inputVal = document.getElementById('curr-loc').value;
  findLatAndLong(inputVal);
};

const updateTempColor = () => {
  let chosenTempText = document.getElementsByClassName('chosen-temp')[0];
  let chosenTherm = document.getElementById('chosen-temp-thermometer');
  if (STATE.currTemp < 50) {
    chosenTempText.id = 'cold';
    chosenTherm.src = './assets/thermometer-icons/cold.png';
  } else if (STATE.currTemp < 60) {
    chosenTempText.id = 'cool';
    chosenTherm.src = './assets/thermometer-icons/cool.png';
  } else if (STATE.currTemp < 70) {
    chosenTempText.id = 'warm';
    chosenTherm.src = './assets/thermometer-icons/warm.png';
  } else if (STATE.currTemp < 80) {
    chosenTempText.id = 'hot';
    chosenTherm.src = './assets/thermometer-icons/hot.png';
  } else {
    chosenTempText.id = 'scorching';
    chosenTherm.src = './assets/thermometer-icons/scorching.png';
  }
};

const realTempColor = () => {
  let thermometerDisplay = document.getElementById('thermometer-image');
  console.log('entered realTempColor');
  if (parseInt(tempText.textContent) < 50) {
    tempText.id = 'cold';
    thermometerDisplay.src = './assets/thermometer-icons/cold.png';
  } else if (parseInt(tempText.textContent) < 60) {
    tempText.id = 'cool';
    thermometerDisplay.src = './assets/thermometer-icons/cool.png';
  } else if (parseInt(tempText.textContent) < 70) {
    tempText.id = 'warm';
    thermometerDisplay.src = './assets/thermometer-icons/warm.png';
  } else if (parseInt(tempText.textContent) < 80) {
    tempText.id = 'hot';
    thermometerDisplay.src = './assets/thermometer-icons/hot.png';
  } else {
    tempText.id = 'scorching';
    thermometerDisplay.src = './assets/thermometer-icons/scorching.png';
  }
};

findLatAndLong('Charlotte, NC');
updateTempColor();
realTempColor();

const incTemp = () => {
  STATE.currTemp += 1;
  console.log('entered incTemp');
  let adjustableTempText = document.getElementsByClassName('chosen-temp')[0];
  adjustableTempText.textContent = `${STATE.currTemp} °F`;
  updateTempColor();
};

const decTemp = () => {
  STATE.currTemp -= 1;
  let adjustableTempText = document.getElementsByClassName('chosen-temp')[0];
  adjustableTempText.textContent = `${STATE.currTemp} °F`;
  updateTempColor();
};

// Display chosen city and state name

const displayChosenCity = (input) => {
  console.log('entered displayChosenCity');
  console.log(input);
  let displayCity = document.getElementById('display-chosen-city-state');
  displayCity.textContent = input;
};

const displayChosenState = () => {
  console.log('entered displayChosenState');
  let chosenState = document.getElementById('display-chosen-state');
  let selectState = document.getElementById('choose-state');

  chosenState.textContent = selectState.value;
};

const resetChosenLocation = () => {
  let chosenState = document.getElementById('display-chosen-state');
  chosenState.textContent = 'North Carolina';

  let chosenCity = document.getElementById('display-chosen-city-state');
  chosenCity.textContent = 'Charlotte';
};

// Display weather for chosen weather

const displayChosenSunny = () => {
  console.log('entered displayChosenSunny');
  let backgroundChosenWeather = document.getElementById('page3-conditions');
  let video = document.getElementById('bgvid-3');

  backgroundChosenWeather.setAttribute('src', './assets/sunny.mp4');

  video.load();
  video.play();
};

const displayChosenCloudy = () => {
  let backgroundChosenWeather = document.getElementById('page3-conditions');
  let video = document.getElementById('bgvid-3');

  backgroundChosenWeather.setAttribute('src', './assets/partly-cloudy.mp4');

  video.load();
  video.play();
};

const displayChosenRain = () => {
  let backgroundChosenWeather = document.getElementById('page3-conditions');
  let video = document.getElementById('bgvid-3');

  backgroundChosenWeather.setAttribute('src', './assets/rain.mp4');

  video.load();
  video.play();
};

const displayChosenStorm = () => {
  let backgroundChosenWeather = document.getElementById('page3-conditions');
  let video = document.getElementById('bgvid-3');

  backgroundChosenWeather.setAttribute('src', './assets/Lightning.mp4');

  video.load();
  video.play();
};

const displayChosenSnow = () => {
  let backgroundChosenWeather = document.getElementById('page3-conditions');
  let video = document.getElementById('bgvid-3');

  backgroundChosenWeather.setAttribute('src', './assets/snow.mp4');

  video.load();
  video.play();
};

// console.log(document.getElementById("input-location").childNodes[2])
document.addEventListener('DOMContentLoaded', registerEventHandlers);
// updateCityName('Charlotte, NC');
