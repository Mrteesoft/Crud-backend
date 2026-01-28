"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payNextInstallment = exports.getInstallments = exports.deletePurchase = exports.updatePurchase = exports.getPurchaseById = exports.getPurchases = exports.createPurchase = void 0;
const purchaseModel_1 = require("../models/purchaseModel");
const installmentModel_1 = require("../models/installmentModel");
const installments_1 = require("../utils/installments");
const logger_1 = require("../utils/logger");
const ids_1 = require("../utils/ids");
const merchantModel_1 = require("../models/merchantModel");
const log = (0, logger_1.getLogger)('PurchaseController');
const ownerIdFromReq = (req, res) => {
    const id = req.user?.id;
    if (!id) {
        res.status(401).json({ message: 'Authentication required' });
        return null;
    }
    return id;
};
const createPurchase = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.body.merchantId)) {
            return res.status(400).json({ message: 'Invalid merchant id' });
        }
        const merchantExists = await merchantModel_1.Merchant.exists({ _id: req.body.merchantId });
        if (!merchantExists) {
            return res.status(404).json({ message: 'Merchant not found' });
        }
        const purchase = await purchaseModel_1.Purchase.create({ ...req.body, createdBy: ownerId });
        const installments = (0, installments_1.buildInstallments)(purchase);
        await installmentModel_1.Installment.insertMany(installments);
        res.status(201).json(purchase);
    }
    catch (err) {
        log.error('Create purchase failed', { error: err.message });
        res.status(500).json({ message: 'Unable to create purchase' });
    }
};
exports.createPurchase = createPurchase;
const getPurchases = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        const { status } = req.query;
        const query = { createdBy: ownerId };
        if (status)
            query.status = status;
        const purchases = await purchaseModel_1.Purchase.find(query).sort({ createdAt: -1 });
        res.json(purchases);
    }
    catch (err) {
        log.error('List purchases failed', { error: err.message });
        res.status(500).json({ message: 'Unable to list purchases' });
    }
};
exports.getPurchases = getPurchases;
const getPurchaseById = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const purchase = await purchaseModel_1.Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
        if (!purchase)
            return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    }
    catch (err) {
        log.error('Get purchase failed', { error: err.message });
        res.status(500).json({ message: 'Unable to fetch purchase' });
    }
};
exports.getPurchaseById = getPurchaseById;
const updatePurchase = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        if (req.body.merchantId) {
            if (!(0, ids_1.isValidObjectId)(req.body.merchantId)) {
                return res.status(400).json({ message: 'Invalid merchant id' });
            }
            const merchantExists = await merchantModel_1.Merchant.exists({ _id: req.body.merchantId });
            if (!merchantExists)
                return res.status(404).json({ message: 'Merchant not found' });
        }
        const purchase = await purchaseModel_1.Purchase.findOneAndUpdate({ _id: req.params.id, createdBy: ownerId }, req.body, { new: true, runValidators: true });
        if (!purchase)
            return res.status(404).json({ message: 'Purchase not found' });
        res.json(purchase);
    }
    catch (err) {
        log.error('Update purchase failed', { error: err.message });
        res.status(500).json({ message: 'Unable to update purchase' });
    }
};
exports.updatePurchase = updatePurchase;
const deletePurchase = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const purchase = await purchaseModel_1.Purchase.findOneAndDelete({ _id: req.params.id, createdBy: ownerId });
        if (!purchase)
            return res.status(404).json({ message: 'Purchase not found' });
        await installmentModel_1.Installment.deleteMany({ purchaseId: purchase._id });
        res.json({ message: 'Purchase deleted' });
    }
    catch (err) {
        log.error('Delete purchase failed', { error: err.message });
        res.status(500).json({ message: 'Unable to delete purchase' });
    }
};
exports.deletePurchase = deletePurchase;
const getInstallments = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const purchase = await purchaseModel_1.Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
        if (!purchase)
            return res.status(404).json({ message: 'Purchase not found' });
        const installments = await installmentModel_1.Installment.find({ purchaseId: purchase._id }).sort({ sequence: 1 });
        res.json(installments);
    }
    catch (err) {
        log.error('Get installments failed', { error: err.message });
        res.status(500).json({ message: 'Unable to fetch installments' });
    }
};
exports.getInstallments = getInstallments;
const payNextInstallment = async (req, res) => {
    try {
        const ownerId = ownerIdFromReq(req, res);
        if (!ownerId)
            return;
        if (!(0, ids_1.isValidObjectId)(req.params.id))
            return res.status(400).json({ message: 'Invalid id' });
        const purchase = await purchaseModel_1.Purchase.findOne({ _id: req.params.id, createdBy: ownerId });
        if (!purchase)
            return res.status(404).json({ message: 'Purchase not found' });
        const next = await installmentModel_1.Installment.findOne({ purchaseId: purchase._id, status: 'pending' }).sort({ sequence: 1 });
        if (!next)
            return res.status(400).json({ message: 'All installments already paid' });
        next.status = 'paid';
        await next.save();
        const remaining = await installmentModel_1.Installment.countDocuments({ purchaseId: purchase._id, status: 'pending' });
        if (remaining === 0) {
            purchase.status = 'completed';
            await purchase.save();
        }
        res.json({ message: 'Installment paid', installment: next });
    }
    catch (err) {
        log.error('Pay installment failed', { error: err.message });
        res.status(500).json({ message: 'Unable to pay installment' });
    }
};
exports.payNextInstallment = payNextInstallment;
//# sourceMappingURL=purchaseController.js.map