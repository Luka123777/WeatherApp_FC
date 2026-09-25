import React, { useState } from "react";
import SearchIcon from '../assets/images/icon-search.svg'
import { useEffect, useRef } from "react";
import { useResultDropdown } from "../animations/Animations";
import '../styles/Search.scss';

interface CityInterface {
    ciudad: string,
    lat: number,
    lon: number
};

//Variables que vienen de App.tsx.
interface SearchCityProps {
    props: {
        error: string | null;
        setError: React.Dispatch<React.SetStateAction<string | null>>;
        setActive: React.Dispatch<React.SetStateAction<boolean>>;
        lat: number | null;
        lon: number | null;
        setLat: React.Dispatch<React.SetStateAction<number | null>>;
        setLon: React.Dispatch<React.SetStateAction<number | null>>;
    }
}

export function SearchCity({props}: SearchCityProps) {
    const {error, setError, setActive, lat, lon, setLat, setLon } = props;

    //Variable para almacenar el valor del input de búsqueda.
    const [resultado, setResultado] = useState<CityInterface[] | null>(null);
    //Variable para almacenar el valor del input de búsqueda.
    const [busqueda, setBusqueda] = useState<string>("");
    //Variable para avisar si hay errores en la búsqueda.

    const resultsRef = useRef<HTMLDivElement>(null);
    const timelineRef = useResultDropdown(resultsRef);

    //Atajo para acceder a la timeline del hook useResultDropdown.
    const tl = timelineRef.current;

    async function handleSearch(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        //Si el input está vacío, se cancela la funcion y se limpia el resultado. 
        if(!busqueda.trim()) {
            setError(null); 
            setResultado(null);
            tl?.reverse();
            return;
        }

        //Verifica si el server esta activo antes de hacer la busqueda.
        const serverStatus = await CheckServerStatus();
        if(!serverStatus){
            return
        };

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
                tl?.reverse();
            } else{
                setError('Error desconocido');
            }

            setResultado(null);
        }
    };
    
    function getLatLon( latitud: number, longitud: number) {
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

    //Devuelve una promesa que se resuelve en un booleano indicando
    //si el servidor está activo o no.
    async function IsServerActive(): Promise<boolean> {
        const url = 'http://localhost:3000/api/health';

        try{
            const response = await fetch(url);
            return response.ok;

        } catch{
            return false;
        }
    }

    //Maneja la promesa de IsServerActive y actualiza el estado de 
    //active en App.tsx.
    async function CheckServerStatus() {
        const serverStatus = await IsServerActive();
        setActive(serverStatus);

        return serverStatus;
    }
    
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
                {/* CONDICIONAR RESULTADOS TOMANDO EN CUENTA ERROR Y ACTIVE,
                PROBABLEMENTE LA MEJOR OPCION SERIA CONDICIONAR EN APP.TSX */}
                {error && (
                    <h1 className="fetchError">{error}</h1>
                )}
            </div>
        </>
    )
};