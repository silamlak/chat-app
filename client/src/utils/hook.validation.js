import * as yup from 'yup';

export const signUpValidation = yup.object({
  name: yup
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    // .min(8, 'Password must be at least 8 characters long')
    // .max(20, 'Password must be at most 20 characters long')
    // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9]/, 'Password must contain at least one number')
    // .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('Password is required')
});

export const signInValidation = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    // .min(8, 'Password must be at least 8 characters long')
    // .max(20, 'Password must be at most 20 characters long')
    // .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    // .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .matches(/[0-9]/, 'Password must contain at least one number')
    // .matches(/[@$!%*?&#]/, 'Password must contain at least one special character')
    .required('Password is required')
});