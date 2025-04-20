import { StorageManager } from './storageManager.js';

export class User {
    constructor(id, email, password, role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

export class UserManager {
    static createUser(email, password, role) {
        const id = Date.now();
        const user = new User(id, email, password, role);
        let users = StorageManager.load('users') || [];
        users.push(user);
        StorageManager.save('users', users);
        return user;
    }

    static getUser(id) {
        const users = StorageManager.load('users') || [];
        return users.find(user => user.id === id);
    }

    static getUserByEmail(email) {
        const users = StorageManager.load('users') || [];
        return users.find(user => user.email === email);
    }

    static updateUser(id, email, password, role) {
        let users = StorageManager.load('users') || [];
        users = users.map(user => 
            user.id === id ? new User(id, email, password, role) : user
        );
        StorageManager.save('users', users);
    }

    static deleteUser(id) {
        let users = StorageManager.load('users') || [];
        users = users.filter(user => user.id !== id);
        StorageManager.save('users', users);
    }

    static getAllUsers() {
        return StorageManager.load('users') || [];
    }

    static initializeDefaultAdmin() {
        const adminEmail = 'admin@ecommerce.com';
        const adminPassword = 'admin123';
        const adminRole = 'admin';

        const exists = UserManager.getUserByEmail(adminEmail);
        if (!exists) {
            UserManager.createUser(adminEmail, adminPassword, adminRole);
        }
    }
}