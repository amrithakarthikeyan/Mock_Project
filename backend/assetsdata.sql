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

CREATE TABLE "Assignment" (
	"Assignment_ID"	INTEGER NOT NULL PRIMARY KEY,
	"Asset-ID"	INTEGER NOT NULL,
	"Employee_ID"	INTEGER NOT NULL,
	"Assigned_Date"	TEXT,
	"Return_Date"	TEXT,
	"Condition_on_return"	TEXT,
	FOREIGN KEY("Asset-ID") REFERENCES "Assets"("Asset-ID") ,
	FOREIGN KEY("Employee_ID") REFERENCES "Employees"("Employee-ID")
);

CREATE TABLE "Employees" (
	"Employee-ID"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Department"	INTEGER,
	"Email"	TEXT UNIQUE,
	PRIMARY KEY("Employee-ID")
);
