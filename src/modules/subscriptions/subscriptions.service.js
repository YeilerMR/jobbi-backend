const subscriptionDb = require('./subscriptions.db');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  // Format to YYYY-MM-DD for MySQL DATE
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function getUserPlanInfo(userId) {
  const active = await subscriptionDb.getActiveSubscriptionWithPlan(userId);
  if (!active) return null;
  const limits = await subscriptionDb.getPlanLimits(active.id_plans_subscription);
  return {
    plan_id: active.id_plans_subscription,
    plan_name: active.plan_name,
    plan_description: active.plan_description,
    price: active.price,
    duration_days: active.duration,
    start_date: active.start_date,
    end_date: active.end_date,
    limits,
  };
}

async function getUserPlanWithLimits(userId) {
  const active = await subscriptionDb.getActiveSubscriptionWithPlan(userId);
  if (!active) return null;
  const limits = await subscriptionDb.getPlanLimits(active.id_plans_subscription);
  return {
    plan_id: active.id_plans_subscription,
    plan_name: active.plan_name,
    limits,
  };
}

async function getPlanUsage(userId) {
  // Count businesses, branches and employees
  const totalBusinesses = await subscriptionDb.countBusinessesForAdmin(userId);
  const totalBranches = await subscriptionDb.countBranchesForAdmin(userId);
  const branchIds = await subscriptionDb.getBranchesForAdmin(userId);
  const employeesByBranch = [];
  for (const bid of branchIds) {
    const total = await subscriptionDb.countEmployeesInBranch(bid);
    employeesByBranch.push({ branchId: bid, employees: total });
  }
  return { totalBusinesses, totalBranches, employeesByBranch };
}

async function canCreateBusiness(userId) {
  const plan = await getUserPlanWithLimits(userId);
  if (!plan) {
    return { allowed: false, reason: 'no_active_plan', message: "You don't have an active plan" };
  }
  const usage = await getPlanUsage(userId);
  const maxBusinesses = plan.limits.maxBusinesses; // null means unlimited
  if (maxBusinesses === null) {
    return { allowed: true, usage: { totalBusinesses: usage.totalBusinesses, maxBusinesses: null } };
  }
  const allowed = usage.totalBusinesses < maxBusinesses;
  if (!allowed) {
    return {
      allowed: false,
      reason: 'business_limit_reached',
      message: 'You already have the maximum number of businesses allowed by your plan.',
      currentCount: usage.totalBusinesses,
      limit: maxBusinesses,
      usage: { totalBusinesses: usage.totalBusinesses, maxBusinesses },
    };
  }
  return { allowed: true, usage: { totalBusinesses: usage.totalBusinesses, maxBusinesses } };
}

async function canCreateBranch(userId /*, businessId */) {
  const plan = await getUserPlanWithLimits(userId);
  if (!plan) {
    return { allowed: false, reason: 'no_active_plan', message: "You don't have an active plan" };
  }
  const usage = await getPlanUsage(userId);
  const maxBranches = plan.limits.maxBranches; // null means unlimited
  if (maxBranches === null) {
    return { allowed: true, usage: { totalBranches: usage.totalBranches, maxBranches: null } };
  }
  const allowed = usage.totalBranches < maxBranches;
  if (!allowed) {
    return {
      allowed: false,
      reason: 'branch_limit_reached',
      message: 'You already have the maximum number of branches allowed by your plan.',
      currentCount: usage.totalBranches,
      limit: maxBranches,
      usage: { totalBranches: usage.totalBranches, maxBranches },
    };
  }
  return { allowed: true, usage: { totalBranches: usage.totalBranches, maxBranches } };
}

async function canCreateEmployee(userId, branchId) {
  const plan = await getUserPlanWithLimits(userId);
  if (!plan) {
    return { allowed: false, reason: 'no_active_plan', message: "You don't have an active plan" };
  }
  const current = await subscriptionDb.countEmployeesInBranch(branchId);
  const maxEmp = plan.limits.maxEmployeesPerBranch; // null means unlimited
  if (maxEmp === null) {
    return { allowed: true, usage: { employeesInBranch: current, maxEmployeesPerBranch: null } };
  }
  const allowed = current < maxEmp;
  if (!allowed) {
    return {
      allowed: false,
      reason: 'employees_per_branch_limit_reached',
      message: 'This branch already has the maximum number of employees allowed by your plan.',
      currentCount: current,
      limit: maxEmp,
      usage: { employeesInBranch: current, maxEmployeesPerBranch: maxEmp },
    };
  }
  return { allowed: true, usage: { employeesInBranch: current, maxEmployeesPerBranch: maxEmp } };
}

async function assignPlanToUser(userId, planId) {
  const plan = await subscriptionDb.getPlanById(planId);
  if (!plan || plan.is_active !== 1) {
    throw new Error('Invalid or inactive plan');
  }

  const today = new Date();
  const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const endDate = addDays(startDate, plan.duration || 30);

  await subscriptionDb.deactivateActiveSubscriptions(userId);
  await subscriptionDb.createSubscription(userId, planId, startDate, endDate);

  const limits = await subscriptionDb.getPlanLimits(planId);
  return {
    assigned: true,
    plan_id: planId,
    plan_name: plan.name,
    start_date: startDate,
    end_date: endDate,
    limits,
  };
}

async function changeUserPlan(userId, newPlanId) {
  const current = await subscriptionDb.getActiveSubscriptionWithPlan(userId);
  if (current && Number(current.id_plans_subscription) === Number(newPlanId)) {
    return { changed: false, reason: 'same_plan', message: 'Already on the selected plan' };
  }

  const plan = await subscriptionDb.getPlanById(newPlanId);
  if (!plan || plan.is_active !== 1) {
    throw new Error('Invalid or inactive plan');
  }

  // Validate limits
  const limits = await subscriptionDb.getPlanLimits(newPlanId);
  const usage = await getPlanUsage(userId);

  // Business limit check
  if (limits.maxBusinesses !== null && usage.totalBusinesses > limits.maxBusinesses) {
    return {
      changed: false,
      reason: 'business_limit_exceeded',
      message: `You currently have ${usage.totalBusinesses} businesses which exceeds the new plan limit (${limits.maxBusinesses}).`,
      limits,
      usage,
    };
  }

  // Branch limit check
  if (limits.maxBranches !== null && usage.totalBranches > limits.maxBranches) {
    return {
      changed: false,
      reason: 'branch_limit_exceeded',
      message: `You currently have ${usage.totalBranches} branches which exceeds the new plan limit (${limits.maxBranches}).` ,
      limits,
      usage,
    };
  }

  // Employees per branch limit check
  if (limits.maxEmployeesPerBranch !== null) {
    const offending = usage.employeesByBranch.find((b) => b.employees > limits.maxEmployeesPerBranch);
    if (offending) {
      return {
        changed: false,
        reason: 'employees_per_branch_limit_exceeded',
        message: `Branch ${offending.branchId} has ${offending.employees} employees which exceeds the new plan limit (${limits.maxEmployeesPerBranch}).`,
        limits,
        usage,
      };
    }
  }

  // Assign new subscription
  const today = new Date();
  const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const endDate = addDays(startDate, plan.duration || 30);

  await subscriptionDb.deactivateActiveSubscriptions(userId);
  await subscriptionDb.createSubscription(userId, newPlanId, startDate, endDate);

  return {
    changed: true,
    plan_id: newPlanId,
    plan_name: plan.name,
    start_date: startDate,
    end_date: endDate,
    limits,
  };
}

async function getSubscriptionHistory(userId) {
  return subscriptionDb.getSubscriptionHistory(userId);
}

module.exports = {
  getUserPlanInfo,
  getUserPlanWithLimits,
  getPlanUsage,
  canCreateBusiness,
  canCreateBranch,
  canCreateEmployee,
  assignPlanToUser,
  changeUserPlan,
  getSubscriptionHistory,
};
