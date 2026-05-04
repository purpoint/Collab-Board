import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { JWT_SECRET } from '../config/env.js'

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body

        const existing = await User.findOne({ username })
        if (existing) {
            return res.status(400).json({ error: 'Username already taken' })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({ username, email, passwordHash })
        await user.save()

        const token = jwt.sign(
            { userId: user._id, username: user.username, avatarColor: user.avatarColor },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(201).json({ token, user: user.toSafeObject() })
    } catch (err) {
        next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' })
        }

        await User.findByIdAndUpdate(user._id, { lastSeenAt: new Date() })

        const token = jwt.sign(
            { userId: user._id, username: user.username, avatarColor: user.avatarColor },
            JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(200).json({ token, user: user.toSafeObject() })
    } catch (err) {
        next(err)
    }
}