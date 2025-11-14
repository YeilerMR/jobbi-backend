const express = require('express');
const router = express.Router();

const controller = require('./subscriptions.controller');
const verifyToken = require('../../utils/services/verifyToken');
const { verifyAdmin } = require('../../utils/services/verifyToken');

// Public: list all plans with limits
router.get('/plans', controller.getAllPlans);

// Admin only: my plan
router.get('/my-plan', verifyAdmin(), controller.getMyPlan);

// Admin-protected: assign/change plan
router.post('/assign', verifyAdmin(), controller.assignPlan);
router.post('/change', verifyAdmin(), controller.changePlan);

// Admin: get plan by user id
router.get('/:userId/plan', verifyAdmin(), controller.getPlanByUserId);

module.exports = router;
