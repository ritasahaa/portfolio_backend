const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration
const createTransporter = () => {
    // For development, you can use Gmail SMTP or a service like Ethereal Email
    // For production, use a professional email service like SendGrid, AWS SES, etc.
    
    // Option 1: Gmail (if configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('Using Gmail SMTP for email delivery');
        return Promise.resolve(nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }));
    }
    
    // Option 2: Ethereal Email (for testing when no real email configured)
    console.log('Using Ethereal Email for testing (no real email configured)');
    return nodemailer.createTestAccount().then((testAccount) => {
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    });
};

const sendPasswordResetEmail = async (email, username, resetToken) => {
    try {
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: {
                name: process.env.EMAIL_DISPLAY_NAME || 'Portfolio Admin System',
                address: process.env.EMAIL_FROM || 'noreply@portfolio.com'
            },
            to: email,
            subject: 'Password Reset Request - Portfolio Admin',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Portfolio Admin</h1>
                        <p style="color: #e3f2fd; margin: 5px 0 0 0; font-size: 14px;">Password Reset Request</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px; background-color: white;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${username}!</h2>
                        <p style="color: #666; line-height: 1.6;">You have requested to reset your password for the Portfolio Admin panel.</p>
                        
                        <div style="background: linear-gradient(45deg, #f0f7ff, #e3f2fd); border-left: 4px solid #2196f3; padding: 20px; margin: 25px 0; border-radius: 5px;">
                            <p style="margin: 0 0 10px 0; font-weight: bold; color: #1976d2;">Your Reset Token:</p>
                            <div style="background-color: white; padding: 15px; text-align: center; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <h1 style="color: #1976d2; font-size: 32px; letter-spacing: 4px; margin: 0; font-family: 'Courier New', monospace;">${resetToken}</h1>
                            </div>
                        </div>
                        
                        <div style="background-color: #fff3e0; border: 1px solid #ffb74d; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #f57c00; margin-top: 0;">⚠️ Important Security Information</h3>
                            <ul style="color: #666; margin: 0; padding-left: 20px;">
                                <li>This token is valid for <strong>15 minutes</strong> only</li>
                                <li>Do not share this token with anyone</li>
                                <li>If you didn't request this reset, please ignore this email</li>
                                <li>This is an automated system - do not reply to this email</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #e8f5e8; border: 1px solid #81c784; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <h3 style="color: #388e3c; margin-top: 0;">📝 How to Reset Your Password</h3>
                            <ol style="color: #666; margin: 0; padding-left: 20px; line-height: 1.6;">
                                <li>Go to the admin login page</li>
                                <li>Click "Forgot Password?"</li>
                                <li>Enter your username and the token above</li>
                                <li>Create your new secure password</li>
                            </ol>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #37474f; color: #b0bec5; padding: 20px 30px; text-align: center; font-size: 12px;">
                        <p style="margin: 0;">Portfolio Admin Security System</p>
                        <p style="margin: 5px 0 0 0;">This is an automated security email. Please do not reply.</p>
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #546e7a;">
                            <p style="margin: 0; color: #78909c;">Sent by: Portfolio Admin System</p>
                            <p style="margin: 0; color: #78909c;">⚠️ This is a no-reply email - do not respond</p>
                        </div>
                    </div>
                </div>
            `,
            text: `
🔐 PORTFOLIO ADMIN - PASSWORD RESET REQUEST

Hello ${username},

You have requested to reset your password for the Portfolio Admin panel.

YOUR RESET TOKEN: ${resetToken}

⚠️ IMPORTANT SECURITY INFORMATION:
- This token is valid for 15 minutes only
- Do not share this token with anyone
- If you didn't request this reset, please ignore this email
- This is an automated system - do not reply to this email

📝 HOW TO RESET YOUR PASSWORD:
1. Go to the admin login page
2. Click "Forgot Password?"
3. Enter your username and this token
4. Create your new secure password

---
Portfolio Admin Security System
This is an automated no-reply email from the Portfolio Admin System.
⚠️ DO NOT REPLY to this email address.
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        // For Ethereal Email, log the preview URL
        if (info.messageId.includes('ethereal.email')) {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
        
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info)
        };
        
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const sendWelcomeEmail = async (email, username, tempPassword) => {
    try {
        const transporter = await createTransporter();
        
        const mailOptions = {
            from: {
                name: process.env.EMAIL_DISPLAY_NAME || 'Portfolio Admin System',
                address: process.env.EMAIL_FROM || 'noreply@portfolio.com'
            },
            to: email,
            subject: 'Welcome to Portfolio Admin',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Portfolio Admin</h2>
                    <p>Hello <strong>${username}</strong>,</p>
                    <p>Your admin account has been created successfully!</p>
                    <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0;">
                        <h3>Your Login Credentials:</h3>
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
                    </div>
                    <p style="color: #d9534f;"><strong>Important Security Notice:</strong></p>
                    <ul>
                        <li>Please change your password immediately after first login</li>
                        <li>Go to Admin Panel → User Management to update your credentials</li>
                        <li>Keep your login credentials secure</li>
                    </ul>
                    <p>You can access the admin panel at: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin-login">Admin Login</a></p>
                </div>
            `,
            text: `
Welcome to Portfolio Admin

Hello ${username},

Your admin account has been created successfully!

Your Login Credentials:
Username: ${username}
Temporary Password: ${tempPassword}

Important Security Notice:
- Please change your password immediately after first login
- Go to Admin Panel → User Management to update your credentials
- Keep your login credentials secure

You can access the admin panel at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin-login
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        return {
            success: true,
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info)
        };
        
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail
};
