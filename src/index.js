// const axios = require('axios')
// require('dotenv').config()

// const { default: axios } = require("axios");

// console.log(document.getElementById('curr-loc'));

// console.log(process.env.LOCATIONIQ_KEY)

// let currTemp = parseInt(document.getElementById('temp-now').textContent);

const STATE = {
  currTemp: 60,
}

let tempText = document.getElementById('temp-now');
let highTempText = document.getElementById('hi-temp');
let lowTempText = document.getElementById('low-temp');

const findLatAndLong = (query) => {
  let latitude;
  let longitude;
  console.log('entered findLatAndLong');
  axios
    .get('http://127.0.0.1:5000/location', {
      params: {
        q: query,
      },
    })
    .then((response) => {
      console.log(response);
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;

      console.log(latitude);

      let cityState = response.data[0].display_name.split(/[, ]+/);
      let city = `${cityState[0]}`;
      let state = `${cityState[3]} ${cityState[4]}`;

      // console.log(city)

      let displayCity = document.getElementById('city');
      displayCity.textContent = city;

      let displayState = document.getElementById('state');
      displayState.textContent = state;

      console.log(latitude)

      return [latitude, longitude];
    })
    .then((response) => {
      // console.log('entered nested call')
      console.log(response);
      axios
        .get('http://127.0.0.1:5000/weather', {
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

        })
        .catch((error) => {
          console.log(error);
        });
    })
    .then((response) => {
      console.log(response);
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;
    })
    .catch((error) => {
      console.log(`Error retrieving latitude and longitude for ${query}`);
    });
};

// findLatAndLong('Charlotte, NC');

const convertKelvinToCelcius = (temp) => {
  let tempCel = Math.round(temp - 273.15);

  let tempFar = Math.round(tempCel * 1.8 + 32);

  return tempFar;
}

const displayRealTemp = (temp) => {
  tempText.textContent = `${temp} °F`;
}

const displayHighTemp = (temp) => {
  
}

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
};

const updateCityName = (userInput) => {
  let inputVal = document.getElementById('curr-loc').value;

  findLatAndLong(inputVal);
};

const updateTempColor = () => {
  let tempText = document.getElementsByClassName('chosen-temp')[0];
  if (STATE.currTemp < 50) {
    tempText.id = 'cold';
  } else if (STATE.currTemp < 60) {
    tempText.id = 'cool';
  } else if (STATE.currTemp < 70) {
    tempText.id = 'warm';
  } else if (STATE.currTemp < 80) {
    tempText.id = 'hot';
  } else {
    tempText.id = 'scorching';
  }
};

const realTempColor = () => {
  // let tempText = document.getElementById('temp-now');
  console.log('entered realTempColor');
  if (parseInt(tempText.textContent) < 50) {
    tempText.id = 'cold';
  } else if (parseInt(tempText.textContent) < 60) {
    tempText.id = 'cool';
  } else if (parseInt(tempText.textContent) < 70) {
    tempText.id = 'warm';
  } else if (parseInt(tempText.textContent) < 80) {
    tempText.id = 'hot';
  } else {
    tempText.id = 'scorching';
  }
};

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

// console.log(document.getElementById("input-location").childNodes[2])
document.addEventListener('DOMContentLoaded', registerEventHandlers);
// updateCityName('Charlotte, NC');
