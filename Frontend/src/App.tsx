import './styles/app.scss';
import { Header } from './components/header';
// import { WeatherData } from './components/weatherData';
// import {Pokemon} from "./api/Pokemon";
import { SearchCity } from './components/SearchCity';

function App() {

  return (
    <>
      <div className='content'>
        <Header></Header>
        <h1 className='Title'>How's the sky looking today?</h1>
        <SearchCity/>
        {/* <WeatherData></WeatherData> */}
        {/* <Pokemon></Pokemon> */}
        
      </div>
    </>
  )
}

export default App
