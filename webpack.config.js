const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  // Configuración de tu webpack...
  plugins: [
    // Otros plugins aquí...
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ]
};
