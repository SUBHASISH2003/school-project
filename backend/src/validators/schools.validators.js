import { body } from 'express-validator';

export const createSchoolRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('contact')
    .trim()
    .matches(/^\d{7,15}$/)
    .withMessage('Contact must be 7-15 digits'),
  body('email_id').trim().isEmail().withMessage('Valid email is required'),
];
