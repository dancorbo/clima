// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona los elementos del DOM
  const dateTime = document.querySelector(".date-time");
  const button = document.querySelector(".search");
  const input = document.querySelector(".search-weather");
  const card1 = document.querySelector(".card-1");
  const card2 = document.querySelector(".card-2");

  // Función para obtener y mostrar la fecha y hora actual
  const getDateTime = (widget) => {
    const dateTime = new Date();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();
    const dayList = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedDay = dayList[dateTime.getDay()];
    const formattedDate = date < 10 ? `0${date}` : date;
    const formattedMonth = month < 10 ? `0${month}` : month;
    widget.innerHTML = `
        <p class="time">
            ${formattedHours}:${formattedMinutes}:${formattedSeconds}
        </p>
        <p class="date">
            ${formattedDay} ${formattedDate}/${formattedMonth}/${year}
        </p>`;
  };

  // Inicializa la hora y fecha y actualiza cada segundo
  getDateTime(dateTime);
  setInterval(() => {
    getDateTime(dateTime);
  }, 1000);

  // Función para obtener datos del clima de la API
  const getWeather = async (city) => {
    const keyCode = "63da5e52930472d1a9cca33fdc8207af";
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${keyCode}&lang=es`
      );
      if (!response.ok) {
        throw new Error("Error en la obtención de datos.");
      }
      return await response.json();
    } catch (error) {
      console.error(`Ha ocurrido un error inesperado: ${error}`);
    }
  };

  // Función para obtener el icono del clima
  const getIcon = async (data) => {
    try {
      if (!data.weather[0]?.icon) {
        return 'https://i.pinimg.com/originals/0e/c3/68/0ec368d72828dc9509c66b7600a86ed7.gif';
      } else {
        return `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      }
    } catch (error) {
      console.error(`Error al obtener el icono: ${error}`);
      return 'https://i.pinimg.com/originals/0e/c3/68/0ec368d72828dc9509c66b7600a86ed7.gif';
    }
  };

  // Función para mostrar los datos del clima en las tarjetas
  const getData = async (card1, card2, inputElement) => {
    let city = inputElement.value.trim();
    if (!city) {
      card1.innerHTML = "<p>Por favor ingresa el nombre de una ciudad.</p>";
      card2.style.display = 'none';
      return;
    }
    try {
      let data = await getWeather(city);
      let icon = await getIcon(data);
      let temperature = data.main.temp - 273.15;
      let description = data.weather[0].description;
      let descriptionCapitalize = description.charAt(0).toUpperCase() + description.slice(1).toLowerCase();
      let sensation = data.main.feels_like - 273.15;
      let visibility = Math.sqrt(data.visibility);
      if (data) {
        card1.innerHTML = `
          <h3>Ciudad</h3>
          <p>${data.name} - ${data.sys.country}</p>
          <img src="${icon}" class="icon-weather" alt="Icono del clima"></img>
          <p>${Math.round(temperature)}°C</p>
          <p>${descriptionCapitalize}</p>`;
        card2.innerHTML = `
          <p>Sensación térmica</p>
          <p>${Math.round(sensation)}°C</p>
          <p>Velocidad del viento</p>
          <p>${Math.round(data.wind.speed)} km/h</p>
          <p>Humedad</p>
          <p>${data.main.humidity}%</p>
          <p>Visibilidad</p>
          <p>${Math.round(visibility)}%</p>`;
        card2.style.display = 'block';
      } else {
        card1.innerHTML = "<p>No se pudieron obtener los datos del clima.</p>";
        card2.style.display = 'none';
      }
    } catch (error) {
      console.error(`Error al obtener los datos: \n${error}.
        Por favor ingresa una ciudad válida.`);
      card1.innerHTML = `
      <p>Error al obtener los datos: </p>
      <p>Por favor ingresa una ciudad válida.</p>`;
      card2.style.display = 'none';
    }
  };

  // Event listener para la búsqueda por teclado y clic en botón
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      getData(card1, card2, input);
    }
  });
  button.addEventListener("click", () => {
    getData(card1, card2, input);
  });
});
