const express = require('express');
const router = express.Router();

const controller = require('./subscriptions.controller');
const verifyToken = require('../../utils/services/verifyToken');
const { verifyAdmin } = require('../../utils/services/verifyToken');

// Public: list all plans with limits
router.get('/plans', controller.getAllPlans);

// Admin only: my plan
router.get('/my-plan', verifyAdmin(), controller.getMyPlan);

// Admin only: check limits
router.get('/can-create-business', verifyAdmin(), controller.canCreateBusiness);
router.get('/can-create-branch', verifyAdmin(), controller.canCreateBranch);
router.get('/can-create-employee', verifyAdmin(), controller.canCreateEmployee);

// Admin only: usage and history
router.get('/my-usage', verifyAdmin(), controller.getMyPlanUsage);
router.get('/my-history', verifyAdmin(), controller.getMySubscriptionHistory);

// Admin-protected: assign/change plan
router.post('/assign', verifyAdmin(), controller.assignPlan);
router.post('/change', verifyAdmin(), controller.changePlan);

// Admin: get plan by user id
router.get('/:userId/plan', verifyAdmin(), controller.getPlanByUserId);

module.exports = router;
