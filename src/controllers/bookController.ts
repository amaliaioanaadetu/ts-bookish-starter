import { Router, Request, Response } from 'express';
import { Connection, ConnectionConfiguration, Request as TediousRequest } from 'tedious';
import {Book} from './Book'

const config: ConnectionConfiguration = {
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: 'amaadeioa',
            password: 'amaliaioana12!',
        },
    },
    options: {
        database: 'bookish',
        trustServerCertificate: true,
        encrypt: false,
    },
};

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
            const connection = new Connection(config);
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
            const connection = new Connection(config);
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
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }
}

export default new BookController().router;
