const Case = require('../model/casesModel');



exports.createCase = async (req, res) => {
    try {
      const { title, description, assignee } = req.body;
      const newCase = await Case.create({ title, description, assignee });
      res.status(201).json(newCase);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create case' });
    }
  };
  
  // Get all cases
  exports.getCases = async (req, res) => {
    try {
      const cases = await Case.find().populate('assignee');
      res.json(cases);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch cases' });
    }
  };
  
  // Get a case by ID
  exports.getCaseById = async (req, res) => {
    try {
      const caseId = req.params.id;
      const caseItem = await Case.findById(caseId).populate('assignee', '-_id name email role');
      res.json(caseItem);
      res.json(caseItem);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch case' });
    }
  };

  // Update a case
  exports.updateCase = async (req, res) => {
    try {
      const caseId = req.params.id;
      const { title, description, assignee } = req.body;
      const updatedCase = await Case.findByIdAndUpdate(caseId, { title, description, assignee }, { new: true });
      res.json(updatedCase);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update case' });
    }
  };
  
  // Delete a case
  exports.deleteCase = async (req, res) => {
    try {
      const caseId = req.params.id;
      await Case.findByIdAndRemove(caseId);
      res.json({ message: 'Case deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete case' });
    }
  };