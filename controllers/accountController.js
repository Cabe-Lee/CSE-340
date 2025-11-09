
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")

const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
	let nav = await utilities.getNav()
	res.render('account/login', {
		title: 'Login',
		nav,
	})
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render('account/registration', {
    title: 'Register',
    nav,
    errors: null,
  })
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  // use the form field names from the registration view
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    if (regResult && regResult.rowCount && regResult.rowCount > 0) {
      return res.status(201).render('account/registered', {
        title: 'Registration Successful',
        nav,
        firstName: account_firstname,
      })
    }

    return res.status(400).render('account/registration', {
      title: 'Register',
      nav,
      errors: [{ msg: 'Sorry, registration failed. Please try again.' }]
    })
  } catch (error) {
    req.flash('notice', 'Sorry, there was an error processing the registration.')
    return res.status(500).render('account/registration', {
      title: 'Register',
      nav,
      errors: [{ msg: 'Sorry, there was an error processing the registration.' }]
    })
  }
}

accountController.buildRegistration = buildRegister

module.exports = accountController

accountController.registerAccount = registerAccount