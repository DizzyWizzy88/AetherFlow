const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const ACCESS_EXPIRY = '15m'
const REFRESH_EXPIRY = '7d'

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    // basic validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' })
    }

    try {
        // look up user in db
        const [rows] = await db.query(
            'SELECT users.*, roles.role_name FROM users JOIN roles ON users.role_id = roles.role_id WHERE users.username = ?',
            [username]
        )

        const user = rows[0]

        // user not found
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        // account disabled
        if (!user.is_active) {
            return res.status(401).json({ success: false, message: 'Account is disabled' })
        }

        // check password against hash
        const passwordOk = await bcrypt.compare(password, user.password_hash)

        if (!passwordOk) {
            // keeping message vague so attackers dont know what was wrong
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        // generate tokens
        const accessToken = jwt.sign(
            { user_id: user.user_id, username: user.username, role: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: ACCESS_EXPIRY }
        )

        const refreshToken = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: REFRESH_EXPIRY }
        )

        // store refresh token hash in db
        const tokenHash = await bcrypt.hash(refreshToken, 10)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

        await db.query(
            'INSERT INTO auth_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [user.user_id, tokenHash, expiresAt]
        )

        // log the login event to audit log
        await db.query(
            'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
            [user.user_id, 'LOGIN', 'User logged in successfully', req.ip]
        )

        return res.json({
            success: true,
            accessToken,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role_name
            }
        })

    } catch (err) {
        console.error('login error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

module.exports = router
