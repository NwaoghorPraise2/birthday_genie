import {Server as SocketServer, Socket} from 'socket.io';

export default class SocketService {
    private io: SocketServer;

    constructor(io: SocketServer) {
        this.io = io;
    }

    public emit(event: string, userId: string, data: unknown): void {
        this.io.to(userId).emit(event, data);
    }

    public handleUserSubscription(socket: Socket, userId: string) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        socket.join(userId);
    }
}

