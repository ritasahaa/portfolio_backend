const User = require('./models/userModel');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/portfolio')
    .then(() => {
        console.log('Connected to MongoDB');
        createDefaultAdmin();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

async function createDefaultAdmin() {
    try {
        // Check if any user exists
        const existingUser = await User.findOne();
        
        if (existingUser) {
            console.log('Admin user already exists:', existingUser.username);
            console.log('If you want to reset credentials, use the User Management panel in the admin interface.');
            process.exit(0);
        }

        // Create default admin user
        const defaultAdmin = new User({
            username: 'admin',
            password: 'admin123',
            email: 'admin@portfolio.com',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await defaultAdmin.save();
        console.log('Default admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');
        console.log('Please change these credentials immediately after first login.');
        
    } catch (error) {
        console.error('Error creating default admin:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}
