import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// grabbing these from the .env file so we dont hardcode secrets
const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

// not sure if 12 rounds is overkill but professor said higher is more secure
const SALT_ROUNDS = 12

// access tokens expire fast, refresh tokens last longer
// read that 15min is pretty standard for access tokens
const ACCESS_EXPIRY = '15m'
const REFRESH_EXPIRY = '7d'


// hashes the password before we store it in the db
export async function hashPassword(password) {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)
    return hashed
}


// checks if the password the user typed matches what we have stored
export async function verifyPassword(password, hash) {
    const match = await bcrypt.compare(password, hash)
    return match
}


// makes the short lived token that the frontend will use for requests
export function makeAccessToken(user) {
    // only putting non sensitive stuff in here
    const data = {
        user_id: user.user_id,
        username: user.username,
        role: user.role_name
    }

    const token = jwt.sign(data, JWT_SECRET, { expiresIn: ACCESS_EXPIRY })
    return token
}


// refresh token is stored in the db so we can invalidate it if needed
export function makeRefreshToken(user) {
    const data = {
        user_id: user.user_id
    }

    const token = jwt.sign(data, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY })
    return token
}


// checks if the token is still valid when a request comes in
export function checkAccessToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return { valid: true, payload: decoded }
    } catch(err) {
        // token could be expired or just wrong
        if (err.name === 'TokenExpiredError') {
            return { valid: false, reason: 'expired' }
        }
        return { valid: false, reason: 'invalid' }
    }
}


export function checkRefreshToken(token) {
    try {
        const decoded = jwt.verify(token, REFRESH_SECRET)
        return { valid: true, payload: decoded }
    } catch(err) {
        return { valid: false, reason: 'invalid or expired' }
    }
}


// main login function
// the route handler is responsible for actually pulling the user from the db
// and passing it in here
export async function login(username, password, userFromDB) {

    // make sure user actually exists first
    if (!userFromDB) {
        return { success: false, message: 'Invalid credentials' }
    }

    // check if account is disabled
    if (!userFromDB.is_active) {
        return { success: false, message: 'Account is disabled' }
    }

    const passwordOk = await verifyPassword(password, userFromDB.password_hash)

    if (!passwordOk) {
        // keeping message vague on purpose so attackers dont know what was wrong
        return { success: false, message: 'Invalid credentials' }
    }

    // both tokens get generated on successful login
    const accessToken = makeAccessToken(userFromDB)
    const refreshToken = makeRefreshToken(userFromDB)

    // refresh token hash should get saved to auth_tokens table by the caller
    return {
        success: true,
        accessToken,
        refreshToken,
        user: {
            user_id: userFromDB.user_id,
            username: userFromDB.username,
            role: userFromDB.role_name
        }
    }
}