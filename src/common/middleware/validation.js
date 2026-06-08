import { body, validationResult } from "express-validator";

// ── Shared validate runner (يشتغل كـ last step في أي array) ──
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ── Sign Up rules + validate (array يُمرَّر مباشرة للـ route) ──
export const signUpValidation = [
  body("userName")
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters")
    .trim(),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
  validate,   // ← مدمج هنا عشان نتجنب تعديل الـ controller
];

// ── Login rules + validate ──
export const loginValidation = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email address"),
  body("password")
    .notEmpty().withMessage("Password is required"),
  validate,   // ← مدمج هنا
];

// ── Change Password rules (الـ controller بيضيف validate بنفسه) ──
export const changePasswordValidation = [
  body("oldPassword").notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 6 }).withMessage("Must be at least 6 characters")
    .matches(/\d/).withMessage("Must contain at least one number"),
];
