import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, input, p } = hh(h);

const MSGS = {
  ADD_LOCATION: 'ADD_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
};

function addLocation(dispatch, locationName) {
  const apiKey = 'APIKEY';

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

function viewLocation(location, dispatch) {
  return div({ className: "flex items-center justify-between bg-blue-100 p-4 my-2 rounded-lg shadow-md" }, [
    p({ className: "text-lg font-semibold" }, location.name),
    p({}, `Temp: ${location.temp}`),
    p({}, `Low: ${location.low}`),
    p({}, `High: ${location.high}`),
    button({
      className: "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center",
      onclick: () => deleteLocation(dispatch, location.id)
    }, 'Delete'),
  ]);
}

function view(dispatch, model) {
  return div({ className: "max-w-2xl mx-auto mt-6" }, [
    div({ className: "flex justify-center my-4" }, [
      input({
        type: 'text',
        id: 'location-input',
        className: 'border-2 border-gray-300 bg-white h-10 px-5 rounded-lg text-sm focus:outline-none w-full max-w-xs',
        placeholder: 'Enter location...',
      }),
      button({
        className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2",
        onclick: () => {
          const locationInput = document.getElementById('location-input');
          const locationName = locationInput.value;
          if(locationName) {
            addLocation(dispatch, locationName);
          }
          locationInput.value = '';
        }
      }, 'Add')
    ]),
    div({ className: "w-full" },
      model.locations.map(location => viewLocation(location, dispatch))
    )
  ]);
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD_LOCATION:
      const { locationName, weatherData } = msg.payload;
      const newLocation = {
        id: model.nextId,
        name: locationName,
        temp: weatherData.temp,
        low: weatherData.low,
        high: weatherData.high,
      };
      return {
        ...model,
        nextId: model.nextId + 1,
        locations: model.locations.concat(newLocation)
      };
    case MSGS.DELETE_LOCATION:
      return {
        ...model,
        locations: model.locations.filter(location => location.id !== msg.payload)
      };
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
  nextId: 3,
  locations: [
    {
      id: 0,
      name: 'London',
      temp: 5,
      low: 3,
      high: 5,
    },
    {
      id: 1,
      name: 'Bangkok',
      temp: 27,
      low: 24,
      high: 28,
    },
    {
      id: 2,
      name: 'Bern',
      temp: 3,
      low: 1,
      high: 4,
    }
  ],
};

const rootNode = document.getElementById("app");

app(initModel, update, view, rootNode);
