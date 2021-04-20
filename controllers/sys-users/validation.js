const db = require('../../database')
const { body, validationResult } = require('express-validator');

module.exports.validateSysUserCreation = [
  body('email', 'Email is valid').isEmail(),   
  body('phone', 'invalid Phone No.').exists().isMobilePhone(),
  body('status', 'Choose action').exists().isNumeric(),
  body('fullName', 'Enter User Name').exists(),
  body('role', 'Enter User Privilege').exists(),
  body('password').isLength({ min: 8, max: 16 }),
  body('confirmPassword', 'Passwords Must match')
    .custom((value, { req }) => value.toString() === req.body.password.toString())
]

module.exports.validateSysUserLogin = [
  body('email', 'invalid Email').isEmail(),  
  body('password', 'Enter Your Password').notEmpty()
]