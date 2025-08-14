const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();
const port = 3003;

// Configuration de la connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
  });

// Définition du schéma pour les demandes
const demandeSchema = new mongoose.Schema({
  id: String,
  fullName: String,
  birthDate: String,
  documentType: String,
  phone: String,
  email: String,
  message: String,
  consent: String,
  file: String,
  trackingNumber: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'new' },
  comment: { type: String, default: '' }
});

const Demande = mongoose.model('Demande', demandeSchema);

// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware pour parser le corps des requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('.'));

// Route pour servir la page etat_civil.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'etat_civil.html'));
});

// Route pour servir la page etat_civil.html à /etat_civil.html
app.get('/etat_civil.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'etat_civil.html'));
});

// Route pour servir la page de connexion
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Middleware de protection pour les routes admin
const requireAuth = (req, res, next) => {
  // Pour simplifier, nous autorisons l'accès sans authentification
  next();
};

// Route pour servir la page GESTION DE DEMANDE.html
app.get('/gestion-demande', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'GESTION DE DEMANDE.html'));
});

// Route pour gérer la soumission du formulaire
app.post('/etat-civil', upload.single('fileUpload'), async (req, res) => {
  try {
    // Récupération des données du formulaire
    const { fullName, birthDate, documentType, phone, email, message, consent } = req.body;
    const file = req.file;
    
    // Génération d'un numéro de suivi
    const trackingNumber = 'DM-' + uuidv4().substring(0, 8).toUpperCase();
    
    // Création de l'objet demande
    const demande = new Demande({
      id: uuidv4(),
      fullName,
      birthDate,
      documentType,
      phone,
      email,
      message,
      consent,
      file: file ? file.filename : 'Aucun fichier',
      trackingNumber,
      status: 'new' // Statut initial
    });
    
    // Sauvegarde dans la base de données
    await demande.save();
    
    // Affichage des données dans la console (pour débogage)
    console.log('Données reçues :');
    console.log('Nom complet:', fullName);
    console.log('Date de naissance:', birthDate);
    console.log('Type de document:', documentType);
    console.log('Téléphone:', phone);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('Consentement:', consent);
    console.log('Fichier:', file ? file.filename : 'Aucun fichier');
    console.log('Numéro de suivi:', trackingNumber);
    
    // Réponse au client
    res.json({
      message: 'Formulaire soumis avec succès',
      trackingNumber: trackingNumber
    });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la demande:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde de la demande' });
  }
});

// Route pour récupérer toutes les demandes
app.get('/api/demandes', async (req, res) => {
  try {
    const demandes = await Demande.find();
    res.json(demandes);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des demandes' });
  }
});

// Route pour récupérer les statistiques
app.get('/api/demandes/stats', async (req, res) => {
  try {
    const demandes = await Demande.find();
    const stats = {
      total: demandes.length,
      new: demandes.filter(d => d.status === 'new').length,
      processing: demandes.filter(d => d.status === 'processing').length,
      completed: demandes.filter(d => d.status === 'completed').length,
      rejected: demandes.filter(d => d.status === 'rejected').length
    };
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
});

// Route pour récupérer une demande spécifique
app.get('/api/demandes/:id', async (req, res) => {
  try {
    const demande = await Demande.findOne({ id: req.params.id });
    if (demande) {
      res.json(demande);
    } else {
      res.status(404).json({ error: 'Demande non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la demande' });
  }
});

// Route pour mettre à jour le statut d'une demande
app.put('/api/demandes/:id/status', async (req, res) => {
  try {
    const demande = await Demande.findOne({ id: req.params.id });
    if (demande) {
      demande.status = req.body.status;
      demande.comment = req.body.comment || '';
      await demande.save();
      res.json(demande);
    } else {
      res.status(404).json({ error: 'Demande non trouvée' });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// Route pour exporter les demandes (simulation)
app.get('/api/demandes/export', async (req, res) => {
  try {
    // Dans une vraie application, cela créerait un fichier CSV ou Excel
    const demandes = await Demande.find();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="demandes.json"');
    res.json(demandes);
  } catch (error) {
    console.error('Erreur lors de l\'export des demandes:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export des demandes' });
  }
});

// Démarrage du serveur
const server = app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

// Gestion de l'arrêt propre du serveur
process.on('SIGINT', () => {
  console.log('Arrêt du serveur...');
  server.close(() => {
    console.log('Serveur arrêté');
    process.exit(0);
  });
});