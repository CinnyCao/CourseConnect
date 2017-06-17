CREATE DATABASE IF NOT EXISTS CourseConnectDb;

CREATE TABLE IF NOT EXISTS Users (
  LastName    varchar(10)   NOT NULL,
  FirstName   varchar(10)   NOT NULL,
  Email       varchar(255)  NOT NULL,
  UTorId      varchar(10)   NOT NULL,
  Password    varchar(10)   NOT NULL,
  CONSTRAINT PK_Users PRIMARY KEY (Email)
);

INSERT INTO Users (LastName, FirstName, Email, Password) VALUES ("Kyle", "Smith", "kyle.smith@gmail.com", "hehe");
INSERT INTO Users (LastName, FirstName, Email, Password) VALUES ("Sam", "Smith", "sam.smith@gmail.com", "123");
INSERT INTO Users (LastName, FirstName, Email, Password) VALUES ("John", "Keys", "john.keys@gmail.com", "oops");
INSERT INTO Users (LastName, FirstName, Email, Password) VALUES ("Sam", "Benzezos", "sam.benz@gmail.com", "sbenz");



