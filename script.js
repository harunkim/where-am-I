'use strict';

let countriesContainer;

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
};

const clear = async () => {
  document.body.innerHTML = '';
  document.body.insertAdjacentHTML(
    'beforeend',
    '<main class="container">    <div class="countries"></div></main>'
  );
  document.body.insertAdjacentHTML(
    'beforeend',
    '<button class="btn-country">Where am I?</button>'
  );
  countriesContainer = document.querySelector('.countries');
  const btn = document.querySelector('.btn-country');
  btn.addEventListener('click', whereAmI);
};

const renderCountry = function (data, city = '') {
  clear();
  const header = '<h1 class = "heading-primary">Here you are!</h1>';
  const html = `
  <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>📍</span>${city}</p>
            <p class="country__row"><span>👫</span>${(
              data.population / 1000000
            ).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].code
            }</p>
          </div>
        </article>
  `;
  document.body.insertAdjacentHTML('afterbegin', header);
  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  // Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  // Reverse geocoding
  const resGeo = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  const dataGeo = await resGeo.json();
  const city = dataGeo.city;

  // Country data
  const res = await fetch(
    `https://restcountries.com/v2/name/${dataGeo.countryName}`
  );
  const data = await res.json();
  renderCountry(data[0], city);
  console.log(data[0]);
};

clear();
