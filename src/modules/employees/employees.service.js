const db = require('./employees.db');
const { Employee, availabilityToColor } = require('./employees.model');
const subscriptionService = require("../subscriptions/subscriptions.service");

// Create employee with validation
exports.createEmployee = async (userId, data) => {
  const { id_branch, id_user, availability = 1 } = data;

  // Validate required fields
  if (!id_branch) {
    throw new Error('Branch ID is required');
  }
  if (!id_user) {
    throw new Error('User ID is required');
  }

  // Validate user exists and is active
  const user = await db.ensureUserActive(id_user);
  if (!user) {
    throw new Error('User not found or inactive');
  }

  // Validate branch exists and is active
  const branch = await db.ensureBranchActive(id_branch);
  if (!branch) {
    throw new Error('Branch not found or inactive');
  }

  // Validar límites del plan antes de crear el empleado
  const validation = await subscriptionService.canCreateEmployee(userId, id_branch);
  
  if (!validation.allowed) {
    const error = new Error(validation.message);
    error.status = 403; // Forbidden
    error.details = {
      currentCount: validation.currentCount,
      limit: validation.limit
    };
    throw error;
  }

  // Validate availability (0=busy, 1=available, 2=partial)
  if (![0, 1, 2].includes(availability)) {
    throw new Error('Invalid availability status');
  }

  // Check for duplicate employee in branch
  const exists = await db.existsEmployeeInBranch(id_user, id_branch);
  if (exists) {
    throw new Error('Employee already exists in this branch');
  }

  const result = await db.createEmployee({ id_branch, id_user, availability });
  // Fetch created employee
  const employee = await db.getEmployeeById(result.insertId);
  if (!employee) {
    throw new Error('Employee was created but could not be retrieved');
  }
  return new Employee(employee);
};

// List all employees with pagination
exports.listEmployees = async (filters) => {
  const result = await db.listEmployees(filters);
  const employees = result.rows.map(row => new Employee(row));
  return { employees, total: result.total };
};

// List employees by business
exports.listEmployeesByBusiness = async (id_user_admin) => {
  if (!id_user_admin) {
    throw new Error('User admin ID is required');
  }

  const rows = await db.listEmployeesByBusiness(id_user_admin);
  const employees = rows.map(row => new Employee(row));
  return employees;
};

// Get employee by ID
exports.getEmployeeById = async (id) => {
  if (!id) {
    throw new Error('Employee ID is required');
  }

  const row = await db.getEmployeeById(id);
  if (!row) {
    throw new Error('Employee not found');
  }

  return new Employee(row);
};

// Update employee
exports.updateEmployee = async (id, data) => {
  if (!id) {
    throw new Error('Employee ID is required');
  }

  // Check employee exists
  const existing = await db.getEmployeeById(id);
  if (!existing) {
    throw new Error('Employee not found');
  }

  const { id_branch, availability } = data;
  const updates = {};

  // Validate branch if provided
  if (id_branch !== undefined) {
    const branch = await db.ensureBranchActive(id_branch);
    if (!branch) {
      throw new Error('Branch not found or inactive');
    }
    updates.id_branch = id_branch;
  } else {
    updates.id_branch = existing.id_branch;
  }

  // Validate availability if provided
  if (availability !== undefined) {
    if (![0, 1, 2].includes(availability)) {
      throw new Error('Invalid availability status');
    }
    updates.availability = availability;
  } else {
    updates.availability = existing.availability;
  }

  // Prevent duplicate employee in branch (if changing branch)
  if (
    (updates.id_branch !== existing.id_branch) ||
    (existing.id_user && updates.id_branch)
  ) {
    const exists = await db.existsEmployeeInBranch(existing.id_user, updates.id_branch);
    // Only block if the found employee is not the current one
    if (exists) {
      throw new Error('Employee already exists in this branch');
    }
  }

  await db.updateEmployee(id, updates);
  // Fetch updated employee
  const updated = await db.getEmployeeById(id);
  return new Employee(updated);
};

// Delete employee
exports.deleteEmployee = async (id) => {
  if (!id) {
    throw new Error('Employee ID is required');
  }

  const existing = await db.getEmployeeById(id);
  if (!existing) {
    throw new Error('Employee not found');
  }

  await db.deleteEmployee(id);
  return { success: true };
};

// Associate employee to branch
exports.associateToBranch = async (id_employee, id_branch) => {
  if (!id_employee) {
    throw new Error('Employee ID is required');
  }
  if (!id_branch) {
    throw new Error('Branch ID is required');
  }

  // Check employee exists
  const employee = await db.getEmployeeById(id_employee);
  if (!employee) {
    throw new Error('Employee not found');
  }

  // Validate branch exists and is active
  const branch = await db.ensureBranchActive(id_branch);
  if (!branch) {
    throw new Error('Branch not found or inactive');
  }

  await db.associateToBranch(id_employee, id_branch);
  
  // Fetch updated employee
  const updated = await db.getEmployeeById(id_employee);
  return new Employee(updated);
};

// Get employee availability with traffic light color
exports.getAvailability = async (id_employee) => {
  if (!id_employee) {
    throw new Error('Employee ID is required');
  }

  const result = await db.getAvailability(id_employee);
  if (!result) {
    throw new Error('Employee not found');
  }

  return {
    id_employee,
    availability: result.availability,
    color: availabilityToColor(result.availability)
  };
};

// Get employee schedule
exports.getSchedule = async (id_employee) => {
  if (!id_employee) {
    throw new Error('Employee ID is required');
  }

  // Check employee exists
  const employee = await db.getEmployeeById(id_employee);
  if (!employee) {
    throw new Error('Employee not found');
  }

  return await db.getSchedule(id_employee);
};
