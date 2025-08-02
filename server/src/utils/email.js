const nodemailer = require('nodemailer');

/**
 * Fonction pour envoyer des emails
 * @param {Object} options - Options pour l'email
 * @param {String} options.email - Email du destinataire
 * @param {String} options.subject - Sujet de l'email
 * @param {String} options.message - Contenu de l'email en texte brut
 * @param {String} options.html - Contenu de l'email en HTML (optionnel)
 */
exports.sendEmail = async (options) => {
  try {
    console.log('Configuration du transporteur SMTP avec les paramètres suivants:');
    console.log(`Service: ${process.env.EMAIL_SERVICE}`);
    console.log(`Utilisateur: ${process.env.EMAIL_USERNAME}`);
    console.log('Mot de passe: [MASQUÉ]');
    
    // Créer un transporteur SMTP réutilisable
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      debug: true // Activer le mode debug pour plus d'informations
    });
    
    // Vérifier la configuration du transporteur
    console.log('Vérification de la configuration du transporteur...');
    const verification = await transporter.verify();
    console.log('Vérification du transporteur réussie:', verification);

    // Définir les options de l'email
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'FoodForce Maroc'}" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message.replace(/\n/g, '<br>')
    };
    
    console.log(`Préparation de l'envoi d'email à: ${options.email}`);
    console.log(`Sujet: ${options.subject}`);

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error(`Erreur d'envoi d'email: ${error.message}`);
  }
};

/**
 * Génère un template HTML pour l'email de vérification
 * @param {String} name - Nom de l'utilisateur
 * @param {String} verificationUrl - URL de vérification
 * @returns {String} Template HTML
 */
exports.generateVerificationEmailTemplate = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Bienvenue sur FoodForce Maroc</h2>
        </div>
        <div class="content">
          <p>Bonjour${name ? ' ' + name : ''},</p>
          <p>Merci de vous être inscrit sur FoodForce Maroc, la plateforme de recrutement spécialisée dans l'industrie alimentaire au Maroc.</p>
          <p>Pour activer votre compte et commencer à utiliser nos services, veuillez cliquer sur le bouton ci-dessous :</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Vérifier mon compte</a>
          </p>
          <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
          <p>${verificationUrl}</p>
          <p>Ce lien expirera dans 24 heures.</p>
          <p>Cordialement,<br>L'équipe FoodForce Maroc</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} FoodForce Maroc. Tous droits réservés.</p>
          <p>Si vous n'avez pas demandé à créer un compte, veuillez ignorer cet email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
