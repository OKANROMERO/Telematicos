import { useState, useEffect } from 'react';
import { UsoCarro } from './carrito.js'; 
import MapSelector from './mapacomp.js'; 
// Importa la función de fetch refactorizada
import { checkUserRegistration } from './apiService.js'; 

export default function CarritoTab() {
  const { cart, setCart } = UsoCarro();
  const [name, setName] = useState('');
  const [location, setLocation] = useState(null); 
  const [map, setMap] = useState(null); 
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);

  // Carga los pedidos
  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('NakoStoreOrders')) || [];
    setOrders(savedOrders.reverse());
  };

  // Arreglo del mapa
  useEffect(() => {
    const cartTabButton = document.getElementById('cart-tab');
    const onTabShow = () => {
      if (map) {
        setTimeout(() => { map.invalidateSize(); }, 200);
      }
    };
    if (cartTabButton) {
      cartTabButton.addEventListener('shown.bs.tab', onTabShow);
    }
    return () => {
      if (cartTabButton) {
        cartTabButton.removeEventListener('shown.bs.tab', onTabShow);
      }
    };
  }, [map]);

  // Carga historial
  useEffect(() => {
    const cartTabButton = document.getElementById('cart-tab');
    loadOrders(); 
    if (cartTabButton) {
      cartTabButton.addEventListener('shown.bs.tab', loadOrders);
    }
    return () => {
      if (cartTabButton) {
        cartTabButton.removeEventListener('shown.bs.tab', loadOrders);
      }
    };
  }, []); 

  // Calcula total
  const total = cart.reduce((acc, item) => acc + (item.priceRaw * item.quantity), 0);
  const formattedTotal = new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0
  }).format(total);

  // Lógica de checkout 
  const handleCheckout = async (e) => { 
    e.preventDefault();
    setMessage('');

    if (cart.length === 0) { setMessage('Tu carrito está vacío.'); return; }
    if (!name) { setMessage('Por favor, ingresa tu nombre.'); return; }
    if (!location) { setMessage('Por favor, selecciona tu ubicación en el mapa.'); return; }

    try {
      const esUsuarioRegistrado = await checkUserRegistration(name);

      if (esUsuarioRegistrado) {
        // Lógica para guardar en localStorage
        const newOrder = {
          buyerName: name,
          items: cart,
          total: formattedTotal,
          location: { latitude: location.lat, longitude: location.lng },
          date: new Date().toISOString()
        };
        const existingOrders = JSON.parse(localStorage.getItem('NakoStoreOrders')) || [];
        existingOrders.push(newOrder);
        localStorage.setItem('NakoStoreOrders', JSON.stringify(existingOrders));

        setMessage(`¡Compra exitosa, ${name}! Total: ${formattedTotal}. Pedido guardado.`);
        setCart([]);
        setName('');
        setLocation(null);
        loadOrders(); 
      } else {
        setMessage('Error: Usuario no registrado. No se puede completar la compra.');
      }
    } catch (error) {
      // Capturamos cualquier error que lance checkUserRegistration
      console.error("Error durante el checkout:", error);
      setMessage('Error del sistema. Intenta más tarde.'); 
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Tu Carrito de Compras</h2>
      <div className="row">
        
        {/* Columna Izquierda: Carrito Actual + Historial */}
        <div className="col-md-7">
          
          {/* --- Carrito Actual --- */}
          {cart.length === 0 ? (
            // Si el carrito está vacío, muestra este párrafo
            <p>Aún no has añadido productos a tu carrito.</p>
          ) : (
            <>
              <ul className="list-group mb-3">
                {cart.map(item => (
                  <li key={item.title} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="my-0">{item.title}</h6>
                      <small className="text-muted">Cantidad: {item.quantity}</small>
                    </div>
                    <span className="text-muted">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.priceRaw * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <h3 className="text-end">Total: {formattedTotal}</h3>
            </>
          )}

          {/*  Historial de Pedidos */}
          <hr className="my-4" />
          <h4 className="mb-3">Registros de Compradores Guardados</h4>
          
          {orders.length === 0 ? (
            <p className="text-muted">No hay pedidos guardados en el historial.</p>
          ) : (
            <div className="accordion" id="ordersAccordion">
              {orders.map((order, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading-${index}`}>
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target={`#collapse-${index}`} 
                      aria-expanded="false" 
                      aria-controls={`collapse-${index}`}
                    >
                      <strong>Pedido de: {order.buyerName}</strong>
                      &nbsp;({new Date(order.date).toLocaleDateString()})
                    </button>
                  </h2>
                  <div 
                    id={`collapse-${index}`} 
                    className="accordion-collapse collapse" 
                    aria-labelledby={`heading-${index}`} 
                    data-bs-parent="#ordersAccordion"
                  >
                    <div className="accordion-body">
                      <p><strong>Total:</strong> {order.total}</p>
                      {order.location ? (
                        <p><strong>Ubicación:</strong> {order.location.latitude.toFixed(4)}, {order.location.longitude.toFixed(4)}</p>
                      ) : (
                        <p><strong>Ubicación:</strong> No registrada</p>
                      )}
                      <strong>Items:</strong>
                      <ul className="list-group list-group-flush">
                        {order.items.map(item => (
                          <li key={item.title} className="list-group-item">
                            {item.title} (Cant: {item.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Formulario de Checkout */}
        <div className="col-md-5">
          <h4>Finalizar Compra</h4>
          <p>Para completar tu pedido, por favor regístrate con tu nombre y selecciona tu ubicación de entrega.</p>
          <form onSubmit={handleCheckout}>
            <div className="mb-3">
              <label htmlFor="checkout-name" className="form-label">Tu nombre registrado:</label>
              <input
                type="text"
                className="form-control"
                id="checkout-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Escribe tu nombre..."
              />
            </div>

            <MapSelector 
              onLocationSelect={setLocation} 
              selectedLocation={location}
              setMapInstance={setMap} 
            />

            <button type="submit" className="btn btn-success w-100 btn-lg">
              Registrar y Comprar
            </button>
            {message && (
              <p className={`purchase-message ${message.startsWith('Error') ? 'text-danger' : 'text-success'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}