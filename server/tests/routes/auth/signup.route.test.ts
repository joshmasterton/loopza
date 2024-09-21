// import { describe, expect, test } from "vitest";
// import { app } from "../../../src/app";
// import request from "supertest";

// describe("/login", () => {
//   test("Should return error if invalid credentials", async () => {
//     const invalidUsernameSignup = await request(app).post("/signup").send({
//       username: "test",
//       password: "Password",
//     });

//     const invalidPasswordSignup = await request(app).post("/signup").send({
//       username: "testUser",
//       password: "Pass",
//     });

//     expect(invalidUsernameSignup.body.error.errors[0]).toBe(
//       "username must be at least 6 characters"
//     );

//     expect(invalidPasswordSignup.body.error.errors[0]).toBe(
//       "password must be at least 6 characters"
//     );
//   });
// });
