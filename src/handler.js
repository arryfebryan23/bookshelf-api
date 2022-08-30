/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    const id = nanoid(16);

    const insertedAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (!name) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });

        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });

        response.code(400);
        return response;
    }

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = res.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });

    response.code(500);
    return response;
};

const getBooksHandler = (req, res) => {
    const { name, reading, finished } = req.query;

    if (books.length === 0) {
        const response = res.response({
            status: 'success',
            data: {
                books: [],
            },
        });
        response.code(200);
        return response;
    }

    if (reading == 1) {
        const filteredBooks = books.filter((n) => n.reading === true);
        const response = res.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
        // eslint-disable-next-line no-else-return
    } else if (reading == 0) {
        const filteredBooks = books.filter((n) => n.reading === false);
        const response = res.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (name) {
        const filteredBooks = books.filter((n) => {
            const tempName = n.name.toLowerCase();
            const tempName2 = name.toLowerCase();
            return tempName.includes(tempName2);
        });

        const response = res.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (finished == 1) {
        const filteredBooks = books.filter((n) => n.finished === true);
        const response = res.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
        // eslint-disable-next-line no-else-return
    } else if (finished == 0) {
        const filteredBooks = books.filter((n) => n.finished === false);
        const response = res.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });

    response.code(200);
    return response;
};

const getBookByIdHandler = (req, res) => {
    const { id } = req.params;
    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        const response = res.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
};

const updateBookHandler = (req, res) => {
    const { id } = req.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;

    const index = books.findIndex((n) => n.id === id);

    if (index !== -1) {
        if (!name) {
            const response = res.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            });
            response.code(400);
            return response;
        }

        if (readPage > pageCount) {
            const response = res.response({
                status: 'fail',
                message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }

        const updatedAt = new Date().toISOString();
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = res.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookHandler = (req, res) => {
    const { id } = req.params;

    const index = books.findIndex((n) => n.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler, getBooksHandler, getBookByIdHandler, updateBookHandler, deleteBookHandler,
};
