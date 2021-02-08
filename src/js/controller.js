//
//
'use strict';
//

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; //for pollyfilling core-js
import 'regenerator-runtime/runtime'; //for pollyfilling async await

//for parcer, when using modules, use this
//if (module.hot) {
//  module.hot.accept();
//}

// //Publisher subscriber pattern's subscriber function
const controlRecipes = async function () {
  try {
    //3 hash change
    const id = window.location.hash.slice(1);

    //guard clause
    if (!id) return;

    recipeView.renderSpinner();

    //1 Loading Recipe
    await model.loadRecipe(id);

    //2 Rendering Recipe
    recipeView.render(model.state.recipe);
    // import icons so that build version will able to find it in dist
    // rotating icon while async function awaits response
    //renderSpinner
  } catch (err) {
    recipeView.renderError();
  }
};

// //Publisher subscriber pattern's subscriber function
//getting search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1 get search query
    const query = searchView.getQuery();

    //guard clasue
    if (!query) return;

    //2 Load search results
    await model.loadSearchResults(query);

    //3 Render results
    //resultsView.render(model.state.search.results); //al results
    resultsView.render(model.getSearchResultsPage()); //pagination

    //4 initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// //Publisher subscriber pattern's subscriber function
const controlPagination = function (gotoPage) {
  //3 Render new page results

  resultsView.render(model.getSearchResultsPage(gotoPage)); //pagination

  //4 new pagination buttons
  paginationView.render(model.state.search);
};

//publisher subscriber pattern
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
};

init();
