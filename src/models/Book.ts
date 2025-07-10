export class Book {
    title: string;
    author: string;
    ISBN: string;
    copies: number;
    copies_available: number;
    
    constructor(title, author, isbn, copies, copies_available) {
        this.title = title;
        this.author = author;
        this.ISBN = isbn;
        this.copies = copies;
        this.copies_available = copies_available;
    }
}