const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const dt_start = parseInt(urlParams.get('dt_start'));
const city = urlParams.get('city');
const apiKey = urlParams.get('apiKey');

const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=ru&units=metric&dt=${dt_start}`;

$.getJSON(url, function (data) {
  let hourlyWeatherHTML = '';

  for (let i = 0; i < 8; i += 1) {
    hourlyWeatherHTML += buildHourlyWeatherInfo(data.list[i]);
  }

  $('#hourlyWeatherContainer').html(`
    <div class="container"> 
      ${hourlyWeatherHTML} 
    </div>
  `);
});

function buildHourlyWeatherInfo(hour) {
  const date = new Date(hour.dt * 1000).toLocaleString('ru-RU', {
    hour: 'numeric',
    minute: 'numeric'
  });

  return `
    <div class="hourlyWeatherInfo">
      <h4>${date}</h4>
      <p>Температура: ${hour.main.temp.toFixed(1)}°C</p>
      <p>Ощущается: ${hour.main.feels_like.toFixed(1)}°C</p>
      <p>Скорость ветра: ${hour.wind.speed.toFixed(1)} м/с</p>
      <p>Описание: ${hour.weather[0].description}</p>
    </div>
  `;
}