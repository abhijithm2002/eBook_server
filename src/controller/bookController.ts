import { Request, Response, NextFunction } from "express";
import IBookController from "./interfaces/IbookController";
import { indexBook, updateBookIndex, deleteBookIndex, searchBooks } from "../services/elasticServices.js";
import BookModel from "../model/bookModel.js";

export default class BookController implements IBookController {
    // Create a new book
    public async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Ensure `addedBy` is included
            const { title, author, publicationYear, isbn, description,image, userId } = req.body;
            
            console.log('book details', req.body);
            const book = new BookModel({
                title,
                author,
                publicationYear: parseInt(publicationYear),
                isbn,
                description,
                image,
                addedBy : userId,
            });
            console.log('book',book)
            const saved = await book.save();
            if (!saved) {
                console.log( "Book could not be saved" );
            }    
            console.log('saved',saved)
            console.log('........')
            // Index the book in Elasticsearch
           const elasticindex =  await indexBook(book);
           console.log('//////////////////////////////')
           console.log('elasticindex', elasticindex);
           

            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    }

    public async getMyBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId as string;
            console.log('userid', userId)
           
            const books = await BookModel.find({ addedBy: userId });
    
            if (!books || books.length === 0) {
                res.status(404).json({ message: "No books found for this user" });
                return;
            }
    
            res.status(200).json({message:'fetched books successfully', books });
        } catch (error) {
            next(error);
        }
    }
    

    // Retrieve all books
    public async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const books = await BookModel.find().populate("addedBy", "name email"); 
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }

    // Update a book
    public async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bookId = req.params.bookId;
            const updatedData = req.body;
            console.log('upadted data', updatedData)
            console.log('bookId', bookId)
            const book = await BookModel.findByIdAndUpdate(bookId, updatedData, { new: true });
            console.log('updated book', book)
            if (book) {
                await updateBookIndex(book);
                
                res.status(200).json(book);
            } else {
                res.status(404).json({ message: "Book not found." });
            }
        } catch (error) {
            next(error);
        }
    }

    // Delete a book
    public async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const bookId = req.params.bookId;
            console.log("bookid",bookId)
            const book = await BookModel.findByIdAndDelete(bookId);
            console.log('book', book)
            if (book) {
                // Remove from Elasticsearch index
                await deleteBookIndex(bookId);
                res.status(200).json({ message: "Book deleted successfully." });
            } else {
                res.status(404).json({ message: "Book not found." });
            }
        } catch (error) {
            next(error);
        }
    }

    // Search for books
    public async searchBooksController(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query.q as string;
            console.log('query', query)
            const books = await searchBooks(query);
            console.log('books in search', books)
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    }
}
