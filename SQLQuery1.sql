create table library (
	title VARCHAR(50) NOT NULL,
	author VARCHAR(50) NOT NULL,
	ISBN VARCHAR(30) NOT NULL,
	copies VARCHAR(3),
	copies_available VARCHAR(3)
)

ALTER TABLE dbo.library
ALTER COLUMN ISBN VARCHAR(30) NOT NULL;

INSERT INTO dbo.library
VALUES ('Baltagul', 'Mihail Sadoveanu', '978-606-93355-0-5', 5, 3);

select * from dbo.library