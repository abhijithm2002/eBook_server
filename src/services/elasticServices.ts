import mongoose from "mongoose";
import elasticClient from "../config/elasticClient.js";
import { IBook } from "../model/bookModel.js";

// Index a new book
export const indexBook = async (book: IBook) => {
    console.log('Coming to indexBook');
    try {
        const response = await elasticClient.index({
            index: "books",
            id: (book._id as mongoose.Types.ObjectId).toString(),
            document: {
                title: book.title,
                author: book.author,
                publicationYear: book.publicationYear,
                isbn: book.isbn,
                description: book.description,
                image: book.image,
                addedBy: book.addedBy.toString(),
            },
        });
        console.log("Elasticsearch Index Response:", response);
        return response;
    } catch (error) {
        console.error("Error indexing book in Elasticsearch:", error);
        throw error;
    }
};


// Update book in Elasticsearch
export const updateBookIndex = async (book: IBook) => {
    console.log('coming to updatedbookk');
    
    try {
       const response =  await elasticClient.update({
            index: "books",
            id: (book._id as mongoose.Types.ObjectId).toString(),
            doc: {
                title: book.title,
                author: book.author,
                publicationYear: book.publicationYear,
                isbn: book.isbn,
                description: book.description,
                image: book.image,
                addedBy: book.addedBy.toString(),
            },
        });
        console.log('elsatic updae response ', response);
        
        return response;
    } catch (error) {
        console.error("Error updating book in Elasticsearch:", error);
        throw error;
    }
};

// Delete book from Elasticsearch
export const deleteBookIndex = async (bookId: string) => {
    try {
       const response =  await elasticClient.delete({
            index: "books",
            id: bookId,
        });
        console.log('response of delete', response)
        return response
    } catch (error) {
        console.error("Error deleting book from Elasticsearch:", error);
        throw error;
    }
};

// Search for books
export const searchBooks = async (query: string) => {
    try {
        const result = await elasticClient.search({
            index: "books",
            query: {
                multi_match: {
                    query,
                    fields: ["title", "author", "description"], 
                    fuzziness: 'AUTO',
                    minimum_should_match: "1<75%",
                },
            },
        });


    return result.hits.hits.map((hit) => hit._source);
} catch (error) {
    console.error("Error searching books in Elasticsearch:", error);
    throw error;
}
};
