class Branch {
  constructor(id_branch, id_business, name, location, phone, email, state_branch) {
    this.id_branch = id_branch;
    this.id_business = id_business;
    this.name = name;
    this.location = location;
    this.phone = phone;
    this.email = email;
    this.state_branch = state_branch;
  }
}

module.exports = Branch;