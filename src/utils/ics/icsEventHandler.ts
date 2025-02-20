import ics, {EventAttributes} from 'ics';

export default class IcsEventHandler {
    public static async createEvent(event: EventAttributes) {
        return new Promise((resolve, reject) => {
            ics.createEvent(event, (error, value) => {
                if (error) {
                    reject(error);
                }
                resolve(value);
            });
        });
    }
}

