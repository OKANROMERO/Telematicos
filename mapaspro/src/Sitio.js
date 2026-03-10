import React from 'react';
// Importa ProductCard desde el archivo Pescarrito.js
import ProductCard from './Pescarrito.js'; 

export default function Sitio() {
  
//Definimos los productos disponibles
  const products = [
    {
      title: "Logitech PRO X SUPERLIGHT 2",
      description: "Mouse inalámbrico ultraligero para e-sports, sensor HERO 2.",
      priceDisplay: "$599.000 COP",
      priceRaw: 599000, 
      imgSrc: "/image/logi.jpg",
      imgAlt: "Logitech Mouse"
    },
    {
      title: "RAZER VIPER V3 PRO",
      description: "Diseño ergonómico y sensor óptico de 35K DPI.",
      priceDisplay: "$649.000 COP",
      priceRaw: 649000, 
      imgSrc: "/image/razer.jpg",
      imgAlt: "Razer Mouse"
    },
    {
      title: "VAXEE XE v2 Wireless (4K)",
      description: "Conectividad 4K plug-and-play y sensor PAW3950.",
      priceDisplay: "$549.000 COP",
      priceRaw: 549000, 
      imgSrc: "/image/vaxee.png",
      imgAlt: "Vaxee Mouse"
    }
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Nuestros Productos</h2>
      <div className="row">
        {products.map(product => (
          // Renderiza una tarjeta de producto para cada producto
          <ProductCard key={product.title} product={product} />
        ))}
      </div>
    </div>
  );
}