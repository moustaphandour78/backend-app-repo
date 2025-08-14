const mongoose = require('mongoose');
require('dotenv').config();

// Afficher l'URI actuelle
console.log('URI de connexion MongoDB:', process.env.MONGODB_URI);

// Essayer de se connecter à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB réussie!');
    // Fermer la connexion après le test
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  });