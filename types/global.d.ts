declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    };

    namespace NodeJS {
        interface ProcessEnv {
            MONGODB_URI: string;
        }
    }
}

export { };

