import React, { useState, useRef, useEffect } from 'react';

function Audio_Disp() {
  const [audioURL, setAudioURL] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);


  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const playbackAudioRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { 

        setHasPermission(true); 
        setError(null); 
        mediaStreamRef.current = stream; 

  
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder; 

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

          audioChunksRef.current = [];

          const audioUrl = URL.createObjectURL(audioBlob);

          setAudioURL(audioUrl);

        };

      })
      .catch(err => { 
        console.error("Error al obtener permiso de audio:", err);
        setError(`Error al acceder al micrófono: ${err.message}. Asegúrate de dar permiso.`);
        setHasPermission(false);
      });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]); 
  const startRecording = () => {
    if (mediaRecorderRef.current && hasPermission) {
      audioChunksRef.current = []; 
      mediaRecorderRef.current.start(); 
      setIsRecording(true); 
      setAudioURL(''); 
      setError(null); 
    } else if (!hasPermission) {
      setError("No hay permiso del micrófono para iniciar la grabación.");
    } else {
        setError("Error al iniciar grabación (MediaRecorder no listo).");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false); 
    }
  };

  return (
    <div>
      <h1>Grabar y Reproducir Audio en React</h1>

      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}

      {hasPermission ? (
        <p>
          <button onClick={startRecording} disabled={isRecording}>
            INICIAR
          </button>
          <button onClick={stopRecording} disabled={!isRecording}>
            PARAR
          </button>
        </p>
      ) : (
        <p>Esperando permiso del micrófono...</p>
      )}

      {audioURL && (
        <div>
          <h3>Audio Grabado:</h3>
          <audio ref={playbackAudioRef} src={audioURL} controls />
           <p><a href={audioURL} download="grabacion.wav">Descargar Grabación (.wav)</a></p>
        </div>
      )}
    </div>
  );
}

export default Audio_Disp;