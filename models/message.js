const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const MessageSchema = new Schema({
  title: { type: String, required: true, min: 2 },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
})

// Date Virtual
MessageSchema.virtual('date_formatted').get(() => {
  return moment(this.timestamp).format('YYYY-MM-DD')
})

// Date, Time from current
MessageSchema.virtual('date_difference').get(() => {
  return moment(this.timestamp).fromNow()
})

// Export module
module.exports = mongoose.model('Message', MessageSchema)
