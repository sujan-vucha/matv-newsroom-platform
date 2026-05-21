import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
   

    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or your preferred email service
      auth: {
        
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
      }
    });
  }

  async sendConfirmationEmail(userEmail, userName, petition) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Thank you for signing: ${petition.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Thank You for Your Support!</h2>
          
          <p>Dear ${userName},</p>
          
          <p>Thank you for signing the petition: <strong>${petition.title}</strong></p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Petition Details:</h3>
            <p><strong>Title:</strong> ${petition.title}</p>
            <p><strong>Description:</strong> ${petition.description}</p>
            <p><strong>Current Signatures:</strong> ${petition.currentSignatures}</p>
            <p><strong>Target:</strong> ${petition.targetSignatures} signatures</p>
            <p><strong>Decision Maker:</strong> ${petition.decisionMaker}</p>
          </div>
          
          <p>Your voice matters and together we can make a difference!</p>
          
          <p>Best regards,<br>The Petition Team</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This email was sent because you signed a petition. If you have any questions, please contact us.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }

  async sendOrganizerNotification(signature, petition) {
    const organizerEmail = process.env.ORGANIZER_EMAIL;
    
    if (!organizerEmail) {
      console.log('No organizer email configured');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizerEmail,
      subject: `New signature on petition: ${petition.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Petition Signature!</h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Signature Details:</h3>
            <p><strong>Name:</strong> ${signature.firstName} ${signature.lastName}</p>
            <p><strong>Email:</strong> ${signature.email}</p>
            <p><strong>Location:</strong> ${signature.location}</p>
            <p><strong>Signed at:</strong> ${new Date(signature.createdAt).toLocaleString()}</p>
            <p><strong>Display Name:</strong> ${signature.displayName ? 'Yes' : 'No'}</p>
          </div>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc2626; margin-top: 0;">Petition Status:</h3>
            <p><strong>Title:</strong> ${petition.title}</p>
            <p><strong>Current Signatures:</strong> ${petition.currentSignatures}</p>
            <p><strong>Target:</strong> ${petition.targetSignatures} signatures</p>
            <p><strong>Progress:</strong> ${Math.round((petition.currentSignatures / petition.targetSignatures) * 100)}%</p>
          </div>
          
          <p>Keep up the great work!</p>
          
          <p>Best regards,<br>Petition System</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Organizer notification sent to ${organizerEmail}`);
    } catch (error) {
      console.error('Error sending organizer notification:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export default new EmailService();