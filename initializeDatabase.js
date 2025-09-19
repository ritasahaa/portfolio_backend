const mongoose = require('mongoose');
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
} = require('./models/portfolioModel');

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mernportfolio');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Initialize sample data for all schemas
async function initializeSampleData() {
    try {
        console.log('🚀 Initializing sample portfolio data...');

        // 1. Header Data
        const headerExists = await Header.findOne();
        if (!headerExists) {
            await Header.create({
                firstLetter: "Y",
                middleLetter: "O",
                lastLetter: "U"
            });
            console.log('✅ Header data created');
        }

        // 2. Introduction Data
        const introExists = await Introduction.findOne();
        if (!introExists) {
            await Introduction.create({
                welcomeText: "Hi, I'm",
                firstName: "Your",
                lastName: "Name",
                jobTitle: "Full Stack Developer",
                description: "I am a passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through code.",
                myResume: "https://example.com/resume.pdf",
                profileImage: "https://via.placeholder.com/400x400"
            });
            console.log('✅ Introduction data created');
        }

        // 3. About Data
        const aboutExists = await About.findOne();
        if (!aboutExists) {
            await About.create({
                lottieURL: "https://lottie.host/4d8ef5c7-0fbd-45d3-8504-a2b1b22e7c87/8n9PUnOF8M.json",
                description1: "I am a dedicated software developer with a passion for creating efficient and scalable web applications.",
                description2: "With experience in both frontend and backend technologies, I enjoy tackling complex problems and delivering high-quality solutions.",
                message: "Let's build something amazing together!",
                skills: [
                    "JavaScript", "React", "Node.js", "MongoDB", "Python", "AWS"
                ]
            });
            console.log('✅ About data created');
        }

        // 4. Skills Data
        const skillsExist = await Skill.findOne();
        if (!skillsExist) {
            await Skill.create([
                {
                    title: "Frontend Technologies",
                    skills: [
                        { name: "React", level: "Advanced" },
                        { name: "JavaScript", level: "Advanced" },
                        { name: "HTML/CSS", level: "Advanced" },
                        { name: "TypeScript", level: "Intermediate" }
                    ]
                },
                {
                    title: "Backend Technologies", 
                    skills: [
                        { name: "Node.js", level: "Advanced" },
                        { name: "Express.js", level: "Advanced" },
                        { name: "MongoDB", level: "Intermediate" },
                        { name: "PostgreSQL", level: "Intermediate" }
                    ]
                }
            ]);
            console.log('✅ Skills data created');
        }

        // 5. Experience Data
        const experienceExists = await Experience.findOne();
        if (!experienceExists) {
            await Experience.create([
                {
                    title: "Senior Full Stack Developer",
                    period: "2022 - Present",
                    company: "Tech Solutions Inc.",
                    description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices."
                },
                {
                    title: "Frontend Developer",
                    period: "2020 - 2022", 
                    company: "Digital Agency Ltd.",
                    description: "Developed responsive web applications and improved user experience for various client projects using modern frontend frameworks."
                }
            ]);
            console.log('✅ Experience data created');
        }

        // 6. Projects Data
        const projectsExist = await Project.findOne();
        if (!projectsExist) {
            await Project.create([
                {
                    title: "E-Commerce Platform",
                    description: "A full-featured e-commerce platform with user authentication, payment integration, and admin dashboard.",
                    image: "https://via.placeholder.com/600x400",
                    project_link: "https://example-ecommerce.com",
                    github_link: "https://github.com/username/ecommerce",
                    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT"]
                },
                {
                    title: "Task Management App",
                    description: "A collaborative task management application with real-time updates and team collaboration features.",
                    image: "https://via.placeholder.com/600x400",
                    project_link: "https://example-tasks.com",
                    github_link: "https://github.com/username/taskapp",
                    technologies: ["React", "Express", "Socket.io", "PostgreSQL"]
                }
            ]);
            console.log('✅ Projects data created');
        }

        // 7. Education Data
        const educationExists = await Education.findOne();
        if (!educationExists) {
            await Education.create([
                {
                    title: "Computer Science",
                    institution: "University of Technology",
                    degree: "Bachelor of Science",
                    period: "2018 - 2022",
                    description: "Specialized in software engineering, data structures, and algorithms. Graduated with honors.",
                    grade: "3.8 GPA",
                    location: "New York, USA"
                },
                {
                    title: "Full Stack Web Development",
                    institution: "Coding Bootcamp",
                    degree: "Certificate",
                    period: "2019",
                    description: "Intensive program covering modern web development technologies and best practices.",
                    grade: "Top 10%",
                    location: "Online"
                }
            ]);
            console.log('✅ Education data created');
        }

        // 8. Certificates Data
        const certificatesExist = await Certificate.findOne();
        if (!certificatesExist) {
            await Certificate.create([
                {
                    title: "AWS Certified Solutions Architect",
                    issuer: "Amazon Web Services",
                    issueDate: "2023",
                    image: "https://via.placeholder.com/300x200",
                    description: "Validates expertise in designing distributed systems on AWS platform."
                },
                {
                    title: "React Professional Certificate",
                    issuer: "Meta",
                    issueDate: "2022",
                    image: "https://via.placeholder.com/300x200",
                    description: "Advanced React development and best practices certification."
                }
            ]);
            console.log('✅ Certificates data created');
        }

        // 9. Contact Data
        const contactExists = await Contact.findOne();
        if (!contactExists) {
            await Contact.create({
                name: "Your Name",
                gender: "Other",
                email: "your.email@example.com",
                mobile: "+1 (555) 123-4567",
                age: "25",
                address: "123 Tech Street, Innovation City, TC 12345",
                lottieURL: "https://lottie.host/4d8ef5c7-0fbd-45d3-8504-a2b1b22e7c87/8n9PUnOF8M.json"
            });
            console.log('✅ Contact data created');
        }

        // 10. LeftSider Data
        const leftSiderExists = await LeftSider.findOne();
        if (!leftSiderExists) {
            await LeftSider.create({
                email: "your.email@example.com",
                mobile: "+1 (555) 123-4567",
                github: "https://github.com/yourusername",
                linkedin: "https://linkedin.com/in/yourprofile"
            });
            console.log('✅ LeftSider data created');
        }

        // 11. Footer Data
        const footerExists = await Footer.findOne();
        if (!footerExists) {
            await Footer.create({
                firstLine: "Designed and Developed By",
                secondLine: "Your Name"
            });
            console.log('✅ Footer data created');
        }

        // 12. Social Stats Data
        const socialStatsExists = await SocialStats.findOne();
        if (!socialStatsExists) {
            await SocialStats.create({
                fields: [
                    {
                        id: 'years_experience',
                        name: 'Years Experience',
                        value: 5,
                        category: 'experience',
                        type: 'static',
                        unit: '+',
                        enabled: true,
                        order: 0
                    },
                    {
                        id: 'projects_completed',
                        name: 'Projects Completed',
                        value: 50,
                        category: 'projects',
                        type: 'static',
                        unit: '+',
                        enabled: true,
                        order: 1
                    },
                    {
                        id: 'happy_clients',
                        name: 'Happy Clients',
                        value: 100,
                        category: 'clients',
                        type: 'static',
                        unit: '%',
                        enabled: true,
                        order: 2
                    },
                    {
                        id: 'linkedin_followers',
                        name: 'LinkedIn Followers',
                        value: 1250,
                        category: 'social',
                        type: 'dynamic',
                        unit: '+',
                        enabled: true,
                        order: 3
                    }
                ]
            });
            console.log('✅ Social Stats data created');
        }

        console.log('\n🎉 Database initialization completed successfully!');
        console.log('\n📊 Summary:');
        
        // Print counts
        const counts = {
            Headers: await Header.countDocuments(),
            Introductions: await Introduction.countDocuments(),
            About: await About.countDocuments(),
            Skills: await Skill.countDocuments(),
            Experiences: await Experience.countDocuments(),
            Projects: await Project.countDocuments(),
            Education: await Education.countDocuments(),
            Certificates: await Certificate.countDocuments(),
            Contacts: await Contact.countDocuments(),
            LeftSiders: await LeftSider.countDocuments(),
            Footers: await Footer.countDocuments(),
            SocialStats: await SocialStats.countDocuments()
        };

        Object.entries(counts).forEach(([collection, count]) => {
            console.log(`   ${collection}: ${count} documents`);
        });

    } catch (error) {
        console.error('❌ Error initializing data:', error);
        throw error;
    }
}

// Validate all schemas
async function validateSchemas() {
    console.log('\n🔍 Validating all schemas...');
    
    const schemas = {
        Header, Introduction, About, Skill, Experience, 
        Project, Education, Certificate, Contact, 
        LeftSider, Footer, SocialStats
    };

    for (const [name, Model] of Object.entries(schemas)) {
        try {
            const sample = await Model.findOne();
            if (sample) {
                console.log(`✅ ${name} schema is valid and has data`);
            } else {
                console.log(`⚠️  ${name} schema is valid but has no data`);
            }
        } catch (error) {
            console.error(`❌ ${name} schema validation failed:`, error.message);
        }
    }
}

// Main execution
async function main() {
    try {
        await connectDB();
        await initializeSampleData();
        await validateSchemas();
        
        console.log('\n✨ All operations completed successfully!');
        console.log('🌐 You can now start your frontend and backend servers.');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    connectDB,
    initializeSampleData,
    validateSchemas
};
