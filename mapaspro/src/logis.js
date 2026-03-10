import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet'; //Esto es para crear iconos personalizados
import 'leaflet/dist/leaflet.css';

// PARAMETROS
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjhjYTlmNzM5MzgwNjQ3MmQ5MDk5ZDhiN2FjNzkxOGU1IiwiaCI6Im11cm11cjY0In0='; //API KEY de OpenrouteService
const STORE_LOCATION = { lat: 4.592559266370295, lng: -74.12416276308306 }; // Lugar tienda Nako Store
const carroURL = '/image/moto.png'; // route al icono de vehículo
const casaURL = '/image/casa.png';   // route al icono de casa
const multiVelocidad = 50; // Acelera la animación

// PARTE DE CREACION DE ICONOS
let iconoCarro;
try {
  iconoCarro = new L.Icon({
    iconUrl: carroURL,
    iconSize: [35, 35],
    iconAnchor: [17, 17], // Centro del icono
  });
} catch (e) {
  console.error("Error creando iconoCarro:", e);
  iconoCarro = new L.Icon.Default(); // Fallback
}

let houseIcon;
try {
  houseIcon = new L.Icon({
    iconUrl: casaURL,
    iconSize: [30, 30],       
    iconAnchor: [15, 30],    
    popupAnchor: [0, -30]
  });
} catch (e) {
  console.error("Error creando houseIcon:", e);
  houseIcon = new L.Icon.Default(); // Fallback
}

//  Componente Principal de Logistica
export default function LogisticaTabContent() {
    //Se guardan las ordenes y estados
  const [orders, setOrders] = useState([]);
  // Se guardan las coordenadas de la route
  const [routeCoordinates, setrouteCoordinates] = useState([]);
  //Se guarda la posicion del vehiculo
  const [vehiclePosition, setVehiclePosition] = useState(STORE_LOCATION || { lat: 0, lng: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Se guarda la duracion total de la route
  const [totalDuration, setTotalDuration] = useState(0);

  const animationFrameId = useRef(null);
  const startTimeRef = useRef(null);
  const mapRef = useRef(null);

  //  Función para cargar pedidos
  const loadOrders = () => {
    try {//Lee el JsON del localStorage y filtra los pedidos con ubicacion valida
      const savedOrders = JSON.parse(localStorage.getItem('NakoStoreOrders')) || [];
      const ordersWithValidLocation = savedOrders.filter(order =>
          order.location &&
          typeof order.location.latitude === 'number' && !isNaN(order.location.latitude) &&
          typeof order.location.longitude === 'number' && !isNaN(order.location.longitude)
      );
      // Actualiza el estado solo con pedidos que tienen ubicación válida y atiende los mas cercanos primero
      setOrders(ordersWithValidLocation.reverse());
    } catch (e) {
        console.error("Error cargando o parseando pedidos de localStorage:", e);
        setOrders([]); // Resetea si hay error
        setError("Error al cargar los pedidos guardados.");
    }

    setrouteCoordinates([]);// Resetea la route del vehículo
    setVehiclePosition(STORE_LOCATION && typeof STORE_LOCATION.lat === 'number' && typeof STORE_LOCATION.lng === 'number'
        ? STORE_LOCATION
        : { lat: 0, lng: 0 });

    if (animationFrameId.current) {// detener animación si está en curso
        cancelAnimationFrame(animationFrameId.current);
        startTimeRef.current = null;
    }
  };

  // Efecto para Cargar Pedidos y Arreglar Mapa
  useEffect(() => {
    const logisticaTabButton = document.getElementById('logistica-tab');// se anade un boton de listener
    let isMounted = true; // Para evitar actualizaciones de estado si el componente se desmonta rápido

    const handleTabShow = () => {
        if (!isMounted) return; // No hacer nada si ya se desmontó
        loadOrders();
        if (mapRef.current) {
            mapRef.current.invalidateSize();
            setTimeout(() => {
                if (isMounted && mapRef.current) {//Esta parte se realiza para que el mapa se vea bien al cambiar de pestaña
                   mapRef.current.invalidateSize();
                }
            }, 300);
        }
    };

    if (logisticaTabButton) {
      logisticaTabButton.addEventListener('shown.bs.tab', handleTabShow);
       const isActive = logisticaTabButton.classList.contains('active');
       if (isActive) {
           handleTabShow(); // Llama si ya está activa al montar
       }
    } else {
        handleTabShow();
    }

    // Limpieza al desmontar
    return () => {
      isMounted = false; // Marca como desmontado
      if (logisticaTabButton) {
        logisticaTabButton.removeEventListener('shown.bs.tab', handleTabShow);//Esto permite remover el listener al desmontar el componente
      }
       if (animationFrameId.current) {
           cancelAnimationFrame(animationFrameId.current);
       }
    };
  }, []); // Dependencias vacías 


  // --- Función para Calcular la route (llamada por el botón) ---
  // Es 'async' porque usa 'await' para esperar la respuesta del 'fetch'.
  const calculateroute = async () => {
    // Verificaciones iniciales (orders, API key, STORE_LOCATION)
    if (orders.length === 0) { setError("No hay pedidos con ubicación válida."); return; }
    if (!ORS_API_KEY || ORS_API_KEY === 'TU_API_KEY_DE_OPENrouteSERVICE') { setError("API Key de ORS no configurada."); return; }
    if (!STORE_LOCATION || typeof STORE_LOCATION.lat !== 'number' || typeof STORE_LOCATION.lng !== 'number') { setError("Ubicación de la tienda inválida."); return; }

    setIsLoading(true);
    setError(null);
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    startTimeRef.current = null;
    setVehiclePosition(STORE_LOCATION); // Posición inicial

    //  Prepara coordenadas [lng, lat]
    const storeCoords = [STORE_LOCATION.lng, STORE_LOCATION.lat];
    const customerCoords = orders.map(order => [order.location.longitude, order.location.latitude]);
    const coordinatesPayload = [storeCoords, ...customerCoords, storeCoords];  //Se crea la secuencia de route

    // DEBUG: Imprime lo que se enviará
    console.log("Enviando a ORS - API Key:", ORS_API_KEY); 
    console.log("Enviando a ORS - Coordenadas:", JSON.stringify({ coordinates: coordinatesPayload }));

    const orsUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

    try {
        //  Llamado del fetch
        const response = await fetch(orsUrl, {
            method: 'POST', // se usan las componentes como POST Y GET como dice en la documentacion
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Content-Type': 'application/json',
                'Authorization': ORS_API_KEY 
            },
            body: JSON.stringify({ coordinates: coordinatesPayload }) 
        });

        //  Verifica la respuesta
        if (!response.ok) {
            // Intenta obtener más detalles del error si es posible
            let errorDetails = response.statusText;
            try {
                 const errorData = await response.json();
                 errorDetails = errorData.error?.message || JSON.stringify(errorData) || errorDetails;
            } catch (jsonError) {
                 // Si la respuesta no es JSON, usa el texto
                 errorDetails = await response.text() || errorDetails;
            }
            // Lanza un error detallado
            throw new Error(`Error ORS (${response.status}): ${errorDetails}`);
        }

        //  Procesa la respuesta exitosa
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const route = data.features[0];
            const coords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Swap a Lat, Lng
            const duration = route.properties.summary.duration;

            if (!coords || coords.length === 0) { throw new Error("route ORS recibida está vacía."); }

            setrouteCoordinates(coords);
            setTotalDuration(duration);
            setVehiclePosition({ lat: coords[0][0], lng: coords[0][1] });

            startTimeRef.current = performance.now();
            animaCarro(coords, duration);
        } else {
            throw new Error("Respuesta de ORS no contiene una route ('features').");
        }
    } catch (err) {
        // 5. Muestra errores en consola y UI
        console.error('Error detallado al calcular la route ORS:', err);
        setError(`Error calculando route: ${err.message}`);
        setrouteCoordinates([]); // Limpia la route si falla
    } finally {
        setIsLoading(false);
    }
  };

  // --- Función de Animación ---
  const animaCarro = (route, durationInSeconds) => {
    const duracion = Math.max(durationInSeconds, 0.1);
    const totalDurationMs = (duracion * 1000) / multiVelocidad;
    let isCancelled = false; // Flag para detener si se cancela

    const step = (timestamp) => {
        if (isCancelled || !startTimeRef.current) return; // Detiene si se canceló o reseteó

        const elapsedTime = timestamp - startTimeRef.current;
        const progress = Math.min(elapsedTime / totalDurationMs, 1);

        if (route && route.length > 0) {
           const index = Math.min(Math.floor(progress * (route.length - 1)), route.length - 1);
           const currentPos = route[index];
           if (currentPos && typeof currentPos[0] === 'number' && typeof currentPos[1] === 'number') {
               setVehiclePosition({ lat: currentPos[0], lng: currentPos[1] });
           } else {
               console.warn("Coordenada inválida en route, índice:", index);
           }
        }

        if (progress < 1) {
            animationFrameId.current = requestAnimationFrame(step);
        } else {
            startTimeRef.current = null; // Animación completada
            animationFrameId.current = null;
        }
    };
    
    // Limpia cualquier animación previa antes de empezar una nueva
    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    startTimeRef.current = performance.now(); // Reinicia el tiempo de inicio
    animationFrameId.current = requestAnimationFrame(step);

    // Función de limpieza para este efecto específico
    return () => { isCancelled = true; };
  };

  //  Renderizado del Componente
  return (
    <div className="container py-4">
      <h2 className="text-center mb-3">Mapeo</h2>

      {/* Botón para iniciar la simulación */}
      <div className="text-center mb-3">
          <button
              onClick={calculateroute}
              className="btn btn-success"
              disabled={isLoading || orders.length === 0}
          >
              {isLoading ? 'Calculando ruta...' : (orders.length === 0 ? 'Añade pedidos con ubicación' : 'Iniciar Simulación de ruta')}
          </button>
      </div>

      {/* Mensaje de error si existe */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Contenedor del Mapa */}
      <MapContainer
          center={(typeof STORE_LOCATION?.lat === 'number' && typeof STORE_LOCATION?.lng === 'number') ? [STORE_LOCATION.lat, STORE_LOCATION.lng] : [0, 0]}
          zoom={12}
          style={{ height: '600px', width: '100%' }}
          whenCreated={instance => { mapRef.current = instance }}
      >
        {/* Capa base del mapa */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador Fijo de la Tienda */}
        {typeof STORE_LOCATION?.lat === 'number' && typeof STORE_LOCATION?.lng === 'number' && (
            <Marker position={[STORE_LOCATION.lat, STORE_LOCATION.lng]} icon={houseIcon}>
                <Popup>Nako Store (Tienda)</Popup>
                <Tooltip>Tienda</Tooltip>
            </Marker>
        )}

        {/* Marcadores de Clientes */}
        {orders.map((order, index) => {
            const lat = order.location?.latitude;
            const lng = order.location?.longitude;
            if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker key={`order-${index}`} position={[lat, lng]} icon={houseIcon}>
                    <Popup>Pedido para: {order.buyerName}<br/>Items: {order.items.map(item => `${item.title}(x${item.quantity})`).join(', ')}</Popup>
                    <Tooltip>Cliente: {order.buyerName}</Tooltip>
                </Marker>
              );
            }
            return null;
        })}

        {/* Línea de la ruta Calculada */}
        {routeCoordinates && routeCoordinates.length > 0 && (
            <Polyline positions={routeCoordinates} color="dodgerblue" weight={5} opacity={0.7} />
        )}

        {/* Marcador Animado del Vehículo */}
        {routeCoordinates && routeCoordinates.length > 0 && typeof vehiclePosition?.lat === 'number' && typeof vehiclePosition?.lng === 'number' && (
            <Marker position={[vehiclePosition.lat, vehiclePosition.lng]} icon={iconoCarro}>
               <Tooltip>Vehículo de Entrega</Tooltip>
            </Marker>
        )}

      </MapContainer>

      {/* Información de Duración */}
       {totalDuration > 0 && routeCoordinates && routeCoordinates.length > 0 && (
           <p className="mt-2 text-center text-muted">
               Tiempo estimado real del viaje (sin acelerar): {(totalDuration / 60).toFixed(1)} minutos.
               Duración simulación: {(totalDuration / multiVelocidad).toFixed(1)} segundos.
           </p>
       )}
    </div>
  );
}