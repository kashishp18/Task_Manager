const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const jwt = require('jsonwebtoken');

// Middleware to verify the token (The "Security Guard")
const protect = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

// CREATE A PROJECT
router.post('/', protect, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const newProject = new Project({
            name,
            description,
            admin: req.user.id, // The person logged in becomes Admin
            members: [req.user.id] // They are also the first member
        });

        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});
// GET ALL PROJECTS FOR LOGGED IN USER
router.get('/', protect, async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;