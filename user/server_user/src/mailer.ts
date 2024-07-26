import { config } from "./config/appConfig";
import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(config.MAILJET_API_KEY, config.MAILJET_SECRET_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = async ({ to,subject,text }: SendEmailParams): Promise<void> => {
  try {
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'pspranjalsharma10@gmail.com',
              Name: 'Admin Vegavid',
            },
            To: [
              {
                Email: to,
              },
            ],
            Subject: subject,
            TextPart: text,
          },
        ],
      });

    const response = await request;
  } catch (err) {
    console.error(err);
  }
};

export { sendEmail };

