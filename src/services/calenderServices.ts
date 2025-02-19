import CalenderRepository from '../repositories/calenderRepository';
import IcsEventHandler from '../utils/icsEventHandler';

export default class CalenderService {
    static async doSubscribeToCalender(userId: string) {
        const bithdays = await CalenderRepository.getUserAndFriendsBirthdays(userId);

        // 1. Find user by userId
        // 2. Get user email
        // 3. get user date of birth
        // 4. get birthdays of all friends assointed to user
        // 5. create a birthdday object for all the birthdays
        // 6. create a event for all birthdays
        // 7. subscribe to calender
        // 8. return success message

        // This is a dummy code snippet. Replace this with your actual code.
        // const user = await IcsEventHandler.createEvent({
        //     title: 'Birthday',
        //     description: 'Birthday of user',
        //     start: new Date(),
        //     end: new Date(),
        //     location: 'Home',
        //     url: 'XXXXXXXXXXXXXXXXXXXXXX',
        //     organizer: {
        //         name: 'John Doe',
        //         email: 'john.doe@example.com'
        //     },
        //     attendees: [
        //         {
        //             name: 'John Doe',
        //             email: 'john.doe@example.com',
        //             rsvp: true,
        //             partstat: 'ACCEPTED',
        //             role: 'REQ-PARTICIPANT'
        //         }
        //     ]
        // });
    }
}

