// authService.ts
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import pool from '../db';
import userService from '../services/userService';
import { sanitizeInput } from '../utils/utils';

const jwtSecret = process.env.JWT_SECRET || 'thisisadummysecretkey';
class AuthService {
  async signUp(
    username: string,
    password: string,
    role: string,
    name: string,
    contact_email: string,
    school_id: string,
    contact_phone: string,
    mailing_address: string
  ): Promise<string | null> {
    try {
      // Check if the username is already taken
      const sanitizedUsername = sanitizeInput(username);
      const existingUser = await userService.getUserByUsername(username);

      if (existingUser) {
        return null; // Username already exists
      }
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Store the user in the database
      const result = await userService.createUser({
        username,
        password: hashedPassword,
        role,
        name,
        school_id,
        contact_phone,
        contact_email,
        mailing_address,
      });

      // Return the user's ID
      return result.id;
    } catch (error: any) {
      console.error('Error during sign-up:', error);

      // Handle specific errors (example: duplicate username)
      if (error.name === 'SequelizeUniqueConstraintError') {
        return 'Username already exists.';
      }

      // Handle other errors appropriately (log, return error message, etc.)
      return 'An error occurred during sign-up.';
    }
  }

  async logIn(username: string, password: string): Promise<string | null> {
    try {
      // Retrieve the user from the database
      const sanitizedUsername = sanitizeInput(username);
      const existingUser = await userService.getUserByUsername(sanitizedUsername);
      // Check if the user exists

      if (!existingUser) {
        return null; // User not found
      }

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, existingUser.password);

      // If passwords match, generate a JWT token
      if (passwordMatch) {
        const payload = {
          userId: existingUser.id,
          username: existingUser.username,
          role: existingUser.role,
        };
        console.log("payload:", payload);
        const token = jwt.sign(payload, jwtSecret, {
          // expire in 1 day
          expiresIn: '1d',
        });
        return token;
      } else {
        return null; // Passwords do not match
      }
    } catch (error) {
      console.error('Error during login:', error);
      return null; // Handle errors appropriately (log, return error message, etc.)
    }
  }
}

export default new AuthService();
