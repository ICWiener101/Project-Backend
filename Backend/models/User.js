const { Schema, model } = require('mongoose');

const userSchema = new Schema({
      email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                  validator: (value) => {
                        // Use a regular expression to validate the email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        return emailRegex.test(value);
                  },
                  message: 'Invalid email address',
            },
      },
      hashedPassword: { type: String, required: true },
});

userSchema.index({
      unique: true,
      collation: { locale: 'en', strength: 2 },
});

const User = model('User', userSchema);

module.exports = User;
