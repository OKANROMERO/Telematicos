import React, { useState } from 'react';
import Home from './Home';
import Camara from './Camara';
import Mostrar from './Mostrar';
import './App.css';
import './Tabs.css';

function App() {
  const [activeTab, setActiveTab] = useState('capturar');
  const [capturas, setCapturas] = useState([]);
  const handleGuardarCaptura = (nuevaCaptura) => {
    setCapturas(prevCapturas => [...prevCapturas, nuevaCaptura]);
    
    alert('¡Captura guardada con éxito!');
    setActiveTab('mostrar');
  };

  return (
    <div className="App">
      <Home />

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'capturar' ? 'active' : ''}`}
          onClick={() => setActiveTab('capturar')}
        >
          Capturar
        </button>
        <button
          className={`tab-button ${activeTab === 'mostrar' ? 'active' : ''}`}
          onClick={() => setActiveTab('mostrar')}
        >
          Mostrar
        </button>
      </nav>

      <main className="tab-content">
        {activeTab === 'capturar' && (
          <Camara onGuardarCaptura={handleGuardarCaptura} />
        )}
        
        {activeTab === 'mostrar' && (
          <Mostrar capturas={capturas} />
        )}
      </main>
    </div>
  );
}

export default App;