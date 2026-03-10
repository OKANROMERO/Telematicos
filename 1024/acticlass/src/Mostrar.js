import React, { useState, useRef, useEffect } from 'react';
import './Mostrar.css'; 
function Mostrar({ capturas }) {
  const canvasRef = useRef(null); 
  const drawingCanvasRef = useRef(null);

  const [seleccionadoId, setSeleccionadoId] = useState('');
  const [formas, setFormas] = useState([]); 
  const [draggingItem, setDraggingItem] = useState(null);
  
  const [mensajeVisible, setMensajeVisible] = useState('');

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#FFFF00'); 
  const [drawLineWidth, setDrawLineWidth] = useState(5);

  const dibujarCanvas = (urlImagen) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = urlImagen;
  };

  const handleSelectChange = (event) => {
    const id = event.target.value;
    setSeleccionadoId(id);

    if (id) {
      const usuario = capturas.find(d => d.id === parseInt(id));
      if (usuario) {
        dibujarCanvas(usuario.urlImagen);
        
        setMensajeVisible(usuario.mensaje); 
        
        setFormas([]); 
      }
    } else {
      setFormas([]);
      setMensajeVisible('');
      const context = canvasRef.current.getContext('2d');
      if (context) context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const getDrawCoords = (e) => {
    const canvas = drawingCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getDrawCoords(e.nativeEvent);
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getDrawCoords(e.nativeEvent);
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawLineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = drawingCanvasRef.current.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearDrawing = () => {
    const ctx = drawingCanvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
  };


  const handleInsertDrawing = () => {
    if (!drawingCanvasRef.current) return;
    const dataUrl = drawingCanvasRef.current.toDataURL('image/png');
    setFormas(prev => [
      ...prev,
      { id: Date.now(), type: 'image', content: dataUrl, x: 50, y: 50 }
    ]);
    clearDrawing();
  };

  const handleAddText = () => {
    setFormas(prev => [
      ...prev,
      { id: Date.now(), type: 'text', content: 'Nota...', x: 50, y: 50 }
    ]);
  };

  const handleTextChange = (id, newContent) => {
    setFormas(prev => 
      prev.map(f => (f.id === id ? { ...f, content: newContent } : f))
    );
  };
  
  const handleDragStart = (e, forma) => {
    e.preventDefault(); 
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setDraggingItem({ id: forma.id, offsetX, offsetY });
  };

  const handleDragMove = (e) => {
    if (!draggingItem || !canvasRef.current) return;
    const parentRect = canvasRef.current.parentElement.getBoundingClientRect();
    let newX = e.clientX - parentRect.left - draggingItem.offsetX;
    let newY = e.clientY - parentRect.top - draggingItem.offsetY;
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    setFormas(prev =>
      prev.map(f => (f.id === draggingItem.id ? { ...f, x: newX, y: newY } : f))
    );
  };

  const handleDragEnd = () => setDraggingItem(null);

  if (capturas.length === 0) {
    return (
      <section className="mostrar-section">
        <h2>Aun no hay capturas</h2>
      </section>
    );
  }

  const textoWhatsapp = encodeURIComponent(mensajeVisible);
  const urlWhatsapp = `https://api.whatsapp.com/send?text=${textoWhatsapp}`;
  const urlFacebook = `https://www.facebook.com/sharer/sharer.php?u=https://www.google.com`; 

  return (
    <section className="mostrar-section">
      <h2>Visualizador de Capturas</h2>
      
      <div className="controles-mostrar">
        <label htmlFor="usuarioSelect">Selecciona usuario:</label>
        <select id="usuarioSelect" value={seleccionadoId} onChange={handleSelectChange}>
          <option value="">-- Seleccionar --</option>
          {capturas.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>
      <div className="editor-container">
        
        <div 
          className="visualizador"
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <canvas ref={canvasRef} width="640" height="480" className="canvas-mostrar" />
          
          {formas.map((forma) => (
            forma.type === 'text' ? (
              <div
                key={forma.id}
                className="draggable-item"
                style={{ top: `${forma.y}px`, left: `${forma.x}px` }}
                onMouseDown={(e) => handleDragStart(e, forma)}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleTextChange(forma.id, e.currentTarget.innerText)}
              >
                {forma.content}
              </div>
            ) : (
              <img
                key={forma.id}
                src={forma.content}
                className="draggable-item image"
                style={{ top: `${forma.y}px`, left: `${forma.x}px` }} 
                onMouseDown={(e) => handleDragStart(e, forma)}
                alt="Forma dibujada"
              />
            )
          ))}
        </div>

        {seleccionadoId && (
          <div className="drawing-pad-container">
            <h3>Dibuja tu Forma</h3>
            <canvas
              ref={drawingCanvasRef}
              width="250"
              height="200"
              className="drawing-pad"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="drawing-controls">
              <label>Color:</label>
              <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} />
              <label>Grosor:</label>
              <input type="range" min="1" max="20" value={drawLineWidth} onChange={(e) => setDrawLineWidth(e.target.value)} />
            </div>
            <button onClick={clearDrawing}>Limpiar Paleta</button>
            <button onClick={handleInsertDrawing} className="insert-button">
              Insertar Dibujo
            </button>
          </div>
        )}
      </div>

      {mensajeVisible && (
        <div className="mensaje-mostrado">
          <strong>Mensaje de {capturas.find(d => d.id === parseInt(seleccionadoId))?.nombre}:</strong>
          <p>"{mensajeVisible}"</p>
        </div>
      )}
      
      {mensajeVisible && (
        <div className="share-buttons">
          <a 
            href={urlFacebook}
            target="_blank" 
            rel="noopener noreferrer"
            className="share-button facebook"
          >
            Compartir en Facebook
          </a>
          <a 
            href={urlWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="share-button whatsapp"
          >
            Compartir en WhatsApp
          </a>
        </div>
      )}
      
    </section>
  );
}

export default Mostrar;