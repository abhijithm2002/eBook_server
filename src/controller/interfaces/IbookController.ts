import { Request, Response, NextFunction } from "express";

export default interface IBookController {
    createBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMyBooks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getBooks(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteBook(req: Request, res: Response, next: NextFunction): Promise<void>;
    searchBooksController(req: Request, res: Response, next: NextFunction): Promise<void>;
}
