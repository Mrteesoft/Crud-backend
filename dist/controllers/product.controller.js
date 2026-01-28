"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const product_model_1 = require("../models/product.model");
const logger_1 = require("../utils/logger");
const log = (0, logger_1.getLogger)('ProductController');
const ensureOwnerId = (req, res) => {
    const ownerId = req.user?.id;
    if (!ownerId) {
        res.status(401).json({ message: 'Authentication required' });
        return null;
    }
    return ownerId;
};
const createProduct = async (req, res) => {
    try {
        const ownerId = ensureOwnerId(req, res);
        if (!ownerId)
            return;
        const product = await product_model_1.Product.create({ ...req.body, owner: ownerId });
        res.status(201).json(product);
    }
    catch (err) {
        log.error('Create product failed', { error: err.message });
        res.status(500).json({ message: 'Unable to create product' });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const ownerId = ensureOwnerId(req, res);
        if (!ownerId)
            return;
        const products = await product_model_1.Product.find({ owner: ownerId }).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (err) {
        log.error('List products failed', { error: err.message });
        res.status(500).json({ message: 'Unable to list products' });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    try {
        const ownerId = ensureOwnerId(req, res);
        if (!ownerId)
            return;
        const product = await product_model_1.Product.findOne({ _id: req.params.id, owner: ownerId });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        log.error('Get product failed', { error: err.message });
        res.status(500).json({ message: 'Unable to fetch product' });
    }
};
exports.getProductById = getProductById;
const updateProduct = async (req, res) => {
    try {
        const ownerId = ensureOwnerId(req, res);
        if (!ownerId)
            return;
        const product = await product_model_1.Product.findOneAndUpdate({ _id: req.params.id, owner: ownerId }, req.body, { new: true, runValidators: true });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        log.error('Update product failed', { error: err.message });
        res.status(500).json({ message: 'Unable to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const ownerId = ensureOwnerId(req, res);
        if (!ownerId)
            return;
        const product = await product_model_1.Product.findOneAndDelete({ _id: req.params.id, owner: ownerId });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    }
    catch (err) {
        log.error('Delete product failed', { error: err.message });
        res.status(500).json({ message: 'Unable to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.controller.js.map