// Template: Email de confirmation au client
export const clientConfirmationEmail = (name: string, message: string) => ({
  subject: 'Votre demande a bien été reçue - ZMR Models Agency',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">ZMR Models Agency</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Merci pour votre message</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Bonjour ${name},</h2>
            <p style="font-size: 16px;">Nous avons bien reçu votre demande et nous vous en remercions.</p>

            <div class="message-box">
              <h3 style="margin-top: 0; color: #667eea;">Votre message :</h3>
              <p style="margin: 0; font-style: italic; color: #4b5563;">"${message}"</p>
            </div>

            <p style="font-size: 16px;">Notre équipe va l'examiner attentivement et vous répondra dans les <strong>24-48 heures</strong>.</p>

            <p style="font-size: 16px;">En attendant, n'hésitez pas à consulter notre portfolio de mannequins sur notre site web.</p>

            <div style="text-align: center;">
              <a href="https://zmr-models-agency.vercel.app/models" class="button">Découvrir nos modèles</a>
            </div>

            <div class="footer">
              <p><strong>ZMR Models Agency</strong></p>
              <p>Email: jlwebdesign33@gmail.com</p>
              <p style="margin-top: 20px; font-size: 12px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
});

// Template: Notification à l'admin
export const adminNotificationEmail = (contact: {
  name: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
}) => ({
  subject: `🔔 Nouveau contact: ${contact.name}`,
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .label { font-weight: bold; color: #1e40af; display: inline-block; width: 100px; }
          .badge { display: inline-block; padding: 5px 15px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 14px; font-weight: 600; }
          .message-box { background: white; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #1e40af; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">🔔 Nouveau Contact Reçu</h1>
          </div>
          <div class="content">
            <div class="info-row">
              <span class="label">Nom:</span>
              <span style="font-size: 18px; font-weight: 600;">${contact.name}</span>
              <span class="badge" style="float: right;">${contact.type === 'Professional' ? '💼 Professionnel' : '👤 Particulier'}</span>
            </div>

            <div class="info-row">
              <span class="label">Email:</span>
              <a href="mailto:${contact.email}" style="color: #1e40af;">${contact.email}</a>
            </div>

            ${contact.phone ? `
            <div class="info-row">
              <span class="label">Téléphone:</span>
              <a href="tel:${contact.phone}" style="color: #1e40af;">${contact.phone}</a>
            </div>
            ` : ''}

            <div class="message-box">
              <h3 style="margin-top: 0; color: #1e40af;">Message:</h3>
              <p style="margin: 0; color: #4b5563;">${contact.message}</p>
            </div>

            <div style="text-align: center;">
              <a href="https://zmr-models-agency.vercel.app/admin/contacts" class="button">Voir dans le CRM</a>
            </div>

            <p style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
              Connectez-vous au CRM pour répondre à ce contact
            </p>
          </div>
        </div>
      </body>
    </html>
  `
});

// Template: Confirmation de rendez-vous
export const appointmentConfirmationEmail = (appointment: {
  clientName: string;
  date: Date;
  duration: number;
  notes?: string;
}) => ({
  subject: '✅ Votre rendez-vous est confirmé - ZMR Models Agency',
  html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .calendar-box { background: white; padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .date-large { font-size: 36px; font-weight: bold; color: #10b981; margin: 10px 0; }
          .time-info { background: #d1fae5; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .info-item { margin: 10px 0; }
          .label { font-weight: bold; color: #059669; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Rendez-vous Confirmé</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">ZMR Models Agency</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Bonjour ${appointment.clientName},</h2>
            <p style="font-size: 16px;">Votre rendez-vous avec ZMR Models Agency est confirmé!</p>

            <div class="calendar-box">
              <div style="font-size: 48px; margin-bottom: 10px;">📅</div>
              <div class="date-large">
                ${appointment.date.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div class="time-info">
                <div class="info-item">
                  <span class="label">⏰ Heure:</span>
                  ${appointment.date.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div class="info-item">
                  <span class="label">⏱️ Durée:</span>
                  ${appointment.duration} minutes
                </div>
              </div>
            </div>

            ${appointment.notes ? `
            <div style="background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #059669;">Informations complémentaires:</h3>
              <p style="margin: 0; color: #4b5563;">${appointment.notes}</p>
            </div>
            ` : ''}

            <p style="font-size: 16px;">Nous avons hâte de vous rencontrer!</p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="font-size: 14px; color: #6b7280;">Ajoutez ce rendez-vous à votre calendrier:</p>
              <a href="#" class="button">📆 Google Calendar</a>
              <a href="#" class="button">📱 Apple Calendar</a>
            </div>

            <div class="footer">
              <p><strong>ZMR Models Agency</strong></p>
              <p>Email: jlwebdesign33@gmail.com</p>
              <p style="margin-top: 20px; font-size: 12px;">Si vous avez besoin de modifier ou annuler ce rendez-vous, contactez-nous par email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
});
