import Sendchamp from 'sendchamp-sdk';
import { SendSMSDTO } from './sms.dto';
import { SendchampMode, SMSRoute } from 'sendchamp-sdk/lib/constants/types';

export default async function sendOTP({
  message,
  phone_number,
}: SendSMSDTO): Promise<void> {
  try {
    const sendchamp = new Sendchamp({
      mode: SendchampMode.live,
      publicKey:
        'sendchamp_live_$2a$10$0gqYNbhyw6O/aPe4FjyGcOh232Ve.J2ZJ4BAvtzH.7EvjS1uwKPvK',
    });

    // Initialize a service
    const sms = sendchamp.SMS;

    sms
      .send({
        to: phone_number,
        message: message,
        sender_name: 'Quick Pocket',
        route: SMSRoute.dnd,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
