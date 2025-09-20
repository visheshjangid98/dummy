import express from 'express';
// Assuming your model files are in the root directory relative to app.js
import Rank from '../model/ranks.js';
import Admin from '../model/admin.js';
import Order from '../model/order.js';
import User from '../model/user.js';

const router = express.Router();

// --- Security Middleware ---
// This simple middleware checks for a secret API key in the request headers.
// Your other website must include this key to access the API.
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    // IMPORTANT: Replace 'YOUR_SECRET_API_KEY' with a strong, randomly generated key.
    if (apiKey && apiKey === 'YOUR_SECRET_API_KEY') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Missing or invalid API key.' });
    }
};

// Apply the API key authentication to all routes defined in this file.
router.use(apiKeyAuth);

// --- Ranks API Routes ---

// [GET] /api/ranks - Fetches all ranks
router.get('/ranks', async (req, res) => {
    try {
        const ranks = await Rank.find();
        res.json(ranks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [POST] /api/ranks - Creates a new rank
router.post('/ranks', async (req, res) => {
    const rank = new Rank(req.body);
    try {
        const newRank = await rank.save();
        res.status(201).json(newRank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [PUT] /api/ranks/:id - Updates a rank by its ID
router.put('/ranks/:id', async (req, res) => {
    try {
        const updatedRank = await Rank.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRank) return res.status(404).json({ message: 'Rank not found' });
        res.json(updatedRank);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [DELETE] /api/ranks/:id - Deletes a rank by its ID
router.delete('/ranks/:id', async (req, res) => {
    try {
        const deletedRank = await Rank.findByIdAndDelete(req.params.id);
        if (!deletedRank) return res.status(404).json({ message: 'Rank not found' });
        res.json({ message: 'Deleted Rank successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- Admin API Routes ---

// [GET] /api/admins - Fetches all admin data
router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [POST] /api/admins - Creates a new admin entry
router.post('/admins', async (req, res) => {
    const admin = new Admin(req.body);
    try {
        const newAdmin = await admin.save();
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [PUT] /api/admins/:id - Updates an admin entry by ID
router.put('/admins/:id', async (req, res) => {
    try {
        const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
         if (!updatedAdmin) return res.status(404).json({ message: 'Admin not found' });
        res.json(updatedAdmin);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [DELETE] /api/admins/:id - Deletes an admin entry by ID
router.delete('/admins/:id', async (req, res) => {
    try {
        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });
        res.json({ message: 'Deleted Admin successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Order API Routes ---

// [GET] /api/orders - Fetches all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [POST] /api/orders - Creates a new order
router.post('/orders', async (req, res) => {
    const order = new Order(req.body);
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [PUT] /api/orders/:id - Updates an order by ID
router.put('/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [DELETE] /api/orders/:id - Deletes an order by ID
router.delete('/orders/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: 'Deleted Order successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// --- RCON API Routes ---

// [POST] /api/rcon/command - Sends a command to the server via RCON
router.post('/rcon/command', async (req, res) => {
    const { command } = req.body;
    if (!command) {
        return res.status(400).json({ message: 'Command is required' });
    }

    try {
        const runCommandIfOnline = (await import('../controller/rc.js')).default;
        const response = await runCommandIfOnline(command);
        res.json({ response, status: 'success' });
    } catch (err) {
        res.status(500).json({ message: err.message, status: 'error' });
    }
});

// [GET] /api/rcon/status - Checks if the server is online
router.get('/rcon/status', async (req, res) => {
    let ad;
    try {
        ad = await Admin.findOne();
        if (!ad) {
            throw new Error('Admin configuration not found in database');
        }

        const runCommandIfOnline = (await import('../controller/rc.js')).default;
        // Try a simple command to check if server is online
        await runCommandIfOnline('list');
        res.json({
            status: 'online',
            connection: {
                ip: ad.rcon_ip,
                port: ad.rcon_port
            }
        });
    } catch (err) {
        // Try to get admin config even if connection failed
        if (!ad) {
            try {
                ad = await Admin.findOne();
            } catch (adminErr) {
                // Ignore admin fetch error
            }
        }

        res.json({
            status: 'offline',
            error: err.message,
            connection: {
                ip: ad?.rcon_ip || 'unknown',
                port: ad?.rcon_port || 'unknown'
            }
        });
    }
});

// --- User API Routes ---

// [GET] /api/users - Fetches all users
router.get('/users', async (req, res) => {
    try {
        // .select('-password') prevents passwords from being sent in the response
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [POST] /api/users - Creates a new user
router.post('/users', async (req, res) => {
    // SECURITY WARNING: Storing passwords in plain text is highly insecure.
    // You should hash passwords using a library like bcrypt before saving them.
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        const userObject = newUser.toObject();
        delete userObject.password; // Ensure password is not sent in the response
        res.status(201).json(userObject);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [PUT] /api/users/:id - Updates a user by ID
router.put('/users/:id', async (req, res) => {
    try {
        if (req.body.password) {
            // Add password hashing logic here as well if the password can be updated
            console.warn("Updating password without hashing is insecure.");
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// [DELETE] /api/users/:id - Deletes a user by ID
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Deleted User successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
