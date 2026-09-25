import './styles/app.scss';
import { Header } from './components/header';
import IconError from './assets/images/icon-error.svg';
import IconRetry from './assets/images/icon-retry.svg';
// import { WeatherData } from './components/weatherData';
// import {Pokemon} from "./api/Pokemon";
import { SearchCity } from './components/SearchCity';
import { useState, useEffect } from 'react';

function App() {
  // Variables que condicionan la renderización de los componentes.
  // Se envian como props a SearchCity para que pueda modificar su valor.
  const [error, setError] = useState<string | null>(null);

  //Variable para condicionar si el server esta corriendo o no.
  //Se envia como props a SearchCity para que pueda modificar su valor.
  const [active, setActive] = useState<boolean>(false);

  const [lat, setLat] = useState<number | null>(52.5173885 );
  const [lon, setLon] = useState<number | null>(13.3951309);
  
    //Funcion para verificar si el server esta activo.
    //Devueve una promesa que se resuelve en un booleano.
    async function IsServerActive(): Promise<boolean> {
      const url = `http://localhost:3000/api/health`;

      try{
        const response = await fetch(url);

        return response.ok

      } catch{
        return false
      }
    }

  // useEffect para verificar si el server esta activo al cargar la pagina.
  useEffect(()=>{
    IsServerActive().then((serverStatus) => {
      setActive(serverStatus);
    })
  },[]);

  //Funcion para verificar si el server esta activo al hacer click en el boton de retry.
  async function handleCheckServer() {
    const serverStatus = await IsServerActive();
    setActive(serverStatus);
  }

  return (
    <>
      <div className='content'>
        <Header></Header>
        {active ? 
        <div className='APIsuccess'>
          <h1 className='Title'>How's the sky looking today?</h1>
          <SearchCity props={{error, setError, setActive, lat, lon, setLat, setLon}}/>
        </div> : 
        <div className='APIerror'>
          <img className='ApiErrorImg' src={IconError} alt="IconError" />
          <h1>Something went wrong</h1>
          <p>We couldn't connect to the server (API error). Please try again in a few moments.</p>
          <button onClick={()=>{handleCheckServer()}}><img src={IconRetry} alt="Icon Retry" /> Retry</button>
        </div>}

        {/* <WeatherData></WeatherData> */}
        {/* <Pokemon></Pokemon> */}  
      </div>
    </>
  )
}

export default App
