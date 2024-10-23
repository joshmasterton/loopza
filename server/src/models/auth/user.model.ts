import { tableConfig } from "../../app";
import { queryDatabase } from "../../database/query.database";
import { UserTypes } from "../../types/model/auth/user.type";
import { uploadImage } from "../../config/cloudinary.config";
import bcrypt from "bcryptjs";

export class User {
  public id?: number;
  public username?: string;
  public email?: string;
  public file?: Express.Multer.File;
  private password?: string;

  constructor(
    username?: string,
    email?: string,
    password?: string,
    file?: Express.Multer.File
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.file = file;
  }

  async signup() {
    try {
      const existingUser = await this.getUser(
        "username_lower_case",
        this.username?.toLowerCase()
      );

      if (existingUser) {
        throw new Error("Username already in use");
      }

      if (!this.password) {
        throw new Error("No password provided");
      }

      if (!this.file) {
        throw new Error("No profile picture found");
      }

      const uploadedImage = await uploadImage(this.file);

      const hashedPassword = await bcrypt.hash(this.password, 10);

      await queryDatabase(
        `
					INSERT INTO ${tableConfig.getUsersTable()} (
						username, username_lower_case, email, password, profile_picture_url
					) VALUES (
						$1, $2, $3, $4, $5
					)
				`,
        [
          this.username,
          this.username?.toLowerCase(),
          this.email,
          hashedPassword,
          uploadedImage,
        ]
      );

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async login() {
    try {
      const existingUser = await this.getUser(
        "username_lower_case",
        this.username?.toLowerCase()
      );

      if (!existingUser) {
        throw new Error("User login failed");
      }

      const hashedPassword = await this.getUserPassword(
        "username_lower_case",
        this.username?.toLowerCase()
      );

      if (!this.password || !hashedPassword) {
        throw new Error("User login failed");
      }

      const comparePassword = await bcrypt.compare(
        this.password,
        hashedPassword
      );

      if (!comparePassword) {
        throw new Error("User login failed");
      }

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async logout(userId: number) {
    try {
      await queryDatabase(
        `
					UPDATE ${tableConfig.getUsersTable()}
					SET refresh_token = NULL
					WHERE id = $1
				`,
        [userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async updateRefreshToken(token: string, userId: number) {
    try {
      await queryDatabase(
        `
					UPDATE ${tableConfig.getUsersTable()}
					SET refresh_token = $1
					WHERE id = $2
				`,
        [token, userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getUserId<T>(method: string, value: T) {
    try {
      const user = await queryDatabase(
        `
					SELECT id, username, email, followers, following,
					comments, likes, dislikes, created_at, profile_picture_url
					FROM ${tableConfig.getUsersTable()} 
					WHERE ${method} = $1
				`,
        [value]
      );

      return user.rows[0].id as number;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getUserPassword<T>(method: string, value: T) {
    try {
      const user = await queryDatabase(
        `
					SELECT password
					FROM ${tableConfig.getUsersTable()} 
					WHERE ${method} = $1
				`,
        [value]
      );

      return user.rows[0].password as string;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async getUser<T>(method: string, value: T) {
    try {
      const user = await queryDatabase(
        `
					SELECT id, username, email, followers, following,
					comments, likes, dislikes, created_at, profile_picture_url
					FROM ${tableConfig.getUsersTable()} 
					WHERE ${method} = $1
				`,
        [value]
      );

      const serializedUser = user.rows[0] as UserTypes;

      if (serializedUser) {
        serializedUser.created_at = new Date(
          serializedUser.created_at
        ).toLocaleString();
      }

      return serializedUser;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw error;
      }
    }
  }
}
