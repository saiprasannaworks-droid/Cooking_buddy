import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVariables = requiredVariables.filter(
  (name) => !process.env[name],
);

if (missingVariables.length) {
  throw new Error(
    `Missing required environment variables: ${missingVariables.join(", ")}`,
  );
}