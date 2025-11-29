const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountController.buildLogin))

router.get('/registration', utilities.handleErrors(accountController.buildRegistration))

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

router.get('/update/:account_id', utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

router.post('/update', utilities.checkLogin, regValidate.updateRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

router.post('/update-password', utilities.checkLogin, regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.changePassword))

router.get('/logout', utilities.handleErrors(accountController.accountLogout))

// Process the registration data
router.post(
        "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// also accept POST to /registration (form action uses /account/registration)
router.post('/registration',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router


