
const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

require("dotenv").config()

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


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("notice", "You are logged in.")
      return res.redirect("/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
	let nav = await utilities.getNav()
	res.render('account/account-management', {
		title: 'Account Management',
		nav,
		errors: null,
		accountData: res.locals.accountData,
	})
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
	let nav = await utilities.getNav()
	const account_id = parseInt(req.params.account_id)
	const accountData = await accountModel.getAccountById(account_id)
	if (!accountData) {
		req.flash('notice', 'Account not found.')
		return res.redirect('/account/')
	}
	res.render('account/update', {
		title: 'Update Account Information',
		nav,
		errors: null,
		message: null,
		accountData,
	})
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res) {
	let nav = await utilities.getNav()
	const { account_firstname, account_lastname, account_email, account_id } = req.body
	const loggedInAccountId = res.locals.accountData.account_id

	if (parseInt(account_id) !== loggedInAccountId) {
		req.flash('notice', 'You can only update your own account.')
		return res.redirect('/account/')
	}

	// Get current account data to check for changes
	const currentAccountData = await accountModel.getAccountById(account_id)
	if (!currentAccountData) {
		req.flash('notice', 'Account not found.')
		return res.redirect('/account/')
	}

	// Check if any information has changed
	const hasChanged = (
		currentAccountData.account_firstname !== account_firstname ||
		currentAccountData.account_lastname !== account_lastname ||
		currentAccountData.account_email !== account_email
	)

	if (!hasChanged) {
		req.flash('notice', 'Account information is the same and has not changed.')
		return res.redirect('/account/update/' + account_id)
	}

	try {
		const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
		if (updateResult) {
			const accountData = await accountModel.getAccountById(account_id)
			delete accountData.account_password
			const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
			if(process.env.NODE_ENV === 'development') {
				res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
			} else {
				res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
			}
			req.flash('notice', 'Account information has been changed.')
			res.redirect('/account/')
		} else {
			req.flash('notice', 'Sorry, the update failed.')
			res.redirect('/account/update/' + account_id)
		}
	} catch (error) {
		req.flash('notice', 'There was an error processing the update.')
		res.redirect('/account/update/' + account_id)
	}
}

/* ****************************************
*  Process password change
* *************************************** */
async function changePassword(req, res) {
	let nav = await utilities.getNav()
	const { account_password, account_id } = req.body
	try {
		const hashedPassword = await bcrypt.hash(account_password, 10)
		const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
		if (updateResult && updateResult.rowCount && updateResult.rowCount > 0) {
			res.clearCookie("jwt")
			req.flash('notice', 'Password changed successfully. Please log in with your new password.')
			res.redirect('/account/login')
		} else {
			req.flash('notice', 'The password change failed.')
			res.redirect('/account/update/' + account_id)
		}
	} catch (error) {
		req.flash('notice', 'There was an error processing the password change.')
		res.redirect('/account/update/' + account_id)
	}
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function accountLogout(req, res, next) {
	res.clearCookie("jwt")
	req.flash("notice", "You have been logged out.")
	res.redirect("/")
}

accountController.buildRegistration = buildRegister
accountController.accountLogin = accountLogin
accountController.buildAccountManagement = buildAccountManagement
accountController.buildUpdateAccount = buildUpdateAccount
accountController.updateAccount = updateAccount
accountController.changePassword = changePassword
accountController.accountLogout = accountLogout

module.exports = accountController

accountController.registerAccount = registerAccount
