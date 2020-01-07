const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email already registered']
    },
    firstName: {
      type: String,
      required: [true, 'firstName required'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName required'],
    },
    googleId: {
        type: String,
        default: null
    },
    googleToken: {
      type: String,
      default: null
    },
    googleRefreshToken: {
      type: String,
      default: null
    },
    googleFolderId: {
      type: String,
      default: null
    }
});

module.exports = mongoose.model('User', userSchema);
