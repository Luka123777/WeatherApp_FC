
import { fetchWeatherApi } from "openmeteo";

//funcion para probar la API de OpenMeteo y obetener datos por horas en forma
//de un array de objetos.
export async function ApiWeatherperHours() {
    const params = {
        latitude: -25.51,
        longitude: -54.61,
        hourly: ["temperature_2m", "relative_humidity_2m", "precipitation", "wind_speed_10m"],
        timezone: "auto",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    console.log("Latitud:", response.latitude());
    console.log("Longitud:", response.longitude());
    console.log("Elevación:", response.elevation());
    console.log("UTC Offset (segundos):", response.utcOffsetSeconds());

    // Datos horarios
    const hourly = response.hourly()!;

    // Define una interfaz para los datos horarios tipando 
    // los arrays de valores como Float32Array o null.
    interface weatherDataInterface {
        time: Date[];
        temperature_2m: Float32Array | null ;
        humidity_2m: Float32Array | null;
        precipitation: Float32Array | null;
        wind_speed_10m: Float32Array | null;
    }

    // Construye un objeto con los datos horarios.
    const weatherData: weatherDataInterface = {
        time: Array.from(
        { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + response.utcOffsetSeconds()) * 1000)
        ),
        temperature_2m: ( hourly.variables(0)!.valuesArray()),
        humidity_2m: hourly.variables(1)!.valuesArray(),
        precipitation: hourly.variables(2)!.valuesArray(),
        wind_speed_10m: hourly.variables(3)!.valuesArray(),
    };

    // Imprime los datos horarios en consola.
    weatherData.time.forEach((t, i) => {
        console.log(
            `${t.toLocaleString()} → 
            Temp: ${weatherData.temperature_2m?.[i]}°C, ` +
            `Humedad: ${weatherData.humidity_2m?.[i]}%, ` +
            `Viento: ${weatherData.wind_speed_10m?.[i]} km/h, ` +
            `Precipitación: ${weatherData.precipitation?.[i]} mm`
        );
    });

    // interface pronosticoInterface {
    //     hora: string,
    //     temperatura: Float32Array | number,
    //     humedad: Float32Array | number,
    //     precipitacion: Float32Array | number,
    //     vel_viento: Float32Array | number
    // }

    // const pronostico: pronosticoInterface[] = weatherData.time.map((time, index) => ({
    //     hora: time.toLocaleString(),
    //     temperatura: Math.round(weatherData.temperature_2m![index]),
    //     humedad: Math.round(weatherData.humidity_2m![index]),
    //     precipitacion: weatherData.precipitation![index], //duda de datos mm.
    //     vel_viento: Math.round(weatherData.wind_speed_10m![index])
    // }));
    
    // console.log(pronostico);

    // return pronostico;
};

export async function ApiCurrentWeather() {
    const params = {
        latitude: -25.51,
        longitude: -54.61,
        current: ["temperature_2m", "apparent_temperature" , "precipitation" , "precipitation_probability" , "relative_humidity_2m",  "wind_speed_10m", "is_day"],
        timezone: "auto",
    }
    const url = "https://api.open-meteo.com/v1/forecast";

    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const current = response.current();

    interface CurrentWeatherInterface {
        latitud: number;
        longitud: number;
        temperatura: number;
        apparent_temperature: number;
        humedad: number;
        precipitacion:  number;
        probabilidad_precipitacion:  number;
        vel_viento: number;
        time: Date;
        is_day: number;
    };

    const currentWeather: CurrentWeatherInterface = {
        latitud: response.latitude(),
        longitud: response.longitude(),
        temperatura: Math.round(current?.variables(0)?.value() ?? 0),
        apparent_temperature: Math.round(current?.variables(1)?.value() ?? 0), 
        precipitacion: current?.variables(2)?.value() ?? 0,
        probabilidad_precipitacion: current?.variables(3)?.value() ?? 0,
        humedad: Math.round(current?.variables(4)?.value() ?? 0),
        vel_viento: Math.round(current?.variables(5)?.value() ?? 0),
        time: new Date(Number(current?.time()) * 1000),
        is_day: current?.variables(6)?.value() ?? 0,
    }

    // console.log(currentWeather);

    return currentWeather;
};
