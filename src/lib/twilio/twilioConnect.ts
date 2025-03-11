import {Twilio} from 'twilio';
import config from '../../config/config';

const TwilioConnect = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
export default TwilioConnect;

