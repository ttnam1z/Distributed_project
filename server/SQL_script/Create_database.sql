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
drop table distributed_project.RoomTime;
drop table distributed_project.ChatRoom;
drop table distributed_project.BlockList;
drop table distributed_project.UserGlobal;
drop table distributed_project.UserLocal;
drop table distributed_project.Server;


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
create table RoomTime (
    id INT PRIMARY KEY AUTO_INCREMENT,
    roomid INT,
    user INT,
    leftTime DATETIME NOT NULL DEFAULT '1000-01-01 00:00:00.000000',
    FOREIGN KEY (roomId) REFERENCES ChatRoom(id),
    FOREIGN KEY (user) REFERENCES UserGlobal(globalId)
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
Delete from distributed_project.ChatRoom;
Delete from distributed_project.Message;
-- Insert init data
Insert into distributed_project.Server(address,hashpass,name,port) value('192.168.99.100','nam','LocalServer',8080);
--update distributed_project.Server Set address='192.168.99.100',hashpass='nam',name='LocalServer',port=8080 where id = 1;
