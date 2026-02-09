# Configuration SMTP - Knit & Craft

## Option 1 : Gmail (le plus simple)

1. Activez la [validation en deux étapes](https://myaccount.google.com/security) sur votre compte Google
2. Créez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Dans `.env.local` :

```
# Désactivez SMTP en ne mettant PAS SMTP_HOST
# SMTP_HOST=

# Gmail
EMAIL_USER=knitandcraft3@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=Knit & Craft <knitandcraft3@gmail.com>
ADMIN_EMAIL=knitandcraft3@gmail.com
```

---

## Option 2 : SMTP personnalisé (ex : Brevo, Mailjet, votre hébergeur)

### Avec Brevo (ex-Sendinblue) – gratuit jusqu’à 300 emails/jour

1. Créez un compte sur [brevo.com](https://www.brevo.com)
2. Paramètres → SMTP & API → Créer une clé API
3. Dans `.env.local` :

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@domaine.com
SMTP_PASSWORD=votre-cle-api-brevo
EMAIL_FROM=Knit & Craft <knitandcraft3@gmail.com>
ADMIN_EMAIL=knitandcraft3@gmail.com
```

### Avec Mailjet – gratuit jusqu’à 200 emails/jour

1. Compte sur [mailjet.com](https://www.mailjet.com)
2. Récupérez SMTP User et SMTP Secret dans Paramètres
3. Dans `.env.local` :

```
SMTP_HOST=in-v3.mailjet.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-mailjet-user
SMTP_PASSWORD=votre-mailjet-secret
EMAIL_FROM=Knit & Craft <knitandcraft3@gmail.com>
ADMIN_EMAIL=knitandcraft3@gmail.com
```

### Avec l’hébergeur de votre domaine (OVH, O2Switch, etc.)

Consultez leur doc SMTP. Souvent :

```
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@votredomaine.com
SMTP_PASSWORD=votre-mot-de-passe-email
EMAIL_FROM=Knit & Craft <contact@votredomaine.com>
ADMIN_EMAIL=knitandcraft3@gmail.com
```

---

## Priorité

- Si `SMTP_HOST` est défini → SMTP est utilisé
- Sinon → Gmail (`EMAIL_USER` + `EMAIL_PASSWORD`)

---

## Test

1. Remplissez `.env.local`
2. Redémarrez le serveur : `npm run dev`
3. Passez une commande de test → l’email doit arriver au client et à `ADMIN_EMAIL`
