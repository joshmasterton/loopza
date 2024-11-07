import { tableConfig } from "../../app";
import { queryDatabase } from "../../database/query.database";
import { UserTypes } from "../../types/model/auth/user.type";
import { uploadImage } from "../../config/cloudinary.config";
import bcrypt from "bcryptjs";
import { calculateOnline } from "../../utilities/isOnline.utilities";

export class User {
  public id?: number;
  public username?: string;
  public email?: string;
  public file?: Express.Multer.File;
  private password?: string;
  public isBot?: boolean;
  public avatar_url?: string;
  public personality?: string;
  public interests?: string;
  public disinterests?: string;

  constructor(
    username?: string,
    email?: string,
    password?: string,
    file?: Express.Multer.File,
    isBot?: boolean,
    avatar_url?: string,
    personality?: string,
    interests?: string,
    disinterests?: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.file = file;
    this.isBot = isBot;
    this.avatar_url = avatar_url;
    this.personality = personality;
    this.interests = interests;
    this.disinterests = disinterests;
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

      const existingEmail = await this.getUser("email", this.email);

      if (existingEmail) {
        throw new Error("Email already in use");
      }

      if (!this.password) {
        throw new Error("No password provided");
      }

      const hashedPassword = await bcrypt.hash(this.password, 10);

      if (this.isBot) {
        await queryDatabase(
          `
						INSERT INTO ${tableConfig.getUsersTable()} (
							username, username_lower_case, email, password, profile_picture_url, is_bot, personality, interests, disinterests
						) VALUES (
							$1, $2, $3, $4, $5, $6, $7, $8, $9
						)
					`,
          [
            this.username,
            this.username?.toLowerCase(),
            this.email,
            hashedPassword,
            this.avatar_url,
            this.isBot,
            this.personality,
            this.interests,
            this.disinterests,
          ]
        );
      } else {
        if (!this.file) {
          throw new Error("No profile picture found");
        }

        const uploadedImage = await uploadImage(this.file);

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
      }

      return this;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async login() {
    try {
      const existingUser = await this.getUser("email", this.email);

      if (!existingUser) {
        throw new Error("User login failed");
      }

      const hashedPassword = await this.getUserPassword("email", this.email);

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

  async setResetToken(reset_password_token: string) {
    try {
      await queryDatabase(
        `
					UPDATE ${tableConfig.getUsersTable()}
					SET reset_password_token = $1,
					reset_password_token_expires = $2
					WHERE email = $3
				`,
        [
          reset_password_token,
          new Date(Date.now() + 15 * 60 * 1000),
          this.email,
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async resetPassword(newPassword: string, reset_password_token: string) {
    try {
      const checkResetToken = await queryDatabase(
        `
					SELECT id FROM ${tableConfig.getUsersTable()}
					WHERE reset_password_token = $1
					AND reset_password_token_expires > NOW()
					AND email = $2
				`,
        [reset_password_token, this.email]
      );

      if (!checkResetToken.rows[0]) {
        throw new Error("Reset token expired or incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await queryDatabase(
        `
					UPDATE ${tableConfig.getUsersTable()}
					SET password = $1,
					reset_password_token = NULL,
					reset_password_token_expires = NULL 
					WHERE email = $2
				`,
        [hashedPassword, this.email]
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

  async updateLastOnline(userId: number) {
    try {
      await queryDatabase(
        `
					UPDATE ${tableConfig.getUsersTable()}
					SET last_online = NOW()
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

  async getUserId<T>(method: string, value: T) {
    try {
      const user = await queryDatabase(
        `
					SELECT id, username, email, followers, following,
					posts, comments, likes, dislikes, created_at, last_online, profile_picture_url, is_bot, personality, interests, disinterests
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

  async getUser<T>(
    method: string,
    value: T,
    requesterId?: number,
    is_bot?: boolean
  ) {
    try {
      const user = await queryDatabase(
        `
					SELECT u.id, u.username, u.email, u.followers, u.following,
					u.posts, u.comments, u.likes, u.dislikes, u.created_at, u.profile_picture_url, f.is_accepted,
					f.pending_user_id, u.is_bot, u.personality, u.interests, u.disinterests, u.last_online
					FROM ${tableConfig.getUsersTable()} u
					LEFT JOIN ${tableConfig.getFollowersTable()} f
					ON (f.follower_one_id = u.id AND f.follower_two_id = $2)
					OR (f.follower_one_id = $2 AND f.follower_two_id = u.id)
					WHERE u.${method} = $1
				`,
        [value, requesterId ?? null]
      );

      let serializedUser: UserTypes;

      if (is_bot) {
        const randomBotId =
          Math.floor(Math.random() * (user.rows.length - 1)) + 1;

        serializedUser = user.rows[randomBotId] as UserTypes;
      } else {
        serializedUser = user.rows[0] as UserTypes;
      }

      if (serializedUser) {
        serializedUser.created_at = new Date(
          serializedUser.created_at
        ).toLocaleString();
        serializedUser.last_online = new Date(
          serializedUser.last_online
        ).toLocaleString();
        serializedUser.is_online = calculateOnline(serializedUser.last_online);
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
