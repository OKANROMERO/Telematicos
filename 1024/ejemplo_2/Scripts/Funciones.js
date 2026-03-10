import React, { useRef, useEffect, useState } from 'react';

function Camara({ onGuardarCaptura }) { 
  const videoRef = useRef(null); 
  const canvasRef = useRef(null); 

  const [mediaStream, setMediaStream] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  // --- 1. RE-INTRODUCIMOS EL ESTADO DE ERROR ---
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // --- 2. ACTUALIZAMOS LAS RESTRICCIONES (CON AUDIO) ---
    const constraints = { 
      audio: true, // <--- CAMBIADO
      video: { width: 640, height: 480 } // Ancho de 640 como en tu ejemplo
    };
    
    let stream = null;
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream); 
        setErrorMsg(''); // Limpiamos errores si todo sale bien
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        // --- 3. GUARDAMOS EL ERROR PARA MOSTRARLO ---
        setErrorMsg(`Error al acceder a la cámara: ${e.toString()}`);
        console.error('navigator.getUserMedia error:', e);
      }
    }
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // El array vacío [] es como el "Cargar al inicio" (init())

  // --- Lógica de Snap ---
  // Esto es lo mismo que tu "snap.addEventListener"
  const handleSnap = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(videoRef.current, 0, 0, 640, 480);
    }
  };

  // (Las otras funciones no cambian)
  const handleFileChange = (event) => { /* ... (código igual) ... */ };
  const handleGuardar = () => { /* ... (código igual) ... */ };

  return (
    <section> 
      <h2>Capturar Imagen</h2>
      
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <br />
        <input 
          type="text" 
          id="nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor="mensaje">Mensaje:</label>
        <br />
        <textarea 
          id="mensaje" 
          value={mensaje} 
          onChange={(e) => setMensaje(e.target.value)} 
          rows="3"
        />
      </div>
      
      <br />
      
      {/* --- 4. MOSTRAMOS EL ERROR (como tu errorMsgElement.innerHTML) --- */}
      {errorMsg && (
        <p style={{ color: 'red' }}>
          <strong>Error:</strong> {errorMsg}
        </p>
      )}
      
      <div>
        <label htmlFor="fileUpload">O sube una foto:</label>
        <br />
        <input 
          type="file" 
          id="fileUpload" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>

      <br />

      <div>
        {/* 'muted' es importante si pediste audio, para evitar acople */}
        <video ref={videoRef} playsInline autoPlay muted width="640" height="480"></video>
      </div>
      
      <br />
      
      <div>
        {/* Tu 'snap' es este botón */}
        <button onClick={handleSnap} disabled={!mediaStream}>
          Capturar Foto (Webcam)
        </button>
        <button 
          onClick={handleGuardar} 
          disabled={nombre.trim() === '' && mensaje.trim() === ''}
        >
          Guardar Captura
        </button>
      </div>

      <br />
      
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </section>
  );
}

// (Las funciones handleFileChange y handleGuardar completas por si las borraste)

 const handleFileChange = (event) => {
   const file = event.target.files[0];
   if (file && canvasRef.current) {
     const context = canvasRef.current.getContext('2d');
     const img = new Image();
     img.onload = () => {
       context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
       context.drawImage(img, 0, 0, 640, 480);
       URL.revokeObjectURL(img.src);
     };
     img.src = URL.createObjectURL(file);
   }
 };
  
 const handleGuardar = () => {
   if (nombre.trim() === '' && mensaje.trim() === '') {
     alert('Por favor, ingresa un nombre y un mensaje antes de guardar.');
     return;
   }
   if (!canvasRef.current) return;
   const imagenDataUrl = canvasRef.current.toDataURL('image/png');
   const nuevaCaptura = {
     id: Date.now(), 
     nombre: nombre,
     mensaje: mensaje,
     urlImagen: imagenDataUrl 
   };
   onGuardarCaptura(nuevaCaptura);
   setNombre('');
   setMensaje('');
   const context = canvasRef.current.getContext('2d');
   context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
};

export default Camara;