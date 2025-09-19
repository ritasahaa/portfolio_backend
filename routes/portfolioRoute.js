const router = require('express').Router();
const {
    Header,
    Introduction,
    About,
    Skill,
    Experience,
    Project,
    Education,
    Certificate,
    Contact,
    LeftSider,
    Footer,
    SocialStats

} = require('../models/portfolioModel');
const User = require('../models/userModel');
const { sendPasswordResetEmail } = require('../utils/emailService');

// Get all Portfolio data


router.get('/get-portfolio-data', async (req, res) => {
    try {
        const headers = await Header.find();
        const introductions = await Introduction.find();
        const abouts = await About.find();
        const skills = await Skill.find();
        const experiences = await Experience.find();
        const projects = await Project.find();
        const educations = await Education.find();
        const certificates = await Certificate.find();
        const contacts = await Contact.find();
        const leftSides = await LeftSider.find();
        const footer = await Footer.find();
        const socialStats = await SocialStats.find();

        if (leftSides[0]) {
            leftSides[0].email = `mailto:${leftSides[0].email}`;
        }

        // Ensure socialStats has default values if none exist
        let socialStatsData = socialStats[0];
        // If no socialStatsData, do not create default. Just leave as undefined/null.

        res.status(200).send({
            headers: headers[0],
            introduction: introductions[0],
            about: abouts[0],
            skills: skills,
            experiences: experiences,
            projects: projects,
            educations: educations,
            certificates: certificates,
            contacts: contacts[0],
            leftSides: leftSides[0],
            footer: footer[0],
            socialStats: socialStatsData
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Header data

router.post('/update-headers', async (req, res) => {
    try {
        const headers = await Header.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: headers,
            success: true,
            message: 'Header data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Introduction data

router.post('/update-introduction', async (req, res) => {
    try {
        const introduction = await Introduction.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: introduction,
            success: true,
            message: 'Introduction data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add Portfolio Social Stats data (for when none exists)

router.post('/add-social-stats', async (req, res) => {
    try {
        const { 
            name, 
            value = 0, 
            category = 'experience', 
            type = 'static', 
            unit = '', 
            enabled = true 
        } = req.body;
        
        let socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            // Create new social stats document with this field
            socialStats = new SocialStats({
                fields: [{
                    id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name,
                    value,
                    category,
                    type,
                    unit,
                    enabled,
                    lastUpdated: new Date(),
                    order: 0
                }]
            });
        } else {
            // Add new field to existing social stats
            const newField = {
                id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name,
                value,
                category,
                type,
                unit,
                enabled,
                lastUpdated: new Date(),
                order: socialStats.fields.length
            };
            
            socialStats.fields.push(newField);
        }
        
        await socialStats.save();
        
        res.status(200).send({
            success: true,
            message: 'Professional stat added successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to add professional stat',
            error: error.message
        });
    }
});

// Update Portfolio Social Stats data

router.post('/update-social-stats', async (req, res) => {
    try {
        const socialStats = await SocialStats.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: socialStats,
            success: true,
            message: 'Social stats updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update individual social stats field
router.put('/update-social-stats/:fieldId', async (req, res) => {
    try {
        const { fieldId } = req.params;
        const { 
            name, 
            value, 
            category, 
            type, 
            unit, 
            enabled 
        } = req.body;
        
        let socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found'
            });
        }
        
        // Find and update the specific field
        const fieldIndex = socialStats.fields.findIndex(field => field._id.toString() === fieldId);
        
        if (fieldIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Field not found'
            });
        }
        
        // Update the field
        const field = socialStats.fields[fieldIndex];
        field.name = name;
        field.value = value;
        field.category = category;
        field.type = type;
        field.unit = unit;
        field.enabled = enabled;
        field.lastUpdated = new Date();
        
        await socialStats.save();
        
        res.status(200).send({
            success: true,
            message: 'Professional stat updated successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to update professional stat',
            error: error.message
        });
    }
});

// Add a new social stats field
router.post('/add-social-stats-field', async (req, res) => {
    try {
        const { 
            name, 
            value = 0, 
            category = 'experience', 
            type = 'static', 
            unit = '', 
            enabled = true 
        } = req.body;
        
        let socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            // Create new social stats with this field
            socialStats = new SocialStats({
                fields: [{
                    id: `field_${Date.now()}`,
                    name,
                    value,
                    category,
                    type,
                    unit,
                    enabled,
                    lastUpdated: new Date(),
                    order: 0
                }]
            });
        } else {
            // Add new field to existing social stats
            const newField = {
                id: `field_${Date.now()}`,
                name,
                value,
                category,
                type,
                unit,
                enabled,
                lastUpdated: new Date(),
                order: socialStats.fields.length
            };
            socialStats.fields.push(newField);
        }
        
        await socialStats.save();
        res.status(200).send({
            success: true,
            message: 'Social stats field added successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to add social stats field',
            error: error.message
        });
    }
});

// Update a social stats field
router.post('/update-social-stats-field', async (req, res) => {
    try {
        const { fieldId, name, value } = req.body;
        const socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found'
            });
        }
        
        const fieldIndex = socialStats.fields.findIndex(field => field.id === fieldId);
        if (fieldIndex === -1) {
            return res.status(404).send({
                success: false,
                message: 'Field not found'
            });
        }
        
        socialStats.fields[fieldIndex].name = name;
        socialStats.fields[fieldIndex].value = value;
        
        await socialStats.save();
        res.status(200).send({
            success: true,
            message: 'Social stats field updated successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to update social stats field',
            error: error.message
        });
    }
});

// Delete a social stats field
router.post('/delete-social-stats-field', async (req, res) => {
    try {
        const { fieldId } = req.body;
        const socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found'
            });
        }
        
        socialStats.fields = socialStats.fields.filter(field => field.id !== fieldId);
        
        await socialStats.save();
        res.status(200).send({
            success: true,
            message: 'Social stats field deleted successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to delete social stats field',
            error: error.message
        });
    }
});

// Delete individual social stats field (DELETE method)
router.delete('/delete-social-stats/:fieldId', async (req, res) => {
    try {
        const { fieldId } = req.params;
        let socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found'
            });
        }
        
        // Remove the field with the matching _id
        socialStats.fields = socialStats.fields.filter(field => field._id.toString() !== fieldId);
        
        await socialStats.save();
        
        res.status(200).send({
            success: true,
            message: 'Professional stat deleted successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to delete professional stat',
            error: error.message
        });
    }
});

// Reorder social stats fields
router.post('/reorder-social-stats-fields', async (req, res) => {
    try {
        const { fieldOrders } = req.body; // Array of {fieldId, order}
        const socialStats = await SocialStats.findOne();
        
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found'
            });
        }
        
        // Update order for each field
        fieldOrders.forEach(({ fieldId, order }) => {
            const field = socialStats.fields.find(f => f.id === fieldId);
            if (field) {
                field.order = order;
            }
        });
        
        // Sort fields by order
        socialStats.fields.sort((a, b) => a.order - b.order);
        
        await socialStats.save();
        res.status(200).send({
            success: true,
            message: 'Social stats fields reordered successfully',
            data: socialStats
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to reorder social stats fields',
            error: error.message
        });
    }
});

// Live LinkedIn Follower Count API
router.get('/linkedin-followers', async (req, res) => {
    try {
        const followerData = await linkedInService.getLiveFollowerCount();
        res.status(200).send({
            success: true,
            data: followerData,
            profileInfo: linkedInService.getProfileInfo()
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to fetch LinkedIn followers',
            error: error.message
        });
    }
});

// Update LinkedIn Base Count (Admin Override)
router.post('/update-linkedin-base-count', async (req, res) => {
    try {
        const { baseCount } = req.body;
        
        if (!baseCount || baseCount < 0) {
            return res.status(400).send({
                success: false,
                message: 'Valid base count is required'
            });
        }
        
        const updatedProfile = linkedInService.updateBaseCount(baseCount);
        
        res.status(200).send({
            success: true,
            message: 'LinkedIn base count updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to update LinkedIn base count',
            error: error.message
        });
    }
});

// Auto-sync LinkedIn followers to Social Stats
router.post('/sync-linkedin-to-social-stats', async (req, res) => {
    try {
        // Get live LinkedIn count
        const followerData = await linkedInService.getLiveFollowerCount();
        if (!followerData.success) {
            return res.status(500).send({
                success: false,
                message: 'Failed to get LinkedIn follower count'
            });
        }
        // Update social stats with LinkedIn count
        let socialStats = await SocialStats.findOne();
        if (!socialStats) {
            return res.status(404).send({
                success: false,
                message: 'Social stats not found. Please create social stats first.'
            });
        }
        // Find LinkedIn field in social stats
        const linkedinField = socialStats.fields.find(field => 
            field.name.toLowerCase().includes('linkedin') || 
            field.id.includes('linkedin')
        );
        if (linkedinField) {
            // Update existing LinkedIn field
            linkedinField.value = followerData.count;
            await socialStats.save();
            res.status(200).send({
                success: true,
                message: 'LinkedIn followers synced successfully',
                data: {
                    linkedinData: followerData,
                    updatedField: linkedinField,
                    socialStats: socialStats
                }
            });
        } else {
            // Add new LinkedIn field
            const newLinkedInField = {
                id: 'linkedin_followers_live',
                name: 'LinkedIn Followers',
                value: followerData.count,
                order: socialStats.fields.length
            };
            socialStats.fields.push(newLinkedInField);
            await socialStats.save();
            res.status(200).send({
                success: true,
                message: 'LinkedIn followers field added and synced successfully',
                data: {
                    linkedinData: followerData,
                    newField: newLinkedInField,
                    socialStats: socialStats
                }
            });
        }
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Failed to sync LinkedIn followers',
            error: error.message
        });
    }
});

// Update Portfolio About data

router.post('/update-about', async (req, res) => {
    try {
        const about = await About.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: about,
            success: true,
            message: 'About data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});



// Add a new skill category
router.post("/add-skill-category", async (req, res) => {
  try {
    const newCategory = new Skill(req.body);
    await newCategory.save();
    res.status(200).send({ success: true, message: "Skill category added successfully", data: newCategory });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to add skill category" });
  }
});

// Update a skill category
router.post("/update-skill", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.body._id, req.body, { new: true });
    res.status(200).send({ success: true, message: "Skill category updated successfully", data: skill });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to update skill category" });
  }
});

// Delete a skill category
router.post("/delete-skill", async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.body._id);
    res.status(200).send({ success: true, message: "Skill category deleted successfully", data: skill });
  } catch (error) {
    res.status(500).send({ success: false, message: "Failed to delete skill category" });
  }
});



// Add Experience data

router.post('/add-experience', async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(200).send({
            success: true,
            message: 'Experience added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Experience data

router.post('/update-experience', async (req, res) => {
    try {
        const experience = await Experience.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: experience,
            success: true,
            message: 'Experience data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Experience data

router.post('/delete-experience', async (req, res) => {
    try {
        const experience = await Experience.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: experience,
            success: true,
            message: 'Experience deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add Project data

router.post('/add-project', async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(200).send({
            success: true,
            message: 'Project added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Project data

router.post('/update-project', async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: project,
            success: true,
            message: 'Project data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Project data

router.post('/delete-project', async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: project,
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Add Education data

router.post('/add-education', async (req, res) => {
    try {
        const education = new Education(req.body);
        await education.save();
        res.status(200).send({
            success: true,
            message: 'Education added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Education data

router.post('/update-education', async (req, res) => {
    try {
        const education = await Education.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: education,
            success: true,
            message: 'Education data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Education data

router.post('/delete-education', async (req, res) => {
    try {
        const education = await Education.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: education,
            success: true,
            message: 'Education deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add Certificate data

router.post('/add-certificate', async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(200).send({
            success: true,
            message: 'Certificate added successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Certificate data

router.post('/update-certificate', async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: certificate,
            success: true,
            message: 'Certificate data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Delete Certificate data

router.post('/delete-certificate', async (req, res) => {
    try {
        const certificate = await Certificate.findOneAndDelete({
            _id: req.body._id
        });
        res.status(200).send({
            data: certificate,
            success: true,
            message: 'Certificate deleted successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update Portfolio LeftSider data

router.post('/update-leftSides', async (req, res) => {
    try {
        const leftSides = await LeftSider.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: leftSides,
            success: true,
            message: 'LeftSider data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Contact data

router.post('/update-contacts', async (req, res) => {
    try {
        const contacts = await Contact.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: contacts,
            success: true,
            message: 'Contact data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update Portfolio Footer data

router.post('/update-footer', async (req, res) => {
    try {
        const footer = await Footer.findOneAndUpdate(
            {_id: req.body._id},
            req.body,
            {new: true}
        );
        res.status(200).send({
            data: footer,
            success: true,
            message: 'Footer data updated successfully'
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Forgot Password with Email Only
router.post('/forgot-password', async (req, res) => {
    try {
        const { username } = req.body;
        
        
        if (!username || !username.trim()) {
            return res.status(400).send({
                success: false,
                message: 'Username or email is required'
            });
        }

        // Find user by either username or email
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });
        
        
        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'User not found with that username or email'
            });
        }

        if (!user.email) {
            return res.status(200).send({
                success: false,
                message: 'No email address registered for this user'
            });
        }

        // Generate reset token (6-digit OTP)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();


        // Send via Email
        const emailResult = await sendPasswordResetEmail(user.email, user.username, resetToken);
        
        if (emailResult.success) {
            const responseData = {
                success: true,
                message: `Reset OTP sent to your registered email address (${user.email})`,
                deliveryMethod: 'email'
            };
            
            if (emailResult.previewUrl) {
                responseData.previewUrl = emailResult.previewUrl;
                responseData.emailNote = 'Check the previewUrl to see the email (test email service)';
            }
            
            res.status(200).send(responseData);
        } else {
            // Email failed - fallback to display token
            res.status(200).send({
                success: true,
                message: 'Email service unavailable. Reset OTP generated',
                resetToken: resetToken,
                note: 'In production, this OTP would be sent via email'
            });
        }

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).send({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { username, resetToken, newPassword } = req.body;
        
        
        // Find user by either username or email with valid reset token
        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                },
                { resetPasswordToken: resetToken },
                { resetPasswordExpires: { $gt: Date.now() } }
            ]
        });


        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Update password and clear reset token
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.updatedAt = new Date();
        await user.save();


        res.status(200).send({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update User Credentials
router.post('/update-credentials', async (req, res) => {
    try {
        const { currentUsername, currentPassword, newUsername, newPassword } = req.body;
        
        // Verify current credentials by username or email
        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { username: currentUsername },
                        { email: currentUsername }
                    ]
                },
                { password: currentPassword }
            ]
        });

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Current credentials are invalid'
            });
        }

        // Check if new username already exists (if username is being changed)
        if (newUsername && newUsername !== user.username) {
            const existingUser = await User.findOne({ 
                $or: [
                    { username: newUsername },
                    { email: newUsername }
                ]
            });
            if (existingUser) {
                return res.status(200).send({
                    success: false,
                    message: 'Username or email already exists'
                });
            }
            user.username = newUsername;
        }

        // Update password if provided
        if (newPassword) {
            user.password = newPassword;
        }

        user.updatedAt = new Date();
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Credentials updated successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get User Profile
router.get('/user-profile', async (req, res) => {
    try {
        const { username } = req.query;
        
        // Find user by username or email
        const user = await User.findOne({ 
            $or: [
                { username: username },
                { email: username }
            ]
        }, { password: 0, resetPasswordToken: 0, resetPasswordExpires: 0 });
        
        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).send({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});


// Update User Email
router.post('/update-email', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Verify credentials by username or email
        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                },
                { password: password }
            ]
        });

        if (!user) {
            return res.status(200).send({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if email already exists for another user
        const existingUser = await User.findOne({ 
            email: email,
            _id: { $ne: user._id }
        });
        
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email already exists for another user'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(200).send({
                success: false,
                message: 'Invalid email format'
            });
        }

        user.email = email;
        user.updatedAt = new Date();
        await user.save();

        res.status(200).send({
            success: true,
            message: 'Email updated successfully'
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(200).send({
                success: false,
                message: 'Email already exists'
            });
        } else {
            res.status(500).send({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
});

// Admin Login

router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        
        // Validate input
        if (!username || !password) {
            return res.status(400).send({
                success: false,
                message: 'Username/email and password are required'
            });
        }
        
        // Find user by either username or email
        const user = await User.findOne({
            $and: [
                {
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                },
                { password: password }
            ]
        });
        
        
        if (user) {
            // Don't send password back to client
            const userResponse = { ...user.toObject() };
            delete userResponse.password;
            delete userResponse.resetPasswordToken;
            delete userResponse.resetPasswordExpires;
            
            
            res.status(200).send({
                success: true,
                message: "Login successful",
                data: userResponse
            });
        } else {
            res.status(200).send({
                success: false,
                message: 'Invalid username/email/mobile or password'
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Admin Registration (for creating new admin users)
router.post('/admin-register', async (req, res) => {
    try {
        const { username, email, mobile, password } = req.body;
        
        // Check if username, email, or mobile already exists
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email },
                { mobile: mobile }
            ]
        });
        
        if (existingUser) {
            let field = 'field';
            if (existingUser.username === username) field = 'Username';
            else if (existingUser.email === email) field = 'Email';
            else if (existingUser.mobile === mobile) field = 'Mobile number';
            
            return res.status(400).send({
                success: false,
                message: `${field} already exists`
            });
        }
        
        // Create new user
        const newUser = new User({
            username,
            email,
            mobile,
            password
        });
        
        await newUser.save();
        
        res.status(201).send({
            success: true,
            message: 'Admin user created successfully',
            data: {
                username: newUser.username,
                email: newUser.email,
                mobile: newUser.mobile,
                id: newUser._id
            }
        });
        
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).send({
                success: false,
                message: `${field} already exists`
            });
        } else {
            res.status(500).send({
                success: false,
                message: error.message
            });
        }
    }
});

module.exports = router;