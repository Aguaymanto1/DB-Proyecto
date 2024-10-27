import express from 'express';
import multer from 'multer';
import * as productController from './controllers/productController.mjs';
import * as userController from './controllers/userController.mjs';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Rutas de productos
router.get('/products', productController.getAllProducts);  // Obtener todos los productos
router.post('/product-create', upload.single('image'), productController.createProduct);  // Crear un producto nuevo con imagen y tipo
router.put('/products/:id', upload.single('image'), productController.updateProduct);  // Actualizar un producto existente con imagen y tipo
router.delete('/products/:id', productController.deleteProduct);  // Eliminar un producto

// Rutas de usuarios
router.post("/user-create", userController.createUser);  // Crear un nuevo usuario
router.post('/login', userController.login);  // Iniciar sesión de usuario

export default router;
