declare type ContextType = Object | string;
declare class Logger {
    private enabled;
    private previous;
    constructor();
    disable(): void;
    private dateToText;
    private log;
    logSuccess(context: ContextType, title: string, ...data: any): void;
    logError(context: ContextType, title: string, ...data: any): void;
    logInfo(context: ContextType, title: string, ...data: any): void;
    logView(context: ContextType, title: string, ...data: any): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map