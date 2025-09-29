export declare class RedisService {
    private mockStore;
    getClient(): {
        get: (key: string) => Promise<string>;
        set: (key: string, value: string) => Promise<string>;
        del: (key: string) => Promise<1 | 0>;
    };
}
