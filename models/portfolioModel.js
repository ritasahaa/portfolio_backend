const mongoose = require("mongoose");

const headersSchema = new mongoose.Schema({
    firstLetter: {
        type: String,
        required: true
    },
    middleLetter: {
        type: String,
        required: true
    },
    lastLetter: {
        type: String,
        required: true
    },
});

const introductionSchema = new mongoose.Schema({
    welcomeText: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: [String], // Changed to array of strings
        required: true
    },
    description: {
        type: String,
        required: true
    },
    myResume: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
});

const aboutSchema = new mongoose.Schema({
    lottieURL: {
        type: String,
        required: true
    },
    description1: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    skills: {
        type: Array,
        required: false
    },
});

const skillSchema = new mongoose.Schema({
    title: { type: String, required: true },
    skills: [
        {
            name: { type: String, required: true },
            level: {
                type: String,
                enum: ["Beginner", "Intermediate", "Advanced"],
                required: true
            }
        }
    ]
});

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    period: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    project_link: {
        type: String,
        required: false
    },

    github_link: {
        type: String,
        required: false
    },

    technologies: {
        type: Array,
        required: true
    },
});

const educationsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    institution: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        required: true,
        trim: true
    },
    period: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    grade: {
        type: String,
        required: false,
        trim: true
    },
    location: {
        type: String,
        required: false,
        trim: true
    }
});

const certificateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    issueDate: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

});

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    lottieURL: {
        type: String,
        required: true
    },

});

const leftSiderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
        required: true
    },
});

const socialStatsSchema = new mongoose.Schema({
    // Legacy fields for backward compatibility
    yearsExperience: {
        type: Number,
        required: false
    },
    projectsCompleted: {
        type: Number,
        required: false
    },
    clientSatisfaction: {
        type: Number,
        required: false
    },
    linkedinFollowers: {
        type: Number,
        required: false
    },
    // New dynamic fields structure
    fields: [{
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true,
            default: 0
        },
        category: {
            type: String,
            required: false,
            enum: ['experience', 'projects', 'clients', 'skills', 'achievements', 'social'],
            default: 'experience'
        },
        type: {
            type: String,
            required: false,
            enum: ['static', 'dynamic'],
            default: 'static'
        },
        unit: {
            type: String,
            required: false,
            default: ''
        },
        enabled: {
            type: Boolean,
            required: false,
            default: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        order: {
            type: Number,
            required: false,
            default: 0
        }
    }]
}, {
    timestamps: true // Automatically add createdAt and updatedAt
});

const footerSchema = new mongoose.Schema({
    firstLine: {
        type: String,
        required: true
    },
    secondLine: {
        type: String,
        required: true
    },
});


module.exports = {
    Header: mongoose.model('headers', headersSchema),
    Introduction: mongoose.model('introductions', introductionSchema),
    About: mongoose.model('abouts', aboutSchema),
    Skill: mongoose.model('skills', skillSchema),
    Experience: mongoose.model('experiences', experienceSchema),
    Project: mongoose.model('projects', projectSchema),
    Education: mongoose.model('educations', educationsSchema),
    Certificate: mongoose.model('certificates', certificateSchema),
    Contact: mongoose.model('contacts', contactSchema),
    LeftSider: mongoose.model('leftSides', leftSiderSchema),
    Footer: mongoose.model('footer', footerSchema),
    SocialStats: mongoose.model('socialStats', socialStatsSchema),
};
