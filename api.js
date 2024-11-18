const path = require('path');
const Products = require('./products');
const autoCatch = require('./lib/auto-catch');

/**
 * Handle the root route
 * @param {object} req
 * @param {object} res
 */
function handleRoot(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
 * @param {object} res
 */
async function listProducts(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { offset = 0, limit = 25, tag } = req.query;

    try {
        res.json(await Products.list({
            offset: Number(offset),
            limit: Number(limit),
            tag,
        }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { id } = req.params;

    try {
        const product = await Products.get(id);
        if (!product) {
            return next();
        }

        return res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Create a new product
 * @param {object} req
 * @param {object} res
 */
async function createProduct(req, res) {
    console.log('request body:', req.body);
    res.json(req.body);
}

/**
 * Delete a product
 * @param {object} req
 * @param {object} res
 */
async function deleteProduct(req, res) {
    const { id } = req.params;

    const result = await Products.deleteProduct(id);

    if (!result) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    res.status(202).json({ message: `Product with ID ${id} deleted` });
}

/**
 * Update a product
 * @param {object} req
 * @param {object} res
 */
async function updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    const product = await Products.updateProduct(id, updatedData);

    if (!product) {
        return res.status(404).json({ error: `Product with ID ${id} not found` });
    }

    res.status(200).json({ message: `Product with ID ${id} updated`, product });
}

module.exports = autoCatch({
    handleRoot,
    listProducts,
    getProduct,
    createProduct,
    deleteProduct,  
    updateProduct,  
});
