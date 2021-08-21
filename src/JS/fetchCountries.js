import _ from 'lodash';
import countryTemplate from '../templates/single-country.hbs';
// ========== PNotify =========
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/Material.css';
import { defaults } from '@pnotify/core';
defaults.styling = 'material';
defaults.hide = 'true';
defaults.delay = '1000';
defaultModules.set(PNotifyMobile, {});
// =============================

const refs = {
  inputRef: document.getElementById('query-input'),
  containerRef: document.getElementById('country-continer'),
};
let inputValue;
let searchResult = [];

refs.inputRef.addEventListener('input', _.debounce(onInputTipe, 500));

function onInputTipe(e) {
  inputValue = e.target.value;
  console.log('запрос', inputValue);

  if (inputValue) {
    fetch(
      `https://restcountries.eu/rest/v2/name/${inputValue}?fields=name;capital;population;languages;flag`,
    )
      .then(responce => {
        console.log(responce);
        return responce.json();
      })
      .then(data => {
        searchResult = data;
        console.log(searchResult);
        if (searchResult.status === 404) {
          alert({
            type: 'error',
            text: 'Nothing found',
          });
        }
        refs.containerRef.innerHTML = '';
        if (searchResult.length > 10) {
          alert({
            type: 'error',
            text: 'Too many results! Refine your request',
          });
        }
        if (searchResult.length <= 10 && searchResult.length > 1) {
          const responceHtml = searchResult.map(country => `<li>${country.name}</li>`).join('');
          refs.containerRef.insertAdjacentHTML('afterbegin', responceHtml);
        }
        if (searchResult.length === 1) {
          console.log('нашли одну страну');
          console.log(searchResult);
          const markup = countryTemplate(searchResult);
          console.log(markup);
          refs.containerRef.insertAdjacentHTML('afterbegin', markup);
        }
      })
      .catch(() => {
        alert({
          type: 'error',
          text: 'Nothing found',
        });
      });
  }
}
// ========================== ДЕФОЛТНЫЙ ЭКСПОРТ ==========================
export default function fetchCountries(searchQuery) {}
console.dir(refs.inputRef);
// export default fetchCountries(searchQuery);
