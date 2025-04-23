export class StorageManager {
    static save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Loaded ${key}:`, data);
    }

    static load(key) {
        const data = localStorage.getItem(key);
        console.log(`Loaded ${key}:`, "done");
        return data ? JSON.parse(data) : null;

    }

    static remove(key) {
        localStorage.removeItem(key);
        console.log(`Loaded ${key}:`);
    }
}