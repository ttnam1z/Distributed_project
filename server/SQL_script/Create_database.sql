-- user: nam
-- pass: nam_pass
use distributed_project
show user();
select database();
show tables;
--DESCRIBE user;
--drop table distributed_project.Customer;
--select * from Customer;

--    create table Customer (
--        id INT PRIMARY KEY,
--        name varchar(20),
--        hashpass varchar(32)
--        );

drop table distributed_project.Message;
drop table distributed_project.ChatRoom;
drop table distributed_project.BlockList;
drop table distributed_project.UserGlobal;
drop table distributed_project.UserLocal;
drop table distributed_project.Server;

/*
create table Server (
    id INT PRIMARY KEY AUTO_INCREMENT,
    address varchar(256),
    port INT,
    name varchar(20),
    hashpass varchar(32)
    );
create table UserLocal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name varchar(20),
    hashpass varchar(32)
    );
create table UserGlobal (
    globalId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    name varchar(20),
    serverId INT,
    FOREIGN KEY (serverId) REFERENCES Server(id)
    );
create table BlockList (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user INT,
    blockedUser INT,
    timeStart Date,
    FOREIGN KEY (user) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (blockedUsr) REFERENCES UserGlobal(globalId)
    );
create table ChatRoom (
    roomId INT PRIMARY KEY AUTO_INCREMENT,
    userGlobal1 INT,
    userGlobal2 INT,
    FOREIGN KEY (userGlobal1) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (userGlobal2) REFERENCES UserGlobal(globalId)
    );
create table Message (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roomId INT,
    userGlobal INT,
    content varchar(1024),
    timeStamp Date,
    FOREIGN KEY (roomId) REFERENCES ChatRoom(roomId),
    FOREIGN KEY (userGlobal) REFERENCES UserGlobal(globalId)
    );
*/
--begin
--end;