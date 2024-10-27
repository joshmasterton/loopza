import { tableConfig } from "../../app";
import { queryDatabase } from "../../database/query.database";
import { UserTypes } from "../../types/model/auth/user.type";

export class Following {
  public id?: number;
  public follower_initiator_id?: number;
  public follower_one_id?: number;
  public follower_two_id?: number;
  public is_accepted?: boolean;
  public pending_user_id?: number;
  public created_at?: string;

  constructor(
    follower_initiator_id?: number,
    follower_one_id?: number,
    follower_two_id?: number
  ) {
    this.follower_initiator_id = follower_initiator_id;
    this.follower_one_id = follower_one_id;
    this.follower_two_id = follower_two_id;
  }

  async new() {
    try {
      const existingFollowing = await this.get();

      if (existingFollowing) {
        if (existingFollowing.is_accepted) {
          throw new Error("Already followers");
        } else {
          if (
            existingFollowing.pending_user_id === this.follower_initiator_id
          ) {
            await queryDatabase(
              `
								UPDATE ${tableConfig.getFollowersTable()}
								SET is_accepted = true
								WHERE (follower_one_id = $1
								AND follower_two_id = $2)
								OR (follower_one_id = $2
								AND follower_two_id = $1)
							`,
              [this.follower_one_id, this.follower_two_id]
            );

            return await this.get();
          } else {
            throw new Error("Waiting for response");
          }
        }
      } else {
        await queryDatabase(
          `
						INSERT INTO ${tableConfig.getFollowersTable()} (
							follower_initiator, follower_one_id, follower_two_id,
							pending_user_id
						) VALUES (
							 $1, $2, $3, $4
						)
					`,
          [
            this.follower_initiator_id,
            this.follower_one_id,
            this.follower_two_id,
            this.follower_two_id,
          ]
        );

        return await this.get();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async delete() {
    try {
      const existingFollowing = await this.get();

      if (!existingFollowing) {
        throw new Error("No following to remove");
      }

      await queryDatabase(
        `
					DELETE FROM ${tableConfig.getFollowersTable()}
					WHERE (follower_one_id = $1
					AND follower_two_id = $2)
					OR (follower_one_id = $2
					AND follower_two_id = $1)
				`,
        [this.follower_one_id, this.follower_two_id]
      );

      return { message: "Deleted following successfully" };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get() {
    try {
      const following = await queryDatabase(
        `
					SELECT u.id, u.username, u.email, u.followers, u.following,
					u.posts, u.comments, u.likes, u.dislikes, u.created_at, u.profile_picture_url, f.is_accepted,
					f.pending_user_id
					FROM ${tableConfig.getUsersTable()} u
					JOIN ${tableConfig.getFollowersTable()} f
					ON (f.follower_one_id = $1 AND f.follower_two_id = $2)
					OR (f.follower_one_id = $2 AND f.follower_two_id = $1)
					WHERE u.id = $2
				`,
        [this.follower_one_id, this.follower_two_id]
      );

      if (following.rows[0]) {
        following.rows[0].created_at = new Date(
          following.rows[0].created_at
        ).toLocaleString();
        return following.rows[0];
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async gets(
    type: "all" | "followers",
    userId?: number,
    search?: string,
    page: number = 0
  ) {
    try {
      const searchQuery = search ? `%${search}%` : null;

      if (type == "all") {
        const users = await queryDatabase(
          `
						SELECT u.id, u.username, u.email, u.followers, u.following,
						u.posts, u.comments, u.likes, u.dislikes, u.created_at, u.profile_picture_url, f.is_accepted,
						f.pending_user_id
						FROM ${tableConfig.getUsersTable()} u
						LEFT JOIN ${tableConfig.getFollowersTable()} f
						ON (f.follower_one_id = $1 AND f.follower_two_id = u.id)
						OR (f.follower_one_id = u.id AND f.follower_two_id = $1)
						${userId ? "WHERE u.id != $1" : ""}
						${search ? "AND WHERE u.username_lower_case ILIKE $3" : ""}
						LIMIT 10 OFFSET $2
					`,
          search ? [userId, page * 10, searchQuery] : [userId, page * 10]
        );

        const allUsers: UserTypes[] = await Promise.all(
          users.rows.map((user: UserTypes) => {
            return {
              ...user,
              created_at: new Date(user.created_at).toLocaleString(),
            };
          })
        );

        return allUsers;
      } else {
        const followers = await queryDatabase(
          `
						SELECT u.id, u.username, u.email, u.followers, u.following,
						u.posts, u.comments, u.likes, u.dislikes, u.created_at, u.profile_picture_url, f.is_accepted,
						f.pending_user_id
						FROM ${tableConfig.getUsersTable()} u
						JOIN ${tableConfig.getFollowersTable()} f
						ON (f.follower_one_id = $1 AND f.follower_two_id = u.id)
						OR (f.follower_one_id = u.id AND f.follower_two_id = $1)
						${userId ? "WHERE u.id != $1" : ""}
						${search ? "AND WHERE u.username_lower_case ILIKE $3" : ""}
						LIMIT 10 OFFSET $2
					`,
          search ? [userId, page * 10, searchQuery] : [userId, page * 10]
        );

        const allFollowers: UserTypes[] = await Promise.all(
          followers.rows.map((follower: UserTypes) => {
            return {
              ...follower,
              created_at: new Date(follower.created_at).toLocaleString(),
            };
          })
        );

        return allFollowers;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
