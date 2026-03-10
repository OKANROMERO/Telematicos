import React, { useRef, useEffect, useState } from 'react';

function Camara({ onGuardarCaptura }) { 
  const videoRef = useRef(null); 
  const canvasRef = useRef(null); 

  const [mediaStream, setMediaStream] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const constraints = { audio: false, video: { width: 640, height: 480 } };
    let stream = null;
    async function initCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        setMediaStream(stream); 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error('navigator.getUserMedia error:', e);
      }
    }
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  const handleSnap = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      context.drawImage(videoRef.current, 0, 0, 640, 480);
    }
  };

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
        <video ref={videoRef} playsInline autoPlay muted width="640" height="480"></video>
      </div>
      
      <br />
      
      <div>
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

export default Camara;