import { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import * as yup from "yup";
import { User } from "../../models/auth/user.model";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email type").required(),
});

export const forgotPassword = async (req: Request, res: Response) => {
  const { SMTP_USERNAME, SMTP_PASSWORD } = process.env;

  try {
    const validatedData = await forgotPasswordSchema.validate(req.body);
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetTokenLink = `https://www.zonomaly.com/resetPassword?token=${resetPasswordToken}&email=${validatedData.email}`;

    const user = new User(undefined, validatedData.email);

    const transporter = nodemailer.createTransport({
      host: "send.ahasend.com",
      port: 587,
      requireTLS: true,
      secure: false,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: "support@email.zonomaly.com",
      to: validatedData.email,
      subject: "Reset password link",
      text: `Here is your reset password link that you will use \n when your reset your password: \n ${resetPasswordToken}`,
      html: `
				<p>Here is your reset password token that you can use to reset your password:</p>
				<p><a href="${resetTokenLink}">Reset Password</a></p>
				<p>If you did not request this, please ignore this email.</p>
			`,
    };

    transporter.sendMail(mailOptions, async (error) => {
      if (error) {
        throw error;
      }
    });

    await user.setResetToken(resetPasswordToken);
    return res.status(201).json({ message: "Check email for token" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(400).json({ error: "forgot password error has occured" });
  }
};
