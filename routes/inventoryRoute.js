// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
// Management dashboard
router.get('/', invController.buildManagement);

// show add-classification view
router.get('/add-classification', invController.buildAddClassification);

// Process the add-classification data
router.post('/add-classification', validate.classificationRules(), validate.checkClassificationData, invController.addClassification);

// show add-inventory view
router.get('/add-inventory', invController.buildAddInventory);

// Process the add-inventory data
router.post('/add-inventory', validate.inventoryRules(), validate.checkInventoryData, invController.addInventory);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;