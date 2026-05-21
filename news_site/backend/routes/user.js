// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: String,
  password: String // store hashed in production
})

export default mongoose.model('User', userSchema)
