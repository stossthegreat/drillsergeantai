import { OnModuleInit } from '@nestjs/common';
export declare class PrismaService implements OnModuleInit {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    event: {
        create: (data: any) => Promise<any>;
        findMany: (query: any) => Promise<any[]>;
    };
}
