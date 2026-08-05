import { useState } from "react";
import SearchIcon from '../assets/images/icon-search.svg'
import { useEffect, useRef } from "react";
import { useResultDropdown } from "../animations/Animations";
import '../styles/Search.scss';

interface CityInterface {
    ciudad: string,
    lat: string,
    lon: string
};

export function SearchCity() {
    //Variable para almacenar el valor del input de búsqueda.
    const [resultado, setResultado] = useState<CityInterface[] | null>(null);
    //Variable para almacenar el valor del input de búsqueda.
    const [busqueda, setBusqueda] = useState<string>("");
    //Variable para avisar si hay errores en la búsqueda.
    const [error, setError] = useState<string | null>(null);

    const [lat, setLat] = useState<string | null>(null);
    const [lon, setLon] = useState<string | null>(null);

    const resultsRef = useRef<HTMLDivElement>(null);
    const timelineRef = useResultDropdown(resultsRef);

    //Atajo para acceder a la timeline del hook useResultDropdown.
    const tl = timelineRef.current;

    async function handleSearch(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        //Si el input está vacío, se cancela la funcion y se limpia el resultado. 
        if(!busqueda.trim()) {
            setError(''); 
            setResultado(null);
            tl?.reverse();
            return;
        }

        setError(null);

        try {
            const url = `http://localhost:3000/api/buscar-ciudad?nombre=${encodeURIComponent(busqueda)}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error de busqueda');
            }
            setResultado(data);
            
            if(data && data.length > 0) {
                tl?.play();
            } else {
                tl?.reverse();
                console.log('reversed')
            }
          
        } catch (error: unknown) {
            //Si el error es un tipo de Error, se establece el mensaje de error en el estado.
            if (error instanceof Error){
                setError(error.message);
            } else{
                setError('Error desconocido');
            }

            setResultado(null);
        }
    };
    
    function getLatLon( latitud: string, longitud: string) {
        setResultado(null);
        setBusqueda('');
        tl?.reverse();
        setLat(latitud);
        setLon(longitud);
    };

    //Ejecuta cada vez que lat y lon cambian de valor y se muestra en consola.
    useEffect(() => {
        console.log(lat, lon)
    }, [lat, lon]);
    
    return (
        <>
            <div className="SearchCityContent">
                <form className="formContent" onSubmit={handleSearch}>
                    <div className="searchContent">
                        <div className="inputContent">
                            <img src={SearchIcon} alt="SeachIcon" />
                            <input type="text" value={busqueda} onChange={(e) => {setBusqueda(e.target.value)}} placeholder="Search some place..."/>
                            {/* Contenedor de resultado position abosulte */}
                            <div className="resultsContent" ref={resultsRef}>
                                {resultado && (
                                    resultado.map((ciudad, index) => (
                                        <button  onClick={()=>{getLatLon(ciudad.lat, ciudad.lon);}} key={index} className="result">
                                            <p>{ciudad.ciudad}</p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                        <button className="searchButton" type="submit">
                            Search
                        </button>
                    </div>
                </form>
                {/* Pasar esta variable a otros componentes para condicionar
                si va a salir un error o no. */}
                {error && <h2 className="fetchError">{error}</h2>}
            </div>
        </>
    )
};