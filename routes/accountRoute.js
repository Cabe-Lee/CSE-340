const express = require('express')
const router = new express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities')
const regValidate = require('../utilities/account-validation')

router.get('/login', utilities.handleErrors(accountController.buildLogin))

router.get('/registration', utilities.handleErrors(accountController.buildRegistration))

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

module.exports = router