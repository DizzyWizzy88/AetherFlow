const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// allow requests from our react frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())

// routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

// quick test route to make sure server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'server is running' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
