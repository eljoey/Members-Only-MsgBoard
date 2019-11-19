const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  first_name: { type: String, required: true, min: 2, max: 100 },
  last_name: { type: String, required: true, min: 2, max: 100 },
  username: { type: String, required: true, min: 2, max: 100 },
  password: { type: String, required: true, min: 7, max: 30 },
  membership: { type: String, required: true },
  admin: { type: Boolean, default: false }
})

// Export model
module.exports = mongoose.model('User', UserSchema)
