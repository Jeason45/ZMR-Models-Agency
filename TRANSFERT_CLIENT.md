# Guide de Transfert au Client - Configuration Email

## 🎯 Résumé

Actuellement, le système utilise votre Gmail (`jlwebdesign33@gmail.com`) pour les tests.
Lors de la livraison au client, vous devrez simplement changer 2 variables d'environnement.

**Aucune modification de code nécessaire** ✅

---

## 📊 Ce qui reste avec votre compte vs ce qui change

### ✅ Reste avec votre compte (Développement)
- `ADMIN_EMAIL` : peut rester `jlwebdesign33@gmail.com` si vous voulez recevoir les notifications
- Tous les accès admin (Clerk/NextAuth)

### 🔄 Change pour le client (Production)
- `SMTP_USER` : Email du client
- `SMTP_PASSWORD` : App Password du client

---

## 🔧 Étapes pour le transfert (5 minutes)

### Option 1 : Le client a déjà un compte Gmail professionnel

1. **Le client crée un App Password Gmail** :
   - Va sur https://myaccount.google.com/apppasswords
   - Active la 2FA si nécessaire
   - Crée un App Password nommé "ZMR Models Agency"
   - Vous communique le mot de passe (16 caractères)

2. **Vous changez 2 variables sur Vercel** :
   ```
   SMTP_USER=client@zmrmodels.com
   SMTP_PASSWORD=app_password_du_client
   ```

3. **Redéploiement automatique** sur Vercel
   - Le site se redéploie automatiquement
   - Les emails partent maintenant du compte du client

---

### Option 2 : Le client n'a pas Gmail (utilise Outlook, etc.)

Vous pouvez utiliser d'autres services :

#### A. Microsoft 365 / Outlook
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=client@zmrmodels.com
SMTP_PASSWORD=mot_de_passe_outlook
```

#### B. Service email professionnel (SendGrid, Mailgun, AWS SES)

**SendGrid** (Recommandé pour production) :
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=votre_api_key_sendgrid
```

**Avantages SendGrid** :
- 100 emails/jour gratuits
- Meilleure délivrabilité
- Statistiques d'envoi
- Pas de limites Gmail

---

## 📋 Checklist de transfert

### Avant la livraison
- [ ] Tester tous les emails avec votre compte
- [ ] Vérifier que les templates sont corrects
- [ ] Préparer la documentation pour le client

### Lors de la livraison
- [ ] Obtenir les credentials SMTP du client
- [ ] Modifier les variables sur Vercel
- [ ] Tester l'envoi d'un email de test
- [ ] Confirmer réception avec le client

### Optionnel
- [ ] Changer `ADMIN_EMAIL` pour l'email du client (si souhaité)
- [ ] Donner accès Vercel au client
- [ ] Former le client sur le CRM

---

## 💡 Recommandations

### Pour un usage professionnel intensif
Je recommande **SendGrid** plutôt que Gmail :
- Gmail : limité à 500 emails/jour
- SendGrid : 100/jour gratuit, puis plans pro
- Meilleure réputation d'expéditeur
- Moins de risque de spam

### Configuration SendGrid (5 minutes)
1. Créer compte : https://signup.sendgrid.com/
2. Vérifier l'email
3. Créer une API Key
4. Modifier les variables Vercel :
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=votre_sendgrid_api_key
   ```

---

## 🔐 Sécurité

### Variables à NE JAMAIS partager publiquement
- ❌ `SMTP_PASSWORD`
- ❌ `DATABASE_URL`
- ❌ `AUTH_SECRET`
- ❌ `R2_SECRET_ACCESS_KEY`

### Variables que le client peut voir
- ✅ `SMTP_HOST`
- ✅ `SMTP_PORT`
- ✅ `SMTP_USER` (c'est juste un email)

---

## 📞 Support

Si le client a des questions sur la configuration email, vous pouvez :

1. **Leur envoyer ce guide**
2. **Leur donner accès Vercel** (en lecture seule ou admin)
3. **Le faire vous-même** avec leurs credentials

---

## ⏱️ Temps estimé pour le transfert

- **Avec Gmail client** : 5 minutes
- **Avec SendGrid** : 10 minutes
- **Avec autre SMTP** : 15 minutes

---

## 🎯 Conclusion

**Pour l'instant** : Utilisez votre Gmail pour développer et tester.
**À la livraison** : 5 minutes pour changer vers le compte du client.

C'est la méthode standard et professionnelle. Aucun problème !
