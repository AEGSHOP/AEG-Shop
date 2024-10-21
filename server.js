const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Chemins des fichiers
const AVIS_FILE = 'avis.txt';
const CONTACTS_FILE = 'contacts.txt';

// Route pour récupérer les avis
app.get('/api/avis', (req, res) => {
    fs.readFile(AVIS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de lecture des avis' });
        }

        const avisArray = data.split('\n').map(line => {
            const [nom, avis] = line.split('|');
            return { nom, avis };
        }).filter(item => item.nom && item.avis); // Filtre pour éviter les entrées vides

        res.json(avisArray);
    });
});

// Route pour ajouter un avis
app.post('/api/avis', (req, res) => {
    const { nom, avis } = req.body;

    if (!nom || !avis) {
        return res.status(400).json({ message: 'Nom et avis sont requis' });
    }

    const entry = `${nom}|${avis}\n`;

    fs.appendFile(AVIS_FILE, entry, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'avis' });
        }

        // Envoyer une notification au webhook Discord
        const discordMessage = {
            content: `Nouvel avis reçu !\n**Nom :** ${nom}\n**Avis :** ${avis}`
        };

        axios.post(config.DISCORD_WEBHOOK_URL, discordMessage)
            .then(() => {
                res.json({ message: 'Avis ajouté et notification envoyée!' });
            })
            .catch(() => {
                res.json({ message: 'Avis ajouté, mais erreur lors de l\'envoi de la notification.' });
            });
    });
});

// Route pour envoyer un message de contact
app.post('/api/contact', (req, res) => {
    const { nom, email, message } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({ message: 'Nom, email et message sont requis' });
    }

    const entry = `${nom}|${email}|${message}\n`;

    fs.appendFile(CONTACTS_FILE, entry, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
        }

        // Envoyer une notification au webhook Discord
        const discordMessage = {
            content: `Nouveau message de contact !\n**Nom :** ${nom}\n**Email :** ${email}\n**Message :** ${message}`
        };

        axios.post(config.DISCORD_WEBHOOK_URL, discordMessage)
            .then(() => {
                res.json({ message: 'Message envoyé et notification envoyée!' });
            })
            .catch(() => {
                res.json({ message: 'Message envoyé, mais erreur lors de l\'envoi de la notification.' });
            });
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
