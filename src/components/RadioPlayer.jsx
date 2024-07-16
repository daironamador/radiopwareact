import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './RadioPlayer.css'; // Archivo CSS para los estilos personalizados

const RadioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('Cargando ...');
  const [albumArt, setAlbumArt] = useState('/path/to/default-album-art.jpg');
  const [trackBuyUrl, setTrackBuyUrl] = useState('#');
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const albumArtRef = useRef(null);

  useEffect(() => {
    // Función para cargar el script externo
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    };

    // Cargar el script y actualizar la canción actual y el álbum art
    loadScript('https://cast5.asurahosting.com/system/streaminfo.js')
      .then(() => {
        const songElement = document.querySelector('.cc_streaminfo[data-type="song"]');
        const albumArtElement = document.querySelector('.cc_streaminfo[data-type="trackimageurl"]');
        const trackBuyElement = document.querySelector('.cc_streaminfo[data-type="trackbuyurl"]');

        const updateSongInfo = () => {
          setCurrentSong(songElement.innerText);

          // Verificar si el álbum art tiene una URL válida
          const albumArtUrl = albumArtElement.src;
          if (albumArtUrl && albumArtUrl !== window.location.href) {
            setAlbumArt(albumArtUrl);
          } else {
            setAlbumArt('../../src/assets/album-art.png');
          }

          setTrackBuyUrl(trackBuyElement.href);
        };

        const observer = new MutationObserver(updateSongInfo);
        observer.observe(songElement, { childList: true, subtree: true });
        observer.observe(albumArtElement, { attributes: true });
        observer.observe(trackBuyElement, { attributes: true });

        updateSongInfo(); // Inicialmente obtener el texto y atributos
      })
      .catch((error) => console.error('Error loading script:', error));
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <div className="album-art-container">
        <img
          ref={albumArtRef}
          src={albumArt}
          alt="Album Art"
          className={`album-art ${isPlaying ? 'spin' : ''}`}
        />
      </div>
      <h2 className="mt-4 text-2xl">{currentSong}</h2>
      <audio ref={audioRef} src="https://cast5.asurahosting.com/proxy/losarad2/stream" />
      <div className="flex items-center mt-4">
        <button onClick={togglePlayPause} className="p-2 bg-blue-500 rounded-full text-white">
          {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="ml-4"
        />
      </div>
      <a href={trackBuyUrl} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-400 underline">
        Buy this track
      </a>
      {/* Elementos ocultos para la canción actual y el álbum art */}
      <span className="cc_streaminfo" data-type="song" data-username="losarad2" style={{ display: 'none' }}>
        Cargando ...
      </span>
      <img className="cc_streaminfo" data-type="trackimageurl" data-username="losarad2" style={{ display: 'none' }} />
      <a href="#" className="cc_streaminfo" data-type="trackbuyurl" data-username="losarad2" style={{ display: 'none' }}></a>
    </div>
  );
};

export default RadioPlayer;
