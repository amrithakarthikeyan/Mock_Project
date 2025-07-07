CREATE TABLE "Assets" (
	"Asset-ID"	INTEGER,
	"Asset-Type"	TEXT NOT NULL,
	"Brand"	TEXT,
	"Model"	TEXT,
	"Serial-Number"	INTEGER,
	"Purchase_Date"	TEXT,
	"Status"	TEXT,
	PRIMARY KEY("Asset-ID")
);

CREATE TABLE "Employees" (
	"Employee-ID"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Department"	INTEGER,
	"Email"	TEXT UNIQUE,
	PRIMARY KEY("Employee-ID")
);

INSERT INTO Employees ("Employee-ID", Name, Department, Email) VALUES
(4504, 'Aaron Williams', 105, 'mary72@gmail.com'),
(4029, 'Angela Sanchez', 106, 'nancy45@gmail.com'),
(8855, 'Cynthia Cunningham', 103, 'johnwilliams@yahoo.com'),
(2036, 'Kaitlyn Cooper', 105, 'gilbertkathleen@gmail.com'),
(6374, 'Brian Massey', 101, 'kathrynsmith@salazar-jackson.com'),
(6433, 'Melissa Graham DDS', 104, 'kerickson@hotmail.com'),
(8002, 'Kenneth Bass', 108, 'bwarren@hotmail.com'),
(2440, 'Michael Gutierrez', 104, 'enichols@lee.com'),
(2039, 'Amber Smith', 102, 'callahanjennifer@smith.com');

