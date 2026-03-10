import React from 'react'; // Importa React

// Componente para el contenido de la pestaña HOME
export default function Home() {
  return (
    <>
      {/* Carrusel */}
      <div id="carouselExampleCaptions" className="carousel slide pt-4" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            {/* Enlace abre modal del Mouse 1 */}
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalMouse1">
              <img src="/image/logi.jpg" className="d-block w-100" alt="Mouse gamer inalámbrico" />
            </a>
            <div className="carousel-caption d-none d-md-block">
              <h5>Logitech PRO X SUPERLIGHT 2</h5>
            </div>
          </div>
          <div className="carousel-item">
            {/* Enlace abre modal del Mouse 2 */}
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalMouse2">
              <img src="/image/razer.jpg" className="d-block w-100" alt="Mouse gamer ergonómico con RGB" />
            </a>
            <div className="carousel-caption d-none d-md-block">
              <h5>RAZER VIPER V3 PRO</h5>
            </div>
          </div>
          <div className="carousel-item">
            {/* Enlace abre modal del Mouse 3 */}
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalMouse3">
              <img src="/image/vaxee.png" className="d-block w-100" alt="Mouse gamer con botones programables" />
            </a>
            <div className="carousel-caption d-none d-md-block">
              <h5>VAXEE XE v2 Wireless (4K)</h5>
            </div>
          </div>
        </div>
        {/* Controles del Carrusel */}
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <hr className="my-5" />
      <div className="row">
        <div className="col-md-8">
          <h2 className="mb-3">Sobre Nako Store</h2>
          <p>¡Bienvenido a Nako Store! Somos tu principal reseller de periféricos de gaming importados desde tiendas originales, con un enfoque en bajar los precios de importación.</p>
          <p>Nuestra misión es ofrecer solo productos probados por profesionales y ser reseller certificados</p>
        </div>
        <div className="col-md-4">
          <h3 className="mb-3">Desarrollado por:</h3>
          <p><strong>Okán Romero</strong></p>
          <p>Esta página es un proyecto de demostración creado con HTML, CSS y Bootstrap 5 para la materia Servicios Telemáticos.</p>
        </div>
      </div>
    </>
  );
}