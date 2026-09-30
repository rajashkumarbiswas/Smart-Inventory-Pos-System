const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // চেক করা যে হেডার বা রিকোয়েস্টে Bearer টোকেন পাঠানো হয়েছে কিনা
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // হেডার থেকে টোকেনটি আলাদা করে নেওয়া
            token = req.headers.authorization.split(' ')[1];

            // টোকেন ভেরিফাই করা
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

            // টোকেন থেকে ইউজার আইডি এবং রোল রিকোয়েস্ট অবজেক্টে যুক্ত করা
            req.user = decoded;

            next(); // পরবর্তী কন্ট্রোলারে চলে যাও
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) মিডলওয়্যার
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// অ্যাডমিন রাউটের জন্য শর্টকাট মিডলওয়্যার
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, authorizeRoles, admin };