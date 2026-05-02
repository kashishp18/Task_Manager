const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        // Added 'role' to the destructuring
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and Save User (Now includes role)
        // Default to 'Member' if no role is provided
        user = new User({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || 'Member' 
        });
        await user.save();

        res.status(201).json({ message: "User registered successfully! 🎉" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // 3. Create a JWT Token (The "VIP Pass")
        // We add the role to the token so the frontend knows what the user can do
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                role: user.role // Return role to frontend
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;