import { check } from "express-validator";

export const registerDataCheck = [
  check("username").notEmpty().withMessage("username cannot be empty"),
  check("password").notEmpty().withMessage("password cannot be empty"),
  check("email").notEmpty().withMessage("email cannot be empty"),
  check("name").notEmpty().withMessage("name cannot be empty"),
];

export const loginDataCheck = [
  check("username").notEmpty().withMessage("username cannot be empty"),
  check("password").notEmpty().withMessage("password cannot be empty"),
];
