//
//
'use strict';
//
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

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

    //0 update results view to mark selected search item.
    resultsView.update(model.getSearchResultsPage());

    //update bookmarks view to mark selected  item

    bookmarksView.update(model.state.bookmarks);

    //1 Loading Recipe
    await model.loadRecipe(id);

    //2 Rendering Recipe
    recipeView.render(model.state.recipe);
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

const controlServings = function (newServings) {
  //update recipe servings
  model.updateServings(newServings);

  //update the view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe); //render function was reloading whole recipe. we dont need this. we will update just changed parts of html
};

//Add bookmarks
const controlAddBookMark = function () {
  //if not bookmarked earlier add
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //else remove
  else model.deleteBookmark(model.state.recipe.id);

  //console.log(model.state.bookmarks);
  //recipe is bookmarked, update the view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecioe = async function (newRecipe) {
  //upload the new recipe
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //model.uploadRecipe is async function so we should await it.
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in the url pushState(state,title,url)
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

//publisher subscriber pattern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecioe);
};

init();
