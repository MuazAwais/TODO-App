// Yup validation schemas for authentication
// Yup is used with Formik to validate form inputs

import * as Yup from "yup";

// Registration schema
export const registerSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
});

// Login schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

// TypeScript types inferred from schemas
export type RegisterFormValues = Yup.InferType<typeof registerSchema>;
export type LoginFormValues = Yup.InferType<typeof loginSchema>;

