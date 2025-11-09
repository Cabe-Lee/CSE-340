const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className
  if (data.length > 0) {
    className = data[0].classification_name
  } else {
    const classification = await invModel.getClassificationById(classification_id)
    className = classification ? classification.classification_name : 'Unknown'
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const grid = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()
  const invName = data[0].inv_id
  res.render("./inventory/detail", {
    title: invName + " " + data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
    nav,
    grid,
  })
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('./inventory/add-classification', {
    title: 'Add Classification',
    nav,
  })
}

/* ***************************
 *  Build add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render('./inventory/add-inventory', {
    title: 'Add Inventory',
    nav,
    classificationList,
  })
}

/* ***************************
 *  Process add-classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult && addResult.rows && addResult.rows.length > 0) {
    req.flash("notice", `Congratulations, you\'ve added ${classification_name}`)
    const newClassificationId = addResult.rows[0].classification_id
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      newClassificationId,
    })
  } else {
    req.flash("notice", "Sorry, the classification registration failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ***************************
 *  Process add-inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

  const addResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  if (addResult && addResult.rows && addResult.rows.length > 0) {
    req.flash("notice", `Congratulations, you\'ve added ${inv_make} ${inv_model}`)
    let classificationList = await utilities.buildClassificationList()
    const newInvId = addResult.rows[0].inv_id
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      newInvId,
    })
  } else {
    req.flash("notice", "Sorry, the inventory registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    })
  }
}

module.exports = invCont
