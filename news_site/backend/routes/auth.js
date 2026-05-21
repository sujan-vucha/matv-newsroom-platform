import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  let user; // ✅ declare it here!

  try {
    let { email, password } = req.body

    email = email.trim().toLowerCase()

    console.log('Login attempt:', email, password)

    const allUsers = await User.find({})
    console.log('🧾 ALL USERS IN DATABASE:', allUsers)

    user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') })
    console.log('User found in DB:', user)

    if (!user || user.password !== password) {
      console.log('Login failed: invalid credentials')
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' })

    res.json({
      token,
      user: { email }
    })
  } catch (err) {
    console.error('Error during login:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})


export default router
