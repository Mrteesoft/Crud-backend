"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMerchant = exports.updateMerchant = exports.getMerchantById = exports.getMerchants = exports.createMerchant = void 0;
const merchantModel_1 = require("../models/merchantModel");
const logger_1 = require("../utils/logger");
const ids_1 = require("../utils/ids");
const log = (0, logger_1.getLogger)('MerchantController');
const createMerchant = async (req, res) => {
    try {
        const ownerId = req.user?.id ?? null; // public create allowed
        const existing = await merchantModel_1.Merchant.findOne({ name: req.body.name, owner: ownerId });
        if (existing)
            return res.status(409).json({ message: 'Merchant already exists', merchant: existing });
        const merchant = await merchantModel_1.Merchant.create({ ...req.body, owner: ownerId });
        res.status(201).json(merchant);
    }
    catch (err) {
        log.error('Create merchant failed', { error: err.message });
        res.status(500).json({ message: 'Unable to create merchant' });
    }
};
exports.createMerchant = createMerchant;
const getMerchants = async (req, res) => {
    try {
        const ownerId = req.user?.id;
        const filter = ownerId ? { owner: ownerId } : {};
        const merchants = await merchantModel_1.Merchant.find(filter).sort({ createdAt: -1 });
        res.json(merchants);
    }
    catch (err) {
        log.error('List merchants failed', { error: err.message });
        res.status(500).json({ message: 'Unable to list merchants' });
    }
};
exports.getMerchants = getMerchants;
const getMerchantById = async (req, res) => {
    try {
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const filter = { _id: req.params.id };
        if (req.user?.id)
            filter.owner = req.user.id;
        const merchant = await merchantModel_1.Merchant.findOne(filter);
        if (!merchant)
            return res.status(404).json({ message: 'Merchant not found' });
        res.json(merchant);
    }
    catch (err) {
        log.error('Get merchant failed', { error: err.message });
        res.status(500).json({ message: 'Unable to fetch merchant' });
    }
};
exports.getMerchantById = getMerchantById;
const updateMerchant = async (req, res) => {
    try {
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        if (!req.user?.id)
            return res.status(401).json({ message: 'Authentication required' });
        const merchant = await merchantModel_1.Merchant.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true, runValidators: true });
        if (!merchant)
            return res.status(404).json({ message: 'Merchant not found' });
        res.json(merchant);
    }
    catch (err) {
        log.error('Update merchant failed', { error: err.message });
        res.status(500).json({ message: 'Unable to update merchant' });
    }
};
exports.updateMerchant = updateMerchant;
const deleteMerchant = async (req, res) => {
    try {
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        if (!req.user?.id)
            return res.status(401).json({ message: 'Authentication required' });
        const merchant = await merchantModel_1.Merchant.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!merchant)
            return res.status(404).json({ message: 'Merchant not found' });
        res.json({ message: 'Merchant deleted' });
    }
    catch (err) {
        log.error('Delete merchant failed', { error: err.message });
        res.status(500).json({ message: 'Unable to delete merchant' });
    }
};
exports.deleteMerchant = deleteMerchant;
//# sourceMappingURL=merchantController.js.map