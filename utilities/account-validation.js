const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registrationRules = () => {
    return [
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
        
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
        
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
        
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("account/registration", {
                errors,
                title: "Registration",
                nav,
                account_firstname,
                account_lastname,
                account_email,
                })
                return
        }
    next()
}

/* **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
    return [
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),

        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required."),
    ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("account/login", {
                errors,
                title: "Login",
                nav,
                account_email,
                })
                return
        }
    next()
}

/* **********************************
*  Account Update Data Validation Rules
* ********************************* */
validate.updateRules = () => {
    return [
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),

        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),

        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (value, { req }) => {
            const accountModel = require('../models/account-model')
            const account = await accountModel.getAccountByEmail(value)
            if (account && account.account_id != req.body.account_id) {
                throw new Error('Email address already exists.')
            }
            return true
        }),
    ]
}

/* ******************************
 * Check account update data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            req.flash('notice', 'Please correct the following validation errors: ' + errorMessages.join('. '));
            res.redirect('/account/update/' + res.locals.accountData.account_id);
            return;
        }
    next()
}

/* **********************************
*  Password Change Data Validation Rules
* ********************************* */
validate.passwordRules = () => {
    return [
        body("account_password")
        .trim()
        .notEmpty()
        .withMessage("New password is required.")
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),

        body("confirm_password")
        .trim()
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.account_password) {
                throw new Error('Password confirmation does not match password.');
            }
            return true;
        }),
    ]
}

/* ******************************
 * Check password change data and return errors or continue to change
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_password } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            req.flash('notice', 'Please correct the following password validation errors: ' + errorMessages.join(' '));
            res.redirect('/account/update/' + res.locals.accountData.account_id);
            return;
        }
    next()
}

module.exports = validate
