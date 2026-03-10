import { useState, createContext, useContext } from 'react';// Funciones de react necesarias

//  se guardara toda la informacion del carrito
const CarroCont = createContext();

// Se crea una funcion para llamar al carrito y su contenido
export const UsoCarro = () => useContext(CarroCont);

// Creamos el Proveedor que envuelve la app
export function CarritoProv({ children }) {
  const [cart, setCart] = useState([]); 

  const AnadirCarro = (product, quantity) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.title === product.title);
      if (existingItem) {
        // Si ya existe, actualiza la cantidad
        return prevCart.map(item =>
          item.title === product.title
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es nuevo, lo añade
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Pasamos el carrito, la función de añadir, y la de setear (para vaciarlo)
  return (
    <CarroCont.Provider value={{ cart, AnadirCarro, setCart }}>
      {children}
    </CarroCont.Provider>
  );
}