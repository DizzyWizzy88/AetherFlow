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

        // log to audit table
        await db.query(
            'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
            ['ADD_ITEM', 'inventory_items', result.insertId, `Added item ${sku} - ${item_name}`]
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

// PUT /api/inventory/:id - update an existing item
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { item_name, description, category, quantity_on_hand, reorder_threshold, unit_price } = req.body

    try {
        const [result] = await db.query(
            'UPDATE inventory_items SET item_name=?, description=?, category=?, quantity_on_hand=?, reorder_threshold=?, unit_price=?, updated_at=NOW() WHERE item_id=? AND is_active=1',
            [item_name, description, category, quantity_on_hand, reorder_threshold, unit_price, id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' })
        }

        // log to audit table
        await db.query(
            'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
            ['UPDATE_ITEM', 'inventory_items', id, `Updated item ID ${id}`]
        )

        return res.json({ success: true, message: 'Item updated' })
    } catch (err) {
        console.error('update item error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

// DELETE /api/inventory/:id - soft delete an item
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const [result] = await db.query(
            'UPDATE inventory_items SET is_active=0 WHERE item_id=?',
            [id]
        )

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' })
        }

        // log to audit table
        await db.query(
            'INSERT INTO audit_logs (action, target_type, target_id, details) VALUES (?, ?, ?, ?)',
            ['DELETE_ITEM', 'inventory_items', id, `Soft deleted item ID ${id}`]
        )

        return res.json({ success: true, message: 'Item removed from catalog' })
    } catch (err) {
        console.error('delete item error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

// GET /api/inventory/audit - get audit logs for admins
router.get('/audit', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM audit_logs ORDER BY logged_at DESC LIMIT 50'
        )
        return res.json({ success: true, logs: rows })
    } catch (err) {
        console.error('audit log error:', err)
        return res.status(500).json({ success: false, message: 'Server error' })
    }
})

module.exports = router