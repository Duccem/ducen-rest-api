export interface CacheBucket {
    setKey(key: string, val: string, time: number): Promise<boolean>;
    getKey(key: string): Promise<string>;
    deleteKey(keys: string[]): Promise<boolean>;
}