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

// Get all notifications with unread count
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });

        res.status(200).json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
});

// Mark all notifications as read
router.put('/markAllRead/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await Notification.updateMany({ userId, isRead: false }, { $set: { isRead: true } });
        res.status(200).json({ message: 'All notifications marked as read', unreadCount: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error marking notifications as read', error });
    }
});

module.exports = router;
