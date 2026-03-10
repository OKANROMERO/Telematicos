import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

//  Componente interno para manejar los clics 
function LocationClickHandler({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng); // guardar la ubicación seleccionada
      map.flyTo(e.latlng, map.getZoom()); // centra el mapa en el clic
    },
  });
  return null; // No renderiza nada, solo escucha eventos
}

// Este es el componente que exportamos y usamos en otras partes (como en la pestaña Carrito).
// Muestra el mapa y permite al usuario seleccionar una ubicación haciendo clic.
function MapSelector({ onLocationSelect, selectedLocation, setMapInstance }) {
  // Ubicación predeterminada (Bogotá)
  const defaultPosition = [4.60971, -74.08175];

  return (
    <div className="mb-3">
      <label className="form-label">Tu ubicación (haz clic en el mapa):</label>
      <MapContainer 
        center={defaultPosition} 
        zoom={13} 
        style={{ minHeight: '300px', width: '100%' }}
        // 'whenCreated' es una prop especial que nos da la instancia del mapa Leaflet
        // una vez creado y la pasamos hacia arriba usando 'setMapInstance'.
        whenCreated={setMapInstance}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"// URL de donde se cargan las imágenes del mapa.
        />
        {/* Componente que escucha los clics */}
        <LocationClickHandler onLocationSelect={onLocationSelect} />
        
        {/* Si hay una ubicación seleccionada, muestra un marcador */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>
      {selectedLocation && (
        <small className="form-text text-muted">
          Ubicación seleccionada: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
        </small>
      )}
    </div>
  );
}

// Exportamos el componente MapSelector por defecto
export default MapSelector;