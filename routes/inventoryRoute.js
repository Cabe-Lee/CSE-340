// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
// Management dashboard
router.get('/', utilities.checkLogin, utilities.checkAccountType, invController.buildManagement);

// show add-classification view
router.get('/add-classification', utilities.checkLogin, utilities.checkAccountType, invController.buildAddClassification);

// Process the add-classification data
router.post('/add-classification', utilities.checkLogin, utilities.checkAccountType, validate.classificationRules(), validate.checkClassificationData, invController.addClassification);

// show add-inventory view
router.get('/add-inventory', utilities.checkLogin, utilities.checkAccountType, invController.buildAddInventory);

// Process the add-inventory data
router.post('/add-inventory', utilities.checkLogin, utilities.checkAccountType, validate.inventoryRules(), validate.checkInventoryData, invController.addInventory);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInvId);

// Get inventory for AJAX route
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Route to build edit inventory view
router.get('/edit/:inv_id', utilities.checkLogin, utilities.checkAccountType, invController.editInventoryView);

// Process the update-inventory data
router.post('/update-inventory', utilities.checkLogin, utilities.checkAccountType, validate.inventoryRules(), validate.checkUpdateData, invController.updateInventory);

// Route to build delete confirmation view
router.get('/delete/:inv_id', utilities.checkLogin, utilities.checkAccountType, invController.deleteInventoryView);

// Process the delete-inventory data
router.post('/delete-inventory', utilities.checkLogin, utilities.checkAccountType, invController.deleteInventory);

module.exports = router;
