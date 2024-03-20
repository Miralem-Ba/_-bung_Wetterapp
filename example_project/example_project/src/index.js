import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

const { div, button, input, p } = hh(h);

const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

const MSGS = {
  ADD_LOCATION: 'ADD_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
};

function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl" }, `My Title`),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.UPDATE_MODEL) }, "Update Model"),
    p({ className: "text-2xl" }, `Time: ${model.currentTime}`),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.UPDATE_RANDOM_NUMBER) }, "Update Random Number"),
    p({ className: "text-2xl" }, `Random Number: ${model.randomNumber}`),
  ]);
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
