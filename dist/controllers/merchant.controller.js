"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMerchant = exports.updateMerchant = exports.getMerchantById = exports.getMerchants = exports.createMerchant = void 0;
const merchant_model_1 = require("../models/merchant.model");
const logger_1 = require("../utils/logger");
const ids_1 = require("../utils/ids");
const log = (0, logger_1.getLogger)('MerchantController');
const ownerIdFromReq = (req, res) => {
    const id = req.user?.id;
    if (!id) {
        res.status(401).json({ message: 'Authentication required' });
        return null;
    }
    return id;
};
const createMerchant = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        const existing = await merchant_model_1.Merchant.findOne({ name: req.body.name, owner: ownerId });
        if (existing) {
            return res.status(409).json({ message: 'Merchant already exists' });
        }
        const merchant = await merchant_model_1.Merchant.create({ ...req.body, owner: ownerId });
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
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        const merchants = await merchant_model_1.Merchant.find({ owner: ownerId }).sort({ createdAt: -1 });
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
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const merchant = await merchant_model_1.Merchant.findOne({ _id: req.params.id, owner: ownerId });
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
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const merchant = await merchant_model_1.Merchant.findOneAndUpdate({ _id: req.params.id, owner: ownerId }, req.body, { new: true, runValidators: true });
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
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const merchant = await merchant_model_1.Merchant.findOneAndDelete({ _id: req.params.id, owner: ownerId });
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
//# sourceMappingURL=merchant.controller.js.map