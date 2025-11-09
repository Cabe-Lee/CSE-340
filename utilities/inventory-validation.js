const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must be alphabetic characters only
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification name is required.")
        .isLength({ min: 1 })
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Classification name must be alphabetic characters only, no spaces or special characters."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            const filteredErrors = errors.array().filter(error => error.msg !== "Invalid value")
            res.render("inventory/add-classification", {
                errors: filteredErrors,
                title: "Add Classification",
                nav,
                classification_name,
                })
                return
        }
    next()
}

/* **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.inventoryRules = () => {
    return [
        // classification_id is required and must be an integer
        body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please select a classification."),

        // inv_make is required and must be at least 3 characters, alphabetic
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Make must be at least 3 alphabetic characters."),

        // inv_model is required and must be at least 3 characters, alphabetic
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Model must be at least 3 alphabetic characters."),

        // inv_description is required
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Description is required."),

        // inv_image is required
        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Image path is required."),

        // inv_thumbnail is required
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Thumbnail path is required."),

        // inv_price is required and must be a number
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .withMessage("Price must be a number."),

        // inv_year is required and must be a 4-digit year
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .matches(/^[0-9]{4}$/)
        .withMessage("Year must be a 4-digit number."),

        // inv_miles is required and must be an integer
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Miles must be a number."),

        // inv_color is required and must be alphabetic
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Color must be alphabetic characters only."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            let classificationList = await utilities.buildClassificationList()
            const filteredErrors = errors.array().filter(error => error.msg !== "Invalid value")
            res.render("inventory/add-inventory", {
                errors: filteredErrors,
                title: "Add Inventory",
                nav,
                classificationList,
                classification_id,
                inv_make,
                inv_model,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_year,
                inv_miles,
                inv_color,
                })
            return
        }
    next()
}

module.exports = validate
