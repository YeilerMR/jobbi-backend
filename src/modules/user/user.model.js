const bcrypt = require('bcrypt');

class User {
    constructor(id_user, id_rol, name, last_name, email, phone, password, state_user) {
        this.id_user = id_user;
        this.id_rol = id_rol; // 1 = admin, 2 = client
        this.name = name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.state_user = state_user;
    }

    // Validate data types and lengths
    static validate(userData) {
        const errors = [];

        if (userData.userId && typeof userData.userId !== 'number') {
            errors.push('userId must be a number');
        }

        if (!userData.username || typeof userData.username !== 'string' || userData.username.length > 70) {
            errors.push('username must be a string with a maximum length of 70 characters');
        }

        if (!userData.email || typeof userData.email !== 'string' || userData.email.length > 70) {
            errors.push('email must be a string with a maximum length of 70 characters');
        }

        if (!userData.password || typeof userData.password !== 'string' || userData.password.length > 200) {
            errors.push('password must be a string with a maximum length of 200 characters');
        }

        return errors.length > 0 ? errors : null;
    }

    // Hash password before storing
    static async hashPassword(password) {
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (err) {
            throw new Error('Error hashing password: ' + err.message);
        }
    }

    // Create a new user instance with hashed password
    static async create({ username, email, password }) {
        const errors = this.validate({ username, email, password });
        if (errors) {
            throw new Error('Validation failed: ' + errors.join(', '));
        }

        const hashedPassword = await this.hashPassword(password);
        return new User(null, username, email, hashedPassword);
    }

    // Compare provided password with stored hash
    async comparePassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (err) {
            throw new Error('Error comparing password: ' + err.message);
        }
    }

    // Convert to JSON for API responses (exclude password)
    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            email: this.email
        };
    }
}

module.exports = User;