DROP DATABASE IF EXISTS employeemanagement_db;
CREATE DATABASE employeemanagement_db;

USE employeemanagement_db;

DROP TABLE IF EXISTS department;
CREATE TABLE department(
    id INT AUTO_INCREMENT KEY NOT NULL,
    name VARCHAR (30)
);

DROP TABLE IF EXISTS role;
CREATE TABLE role(
    id INT AUTO_INCREMENT KEY NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR (30),
    last_name VARCHAR (30),
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);