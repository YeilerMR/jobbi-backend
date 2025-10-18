class Employee {
  constructor({
    id_employee,
    id_branch = null,
    id_user,
    availability = null,
    name = null,
    last_name = null,
    email = null,
    phone = null,
    branch_name = null
  }) {
    this.id_employee = id_employee;
    this.id_branch = id_branch;
    this.id_user = id_user;
    this.availability = availability; // 0=busy, 1=available, 2=partially_available
    // User information
    this.name = name;
    this.last_name = last_name;
    this.email = email;
    this.phone = phone;
    // Branch information (optional)
    if (branch_name) {
      this.branch_name = branch_name;
    }
  }
}

// Map availability to traffic light
const AVAILABILITY_MAP = {
  0: 'red',    // busy/unavailable
  1: 'green',  // available
  2: 'yellow'  // partially available
};

function availabilityToColor(availability) {
  return AVAILABILITY_MAP[availability] ?? 'red';
}

module.exports = { Employee, availabilityToColor, AVAILABILITY_MAP };
