const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
      email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                  validator: (value) => {
                        const emailRegex =
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

                        return emailRegex.test(value);
                  },
                  message: 'Invalid email address',
            },
      },
      hashedPassword: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

const User = model('User', userSchema);

module.exports = User;
