import express from 'express';
const router = express.Router();
import { authController, todoController, accountController, aboutController, contactController } from '../controller/index.js';

// Middleware
router.use(express.urlencoded({ extended: true }));

// Auth Routes
router.get('/', authController.getLogin);
router.post('/', authController.postLogin);
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/logout', authController.logout);

// Home Routes
router.get('/home', todoController.getTodo);
router.post('/home', todoController.postTodo);
router.get('/show/:id', todoController.showTodo);
router.get('/update/:id', todoController.getUpdateTodo);
router.post('/update/:id', todoController.postUpdateTodo);
router.get('/delete/:id', todoController.deleteTodo);
router.get('/search', todoController.getSearchTodo);
router.post('/search', todoController.postSearchTodo);

// Others Routes
router.get('/account', accountController.account);
router.get('/about', aboutController.about);
router.get('/contact', contactController.getContact);
router.post('/contact', contactController.postContact);

export default router;
