import { tableConfig } from "../../app";
import { queryDatabase } from "../../database/query.database";

export class Following {
  public id?: number;
  public follower_initiator_id?: number;
  public follower_one_id?: number;
  public follower_two_id?: number;
  public is_accepted?: boolean;
  public pending_user_id?: number;
  public created_at?: string;

  constructor(
    follower_initiator_id: number,
    follower_one_id: number,
    follower_two_id: number
  ) {
    this.follower_initiator_id = follower_initiator_id;
    this.follower_one_id = follower_one_id;
    this.follower_two_id = follower_two_id;
  }

  async new() {
    try {
      const existingFollowing = await this.get();

      if (existingFollowing) {
        if (existingFollowing.pending_user_id === this.follower_initiator_id) {
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
      } else {
        const newFollower = await queryDatabase(
          `
						INSERT INTO ${tableConfig.getFollowersTable()} (
							follower_initiator, follower_one_id, follower_two_id,
							pending_user_id
						) VALUES (
							 $1, $2, $3, $4
						) RETURNING *
					`,
          [
            this.follower_initiator_id,
            this.follower_one_id,
            this.follower_two_id,
            this.follower_two_id,
          ]
        );

        return newFollower.rows[0];
      }
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
					SELECT * FROM ${tableConfig.getFollowersTable()}
					WHERE (follower_one_id = $1
					AND follower_two_id = $2)
					OR (follower_one_id = $2
					AND follower_two_id = $1)
				`,
        [this.follower_one_id, this.follower_two_id]
      );

      if (following.rows[0]) {
        return following.rows[0];
      }

      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
