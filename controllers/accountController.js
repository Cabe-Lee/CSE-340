
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

// /* ****************************************
//  *  Process login request
//  * ************************************ */
// async function accountLogin(req, res) {
//   let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body
//   const accountData = await accountModel.getAccountByEmail(account_email)
//   if (!accountData) {
//     req.flash("notice", "Please check your credentials and try again.")
//     res.status(400).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email,
//     })
//     return
//   }
//   try {
//     if (await bcrypt.compare(account_password, accountData.account_password)) {
//       delete accountData.account_password
//       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//       if(process.env.NODE_ENV === 'development') {
//         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
//       } else {
//         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
//       }
//       return res.redirect("/account/")
//     }
//     else {
//       req.flash("message notice", "Please check your credentials and try again.")
//       res.status(400).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//     }
//   } catch (error) {
//     throw new Error('Access Forbidden')
//   }
// }