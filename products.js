const fs = require('fs').promises;
const path = require('path');

const productsFile = path.join(__dirname, 'data/full-products.json');

async function list(options = {}) {
    const { offset = 0, limit = 25, tag } = options;

    const data = await fs.readFile(productsFile);
  
    return JSON.parse(data)
        .filter(product => {
            if (!tag) {
                return product;
            }

            return product.tags.find(({ title }) => title === tag);
        })
        .slice(offset, offset + limit); // Slice the products
}

async function get(id) {
    const products = JSON.parse(await fs.readFile(productsFile));
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }

    // If no product is found, return null
    return null;
}

async function deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(productsFile));

    // Find the index of the product with the given ID
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        // If the product is not found, return null
        return null;
    }

    // Remove the product from the array
    products.splice(index, 1);

    // Write the updated array back to the file
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    console.log(`Product with ID ${id} deleted`);

    return true; // Return true to indicate deletion success
}

async function updateProduct(id, updatedData) {
    const products = JSON.parse(await fs.readFile(productsFile));

    // Find the index of the product with the given ID
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
        // If the product is not found, return null
        return null;
    }

    // Update the product with the new data
    products[index] = { ...products[index], ...updatedData };

    // Write the updated array back to the file
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));

    console.log(`Product with ID ${id} updated`);

    return products[index]; // Return the updated product
}

module.exports = {
    list,
    get,
    deleteProduct,
    updateProduct
};
