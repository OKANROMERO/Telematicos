
import './App.css';

// Archivos importados de otros componentes para realizar un codigo mas limpio.
import { CarritoProv } from './carrito.js';       
import CarritoTab from './tablacarrito.js';      
import Home from './Home.js';                   
import Sitio from './Sitio.js';                 
import LogisticaTabContent from './logis.js';


// Parte inicial de la pagina
function AppContent() {

  // El 'return' define lo que se va a mostrar en pantalla (el JSX).
  return (
    <>
      {/* Contenedor principal de Bootstrap con un margen superior (mt-4) */}
      <div className="container mt-4">
        <h1 className="text-center my-4">Nako Store</h1>
        {/*Barra de Navegación por Pestañas (Tabs)*/}
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            {/* Botón HOME: Conecta con el panel '#home-pane' */} 
            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-pane" type="button" role="tab" aria-controls="home-pane" aria-selected="true">HOME</button>
          </li>
          <li className="nav-item" role="presentation">
            {/* Botón SITIO: Conecta con el panel '#sitio-pane' */}
            <button className="nav-link" id="sitio-tab" data-bs-toggle="tab" data-bs-target="#sitio-pane" type="button" role="tab" aria-controls="sitio-pane" aria-selected="false">SITIO</button>
          </li>
          <li className="nav-item" role="presentation">
            {/* Botón CARRITO: Conecta con el panel '#cart-pane' */}
            <button className="nav-link" id="cart-tab" data-bs-toggle="tab" data-bs-target="#cart-pane" type="button" role="tab" aria-controls="cart-pane" aria-selected="false">CARRITO</button>
          </li>
          <li className="nav-item" role="presentation">
            {/* Botón LOGISTICA: Conecta con el panel '#logistica-pane' */}
            <button className="nav-link" id="logistica-tab" data-bs-toggle="tab" data-bs-target="#logistica-pane" type="button" role="tab" aria-controls="logistica-pane" aria-selected="false">LOGISTICA</button>
          </li>
        </ul>

        {/*Contenedor para el Contenido de las Pestañas */}
        {/* 'tab-content' es donde Bootstrap muestra el contenido de la pestaña activa */}
        <div className="tab-content" id="myTabContent">

          {/* Panel para la Pestaña HOME */}
          <div className="tab-pane fade show active" id="home-pane" role="tabpanel" aria-labelledby="home-tab">
            {/* Renderiza el componente 'Home' que importamos con el carruselk ya hecho */}
            <Home />
          </div>

          {/* Panel para la Pestaña SITIO */}
          <div className="tab-pane fade" id="sitio-pane" role="tabpanel" aria-labelledby="sitio-tab">
            {/* Renderiza el componente 'Sitio' (lista de productos) */}
            <Sitio />
          </div>

          {/* Panel para la Pestaña CARRITO */}
          <div className="tab-pane fade" id="cart-pane" role="tabpanel" aria-labelledby="cart-tab">
            {/* Renderiza el componente 'CarritoTab' (carrito, formulario, historial) */}
            <CarritoTab />
          </div>

          {/* Panel para la Pestaña LOGISTICA */}
          <div className="tab-pane fade" id="logistica-pane" role="tabpanel" aria-labelledby="logistica-tab">
            {/* Renderiza el componente 'LogisticaTabContent' (mapa y simulación) */}
            <LogisticaTabContent />
          </div>

        </div> {/* Fin del contenido de las pestañas */}
      </div> {/* Fin del contenedor principal */}

      {/* Modales */}
      {/* Se crean los popups para mostrar la informacion de pedido */}
      <div className="modal fade" id="modalMouse1" tabIndex="-1" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered">
           <div className="modal-content">
             {/* Contenido del Modal 1 (Logitech) */}
             <div className="modal-header"><h5 className="modal-title">Logitech PRO X SUPERLIGHT 2</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
             <div className="modal-body"><p><strong>Especificaciones técnicas</strong></p><ul><li>Sensor: HERO 2 de Logitech</li></ul><ul><li>Autonomía: hasta 95 h</li></ul><ul><li>Resolución: 100 – 32.000 dpi</li></ul><ul><li>Aceleración máxima: mayor 40 G</li></ul></div>
           </div>
         </div>
      </div>
      <div className="modal fade" id="modalMouse2" tabIndex="-1" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered">
           <div className="modal-content">
              {/* Contenido del Modal 2 (Razer) */}
              <div className="modal-header"><h5 className="modal-title">RAZER VIPER V3 PRO</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
              <div className="modal-body"><p><strong>Especificaciones técnicas</strong></p><ul><li>Peso: 54 gramos (sin incluir el cable y el dongle)</li></ul><ul><li>Focus Pro de 35000 PPP de 2.ª generación</li></ul><ul><li>Aceleración 70G</li></ul><ul><li>Hasta 95 horas a 1000 Hz</li></ul></div>
           </div>
         </div>
      </div>
      <div className="modal fade" id="modalMouse3" tabIndex="-1" aria-hidden="true">
         <div className="modal-dialog modal-dialog-centered">
           <div className="modal-content">
             {/* ... Contenido del Modal 3 (Vaxee) ... */}
             <div className="modal-header"><h5 className="modal-title">VAXEE XE v2 Wireless (4K)</h5><button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
             <div className="modal-body"><p><strong>Especificaciones técnicas</strong></p><ul><li>Sensor: PAW3950</li></ul><ul><li>Autonomía: hasta 30 h</li></ul><ul><li>Resolución: 100 – 3200 dpi</li></ul><ul><li>Aceleración máxima: mayor 50 G</li></ul></div>
           </div>
         </div>
      </div>
    </> // Fin del fragmento
  );
}


//  Exportación Principal
// Envuelve el componente 'AppContent' con el 'CarritoProv'
export default function App() {
  return (
    <CarritoProv>
      <AppContent />
    </CarritoProv>
  );
}