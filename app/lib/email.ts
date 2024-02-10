import nodemailer from "nodemailer";

type Profile = {
  name: string;
  email: string;
};
interface EmailOptions {
  profile: Profile;
  subject: "verification" | "forget-password" | "password-change";
  linkUr?: string;
}

const generateMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: false,
    auth: {
      user: "bablumia.dev@gmail.com",
      pass: "rgpq zppe ecva wwub ",
    },
  });

  return transporter;
};

const sendEmailVerificationLink = async (profile: Profile, linkUrl: string) => {
  const transporter = generateMailTransporter();
  await transporter.sendMail({
    from: "bablumia.dev@gmail.com",
    to: profile.email,
    subject: "Verify your email address",
    text: "Verify your email address",
    html: `
      <p>Hello,</p>
      <p>Thank you for signing up! Please click on the following link to verify your email address:</p>
      <p><a href="${linkUrl}">Verify Email</a></p>
    `,
  });
};

const sendForgetPasswordLink = async (profile: Profile, linkUrl: string) => {
  const transporter = generateMailTransporter();
  await transporter.sendMail({
    from: "bablumia.dev@gmail.com",
    to: profile.email,
    subject: "Reset Your Password",
    text: "Reset Your Password",
    html: `
    <p>Hello,</p>
    <p>We received a request to reset your password. Please click on the following link to reset your password:</p>
    <p><a href="${linkUrl}">Reset Password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `,
  });
};

const passwordChangeConfrimation = async (profile: Profile) => {
  const transporter = generateMailTransporter();
  await transporter.sendMail({
    from: "bablumia.dev@gmail.com",
    to: profile.email,
    subject: "Verify your email address",
    text: "Verify your email address",
    html: `
       <h1>Your password is now changed</h1> 
      `,
  });
};

export const sendEmail = (optins: EmailOptions) => {
  const { profile, subject, linkUr } = optins;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUr!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUr!);
    case "password-change":
      return passwordChangeConfrimation(profile);
  }
};
