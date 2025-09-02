export interface User {
  id: string;
  fullName: string;
  username: string; // Add username field
  email: string;
  password: string;
  role: 'admin' | 'user';
}
