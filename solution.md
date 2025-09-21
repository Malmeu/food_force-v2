Le problème
L'erreur principale est :
Access to fetch at 'https://food-force-api.onrender.com/api/auth/login' from origin 'http://46.202.131.53' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Solutions
1. Configurer CORS sur votre serveur Render
Dans votre serveur backend sur Render, vous devez configurer CORS pour accepter les requêtes depuis votre VPS. Si vous utilisez Express.js, ajoutez ou modifiez la configuration CORS :
javascriptconst cors = require('cors');

// Option 1: Permettre spécifiquement votre domaine
app.use(cors({
  origin: ['http://46.202.131.53', 'https://votre-domaine.com'], // Ajoutez vos domaines
  credentials: true
}));

// OU Option 2: Configuration plus flexible (attention en production)
app.use(cors({
  origin: true, // Accepte toutes les origines (à éviter en production)
  credentials: true
}));
2. Variables d'environnement
Vérifiez que votre serveur Render a les bonnes variables d'environnement configurées, notamment :

Les URL autorisées dans CORS
Les configurations de base de données MongoDB

3. HTTPS vs HTTP
Je remarque que votre VPS utilise HTTP (http://46.202.131.53) tandis que Render utilise HTTPS. Pour la sécurité, considérez :

Configurer un certificat SSL sur votre VPS
Utiliser un nom de domaine avec HTTPS

4. Vérification rapide
Pour tester rapidement, vous pouvez temporairement permettre toutes les origines sur votre serveur Render :
javascriptapp.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
⚠️ Important : N'utilisez origin: '*' qu'en développement, jamais en production.
5. Redémarrage nécessaire
Après avoir modifié la configuration CORS sur Render, vous devrez redéployer votre application pour que les changements prennent effet.