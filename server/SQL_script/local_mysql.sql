create database distributed_project;
use distributed_project

create user 'nam' identified by 'nam_pass';
grant all on distributed_project.* to 'nam';
ALTER USER 'nam' IDENTIFIED WITH mysql_native_password BY 'nam_pass';

--update mysql.user set authentication_string ='name_pass' where User = 'nam';

show grants for 'nam';
drop user 'nam';
select user();
show grants for nam;