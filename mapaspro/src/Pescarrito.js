import React, { useState } from 'react'; // Importa React y useState
import { UsoCarro } from './carrito.js';   // Importa el hook del carrito

// 3. Exporta la función ProductCard
export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);// set quantity sirve para guardar cantidad de productos empezando desde uno
  const { AnadirCarro } = UsoCarro();
// AnadirCarro es la función para añadir productos al carrito
  const handleAnadirCarro = () => {
    if (quantity > 0) {
      AnadirCarro(product, quantity);
      alert(`${quantity} ${product.title} añadido(s) al carrito!`);// Mostramos una alerta al usuario confirmando que se añadió.
      setQuantity(1);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img src={product.imgSrc} className="card-img-top card-img-custom" alt={product.imgAlt} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.title}</h5>
          <p className="card-text">{product.description}</p>
          <div className="purchase-form">
            <h4 className="my-3">{product.priceDisplay}</h4>
            <div className="mb-3">
              <label htmlFor={`qty-${product.title}`} className="form-label">Cantidad:</label>
              <input
                type="number"
                className="form-control"
                id={`qty-${product.title}`}
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <button type="button" className="btn btn-primary w-100" onClick={handleAnadirCarro}>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}