const errorController = {}

// Controller triggers a 500 error
errorController.error500 = async function (req, res, next) {
  // create an error and pass to next() so the app-level error handlers catch it
  next({ status: 500, message: 'You are lost and you found Bob. Server error.' })
}

module.exports = errorController
