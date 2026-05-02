const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware to verify the token
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

// CREATE A TASK
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, dueDate, priority, projectId } = req.body;
        
        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            project: projectId, // Link task to the project
            assignedTo: req.user.id // Default assign to creator
        });

        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
// GET ALL TASKS
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;