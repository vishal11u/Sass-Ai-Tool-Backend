// routes/notifications.js
const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Create a notification (POST route)
router.post('/create', async (req, res) => {
    const { userId, type, message } = req.body;

    try {
        const notification = new Notification({
            userId,
            type,
            message,
            isRead: false
        });

        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notification', error });
    }
});

router.get('/admin/all', async (req, res) => {
    try {
        // Fetch all notifications sorted by creation date
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Optionally, count unread notifications for the admin's reference
        const unreadCount = await Notification.countDocuments({ isRead: false });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
});

// Mark all notifications as read
router.put('/markAllRead', async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
        res.status(200).json({ message: 'All notifications marked as read', unreadCount: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error });
    }
});

module.exports = router;
