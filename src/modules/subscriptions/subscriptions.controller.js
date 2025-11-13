const subscriptionService = require('./subscriptions.service');
const subscriptionDb = require('./subscriptions.db');

/**
 * Get the current authenticated user's plan info
 */
exports.getMyPlan = async (req, res) => {
  try {
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const planInfo = await subscriptionService.getUserPlanInfo(req.user.id_user);
    if (!planInfo) {
      return res.status(404).json({
        success: false,
        message: "You don't have an active plan",
      });
    }
    res.status(200).json({
      success: true,
      message: 'Plan information retrieved successfully',
      data: planInfo,
    });
  } catch (error) {
    console.error('Error getting plan info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all available plans (public)
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await subscriptionDb.getAllPlans();
    const plansWithLimits = await Promise.all(
      plans.map(async (plan) => {
        const limits = await subscriptionDb.getPlanLimits(plan.id_plans_subscription);
        return { ...plan, limits };
      })
    );
    res.status(200).json({
      success: true,
      message: 'Plans retrieved successfully',
      data: plansWithLimits,
    });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current usage of the authenticated user's plan
 */
exports.getMyPlanUsage = async (req, res) => {
  try {
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const usage = await subscriptionService.getPlanUsage(req.user.id_user);
    const planWithLimits = await subscriptionService.getUserPlanWithLimits(req.user.id_user);

    res.status(200).json({
      success: true,
      message: 'Usage retrieved successfully',
      data: {
        usage,
        limits: planWithLimits?.limits || null,
        planName: planWithLimits?.plan_name || null,
      },
    });
  } catch (error) {
    console.error('Error getting usage:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check if the authenticated admin can create a branch
 */
exports.canCreateBranch = async (req, res) => {
  try {
    if (!req.user || req.user.id_rol != 1) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    const { businessId } = req.query;
    if (!businessId) {
      return res.status(400).json({ success: false, message: 'businessId is required' });
    }

    const validation = await subscriptionService.canCreateBranch(req.user.id_user, Number(businessId));
    res.status(200).json({ success: true, data: validation });
  } catch (error) {
    console.error('Error checking branch creation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Check if the authenticated admin can create an employee in a branch
 */
exports.canCreateEmployee = async (req, res) => {
  try {
    if (!req.user || req.user.id_rol != 1) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    const { branchId } = req.query;
    if (!branchId) {
      return res.status(400).json({ success: false, message: 'branchId is required' });
    }

    const validation = await subscriptionService.canCreateEmployee(req.user.id_user, Number(branchId));
    res.status(200).json({ success: true, data: validation });
  } catch (error) {
    console.error('Error checking employee creation:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Assign/subscribe a plan to the authenticated admin user
 */
exports.assignPlan = async (req, res) => {
  try {
    if (!req.user || req.user.id_rol != 1) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }
    const result = await subscriptionService.assignPlanToUser(req.user.id_user, Number(planId));
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[CONTROLLER] assignPlan ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Change the authenticated admin user's plan with validations
 */
exports.changePlan = async (req, res) => {
  try {
    if (!req.user || req.user.id_rol != 1) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    const { newPlanId } = req.body;
    if (!newPlanId) {
      return res.status(400).json({ success: false, message: 'newPlanId is required' });
    }
    const result = await subscriptionService.changeUserPlan(req.user.id_user, Number(newPlanId));
    if (!result.changed) {
      if (result.reason) {
        return res.status(409).json({ success: false, message: result.message, details: result });
      }
      return res.status(200).json({ success: true, data: result });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error changing plan:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Get subscription history for authenticated user
 */
exports.getMySubscriptionHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.id_user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const history = await subscriptionService.getSubscriptionHistory(req.user.id_user);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a specific user's plan by userId (admin only)
 */
exports.getPlanByUserId = async (req, res) => {
  try {
    if (!req.user || req.user.id_rol != 1) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    const planInfo = await subscriptionService.getUserPlanInfo(Number(userId));
    res.status(200).json({ success: true, data: planInfo });
  } catch (error) {
    console.error('Error getting user plan by id:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
/** End of controller */
