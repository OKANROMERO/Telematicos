// 1. (Opcional) Puedes borrar el logo si no lo usas
// import logo from './logo.svg'; 

// 2. (Opcional) Puedes mantener el CSS o borrarlo
import './App.css';

// 3. ¡Importa tu componente!
import MapaBasico from './MapaBasico';
// (Asegúrate de que tus otros archivos como 'Marcadores' también estén en la carpeta 'src')

function App() {
  return (
    <div className="App">
      
      {/* 4. Borra el <header> con el logo y el texto... */}
      {/* ...y reemplázalo por tu componente de mapa */}
      
      <MapaBasico />

      {/* Aquí podrías agregar tus otros componentes si quisieras */}
      {/* <Marcarmapa /> */}
      {/* <CrearEvent /> */}

    </div>
  );
}

export default App;