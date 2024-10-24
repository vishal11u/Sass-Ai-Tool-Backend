// routes/contact.js
const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();
const Notification = require('../models/Notification');

// Create a new contact
router.post('/submit', async (req, res) => {
    const { name, email, country, mobile } = req.body;

    if (!name || !email || !country || !mobile) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newContact = new Contact({ name, email, country, mobile });
        await newContact.save();

        // Create notification for contact action
        const notification = new Notification({
            userId: null,
            type: 'contact',
            message: `New contact form submission from ${name}`,
        });
        await notification.save();
        
        res.status(201).json({ message: 'Contact details submitted successfully!', contact: newContact });
    } catch (error) {
        res.status(500).json({ message: "Error saving contact details", error: error.message });
    }
});

// Get all contacts
router.get('/all-contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contacts", error: error.message });
    }
});

// Get a contact by ID
router.get('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contact", error: error.message });
    }
});

// Update a contact by ID
router.put('/contacts/:id', async (req, res) => {
    const { name, email, country, mobile } = req.body;

    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, { name, email, country, mobile }, { new: true, runValidators: true });
        if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: "Error updating contact", error: error.message });
    }
});

// Delete a contact by ID
router.delete('/contacts/:id', async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);
        if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting contact", error: error.message });
    }
});

module.exports = router;
