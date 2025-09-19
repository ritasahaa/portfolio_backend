const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please enter a valid email address'
        }
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for efficient querying
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ email: 1 });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = { ContactMessage };
