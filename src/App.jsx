import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import RadioPlayer from './components/RadioPlayer';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true); // Mostrar el botón de instalación
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false); // Ocultar el botón de instalación después de la interacción del usuario
      });
    }
  };

  return (
    <div>
      {loading ? (
        <SplashScreen onComplete={() => setLoading(false)} />
      ) : (
        <>
          <RadioPlayer />
          {showInstallPrompt && (
            <button onClick={handleInstallClick}>Instalar la aplicación</button>
          )}
        </>
      )}
    </div>
  );
};

export default App;
