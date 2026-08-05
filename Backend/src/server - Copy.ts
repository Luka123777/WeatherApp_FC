import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { get } from "node:http";

//#Middlewares, interfaces and variants.
const app = express();
const PORT = 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen.
app.use(cors());

// Configurar middleware para parsear JSON en las solicitudes entrantes.
app.use(express.json());

//Rate limitng para evitar el sobre-saturamiento de las peticiones.
const limiter = rateLimit({
  windowMs: 60*1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: "Too many request"
})

//interface para el cache de buscar ciudades.
interface cityData {
  ciudad: string,
  lat: string,
  lon: string
}

//Cache para almacenar respuestas temporalmente y evitar sobresaturacion.
const cityCache = new Map<string, cityData>();

// Ruta que usa Node Fetch para conectarse a otra API(Pokemon).
app.get('/api/pokemon-proxy', async (req, res): Promise<void> => {
  interface PokemonApiResponse {
    id: number,
    name: string,
    height: number,
    weight: number,
    abilities: 
    {
      ability: {
        name: string
      },
      is_hidden: boolean,
    }[]
  }

  try {
    // Tu servidor hace una petición "hacia afuera" usando fetch
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
    const data = await response.json() as PokemonApiResponse; //Interface para ts.

    //Se crea un objeto con los datos que queremos enviar al cliente.
    const pokemon = {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map(a => ({
        name: a.ability.name,
        is_hidden: a.is_hidden
      })),
    };
    // Tu servidor le responde al usuario con los datos que consiguió
    res.json(pokemon);

  } catch (error) {
    res.status(500).send('Error al conectar con la API externa de Pokemon');
  }
});

// ruta GET para buscar ciudades.
app.get('/api/buscar-ciudad', limiter, async (req, res): Promise<void> => {
  const USER_AGENT = 'MyWeatherAppByFrontedMentor/1.0 (Kalu0973153604@gmail.com)'

  try {
    //Extraemos el query string de la url.
    const nombreCiudad = req.query.nombre as string;

    //Validación por si el frontend se olvida de enviar la ciudad.
    if (!nombreCiudad) {
      res.status(400).json({ error: 'Falta el parámetro "nombre" de la ciudad' });
      return;
    }

    //Validacion si hay response en el cache.
    const key = nombreCiudad.toLowerCase().trim();

    

    const urlNominatim = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nombreCiudad)}&format=json&limit=3`;

    const response = await fetch(urlNominatim, {
      headers: {
        "User-Agent": USER_AGENT
      }
    });

    interface NominatimResult {
      display_name: string;
      lat: string;
      lon: string;
    }

    const data = await response.json() as NominatimResult[];

    //Si no hay resultados se ejecuta este if.
    if (data.length === 0) {
      res.status(404).json({ error: 'No search result found!' });
      return;
    }

    const nominatim = data.map(ciudad => ({
      ciudad: ciudad.display_name,
      lat: ciudad.lat,
      lon: ciudad.lon
    }));

    res.json(nominatim);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar con Nominatim' });
  }
});  

// Encender el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});