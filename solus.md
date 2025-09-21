L'erreur CORS que vous rencontrez est causée par votre API backend déployée sur Render qui ne configure pas correctement les headers CORS pour autoriser les requêtes venant de votre application frontend déployée sur Vercel.[1][2]

## Solution principale : Configuration CORS côté backend

### Configuration CORS avec le package cors
Dans votre API Express sur Render, installez et configurez le package `cors` :

```bash
npm install cors
```

Puis dans votre fichier principal (index.js, app.js, ou server.js) :

```javascript
const cors = require('cors');
const express = require('express');
const app = express();

// Configuration CORS
const corsOptions = {
  origin: ['https://food-force-v2-finale.vercel.app'], // Votre domaine Vercel
  credentials: true, // Autorise les cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Pour les anciens navigateurs
};

app.use(cors(corsOptions));
```

### Configuration pour plusieurs environnements
Pour gérer différents environnements (développement, production)  :[3]

```javascript
const allowedOrigins = [
  'https://food-force-v2-finale.vercel.app', // Production
  'http://localhost:3000', // Développement local
  'http://localhost:5173'  // Vite dev server
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Gestion manuelle des headers CORS
Si vous préférez configurer manuellement  :[4]

```javascript
app.use((req, res, next) => {
  const allowedOrigins = ['https://food-force-v2-finale.vercel.app'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Gestion des requêtes preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Max-Age', '86400'); // Cache 24h
    return res.status(200).end();
  }
  
  next();
});
```

## Vérifications côté frontend

Assurez-vous que vos requêtes sont correctement configurées dans votre application React :

```javascript
// Dans votre AuthContext.js ou service API
const login = async (credentials) => {
  try {
    const response = await fetch('https://food-force-api.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important pour les cookies
      body: JSON.stringify(credentials)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};
```

## Points importants

### Credentials et origine spécifique
Quand vous utilisez `credentials: true`, vous **ne pouvez pas** utiliser `origin: '*'`. Vous devez spécifier des origines exactes.[2][5][6]

### Requêtes preflight
Les requêtes POST avec `Content-Type: application/json` déclenchent automatiquement des requêtes preflight (OPTIONS). Le middleware `cors` les gère automatiquement.[7][8]

### Redéploiement nécessaire
Après avoir modifié la configuration CORS dans votre API, vous devez redéployer votre application sur Render pour que les changements prennent effet.[9][10]

Une fois ces modifications apportées à votre backend et le redéploiement effectué sur Render, l'erreur CORS devrait être résolue et votre frontend pourra communiquer avec votre API.[11][1]

[1](https://community.render.com/t/having-cors-error-due-to-preflight-error/22413)
[2](https://stackoverflow.com/questions/77159292/cors-error-after-deployment-on-render-com)
[3](https://stackoverflow.com/questions/26988071/allow-multiple-cors-domain-in-express-js)
[4](https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue)
[5](https://stackoverflow.com/questions/49189058/cors-allow-credentials-nodejs-express/49189275)
[6](https://dev.to/alexmercedcoder/expressjs-handling-cross-origin-cookies-38l9)
[7](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)
[8](https://treblle.com/blog/setup-cors-rest-api)
[9](https://community.render.com/t/error-after-deployment-has-been-blocked-by-cors-policy/6439)
[10](https://community.render.com/t/cors-issues-cross-origin-request-blocked/19891)
[11](https://community.render.com/t/connecting-frontend-from-vercel/2078)
[12](https://vercel.com/guides/how-to-enable-cors)
[13](https://stackoverflow.com/questions/79304532/how-do-i-fix-this-cors-error-when-attempting-to-host-on-vercel)
[14](https://www.geeksforgeeks.org/reactjs/how-to-fix-cors-errors-in-next-js-and-vercel/)
[15](https://expressjs.com/en/resources/middleware/cors.html)
[16](https://community.vercel.com/t/cors-issue/8026)
[17](https://community.render.com/t/access-control-allow-origin-driving-me-insane-help/17524)
[18](https://www.stackhawk.com/blog/nodejs-cors-guide-what-it-is-and-how-to-enable-it/)
[19](https://community.render.com/t/mern-deployment-cors-issue/14896)
[20](https://dev.to/kartikeykjjaiswal/how-to-handle-cors-issues-when-deploying-a-nodejs-express-app-on-vercel-10kh)
[21](https://boutdecode.fr/article/cors-avec-nodejs)
[22](https://community.render.com/t/cors-error-communicating-to-render-hosted-api-and-front-end/7285)
[23](https://community.render.com/t/express-server-with-socket-io-getting-cors-error-no-access-control-allow-origin-header-is-present-on-the-requested-resource-despite-it-being-set-for-both-express-and-socket-io/23203)
[24](https://fastapi.tiangolo.com/tutorial/cors/)
[25](https://www.geeksforgeeks.org/node-js/how-to-deal-with-cors-error-in-express-node-js-project/)
[26](https://github.com/expressjs/cors/issues/185)
[27](https://github.com/expressjs/cors/issues/294)
[28](https://stackoverflow.com/questions/56328049/express-cors-not-allowing-credentials)
[29](https://www.geeksforgeeks.org/node-js/how-to-allow-cors-in-express/)
[30](https://stackoverflow.com/questions/77282106/how-does-an-options-request-get-handled-if-preflightcontinue-is-used)
[31](https://fenilsonani.com/articles/understanding-of-cors-in-node-js-and-express)
[32](https://gist.github.com/97def36717c020578a0c)
[33](https://www.reddit.com/r/node/comments/v6afnm/cors_issue_with_express/)
[34](https://www.express-gateway.io/docs/policies/cors/)
[35](https://dev.to/asadbukhari/8-common-cors-errors-in-web-development-and-how-to-fix-them-in-nodejs-2pca)
[36](https://hayageek.com/express-cors/)
[37](https://station.railway.com/questions/cors-preflight-options-requests-not-re-7a328a63)
[38](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)