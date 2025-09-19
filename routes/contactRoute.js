const express = require('express');
const { ContactMessage } = require('../models/contactModel');
const router = express.Router();

// POST - Submit a new contact message
router.post('/submit', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Create new contact message
        const contactMessage = new ContactMessage({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });

        // Save to database
        const savedMessage = await contactMessage.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for your message! I will get back to you soon.',
            data: {
                id: savedMessage._id,
                submittedAt: savedMessage.createdAt
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Sorry, there was an error sending your message. Please try again.'
        });
    }
});

// GET - Get all contact messages (for admin)
router.get('/messages', async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        
        // Build query
        let query = {};
        if (status) {
            query.status = status;
        }

        // Pagination
        const skip = (page - 1) * limit;
        
        // Get messages with pagination
        const messages = await ContactMessage.find(query)
            .sort({ createdAt: -1 }) // Latest first
            .skip(skip)
            .limit(parseInt(limit))
            .select('-ipAddress -userAgent'); // Hide sensitive info

        // Get total count for pagination
        const total = await ContactMessage.countDocuments(query);

        res.json({
            success: true,
            data: {
                messages,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalMessages: total,
                    hasNext: skip + messages.length < total,
                    hasPrev: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages'
        });
    }
});

// PUT - Update message status (for admin)
router.put('/messages/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'read', 'replied', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedMessage = await ContactMessage.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select('-ipAddress -userAgent');

        if (!updatedMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message status updated successfully',
            data: updatedMessage
        });

    } catch (error) {
        console.error('Update message status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating message status'
        });
    }
});

// GET - Get message statistics (for admin dashboard)
router.get('/stats', async (req, res) => {
    try {
        const stats = await ContactMessage.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalMessages = await ContactMessage.countDocuments();
        const todayMessages = await ContactMessage.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        });

        const statusStats = {};
        stats.forEach(stat => {
            statusStats[stat._id] = stat.count;
        });

        res.json({
            success: true,
            data: {
                total: totalMessages,
                today: todayMessages,
                byStatus: {
                    new: statusStats.new || 0,
                    read: statusStats.read || 0,
                    replied: statusStats.replied || 0,
                    archived: statusStats.archived || 0
                }
            }
        });

    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact statistics'
        });
    }
});

// DELETE - Delete a message (for admin)
router.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMessage = await ContactMessage.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.json({
            success: true,
            message: 'Message deleted successfully'
        });

    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting message'
        });
    }
});

module.exports = router;
