const apiKey = '4162461887360bfbbaff0ec128ea078f';
const city = 'Вязьма,ru';
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=ru&units=metric`;

$.getJSON(url, function (data) {
  let currentDate = '';
  let weatherForecast = '';
  let currentMaxTemp = Number.MIN_VALUE;
  let currentSumTemp = 0;
  let tempsCount = 0;

  const weatherIcons = {
    'ясно': 'data/images/sunny_icon.png',
    'переменная облачность': 'data/images/cloudy_icon.png',
    'облачно с прояснениями': 'data/images/cloudy_icon.png',
    'пасмурно': 'data/images/partly_cloudy.png',
    'небольшая облачность': 'data/images/overcast_icon.png',
    'дождь': 'data/images/rainy_icon.png',
    'небольшой дождь': 'data/images/rainy_icon.png',
    'снег': 'data/images/snowy_icon.png',
    // и т.д.
  };

  data.list.forEach((day, index) => {
    const date = new Date(day.dt * 1000).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });

    if (date === currentDate) {
      if (day.main.temp > currentMaxTemp) {
        currentMaxTemp = day.main.temp;
      }
      currentSumTemp += day.main.temp;
      tempsCount++;
    } else {
      if (currentDate !== '') {
        const avgTemp = currentSumTemp / tempsCount;
        weatherForecast += buildWeatherForecast(currentDate, currentMaxTemp, avgTemp, day, weatherIcons);
      }

      currentDate = date;
      currentMaxTemp = day.main.temp;
      currentSumTemp = day.main.temp;
      tempsCount = 1;
    }

    // Добавляем последний день
    if (index === data.list.length - 1) {
      const avgTemp = currentSumTemp / tempsCount;
      weatherForecast += buildWeatherForecast(currentDate, currentMaxTemp, avgTemp, day, weatherIcons);
    }
  });

  $('#weatherForecast').html(weatherForecast);
  
  $(".weatherDay").hover(
    function() {
      $(this).animate({ fontSize: "16px" }, 200);
    },
    function() {
      $(this).animate({ fontSize: "14px" }, 200);
    }
  );

  $(".weatherDay").click(function() {
    const dt_start = $(this).data("dt_start");
    const newWindow = window.open(
      `hourlyWeather.html?city=${encodeURIComponent(city)}&apiKey=${encodeURIComponent(apiKey)}&dt_start=${dt_start}`,
      "_blank"
    );
    newWindow.focus();
  });
});



function buildWeatherForecast(date, maxTemp, avgTemp, day, weatherIcons) {
  const iconPath = weatherIcons[day.weather[0].description.toLowerCase()];
  const iconHtml = iconPath ? `<img src="${iconPath}" alt="${day.weather[0].description}">` : '';

  return `
    <div class="weatherDay" data-dt_start="${day.dt}">
      <h3>${date}</h3>
      ${iconHtml}
      <p>Максимальная температура: ${maxTemp.toFixed(1)}°C</p>
      <p>Средняя температура: ${avgTemp.toFixed(1)}°C</p>
      <p>Ощущается: ${day.main.feels_like.toFixed(1)}°C</p>
      <p>Скорость ветра: ${day.wind.speed.toFixed(1)} м/с</p>
      <p>Описание: ${day.weather[0].description}</p>
    </div>
  `;
}