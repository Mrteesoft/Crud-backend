"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = void 0;
const userModel_1 = require("../models/userModel");
const me = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Authentication required' });
    const user = await userModel_1.User.findById(req.user.id).select('-password');
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
};
exports.me = me;
//# sourceMappingURL=meController.js.map