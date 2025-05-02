import { StorageManager } from "./storageManager.js";

export class User {
  constructor(
    id,
    userName,
    email,
    password,
    role,
    createdAt = new Date(),
    profilePicture = "",
    deliveryData
  ) {
    this.id = id;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.profilePicture = profilePicture;
    this.deliveryData = deliveryData;
  }
}

export class UserManager {
  static getDefaultProfilePicture() {
    return "../images/anonymous.png"; // THE DEFAULT PP WE'RE YET TO ADD IN THE IMAGES FILE
  }

  static getNextUserId() {
    const users = StorageManager.load("users") || [];
    if (users.length === 0) return 1;
    const maxId = Math.max(...users.map((user) => user.id));
    return maxId + 1;
  }

  static createUser(userName, email, password, role, profilePicture = "") {
    console.log(
      "createUser: Attempting to create user with userName:",
      userName,
      "email:",
      email,
      "role:",
      role
    );
    // Validate inputs
    if (!userName || !email || !password || !role) {
      console.error(
        "createUser: userName, email, password, and role are required."
      );
      throw new Error("userName, email, password, and role are required.");
    }
    const validRoles = ["customer", "seller", "admin"];
    if (!validRoles.includes(role)) {
      console.error("createUser: Invalid role:", role);
      throw new Error("Invalid role. Must be customer, seller, or admin.");
    }

    // Check if email already exists
    const exists = UserManager.getUserByEmail(email);
    if (exists) {
      console.error("createUser: Email already registered:", email);
      throw new Error("Email already registered.");
    }

    const id = UserManager.getNextUserId();
    const newProfilePicture =
      profilePicture || UserManager.getDefaultProfilePicture();
    const user = new User(
      id,
      userName,
      email,
      password,
      role,
      new Date(),
      newProfilePicture
    );
    let users = StorageManager.load("users") || [];
    users.push(user);
    StorageManager.save("users", users);
    console.log("createUser: User created successfully:", user);
    return user;
  }

  static getUser(id) {
    console.log("getUser: Fetching user with id:", id);
    const users = StorageManager.load("users") || [];
    const user = users.find((user) => user.id === id);
    console.log("getUser: Found user:", user);
    return user;
  }

  static getUserNameById(id) {
    console.log("getUserNameById: Fetching username for id:", id);
    const user = UserManager.getUser(id);
    return user ? user.userName : null;
  }

  static getUserByEmail(email) {
    console.log("getUserByEmail: Fetching user with email:", email);
    const users = StorageManager.load("users") || [];
    const user = users.find((user) => user.email === email);
    console.log("getUserByEmail: Found user:", user);
    return user;
  }

  static updateUser(id, userName, email, password, role, profilePicture = "") {
    console.log("updateUser: Updating user with id:", id);
    let users = StorageManager.load("users") || [];
    // Get the current user data to keep values (like createdAt and the existing profilePicture)
    const oldUser = users.find((user) => user.id == id);
    if (!oldUser) {
      console.error("updateUser: User not found with id:", id);
      return;
    }
    const newProfilePicture =
      profilePicture ||
      oldUser.profilePicture ||
      UserManager.getDefaultProfilePicture();
    users = users.map((user) =>
      user.id === id
        ? new User(
            id,
            userName,
            email,
            password,
            role,
            oldUser.createdAt,
            newProfilePicture
          )
        : user
    );
    StorageManager.save("users", users);
    console.log("updateUser: User updated successfully:", {
      id,
      userName,
      email,
      role,
    });
  }

  static deleteUser(id) {
    console.log("deleteUser: Deleting user with id:", id);
    let users = StorageManager.load("users") || [];
    users = users.filter((user) => user.id != id);
    StorageManager.save("users", users);
    console.log("deleteUser: User deleted successfully:", id);
  }

  static getAllUsers() {
    console.log("getAllUsers: Fetching all users");
    const users = StorageManager.load("users") || [];
    console.log("getAllUsers: Found users:", users);
    return users;
  }

  static initializeDefaultAdmin() {
    const adminUserName = "AdminUser";
    const adminEmail = "admin@ecommerce.com";
    const adminPassword = "admin123";
    const adminRole = "admin";

    console.log("initializeDefaultAdmin: Checking for default admin");
    //   const exists = UserManager.getUserByEmail(adminEmail);
    //   if (!exists) {
    //     UserManager.createUser(
    //       adminUserName,
    //       adminEmail,
    //       adminPassword,
    //       adminRole
    //     );
    //     console.log("initializeDefaultAdmin: Default admin created");
    //   } else {
    //     console.log("initializeDefaultAdmin: Default admin already exists");
    //   }
  }
}

function initializeDefaultSellers() {
  const defaultUsers = [
    new User(
      1,
      "Admin",
      "Admin@ecommerce.com",
      "admin123",
      "admin",
      new Date("2025-01-01"),
      "https://i.pravatar.cc/150?img=1"
    ),
    new User(
      2,
      "Mahmoud Taha",
      "mahmoud.taha@ecommerce.com",
      "Taha2025!",
      "seller",
      new Date("2025-01-10"),
      "https://i.pravatar.cc/150?img=2"
    ),
    new User(
      3,
      "Omar Khaled",
      "omar.khaled@ecommerce.com",
      "Khaled$25",
      "seller",
      new Date("2025-02-20"),
      "https://i.pravatar.cc/150?img=3"
    ),
    new User(
      4,
      "Farah Alaa",
      "farah.alaa@ecommerce.com",
      "Farah#2025",
      "seller",
      new Date("2025-03-30"),
      "https://i.pravatar.cc/150?img=4"
    ),
    new User(
      5,
      "Dina Mostafa",
      "dina.mostafa@ecommerce.com",
      "Dina_M25",
      "customer",
      new Date("2025-01-15"),
      "https://i.pravatar.cc/150?img=5"
    ),
    new User(
      6,
      "Ibrahim Shaban",
      "ibrahim.shaban@ecommerce.com",
      "Ibrahim@25",
      "customer",
      new Date("2025-02-10"),
      "https://i.pravatar.cc/150?img=6"
    ),
    new User(
      7,
      "Taha Hassan",
      "taha.hassan@ecommerce.com",
      "Hassan!25",
      "customer",
      new Date("2025-12-26"),
      "https://i.pravatar.cc/150?img=7"
    ),
    new User(
      8,
      "Aya Nour",
      "aya.nour@ecommerce.com",
      "Nour_Aya22",
      "seller",
      new Date("2025-04-15"),
      "https://i.pravatar.cc/150?img=8"
    ),
    new User(
      9,
      "Khaled Samir",
      "khaled.samir@ecommerce.com",
      "Samir$2025",
      "customer",
      new Date("2025-05-20"),
      "https://i.pravatar.cc/150?img=9"
    ),
    new User(
      10,
      "Nour Ehab",
      "nour.ehab@ecommerce.com",
      "Ehab#Nour25",
      "customer",
      new Date("2025-06-10"),
      "https://i.pravatar.cc/150?img=10"
    ),
    new User(
      11,
      "Hassan Youssef",
      "hassan.youssef@ecommerce.com",
      "Youssef!2025",
      "seller",
      new Date("2025-07-05"),
      "https://i.pravatar.cc/150?img=11"
    ),
    new User(
      12,
      "Laila Rami",
      "laila.rami@ecommerce.com",
      "Rami_Laila25",
      "customer",
      new Date("2025-08-12"),
      "https://i.pravatar.cc/150?img=12"
    ),
    new User(
      13,
      "Amr Zaki",
      "amr.zaki@ecommerce.com",
      "Zaki#25",
      "customer",
      new Date("2025-09-20"),
      "https://i.pravatar.cc/150?img=13"
    ),
    new User(
      14,
      "Rania Adel",
      "rania.adel@ecommerce.com",
      "Adel$Rania22",
      "seller",
      new Date("2025-10-15"),
      "https://i.pravatar.cc/150?img=14"
    ),
  ];

  if (!StorageManager.load("users")) {
    StorageManager.save("users", defaultUsers);
    console.log("initializeDefaultSellers: Default users initialized");
  }
}
initializeDefaultSellers();
