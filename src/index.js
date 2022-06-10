// const axios = require('axios')
// require('dotenv').config()

// console.log(process.env.LOCATIONIQ_API_KEY)

let currTemp = parseInt(document.getElementById('temp-now').textContent);

const findLatAndLong = (query) => {  
  axios
    .get('https://us1.locationiq.com/v1/search.php',{
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        q: 'Charlotte, NC',
        format: 'json'
      }
    })
    .then((response) => {
      // console.log(response);
      latitude = response.data[0].lat;
      longitude = response.data[0].lon;

      let latHeader = document.getElementById('latitude');
      latHeader.textContent = latitude

      console.log(latitude);
      console.log(longitude);
    })
    .catch((error) => {
      console.log(`Error retrieving latitude and longitude for ${query}`);
    });
}

// findLatAndLong('Charlotte, NC');


const registerEventHandlers = () => {
  let submitButton = document.getElementById('submit-location');
  // submitButton.addEventListener("click", changeText);
  submitButton.addEventListener("click", updateCityName)
  
  let upArrow = document.getElementById('up-arrow');
  upArrow.addEventListener("click", incTemp);

  let downArrow = document.getElementById('down-arrow');
  downArrow.addEventListener("click", decTemp);

}

const updateTempColor = () => {
  let tempText = document.getElementsByClassName('chosen-temp')[0];
  if (currTemp < 50) {
    tempText.id = 'cold';
  }
  else if (currTemp < 60) {
    tempText.id = 'cool';
  }
  else if (currTemp < 70) {
    tempText.id = 'warm';
  }
  else if (currTemp < 80) {
    tempText.id = 'hot';
  }
  else {
    tempText.id = 'scorching';
  };
}

const realTempColor = () => {
  let tempText = document.getElementById('temp-now');
  if (parseInt(tempText.textContent) < 50) {
    tempText.id = 'cold';
  }
  else if (parseInt(tempText.textContent) < 60) {
    tempText.id = 'cool';
  }
  else if (parseInt(tempText.textContent) < 70) {
    tempText.id = 'warm';
  }
  else if (parseInt(tempText.textContent) < 80) {
    tempText.id = 'hot';
  }
  else {
    tempText.id = 'scorching';
  };
}

updateTempColor()
realTempColor()

const incTemp = () => {
  currTemp += 1;
  console.log('entered incTemp');
  let adjustableTempText = document.getElementsByClassName('chosen-temp')[0];
  adjustableTempText.textContent = `${currTemp} °F`;
  updateTempColor();
}

const decTemp = () => {
  currTemp -= 1;
  let adjustableTempText = document.getElementsByClassName('chosen-temp')[0];
  adjustableTempText.textContent = `${currTemp} °F`
  updateTempColor();
}

const updateCityName = (userInput) => {
  console.log('entered updateCityName')
  let inputVal = document.getElementById('curr-loc').value;
  console.log(inputVal)
  let cityName = document.getElementById('input-location').childNodes[5];
  cityName.textContent=inputVal
}

// console.log(document.getElementById("input-location").childNodes[2])
document.addEventListener("DOMContentLoaded", registerEventHandlers)
updateCityName("Charlotte, NC")