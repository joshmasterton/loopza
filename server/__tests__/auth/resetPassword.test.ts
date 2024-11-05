// import { describe, test } from "vitest";
// import { app } from "../../src/app";
// import request from "supertest";
// import path from "path";

// describe("/auth/forgotPassword", () => {
//   test("Should send an email with reset password token", async () => {
//     await request(app)
//       .post("/auth/signup")
//       .field({
//         username: "testUser",
//         email: "joshmasterton@tuta.io",
//         password: "Password",
//         confirmPassword: "Password",
//       })
//       .attach(
//         "profilePicture",
//         path.resolve(__dirname, "..", "mocks", "mockImage.jpg")
//       );

//     const forgotPassword = await request(app)
//       .post("/auth/forgotPassword")
//       .send({
//         email: "joshmasterton@tuta.io",
//       });

//     console.log(forgotPassword.body.reset_password_token);

//     const resetPassword = await request(app).post("/auth/resetPassword").send({
//       email: "joshmasterton@tuta.io",
//       token: forgotPassword.body.reset_password_token,
//       newPassword: "newPassword",
//       newConfirmPassword: "newPassword",
//     });

//     console.log(resetPassword.body);
//   });
// });
