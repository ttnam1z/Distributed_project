-- user: nam1
-- pass: nam_pass


--show user();
--select database();
--show tables;

--DESCRIBE user;
--drop table distributed_project.Customer;
--select * from Customer;

--    create table Customer (
--        id INT PRIMARY KEY,
--        name varchar(20),
--        hashpass varchar(32)
--        );

--use distributed_project
--drop table distributed_project.Message;
--drop table distributed_project.ServerNotify;
--drop table distributed_project.UserNotify;
--drop table distributed_project.ChatRoom;
--drop table distributed_project.BlockList;
--drop table distributed_project.UserGlobal;
--drop table distributed_project.UserLocal;
--drop table distributed_project.Server;

use distributed_project_1
drop table distributed_project_1.Message;
drop table distributed_project_1.ServerNotify;
drop table distributed_project_1.UserNotify;
drop table distributed_project_1.ChatRoom;
drop table distributed_project_1.BlockList;
drop table distributed_project_1.UserGlobal;
drop table distributed_project_1.UserLocal;
drop table distributed_project_1.Server;

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
    hashpass varchar(32),
    FOREIGN KEY (serverId) REFERENCES Server(id)
    );
create table BlockList (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user INT,
    blockedUser INT,
    timeStart DATETIME,
    FOREIGN KEY (user) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (blockedUser) REFERENCES UserGlobal(globalId)
    );
create table ChatRoom (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userGlobal1 INT,
    userGlobal2 INT,
    FOREIGN KEY (userGlobal1) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (userGlobal2) REFERENCES UserGlobal(globalId)
    );
create table UserNotify (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user INT,
    type Int not null default 1,
    info Int,
    FOREIGN KEY (user) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (info) REFERENCES UserGlobal(globalId)
    );
create table ServerNotify (
    id INT PRIMARY KEY AUTO_INCREMENT,
    server Int,
    user INT,
    type Int not null default 1,
    friend int,
    content varchar(1024),
    FOREIGN KEY (server) REFERENCES Server(id),
    FOREIGN KEY (user) REFERENCES UserGlobal(globalId),
    FOREIGN KEY (friend) REFERENCES UserGlobal(globalId)
    );
create table Message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    roomId INT,
    userGlobal INT,
    content varchar(1024),
    timeStamp DATETIME,
    FOREIGN KEY (roomId) REFERENCES ChatRoom(id),
    FOREIGN KEY (userGlobal) REFERENCES UserGlobal(globalId)
    );

--begin
--end;


--Delete from distributed_project.UserGlobal;
--Delete from distributed_project.UserLocal;
--Delete from distributed_project.ChatRoom;
--Delete from distributed_project.Message;
-- Insert init data
Insert into distributed_project_1.Server(address,hashpass,name,port) value('127.0.0.1','nam','LocalServer',8082);
--update distributed_project.Server Set address='192.168.99.100',hashpass='nam',name='LocalServer',port=8080 where id = 1;
