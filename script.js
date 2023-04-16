const cardWeather = document.querySelector(".card_weather");
const spinner = document.querySelector(".card_spinner");

//1/ Запрашиваем геопозицию

function findLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Ooops. Something went wrong.");
  }
}

//2/ Геопозиция разрешена

function success(position) {
  let { longitude, latitude } = position.coords; // достаем координаты

  let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;
  let API_URL_CITY = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;

  fetchData(API_URL, API_URL_CITY); // функция запроса на сервер для погоды и города
}

//2.1/ Запрос на сервер, результат работы функции обьект с данными из массива

async function fetchData(url1, url2) {
  const resWth = await fetch(url1);
  const resCity = await fetch(url2);
  const dataWth = await resWth.json();
  const dataCity = await resCity.json();

  let obj = {
    id: `${dataWth.weather[0].id}`,
    weather: `${dataWth.weather[0].description}`,
    temp: `${(dataWth.main.temp = Math.round(dataWth.main.temp - 273))}`,
    city: `${dataCity[0].name}`,
  };

  drawCard(obj);
}

// 2.2/ отрисовываем данные

function drawCard(obj) {
  spinner.style.display = "none";

  cardWeather.innerHTML = `<p class="card_temp">${obj.temp}&#8451;<p>
  <p class="card_city"><i class="owf owf-${obj.id}"></i>${obj.weather}</p>
  <p class="card_weather">in ${obj.city}</p>
  <button class="changeCity">Change city</button>`;

  // При нажатии на кнопку сменить город

  let changeCity = cardWeather.querySelector(".changeCity");
  let cardTemp = cardWeather.querySelector(".card_temp");
  let cardCity = cardWeather.querySelector(".card_city");
  let nameWeather = cardWeather.querySelector(".card_weather");

  changeCity.addEventListener("click", () =>
    toggleChange(cardTemp, cardCity, nameWeather, changeCity)
  );
}

// функция для отрисовки импута и кнопки Find

function toggleChange(a, b, c, d) {
  a.style.display = "none";
  b.style.display = "none";
  c.style.display = "none";
  d.style.display = "none";
  cardWeather.innerHTML = `<input class="input" type="text" placeholder="Type your city here" >
  <button class="find">Find</button>`;

  //Событие для поиска

  let input = cardWeather.querySelector(".input");
  input.addEventListener("change", () => {
    let value = input.value;
    let btnFind = cardWeather.querySelector(".find");
    btnFind.addEventListener("click", () => toggleFind(value));
  });
}

//Функция для поиска по городу
async function toggleFind(city) {
  console.log(city);
  let API_ID = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b582f0a6371524e7a56d1655c5abe090`;
  let resCity = await fetch(API_ID);
  if (!resCity.ok) {
    alert("Ошибка HTTP");
  } else {
    let datCity = await resCity.json();
    let latitude = datCity.coord.lat;
    let longitude = datCity.coord.lon;
    let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;
    let API_URL_CITY = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;

    fetchData(API_URL, API_URL_CITY); // Запускаем функцию отрисовки обьекта
  }
}

//3/ Геопозиция запрещена
function error() {
  let API_ID = `https://geo.ipify.org/api/v2/country,city?apiKey=at_KcJQI2DA1lJ6rZoXVbTS2AN76TZbB&ipAddress=`;
  fetchId(API_ID);
}

//3.1/ Ищем по IP координаты

async function fetchId(url) {
  let resId = await fetch(url);
  let dataId = await resId.json();
  let city = dataId.name;
  console.log(city);
  let latitude = dataId.location.lat;
  let longitude = dataId.location.lng;
  let API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;
  let API_URL_CITY = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=b582f0a6371524e7a56d1655c5abe090`;

  fetchData(API_URL, API_URL_CITY); // Запускаем функцию отрисовки обьекта
}

findLocation();
