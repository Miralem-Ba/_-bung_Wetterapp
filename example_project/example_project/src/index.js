import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, input, p } = hh(h);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

const MSGS = {
  ADD_LOCATION: 'ADD_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
};

function addLocation(dispatch, locationName) {

  const apiKey = '5fa0f9177f62b229b77edbf0e3aa184c';

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }
      return response.json();
    })
    .then(data => {

      const weatherData = {
        temp: data.main.temp, 
        low: data.main.temp_min, 
        high: data.main.temp_max, 
      };

      dispatch({ type: MSGS.ADD_LOCATION, payload: { locationName, weatherData } });
    })
    .catch(error => {
      console.error('Error fetching weather:', error);

    });
}

function deleteLocation(dispatch, locationId) {
  dispatch({ type: MSGS.DELETE_LOCATION, payload: locationId });
}

function update(msg, model) {
  switch (msg) {
    case MSGS.UPDATE_MODEL:
      return { ...model, currentTime: new Date().toLocaleTimeString() };

    case MSGS.UPDATE_RANDOM_NUMBER:
      return { ...model, randomNumber: Math.random() };
    default:
      return model;
  }
}


function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const initModel = {
  currentTime: new Date().toLocaleTimeString(),
  randomNumber: 1,
};


const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);
