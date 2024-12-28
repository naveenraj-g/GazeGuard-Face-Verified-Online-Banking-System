const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model.js")
const Transaction = require("./models/transaction.model.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // if you need to send cookies or authentication tokens
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// routes


app.get("/", (req, res) => {
    res.send("<h1>Hello from node API</h1>")
});

mongoose.connect("Use Your's MongoDB Atlas")
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Connection Failed!");
    })

// 1. Signup API
app.post('/api/signup', async (req, res) => {
    const { name, email, password, phone, accountNumber } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        user = await User.findOne({ accountNumber });
        if (user) return res.status(400).json({ message: "Account number already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            accountNumber,
            isFaceSetup: true,
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// 2. Login API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        res.json({ success: true, message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Check User
app.post('/api/check-user', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// Update User Profile API
app.put('/api/updateProfile', async (req, res) => {
    const { email, name, phone } = req.body;

    // Input validation
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Update user fields if provided
        if (name) user.name = name;
        if (phone) user.phone = phone;

        // Save the updated user
        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        });
    } catch (error) {
        console.error("Update Profile Error:", error); // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Change Password API
app.post('/api/change-password', async (req, res) => {
    const { email, newPassword } = req.body;

    // Input validation
    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: "Email and new password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Hash the new password before saving (you can use bcrypt or any hashing library)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;  // Update password
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});



// 3. Check Balance API
app.get('/api/checkbalance/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// 4. Transfer Money API
app.post('/api/transfer', async (req, res) => {
    const { senderEmail, receiverAccountNumber, amount, description } = req.body;

    try {
        // Convert amount to a number
        const transferAmount = Number(amount);  // or use parseFloat(amount)

        const sender = await User.findOne({ email: senderEmail });
        if (!sender) return res.status(404).json({ message: "Sender not found" });

        if (sender.balance < transferAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const receiver = await User.findOne({ accountNumber: receiverAccountNumber });
        if (!receiver) return res.status(404).json({ message: "Receiver not found" });

        // Deduct amount from sender's balance
        sender.balance -= transferAmount;
        await sender.save();

        // Add amount to receiver's balance
        receiver.balance += transferAmount;
        await receiver.save();

        // Create a transaction record
        const newTransaction = new Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount: transferAmount,  // Store the numeric amount
            transactionType: 'transfer',
            status: 'success',
            referenceNumber: `TRX${Date.now()}`,
            description,
        });

        await newTransaction.save();

        // Link the transaction to the sender and receiver
        sender.transactions.push(newTransaction._id);
        receiver.transactions.push(newTransaction._id);
        await sender.save();
        await receiver.save();

        res.json({ success: true, message: 'Transfer successful', transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// 5. Transaction History API
app.get('/api/transactions/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const transactions = await Transaction.find({
            $or: [{ sender: user._id }, { receiver: user._id }]
        })
            .populate('sender receiver', 'name email accountNumber')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.listen(3000, () => {
    console.log("Server is running at port 3000");
});
