import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <h1 className="text-4xl text-white">Bienvenido a Mi Radio</h1>
    </div>
  );
};

export default SplashScreen;
