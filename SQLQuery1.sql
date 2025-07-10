create table library(
                        id INT PRIMARY KEY,
                        title VARCHAR(50) NOT NULL,
                        author VARCHAR(50) NOT NULL,
                        ISBN VARCHAR(30) NOT NULL,
                        copies INT NOT NULL,
                        COPIES_AVAILABLE varchar(3) NOT NULL
)

create table authors(
                        id INT PRIMARY KEY,
                        name VARCHAR(50) NOT NULL
)


create table book_authors(
                             book_id INT,
                             author_id INT,
                             FOREIGN KEY (book_id) REFERENCES library(id),
                             FOREIGN KEY (author_id) REFERENCES authors(id)
)

create table users(
                      id INT PRIMARY KEY,
                      name VARCHAR(50) NOT NULL,
                      email VARCHAR(50) NOT NULL,
                      password_hash VARCHAR(50) NOT NULL,
)

create table loans(
                      id INT PRIMARY KEY,
                      user_id INT,
                      book_id INT,
                      loan_date DATETIME,
                      due_date DATETIME
)

    insert into dbo.library
values(1, 'Enigma Otilie', 'George Calinescu', '978-973-104-238-1', 8, 6);

insert into dbo.library
values(2, 'Iona', 'Marin Sorescu', '	973-98642-5-2', 7, 1)