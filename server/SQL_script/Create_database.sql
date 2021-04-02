-- user: nam
-- pass: nam_pass
use distributed_project
show user();
select database();
show tables;
create table Customer (
    id INT PRIMARY KEY,
    name varchar(20),
    hashpass varchar(32)
    );
DESCRIBE user;
--drop table distributed_project.Customer;
select * from Customer;