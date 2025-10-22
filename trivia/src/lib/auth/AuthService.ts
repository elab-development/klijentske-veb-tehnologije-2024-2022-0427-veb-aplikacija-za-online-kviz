import type { UserRecord, AuthUser } from '../../types/auth';

const USERS_KEY = 'tq_users';
const CURRENT_KEY = 'tq_current_user';

function readUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: UserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrent(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCurrent(user: AuthUser | null) {
  if (!user) localStorage.removeItem(CURRENT_KEY);
  else localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
}

function genId() {
  return `u_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export class AuthService {
  static getAll(): UserRecord[] {
    return readUsers();
  }

  static getCurrent(): AuthUser | null {
    return readCurrent();
  }

  static isEmailTaken(email: string): boolean {
    const users = readUsers();
    return users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static register(name: string, email: string, password: string): AuthUser {
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered.');
    }
    const newUser: UserRecord = { id: genId(), name, email, password };
    users.push(newUser);
    writeUsers(users);
    const authUser: AuthUser = { id: newUser.id, name, email: newUser.email };
    writeCurrent(authUser);
    return authUser;
  }

  static login(email: string, password: string): AuthUser {
    const users = readUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password.');
    }
    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
    };
    writeCurrent(authUser);
    return authUser;
  }

  static logout(): void {
    writeCurrent(null);
  }
}
