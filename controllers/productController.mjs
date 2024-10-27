import * as ProductModel from '../models/products.mjs';
import { BlobServiceClient } from '@azure/storage-blob';
import 'dotenv/config';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = 'appwebimg';

const uploadImageAndGetUrl = async (imageBuffer, imageName) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    await blockBlobClient.upload(imageBuffer, imageBuffer.length);

    return blockBlobClient.url;
};

// Obtener todos los productos
export const getAllProducts = (req, res) => {
    ProductModel.getAllProducts((err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los productos' });
        }
        res.status(200).json(products);
    });
};

// Crear un producto nuevo con imagen y tipoProducto
export const createProduct = async (req, res) => {
    const productData = req.body;
    
    // Subida de imagen si se proporciona
    if (req.file) {
        try {
            productData.img = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        } catch (error) {
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }
    }

    // Asegúrate de incluir el campo tipoProducto (puede ser 'normal', 'promocion', o 'oferta')
    productData.tipoProducto = productData.tipoProducto || 'normal';

    ProductModel.createProduct(productData, (err, newProduct) => {
        if (err) {
            return res.status(500).json({ message: 'Error al crear el producto' });
        }
        res.status(201).json(newProduct);
    });
};

// Actualizar un producto existente con imagen y tipoProducto
export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const productData = req.body;

    // Subida de imagen si se proporciona
    if (req.file) {
        try {
            productData.img = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        } catch (error) {
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }
    }

    // Asegúrate de incluir el campo tipoProducto
    productData.tipoProducto = productData.tipoProducto || 'normal';

    ProductModel.updateProduct(productId, productData, (err, updatedProduct) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el producto' });
        }
        res.status(200).json(updatedProduct);
    });
};

// Eliminar un producto
export const deleteProduct = (req, res) => {
    const productId = req.params.id;

    ProductModel.deleteProduct(productId, (err, deletedProduct) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el producto' });
        }
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado con éxito', deletedProduct });
    });
};



/*
export const updateProduct = async (req, res) => {
    const productId = req.params.id; // El ID del producto a actualizar
    const productData = req.body; // Los datos del producto a actualizar desde el cuerpo de la solicitud
    console.log(req.body)
    try {
        // Verifica si se ha subido un archivo y procesalo
        let imageUrl = productData.imageUrl; // Utiliza la URL de la imagen existente por defecto
        if (req.file) {
            // Si se ha subido un archivo, sube la imagen y obtén la URL
            imageUrl = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        }

        // Actualiza el producto con los nuevos datos y la nueva URL de la imagen si se ha proporcionado
        ProductModel.updateProduct(productId, { ...productData, imageUrl }, (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).json({ message: 'Error updating product' });
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Error processing image upload:', error);
        return res.status(500).json({ message: 'Error processing image upload' });
    }
};
export const createProduct = async (req, res) => {
    const productData = req.body; // Los datos del producto desde el cuerpo de la solicitud

    try {
        // Verifica si se ha subido un archivo y procésalo
        let imageUrl;
        if (req.file) {
            // Si se ha subido un archivo, sube la imagen y obtén la URL
            imageUrl = await uploadImageAndGetUrl(req.file.buffer, req.file.originalname);
        } else {
            // Si no se sube una imagen, puedes decidir usar una imagen predeterminada o dejarla en blanco
            imageUrl = ''; // O la URL de una imagen predeterminada
        }

        // Crea el producto con los datos proporcionados y la URL de la imagen
        const newProductData = { ...productData, imageUrl }; // Asegúrate de incluir otros campos necesarios del formulario

        // Llama al modelo para crear el producto en la base de datos
        ProductModel.createProduct(newProductData, (err, result) => {
            if (err) {
                console.error('Error creating product:', err);
                return res.status(500).json({ message: 'Error creating product' });
            }
            res.status(201).json({ message: 'Product created successfully', product: result });
            req.io.emit('productCreateAdmin', { message: 'Product list updated' });
        });
    } catch (error) {
        console.error('Error processing image upload:', error);
        return res.status(500).json({ message: 'Error processing image upload' });
    }
};*/