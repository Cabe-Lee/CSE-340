const errorController = {}

errorController.error500 = async function (req, res, next) {
  next({ status: 500, message: 'You are lost and you found Bob. Server error.' })
}

module.exports = errorController
