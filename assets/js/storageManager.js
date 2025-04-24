export class StorageManager {
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved ${key}:`, data);
  }

  static load(key) {
    const data = localStorage.getItem(key);
    console.log(`Loaded ${key}:`, data ? "done" : "not found");
    return data ? JSON.parse(data) : null;
  }

  static remove(key) {
    localStorage.removeItem(key);
    console.log(`Removed ${key}`);
  }

  static clearAll() {
    localStorage.clear();
    console.log("All data cleared from localStorage");
  }
}
