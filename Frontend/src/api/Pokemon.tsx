import { useState } from "react";

interface abilities {
    name: string,
    is_hidden: boolean
}
interface PokemonData {
    id: number,
    name: string, 
    height: number,
    weight: number,
    abilities: abilities[]
}

export function Pokemon() {
    // Estado para guardar los datos del pokémon
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);
    // Estado para saber si está cargando
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchPokemon() {
        setLoading(true);
        try {
            // Llamamos a NUESTRO servidor proxy, no a la PokeAPI directamente
            const response = await fetch('http://localhost:3000/api/pokemon-proxy');
            const data = await response.json();

            setPokemon(data);

        }
        catch (error) {
            console.error('Error al obtener datos del Pokemon', error)
        }
        finally {
            setLoading(false);
        }
    }  

    return (
        <div className="content">
            <h2>Evitando cors con un servidor proxy</h2>
            <button onClick={()=>{fetchPokemon()}} disabled={loading}>
                {loading === true ? "Cargando datos..." : "Ver datos"}
            </button>

            {pokemon !== null ?
            <div style={{color: "white", marginTop: "20px"}}>
                <h3>El pokemon estirado por el fetch es:</h3>
                <p>Nombre: {pokemon.name.toUpperCase()}</p>
                <p>ID: {pokemon.id}</p>
                <p>Altura: {pokemon.height}</p>
                <p>Peso: {pokemon.weight}</p>
                <p>Habilidades:</p>
                <ul>
                    {pokemon.abilities.map((ability, index) => (
                        <li key={index}>
                            {ability.name} {ability.is_hidden ? "/habilidad oculta/" : "/habilidad visible/"}
                        </li>
                    ))}
                </ul>

            </div>
            : ""
            }   
        </div>
    )
};