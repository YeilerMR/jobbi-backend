class Business {
  constructor(id_business, id_user_admin, name, location, phone, email, state_business) {
    this.id_business = id_business;
    this.id_user_admin = id_user_admin;
    this.name = name;
    this.location = location;
    this.phone = phone;
    this.email = email;
    this.state_business = state_business;
  }
}

module.exports = Business;