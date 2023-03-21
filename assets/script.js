const getWeatherData = (cityName) => {
  const APIKey = "7584014eedbf10b7da56d715314a7e9b";
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setTodayData(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getForecastData = (cityName) => {
  const APIKey = "7584014eedbf10b7da56d715314a7e9b";
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}&units=metric`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setForecastData(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const getHistory = (key) => {
  const historyValue = JSON.parse(localStorage.getItem(key));
  if (!historyValue) return [];
  return historyValue;
};

const setHistory = (key, value) => {
  const historySet = new Set(value);
  const historyArray = Array.from(historySet);
  if (historyArray.length > 10) historyArray.length = 10;
  localStorage.setItem(key, JSON.stringify(historyArray));
};

const formSubmitHandler = (event) => {
  event.preventDefault();
  const historyValue = getHistory("searchHistory");
  if (!historyValue)
    setHistory("searchHistory", [event.target.elements.cityName.value]);
  if (historyValue) {
    historyValue.unshift(event.target.elements.cityName.value);
    setHistory("searchHistory", historyValue);
  }
  getWeatherData(event.target.elements.cityName.value);
  getForecastData(event.target.elements.cityName.value);
  setHistoryList();
};

const setTodayData = (data) => {
  const elTitle = document.querySelector("#cityTitle");
  const elTemp = document.querySelector("#cityTemp");
  const elWind = document.querySelector("#cityWind");
  const elHumidity = document.querySelector("#cityHumidity");
  const iconEl = document.createElement("img");
  iconEl.classList.add("weatherIcon");

  elTitle.textContent = `${data.name}, ${moment().calendar()}`;
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  elTitle.appendChild(iconEl);

  elTemp.textContent = `Temp: ${data.main.temp} °C`;
  elWind.textContent = `Wind: ${data.wind.speed} kPh`;
  elHumidity.textContent = `Humidity: ${data.main.humidity}%`;
};

document.querySelector("#history").addEventListener("click", (event) => {
  if (event.target.nodeName !== "P") return;
  const historyValue = getHistory("searchHistory");
  historyValue.unshift(event.target.textContent);
  setHistory("searchHistory", historyValue);
  getWeatherData(event.target.textContent);
  getForecastData(event.target.textContent);
  setHistoryList();
});

const setHistoryList = () => {
  const elHistoryList = document.querySelector("#history");
  const historyValue = getHistory("searchHistory");
  elHistoryList.innerHTML = "";
  if (!historyValue) return;
  historyValue.forEach((element) => {
    const historyLink = document.createElement("p");
    historyLink.classList.add("historyLink");
    historyLink.textContent = element;
    elHistoryList.appendChild(historyLink);
  });
};
setHistoryList();

const setForecastData = (data) => {
  const filteredData = [
    data.list[8],
    data.list[16],
    data.list[24],
    data.list[32],
    data.list[39],
  ];
  console.log(filteredData);
  const elForecast = document.querySelector("#forecast");
  elForecast.innerHTML = "";
  filteredData.forEach((forecast) => {
    const cardEl = document.createElement("div");
    const dateEl = document.createElement("p");
    const iconEl = document.createElement("img");
    const tempEl = document.createElement("p");
    const windEl = document.createElement("p");
    const humidityEl = document.createElement("p");

    cardEl.classList.add("forecast-card");
    dateEl.textContent = `Date: ${forecast.dt_txt.split(" ")[0]}`;
    iconEl.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`
    );
    tempEl.textContent = `Temp: ${forecast.main.temp} °C`;
    windEl.textContent = `Wind: ${forecast.wind.speed} kPh`;
    humidityEl.textContent = `Humidity: ${forecast.main.humidity}%`;

    cardEl.appendChild(dateEl);
    cardEl.appendChild(iconEl);
    cardEl.appendChild(tempEl);
    cardEl.appendChild(windEl);
    cardEl.appendChild(humidityEl);

    elForecast.appendChild(cardEl);
  });
};
