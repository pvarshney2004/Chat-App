import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// middleware to protect route
export const protectRoute = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(token_decode.userId).select("-password")
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}