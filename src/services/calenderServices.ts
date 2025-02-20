// import CalenderRepository from '../repositories/calenderRepository';
// import IcsService from './icsServices';
// import {EventList} from '../types/calender.types';

// export default class CalenderService {
//     static async doSubscribeToCalender(userId: string) {
//         const data = await CalenderRepository.getUserAndFriendsBirthdays(userId);

//         if (!data) {
//             throw new Error('User data not found');
//         }

//         const event: = [
//             {
//                 id: data.id,
//                 name: data.name,
//                 username: data.username,
//                 dateOfBirth: data.dateOfBirth,
//                 // description: data.description,
//                 phoneNumber: data.phoneNumber,
//                 displayName: data.displayName
//             },
//             {
//                 ...data.friends.map((friend) => ({
//                     id: friend.id,
//                     name: friend.name,
//                     preferredName: friend.preferredName,
//                     dateOfBirth: friend.dateOfBirth,
//                     phoneNumber: friend.phoneNumber,
//                     profilePic: friend.profilePic,
//                     email: friend.email,

//                     relationship: friend.relationship,
//                     description: friend.description
//                 }))
//             }
//         ] as Event[];

//         const icsData = IcsService.createEvent(event);
//         return icsData;
//     }
// }

