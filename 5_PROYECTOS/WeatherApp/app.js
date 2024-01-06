import axios from 'axios';
import chalk from 'chalk';

const API_KEY = "504cb0f0ec5f16ae90335500520b369a";

const mostrarClima = (ciudad, weatherData) => {
  console.log(chalk.yellow.bold(`\nInformación del clima: ${ciudad}:`));
  console.log(
    chalk.yellow.bold(
      "☀️🌙❄️🌡️💧🌈🌪️🌧️☀️🌙❄️🌡️💧🌈🌪️🌧️☀️🌙❄️🌡️💧🌈🌪️🌧️☀️🌙❄️🌡️💧🌈🌪️🌧️"
    )
  );
  console.log(chalk.cyan("Descripción:"), weatherData.weather[0].description);
  console.log(chalk.cyan("Temperatura:"), `${weatherData.main.temp} °C`);
  console.log(chalk.cyan("Humedad:"), `${weatherData.main.humidity}%`);
  console.log(
    chalk.cyan("Velocidad del Viento:"),
    `${weatherData.wind.speed} m/s`
  );
  console.log(
    chalk.yellow("☀️🌙❄️🌡️💧🌈🌪️🌧️☀️🌙❄️🌡️💧🌈🌪️🌧️☀️🌙❄️🌡️💧🌈🌪️🌧️\n")
  );
};

const manejarError = (error) => {
  console.log(chalk.red.bold("Error: "), error.message);
  process.exit(1);
};


const obtenerInfo = async (ciudad) => {
  try {
    let endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}`;
    const respuesta = await axios.get(endpoint, {
      parametros: {
        q: ciudad,
        appid: API_KEY,
        units: "metric"
      }
    });

    // console.log(respuesta);
    return respuesta.data

  } catch (error) {
    console.log(chalk.red(error));
    throw new Error(`No es posible obtener la informacion de ${ciudad}`)
  }
};

const obtenerDatos = () => {
  let ciudad = process.argv[2];

  if (!ciudad) {
    console.log(chalk.red.bold("Por favor ingrese un nombre de una ciudad"));
    console.log(chalk.yellow.bold("Ejecuta el siguiente comando: node app.js [nombre ciudad]"));
  }
  obtenerInfo(ciudad)
    .then((weatherData) => mostrarClima(ciudad, weatherData))
    .catch(manejarError);
};


obtenerDatos();
  