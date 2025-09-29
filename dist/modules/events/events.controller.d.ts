import { EventsService } from './events.service';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    list(req: any, limit?: string): Promise<any[]>;
    create(req: any, body: any): Promise<any>;
}
