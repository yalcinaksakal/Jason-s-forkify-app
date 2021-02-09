//

//
import icons from 'url:../../img/icons.svg'; //parcel 2 for static assets(img video sort of) add url:
//

///

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    this._data = data;

    const newMarkup = this._generateMarkup(); //the updated version's arkup will be this. we will compare it with current markup, find dif, change just difs.

    //-------

    const newDOM = document.createRange().createContextualFragment(newMarkup); //string to DOM object

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    //console.log(newElements);
    //console.log(currentElements);

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      //console.log('new: ', newEl, 'cur: ', curEl, newEl.isEqualNode(curEl));

      //updates changed text

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild &&
        newEl.firstChild.nodeValue.trim() !== ''
      ) {
        //console.log('📢 ', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      //updates changed attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(atr =>
          curEl.setAttribute(atr.name, atr.value)
        );
    });
  }
  renderSpinner() {
    const markup = `
              <div class="spinner">
                  <svg>
                      <use href="${icons}#icon-loader"></use>
                  </svg>
              </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  //view handling errors
  renderError(message = this._errorMessage) {
    const markup = ` 
        <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
         </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  ///succesful renders
  renderMessage(message = this._message) {
    const markup = ` 
        <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
         </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
