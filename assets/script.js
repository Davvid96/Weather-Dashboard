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

const formSubmitHandler = (event) => {
  event.preventDefault();
  const historyValue = JSON.parse(localStorage.getItem("searchHistory"));
  if (!historyValue)
    localStorage.setItem(
      "searchHistory",
      JSON.stringify([event.target.elements.cityName.value])
    );
  if (historyValue) {
    historyValue.unshift(event.target.elements.cityName.value);
    localStorage.setItem("searchHistory", JSON.stringify(historyValue));
  }
  getWeatherData(event.target.elements.cityName.value);
  setHistoryList();
};

const setTodayData = (data) => {
  const elTitle = document.querySelector("#cityTitle");
  const elTemp = document.querySelector("#cityTemp");
  const elWind = document.querySelector("#cityWind");
  const elHumidity = document.querySelector("#cityHumidity");
  const iconEl = document.createElement("img");
  iconEl.classList.add("weatherIcon");

  elTitle.textContent = `${data.name}, ${moment()
    .subtract(10, "days")
    .calendar()}`;
  iconEl.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  elTitle.appendChild(iconEl);

  elTemp.textContent = `Temp: ${data.main.temp} °C`;
  elWind.textContent = `Wind: ${data.wind.speed} kPh`;
  elHumidity.textContent = `Humidity: ${data.main.humidity}%`;
};

const setHistoryList = () => {
  const elHistoryList = document.querySelector("#history");
  const historyValue = JSON.parse(localStorage.getItem("searchHistory"));
  elHistoryList.innerHTML = "";
  if (!historyValue) return;
  historyValue.forEach((element) => {
    const historyLink = document.createElement("p");
    historyLink.textContent = element;
    elHistoryList.appendChild(historyLink);
  });
};
setHistoryList();
