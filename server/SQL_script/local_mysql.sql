--create database distributed_project_1;
--use distributed_project_1

create user 'nam' identified by 'nam_pass';
grant all on distributed_project.* to 'nam';
ALTER USER 'nam' IDENTIFIED WITH mysql_native_password BY 'nam_pass';

create user 'nam1' identified by 'nam_pass';
grant all on distributed_project_1.* to 'nam1';
ALTER USER 'nam1' IDENTIFIED WITH mysql_native_password BY 'nam_pass';

--update mysql.user set authentication_string ='name_pass' where User = 'nam';

show grants for 'nam';
show grants for 'nam1';
--drop user 'nam';
--drop user 'nam1';
select user();
--show grants for nam;

--ALTER TABLE UserGlobal ADD hashpass varchar(32) NOT NULL DEFAULT '108826';