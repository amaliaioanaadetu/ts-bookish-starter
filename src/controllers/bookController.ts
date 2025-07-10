import { Router, Request, Response } from 'express';
import { Connection, ConnectionConfiguration, Request as TediousRequest } from 'tedious';
import { Book } from '../models/Book';
import { configuration } from '../configuration';


class BookController {
    router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', this.getBooks.bind(this));
        this.router.get('/:id', this.getBook.bind(this));

        this.router.post('/', this.createBook.bind(this));
    }

    getBooks(req: Request, res: Response) {
        try {
            const connection = new Connection(configuration);
            const books: Book[] = [];

            connection.on('connect', (err) => {
                if (err) {
                    console.error('Connection error:', err);
                    res.status(500).send('Failed to connect to database');
                    return;
                }

                const sql = 'SELECT * FROM dbo.library';
                const request = new TediousRequest(sql, (err) => {
                    if (err) {
                        console.error('Request error:', err);
                        res.status(500).send('Query failed' + err.message);
                        connection.close();
                    } else {
                        res.json(books);
                        connection.close();
                    }
                });

                request.on('row', (columns) => {
                    const book: any = {};
                    columns.forEach((column) => {
                        book[column.metadata.colName] = column.value;
                    });
                    const b = new Book(
                        book['title'],
                        book['author'],
                        book['ISBN'],
                        book['copies'],
                        book['copies_available'],
                    );
                    books.push(b);
                });
                connection.execSql(request);
            });
            connection.connect();

        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    getBook(req: Request, res: Response) {
        try {
            const connection = new Connection(configuration);
            const books: Book[] = [];

            connection.on('connect', (err) => {
                if (err) {
                    console.error('Connection error:', err);
                    res.status(500).send('Failed to connect to database');
                    return;
                }

                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({
                        error: 'bad request',
                        error_description: 'Not a number.',
                    });
                }

                const sql = `SELECT * FROM dbo.library where id = ${id}`;
                const request = new TediousRequest(sql, (err) => {
                    if (err) {
                        console.error('Request error:', err);
                        res.status(500).send('Query failed' + err.message);
                        connection.close();
                    } else {
                        res.json(books);
                        connection.close();
                    }
                });

                request.on('row', (columns) => {
                    const book: any = {};
                    columns.forEach((column) => {
                        book[column.metadata.colName] = column.value;
                    });
                    const b = new Book(
                        book['title'],
                        book['author'],
                        book['ISBN'],
                        book['copies'],
                        book['copies_available'],
                    );
                    books.push(b);
                });

                connection.execSql(request);
            });
            connection.connect();
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    createBook(req: Request, res: Response) {
        const connection = new Connection(configuration);
        const requestData = req.body;
        const id = parseInt(requestData['id']);
        if (isNaN(id)) {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not a number.',
            });
        }

        const title = requestData['title'];
        if (title === undefined || title === null || title === '') {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not a title.',
            });
        }

        const author = requestData['author'];
        if (author === undefined || author === null || author === '') {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not an author.',
            });
        }

        const isbn = requestData['isbn'];
        if (isbn === undefined || isbn === null || isbn === '') {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not an isbn.',
            });
        }

        const copies = parseInt(requestData['copies']);
        if (isNaN(copies)) {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not a number.',
            });
        }

        const copiesAvailable = parseInt(requestData['available copies']);
        if (isNaN(copiesAvailable)) {
            return res.status(400).json({
                error: 'bad request',
                error_description: 'Not a number.',
            });
        }

        try {
            connection.on('connect', (err) => {
                if (err) {
                    console.error('Connection error:', err);
                    res.status(500).send('Failed to connect to database');
                    return;
                }

                const sql = `insert into dbo.library\nvalues(${id}, ${title}, ${author}, ${isbn}, ${copies}, ${copiesAvailable});`;
                const request = new TediousRequest(sql, (err) => {
                    if (err) {
                        console.error('Request error:', err);
                        res.status(500).send('Query failed' + err.message);
                        connection.close();
                    } else {
                        res.status(200).send('Book added');
                        connection.close();
                    }
                });
                connection.execSql(request);
            });
            connection.connect();
        } catch (error) {
            res.status(500).send('Server Error');
        }

        // return res.status(500).json({
        //     error: 'server_error',
        //     error_description: 'Endpoint not implemented yet.',
        // });
    }
}

export default new BookController().router;
