const express = require('express');
const router = express.Router();
const caseController = require('../controllers/casesController');


router.post('/create', caseController.createCase);
router.get('/getcases', caseController.getCases);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);


module.exports = router;


