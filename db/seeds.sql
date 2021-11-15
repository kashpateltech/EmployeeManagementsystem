USE Employee_Management_db;
INSERT INTO department (name)
 VALUES ("IT"),
		("Production"),
		("Engineering"),
		("Accounting"),
		("Sales");
-- SELECT * FROM department;

INSERT INTO role (title, salary, department_ID) 
VALUES  ("Manager", 65000, 1),
        ("IT Tech", 50000, 1),
        ("Manager", 50000, 2),
        ("Team Lead", 40000, 2),
        ("Operator", 30000, 2),
        ("Manager", 110000 , 3),
        ("Software Engineer", 85000, 3),
        ("Lead Engineer", 100000, 3),
        ("Manager", 85000, 4),
        ("Accountant", 70000, 4),
        ("Manager", 100000, 5),
        ("Sales Lead", 90000, 5),
        ("Salesperson", 70000, 5);
-- SELECT * FROM role;

USE Employee_Management_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES  ("Ron", "Cutajar", 1, NULL ),
		("Bob", "Nocevski", 2, 1),
		("Theresa", "Young", 3, NULL),
		("Leena", "Faiz", 4, 3),
		("Umar", "Khan", 5, 3),
		("Paul", "Pogba", 6, NULL),
		("David", "Beckham", 7, 6),
		("Lionel", "Messi",8, 6),
        ("Jarryd", "Hayne", 9, NULL),
        ("Melissa", "Payne", 10, 9);