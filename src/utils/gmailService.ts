import { google, gmail_v1 } from 'googleapis';

class GmailService {
  private static instance: GmailService;
  private gmail: gmail_v1.Gmail;

  private constructor() {
    const auth = new google.auth.OAuth2({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    this.gmail = google.gmail({ version: 'v1', auth });
  }

  public static getInstance(): GmailService {
    if (!GmailService.instance) {
      GmailService.instance = new GmailService();
    }
    return GmailService.instance;
  }

  private createMessage(to: string, otp: string): string {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2E7D32;">Password Reset OTP</h2>
        <p>Hello,</p>
        <p>You have requested to reset your password. Here is your One-Time Password (OTP):</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 8px;
            display: inline-block;
          ">
            ${otp}
          </div>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          BahayCebu Properties<br>
          This is an automated email, please do not reply.
        </p>
      </div>
    `;

    const email = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${to}`,
      'From: BahayCebu Properties <bahaycebuproperties@gmail.com>',
      'Subject: Password Reset OTP - BahayCebu Properties',
      '',
      emailContent
    ].join('\n');

    return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  public async sendOTP(to: string, otp: string): Promise<void> {
    try {
      const raw = this.createMessage(to, otp);

      await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw
        }
      });

      console.log('OTP email sent successfully');
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  }
}

export const gmailService = GmailService.getInstance(); 