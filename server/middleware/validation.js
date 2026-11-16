import Joi from "joi";

/**
  Creates a validation function for theJoi schema.
  Returns the validation result, collecting errors.
 */

const validate = (rules) => (inputData) =>
  rules.validate(inputData, { abortEarly: false });

// Registration data
const registrationRules = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).required(),
  location: Joi.string().trim().allow(""),
  description: Joi.string().trim().allow(""),
  occupation: Joi.string().trim().allow(""),
}).required();

// Login data
const loginRules = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required(),
}).required();

// Photo upload form data
const photoRules = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().allow("").default(""),
}).required();

// New comment data
const commentRules = Joi.object({
  comment: Joi.string().trim().required(),
}).required();

// Route parameters, such as /api/photos/:id
const parameterRules = Joi.object({
  id: Joi.string().hex().length(24).required(),
}).required();

// Export a separate validation function for each purpose
export const validateRegister = validate(registrationRules);
export const validateLogin = validate(loginRules);
export const validatePhoto = validate(photoRules);
export const validateComment = validate(commentRules);
export const validateIdParams = validate(parameterRules);
