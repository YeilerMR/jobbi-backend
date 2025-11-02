const service = require('./employees.service');

// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await service.createEmployee(req.body);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// List all employees with pagination
exports.listEmployees = async (req, res) => {
  try {
    const filters = {
      limit: req.query.limit || 50,
      offset: req.query.offset || 0,
      id_branch: req.query.id_branch
    };
    const result = await service.listEmployees(filters);
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: result.employees,
      total: result.total
    });
  } catch (error) {
    console.error('Error listing employees:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// List employees by business
exports.listEmployeesByBusiness = async (req, res) => {
  try {
    const { id_business } = req.params;
    // id_business is actually id_user_admin for now since we filter by business owner
    const employees = await service.listEmployeesByBusiness(id_business);
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: employees
    });
  } catch (error) {
    console.error('Error listing employees by business:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// List employees by branch
exports.listEmployeesByBranch = async (req, res) => {
  try {
    const { id_branch } = req.params;
    const filters = { id_branch };
    const result = await service.listEmployees(filters);
    res.status(200).json({
      success: true,
      message: 'Employees retrieved successfully',
      data: result.employees,
      total: result.total
    });
  } catch (error) {
    console.error('Error listing employees by branch:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await service.getEmployeeById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Employee retrieved successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await service.updateEmployee(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    await service.deleteEmployee(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Associate employee to branch
exports.associateToBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_branch } = req.body;
    const employee = await service.associateToBranch(id, id_branch);
    res.status(200).json({
      success: true,
      message: 'Employee associated to branch successfully',
      data: employee
    });
  } catch (error) {
    console.error('Error associating employee to branch:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get employee availability
exports.getAvailability = async (req, res) => {
  try {
    const availability = await service.getAvailability(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Availability retrieved successfully',
      data: availability
    });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Get employee schedule
exports.getSchedule = async (req, res) => {
  try {
    const schedule = await service.getSchedule(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Schedule retrieved successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Get appointments for a specific day for the authenticated employee
exports.getAppointmentsForDay = async (req, res) => {
  try {
    // req.user is set by verifyToken() middleware
    const id_user = req.user?.id_user;
    const date = req.query.date;

    const result = await service.getAppointmentsForDay(id_user, date);

      // If there are no appointments, return an informative message but still 200
      if (!result || !Array.isArray(result.rows) || result.total === 0) {
        return res.status(200).json({
          success: true,
          message: 'No appointments found for the specified date',
          data: [],
          total: 0
        });
      }

      res.status(200).json({
        success: true,
        message: 'Appointments retrieved successfully',
        data: result.rows,
        total: result.total
      });
  } catch (error) {
    console.error('Error getting appointments for day:', error);
    // Basic error mapping
    if (error.message && (error.message.includes('required') || error.message.includes('Invalid'))) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message && error.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
