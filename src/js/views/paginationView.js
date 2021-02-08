//

//
import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2 for static assets(img video sort of) add url:
//

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //Publisher subscriber pattern's publisher function
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      //guard clause
      if (!btn) return;
      const gotoPage = +btn.dataset.goto; //string to number

      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currenPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //At page 1 and there are other pages

    if (currenPage === 1 && numPages > 1) {
      return `<button data-goto="${
        currenPage + 1
      } " class="btn--inline pagination__btn--next">
      <span>Page ${currenPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }

    //Last page

    if (currenPage === numPages && numPages > 1) {
      return `<button data-goto="${
        currenPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currenPage - 1}</span>
    </button>
   `;
    }
    //other page
    if (currenPage < numPages) {
      return `<button data-goto="${
        currenPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currenPage - 1}</span>
    </button>
    <button data-goto="${
      currenPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currenPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
   `;
    }
    //page 1 and no other pages
    return '';
  }
}

export default new PaginationView();
