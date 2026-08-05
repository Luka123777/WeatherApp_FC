import '../styles/weatherData.scss';
import { ApiWeatherperHours, ApiCurrentWeather} from '../api/WeatherDate';
import { useEffect, useState } from 'react';

// interface PronosticoInterface {
//     hora: string;
//     temperatura: Float32Array | number;
//     humedad: Float32Array | number;
//     precipitacion: Float32Array | number;
//     vel_viento: Float32Array | number;
// };


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

export function WeatherData() {
    // const [pronostico, setPronostico] = useState<PronosticoInterface[]>([])

    //Variables de estado para almacenar los datos del clima actual.
    const [currentWeather, setCurrentWeather] = useState<CurrentWeatherInterface | null>(null);

    useEffect(() => {
        async function fetchCurrentWeather() {
            const currentData = await ApiCurrentWeather();
            setCurrentWeather(currentData);
        }
        fetchCurrentWeather();
    }, []);
    
    // useEffect (() =>{
    //     async function fetchWeatherData() {
    //         const data = await ApiWeatherperHours();
    //         setPronostico(data);
    //     }
    //     fetchWeatherData();
    // },[]);

    return (
        <>
            <div className='weatherData'>
                
                <h1>How's the sky looking today?</h1>
                <button onClick={() => {ApiWeatherperHours()}}>
                    Fetch Weather hourly Data
                </button>
                <button onClick={() => {ApiCurrentWeather()}}>
                    Fetch Weather current Data
                </button>

                {/* test para currentWeather usando useEffect */}
                {(currentWeather !== null) ? 
                <div>
                    <p>Latitud: {currentWeather.latitud}</p>
                    <p>Longitud: {currentWeather.longitud}</p>
                    <p>Temperatura: {currentWeather.temperatura} °C</p>
                    <p>Feels Like: {currentWeather.apparent_temperature} °C</p>
                    <p>Humidity: {currentWeather.humedad} %</p>
                    <p>Precipitation: {currentWeather.precipitacion} mm</p>
                    <p>Precipitation posibility: {currentWeather.probabilidad_precipitacion} %</p>
                    <p>Wind: {currentWeather.vel_viento} km/h</p>
                    <p>Time: {currentWeather.time.toLocaleDateString("en-EN", {day:'numeric', month: 'short', year: 'numeric', weekday: 'long'})}</p>
                    <p>Is_day: {currentWeather.is_day === 1 ? "Es de dia" : "Es de noche"}</p>
                </div> :
                <p>Loading current weather data...</p>}
                {/* {pronostico.map((data, i) => (
                    <div key={i}>
                        <p>{data.hora} , {data.temperatura} Celcius</p>
                    </div>
                ))} */}
            </div>
        </> 
    )
}