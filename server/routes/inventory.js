const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /api/inventory - get all inventory items
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM inventory_items WHERE is_active = 1 ORDER BY item_name'
        )
        return res.json({ success: true, items: rows })
    } catch (err) {
        console.error('inventory fetch error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

// GET /api/inventory/search - search by SKU or name
router.get('/search', async (req, res) => {
    const { q } = req.query

    if (!q) {
        return res.status(400).json({ success: false, message: 'Search query required' })
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM inventory_items WHERE is_active = 1 AND (sku LIKE ? OR item_name LIKE ? OR category LIKE ?) ORDER BY item_name',
            [`%${q}%`, `%${q}%`, `%${q}%`]
        )
        return res.json({ success: true, items: rows })
    } catch (err) {
        console.error('search error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

// POST /api/inventory - add new item
router.post('/', async (req, res) => {
    const { sku, item_name, description, category, quantity_on_hand, reorder_threshold, unit_price } = req.body

    if (!sku || !item_name) {
        return res.status(400).json({ success: false, message: 'SKU and item name are required' })
    }

    try {
        const [result] = await db.query(
            'INSERT INTO inventory_items (sku, item_name, description, category, quantity_on_hand, reorder_threshold, unit_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [sku, item_name, description || '', category || '', quantity_on_hand || 0, reorder_threshold || 10, unit_price || 0]
        )
        return res.json({ success: true, message: 'Item added', item_id: result.insertId })
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'SKU already exists' })
        }
        console.error('add item error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

module.exports = router