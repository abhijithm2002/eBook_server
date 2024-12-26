import { Router } from "express";
import AuthController from "../controller/authController.js";
import BookController from "../controller/bookController.js";

const router = Router();

const authController = new AuthController()
const bookController = new BookController();

router.post('/userSignup', authController.userSignup.bind(authController));
router.post('/userLogin', authController.userLogin.bind(authController));
router.post('/createBook', bookController.createBook.bind(bookController));
router.get('/getMyBook/:userId', bookController.getMyBooks.bind(bookController));
router.get('/getAllBooks', bookController.getBooks.bind(bookController));
router.put('/updateBook/:bookId', bookController.updateBook.bind(bookController));
router.delete('/deleteBook/:bookId', bookController.deleteBook.bind(bookController));
router.get('/searchBooks', bookController.searchBooksController.bind(bookController));


export const userRoutes = router;