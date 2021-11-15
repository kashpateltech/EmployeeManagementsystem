//Const used to initialize the npm modules used in this file
const inquirer = require('inquirer');
const figlet = require('figlet');

//This code calls various files in my lib folder that contain objects I reference
const connection = require("./lib/SQL_login");
const commandMenuChoices = require('./lib/commandMenu');
const questions = require('./lib/questions');

//This code calls my classes
const InquirerFunctions = require('./lib/inquirer');
const SQLquery = require('./lib/SQL_queries');

//This array contains the inquirer prompt types I use
const inquirerTypes = [
    'input', 'confirm', 'list'
]

//This line of code runs a synchronous function through the figlet npm that displays the designated text string in the console
console.log(figlet.textSync('Employee Management', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));

//This line begins the app calling the main menu function
mainMenu();

//This function renders the mainmenu options and the directs the user to the proper places based on their choice
function mainMenu() {

    //This is calling the class Inquirer functions to create an instance of the class
    const menuPrompt = new InquirerFunctions(inquirerTypes[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices);
    
    //This code runs a list type inquirer for the choice of what option to choose at the main menu.
    inquirer
    //The menuPrompt.ask() is coming from my InquirerFunctions and creating an object of the inquirer parameters that I deliver in the prompts array
        .prompt([menuPrompt.ask()]).then(operation => {

            //This is a general sql query to grab all the roles in database
            //An instance of mySQL query is created to be called in the switch function below
            const query1 = "SELECT role.title FROM role"
            const compRolesArrayQuery = new SQLquery(query1);

            //This is general sql query to grab all the departments in the database
            //An instance of mySQL query is created to be called in the switch function below
            const depNameQuery = "SELECT department.name FROM department";
            const depNamesArrayQuery = new SQLquery(depNameQuery);

            switch (operation.menuChoice) {

                case commandMenuChoices[2]:
                    //This is the case where user can view all the employees in the company
                    return viewAllEmp();

                case commandMenuChoices[3]:
                    //This is the case where a user can view all the employees in a given department
                    //queryReturnResult() is a method in my SQLqueries class that will run a query and return the result
                    // to the function delivered as the parameter
                    depNamesArrayQuery.queryReturnResult(viewAllEmpDep);
                    break;

                case commandMenuChoices[4]:
                    //This is the case where a user can view all the employees under a given manager
                    const actionChoice5 = "VIEW BY MANAGER"
                    // return viewAllEmpManager
                    dummyArr = [];
                    //This is calling the employee info prompts from below and delivering parameters to run it.
                    EmpInfoPrompts(dummyArr, actionChoice5);
                    break;

                case commandMenuChoices[5]:
                    //This is the case where user can view all the employes by their role title.  Salary and Department will also be listed
                    //GetqueryNoRepeats() is a method in the sqlQueries file that 
                    compRolesArrayQuery.getQueryNoRepeats(viewAllEmpRole)
                    break;

                case commandMenuChoices[6]:
                    //This is the case where user can view all the managers and the departments they are in
                    return viewAllManager();

                case commandMenuChoices[11]:
                    //This is the case for adding an employee
                    const actionChoice1 = "ADD"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice1);

                    break;

                case commandMenuChoices[12]:
                    //This is the case for deleting an employee
                    const actionChoice2 = "DELETE"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice2);
                    break;

                case commandMenuChoices[13]:
                    //This is the case for the update an employees role funtion
                    const actionChoice3 = "UPDATE EMP ROLE"
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice3);

                    break;

                case commandMenuChoices[14]:
                    //This is the case for updating an employees manager
                    const actionChoice4 = "UPDATE EMP MANAGER";
                    compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice4);
                    break;

                case commandMenuChoices[1]:
                    //This is the case for viewing all roles in the company.  It also shows salary and department the role is under
                    return viewAllRoles();

                case commandMenuChoices[9]:
                    //This is the case for adding a role to database.
                    return addRole();

                case commandMenuChoices[10]:
                    //This is the case for deleting a role to database.
                    const actionChoice7 = "DELETE ROLE";
                    compRolesArrayQuery.getQueryNoRepeats(deleteRole, actionChoice7);
                    break;
                // return removeRole();

                case commandMenuChoices[0]:
                    //This is the case for viewing all the departments by name in the company
                    return viewAllDep();

                case commandMenuChoices[7]:
                    //This is the case where user can add a department to database
                    depNamesArrayQuery.queryReturnResult(addDep);
                    break;

                case commandMenuChoices[8]:
                    //this is the case where user can delete a department from database
                    depNamesArrayQuery.queryReturnResult(removeDep);
                    break;
            }
        })
}

//This function will display a table with all the employees on the console
function viewAllEmp() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                     FROM employee
                     INNER JOIN role on role.id = employee.role_id
                     INNER JOIN department on department.id = role.department_id;`

    const empTable = new SQLquery(query);
    //this line runs the generalTableQuery() method on the sqlquery instance declared by empTable variable.
    //Mainmenu is delivered as a parameter because it is the function that is essentially used to take user to the next step.
    empTable.generalTableQuery(mainMenu);
}

//THis function will display a table of all employees by a chosen department to the console
//This function is delivered a parameter that is an array of department names
function viewAllEmpDep(depNamesArray) {
    
    
    const departmentNamePrompt = new InquirerFunctions(inquirerTypes[2], 'department_Name', questions.viewAllEmpByDep, depNamesArray);
    
    //This line of code runs the instance of inquirerfunctions declared above in the inquirer prompt to deliver user response
    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {

        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                        FROM employee
                        INNER JOIN role on role.id = employee.role_id
                        INNER JOIN department on department.id = role.department_id AND department.name = ? ;`

        const empByDepTable = new SQLquery(query, userResp.department_Name);
        //this line runs the generalTableQuery() method on the sqlquery instance declared by empByDepTable variable.  This will generate a table to console.
        empByDepTable.generalTableQuery(mainMenu);
    })
}

//This function will generate a table to console of employees by a chosen manager
//a manager obj and an array of current manager names are delivered as parameters.
function viewAllEmpManager(managerObj, namesArr) {
    

    const chosenManager = new InquirerFunctions(inquirerTypes[2], 'manager_choice', questions.searchByManager, namesArr);

    inquirer.prompt([chosenManager.ask()]).then(userChoice => {

        console.log(`Manager Searched By: ${userChoice.manager_choice}`);

        let chosenManagerID = 0;
        //This line grabs the chosen manager and gets the first name
        const chosenManagerName = userChoice.manager_choice.split(" ", 2)

        //This for loop then compares the last name with the last names of managers in managerObj delivered as parameters
        //because the id for each manager is also in this obj.  When a match is fun the id of that match is set to chosenManagerID.
        for (manager of managerObj) {
            if (chosenManagerName[1] == manager.lastName) {
                chosenManagerID = manager.ID;
            }
        }

        const queryManagerSearch = `SELECT employee.last_name, employee.first_name, role.title, department.name
                                    FROM employee
                                    INNER JOIN role on role.id = employee.role_id
                                    INNER JOIN department on department.id = role.department_id
                                    WHERE employee.manager_id = (?) `

        //The below code then creates an instance of sqlquery and runs a generalTableQuery() method on that instance.
        const managerSearch = new SQLquery(queryManagerSearch, chosenManagerID);
        managerSearch.generalTableQuery(mainMenu);
    })
}

//The below function will generate of all employees by a given role to the console
//An array of company roles is delivered as a parameter to the function
function viewAllEmpRole(compRoles, actionChoice) {

    //Create an instance of inquirerfunctions and then deliver it a prompt for inquirer.
    const rolePrompt = new InquirerFunctions(inquirerTypes[2], 'role_Title', questions.viewAllEmpByRole, compRoles);
    inquirer.prompt(rolePrompt.ask()).then(userResp => {

        //This query selects all the columns top line of query using and INNER JOIN to get from role and department. 
        // The AND role.title = (?) is what filters the results based on the role chosen by the user.
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
                        FROM employee 
                        INNER JOIN role on role.id = employee.role_id AND role.title = (?)
                        INNER JOIN department on department.id = role.department_id;`;


        const empByRoleTable = new SQLquery(query, userResp.role_Title);
        empByRoleTable.generalTableQuery(mainMenu);
    })
}

function viewAllManager() {

   
    const query = `SELECT employee.id, employee.first_name, employee.last_name, department.name
                    FROM employee
                    INNER JOIN role on role.id = employee.role_id
                    INNER JOIN department on department.id = role.department_id
                    WHERE employee.id IN ( SELECT employee.manager_id FROM employee );`;
                    //This line above is what creates filtering by manager effect of table.  Only the selected results that have an
                    //employee ID that is also in the table of employee manager ids from employee table will be returned

    const managerTable = new SQLquery(query);
    managerTable.generalTableQuery(mainMenu);
}

//Function that receives the input from the user and then either adds or deletes the selected employee based on the users choice in the main menu
//Multiple sql queries are run nested in one another to pass the information down the scope to final queries that either adds or deletes
function EmpInfoPrompts(compRoles, actionChoice) {

    //This query selects all the given columns from employee and where employee.id is present in the selected table of employee_ids present in employee_manager column.
    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN ( SELECT employee.manager_id FROM employee )";

    connection.query(query, function (err, res) {
        if (err) throw err
        
        let managerNamesArr = [];
        let managerObjArr = [];

        //The below for loop creates an array of manager names.  I realized some functionality later on in assignment
        // and believe I could remove this code and use SQLquery class instead
        for (let i = 0; i < res.length; i++) {
            let name = res[i].first_name + " " + res[i].last_name;
            let managersobj = {
                ID: res[i].id,
                firstName: res[i].first_name,
                lastName: res[i].last_name
            }

            managerObjArr.push(managersobj);
            managerNamesArr.push(name);
        }

        //Create four instances of inquirefunctions
        const first_name = new InquirerFunctions(inquirerTypes[0], 'first_name', questions.addEmployee1);
        const last_name = new InquirerFunctions(inquirerTypes[0], 'last_name', questions.addEmployee2);
        const emp_role = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.addEmployee3, compRoles);
        const emp_manager = new InquirerFunctions(inquirerTypes[2], 'employee_manager', questions.addEmployee4, managerNamesArr);

        //The actionChoice is a variable that is delivered with the mainMenu choice by user and passed as a parameter into this function
        //Designates to execute this code if add employee option was chosen
        if (actionChoice == "ADD") {

            //Promise.all is used here to grab the ask() methods of all the inquirerFunction instances above and wait for them all to resolve.  
            //it then returns all those as one promise that I can work with and deliver to inquirer 
            Promise.all([first_name.ask(), last_name.ask(), emp_role.ask(), emp_manager.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {

                    //executes add employee function passing employee ingo and manager obj arr as parameters to it
                    addEmp(emp_info, managerObjArr);
                })
            })
            //Execute code if the view by manager was chosen
        } else if (actionChoice == "VIEW BY MANAGER") {
            viewAllEmpManager(managerObjArr, managerNamesArr);

            //This code will excute for all other functions navigated to this area
            //It prompts user for the first and last.
        } else {

            //perfors a promise.all to wait until inquirerfunction instances resolve
            Promise.all([first_name.ask(), last_name.ask()]).then(prompts => {
                inquirer.prompt(prompts).then(emp_info => {

                    //below set of if else statements executed the multiples check function delivering 
                    //different parameters based on the user main menu choice
                    if (actionChoice == "UPDATE EMP ROLE") {
                        EmpMultiplesCheck(emp_info, actionChoice, compRoles);
                    } else if (actionChoice == "UPDATE EMP MANAGER") {
                        EmpMultiplesCheck(emp_info, actionChoice, managerObjArr, managerNamesArr);
                    } else {
                        EmpMultiplesCheck(emp_info, actionChoice);
                    }
                })
            })
        }
    })
}

//This function will add and employee to the database
//The sqlqueries class is not used in this function because I was having trouble getting a method that would return the result.
//Eventually figured it out but didnt have enough time to break up this function into multiple functions to have result delivered as a parameter to
function addEmp(emp_info, managerObjArr) {

    console.log("You've entered employee ADD");


    const queryRoleIdFromTitle = "SELECT role.id FROM role WHERE role.title = (?) ;"
    connection.query(queryRoleIdFromTitle, emp_info.employee_role, function (err, res) {
        if (err) {
            throw err;
        }
        const empRoleId = res[0].id;
        const empFirstName = emp_info.first_name;
        const empLastName = emp_info.last_name;
        const empManagerName = emp_info.employee_manager.split(" ");
        const empManagerFirstName = empManagerName[0];
        const empManagerLastName = empManagerName[1];

        let empManagerID = 0;

        //This for loop is done to get the manager Id of the employee being added so that it can be added to the database
        for (let manager of managerObjArr) {
            if (manager.firstName == empManagerFirstName && manager.lastName === empManagerLastName) {
                empManagerID = manager.ID;
            }
        }


        const queryInsertEmpInfo = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"
        connection.query(queryInsertEmpInfo, [empFirstName, empLastName, empRoleId, empManagerID], function (err, res) {
            if (err) {
                throw err
            }
            console.log("Employee Added");
            mainMenu();
        })
    })
}

//This function checks for multiple instances of the employee or role that is being changed
function EmpMultiplesCheck(emp_info, actionChoice, arrayNeededForNextStep) {

    console.log("You've entered employee multiples check")

    const empFirstName = emp_info.first_name;
    const empLastName = emp_info.last_name;
    const queryMultipleEmpCheck = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, 
                                    employee.manager_id, department.name
                                    FROM employee 
                                    INNER JOIN role on role.id = employee.role_id
                                    INNER JOIN department on department.id = role.department_id
                                    WHERE employee.first_name = (?) AND employee.last_name = (?);`

    connection.query(queryMultipleEmpCheck, [empFirstName, empLastName], function (err, res) {


        if (res.length > 1) {
            console.log("Multiple Employees Found!")
            let multipleName = [];
            for (employee of res) {
                let empStr = `${employee.id} ${employee.first_name} ${employee.last_name} ${employee.title} ${employee.name}`
                multipleName.push(empStr);
            }
            const which_employee_to_Delete = new InquirerFunctions(inquirerTypes[2], 'employee_delete', questions.deleteEmployee1, multipleName);

            inquirer.prompt([which_employee_to_Delete.ask()]).then(userChoice => {
                const chosenEmpInfo = userChoice.employee_delete.split(" ");
                const chosenEmpFirstName = chosenEmpInfo[1];
                const chosenEmpLastName = chosenEmpInfo[2];
                const chosenEmpID = chosenEmpInfo[0];
                const chosenEmpRole = chosenEmpInfo[3];

                if (actionChoice === "DELETE") {
                    deleteEmp(chosenEmpFirstName, chosenEmpLastName, chosenEmpID);
                } else if (actionChoice === "UPDATE EMP ROLE") {
                    updateEmpRole(chosenEmpID, arrayNeededForNextStep);
                } else if (actionChoice === "UPDATE EMP MANAGER") {
                    updateEmpManager(chosenEmpID, arrayNeededForNextStep);
                }
            })

        } else if (res[0].id == "undefined") {
            console.log("Could not find employee. Rerouted to Main Menu")
            mainMenu();

        } else {
            console.log("One Employee Found!")

            if (actionChoice === "DELETE") {
                deleteEmp(empFirstName, empLastName, res[0].id)
            } else if (actionChoice === "UPDATE EMP ROLE") {
                updateEmpRole(res[0].id, arrayNeededForNextStep);
            } else if (actionChoice === "UPDATE EMP MANAGER") {
                updateEmpManager(res[0].id, arrayNeededForNextStep);
            }
        }
    })
}   

//This function will delete the employee.  The first name, last name, and employeeID are delivered as parameters of this function
function deleteEmp(firstName, lastName, employeeID) {
    console.log("You've entered employee delete.")

    const queryDelete = "DELETE FROM employee WHERE employee.id = (?);"
    const confirmDelete = new InquirerFunctions(inquirerTypes[2], 'confirm_choice', questions.deleteEmployee2 + firstName + " " + lastName + "?", ["yes", "no"]);
    const deleteQuery = new SQLquery(queryDelete, employeeID);

    //I created a confirm method in inquirer.js but was having trouble keeping scope and keeping functions from waiting so I did a list inquirer instead.
    inquirer.prompt([confirmDelete.ask()]).then(respObj => {
        if (respObj.confirm_choice === "yes") {
            deleteQuery.delete(mainMenu);
        } else {
            mainMenu();
        }
    })
}

//This function will updated the employees role
//The id of the employee being updated and an array of the roles from the database are passed in as parameters
function updateEmpRole(employeeID, RolesArray) {
    console.log("Entered update employee role.")

    const empNewRole = new InquirerFunctions(inquirerTypes[2], 'employee_role', questions.updateRole, RolesArray);
    const queryGetRoleId = `SELECT role.id
                    FROM role
                    Where role.title = (?);`
    inquirer.prompt([empNewRole.ask()]).then(chosenRole => {

        connection.query(queryGetRoleId, chosenRole.employee_role, function (err, res) {
            if (err) {
                throw err
            }

            const queryUpdateRoleId = `UPDATE employee
                                            SET employee.role_id = (?)
                                            WHERE employee.id = (?)`

            const updateEmpRoleId = new SQLquery(queryUpdateRoleId, [res[0].id, employeeID])

            updateEmpRoleId.update(mainMenu, "Employee Role Updated!");
        })
    })
}

//This function will update the employees manager
//the ID of the employee being updated and an Array of the manager data from database are based into it as parameters
function updateEmpManager(employeeID, managerObjectArray) {
    console.log("Entered update employee manager.")

    const queryCurrentManager = `SELECT employee.manager_id
                                 FROM employee
                                 WHERE employee.id = (?);`
    connection.query(queryCurrentManager, employeeID, function (err, res) {
        if (err) {
            throw err;
        }

        const currentManagerID = res[0].manager_id;

        const managerChoices = managerObjectArray.filter(manager => {
            if (manager.ID != currentManagerID) {
                return true;
            };
        })

        possibleNewManagerNames = [];
        for (manager of managerChoices) {
            managerName = "ID: " + manager.ID + " " + manager.firstName + " " + manager.lastName;
            possibleNewManagerNames.push(managerName);
        }

        const newManagerChoice = new InquirerFunctions(inquirerTypes[2], 'new_Manager', questions.newManager, possibleNewManagerNames)

        inquirer.prompt([newManagerChoice]).then(userChoice => {
            const userInputSplitAtId = userChoice.new_Manager.split(" ", 2);
            const newManagerID = userInputSplitAtId[1];

            const queryUpdateNewManager = `UPDATE employee
                                            SET employee.manager_id = (?)
                                            WHERE employee.id = (?)`

            connection.query(queryUpdateNewManager, [newManagerID, employeeID], function (err, res) {
                if (err) {
                    throw err;
                }
                console.log("Manager Updated!");
                mainMenu();
            })
        })
    })
}

function viewAllRoles() {
    const query = `SELECT role.title, role.salary, department.name
                    FROM role
                    INNER JOIN department ON department.id = role.department_id`
    const roleTable = new SQLquery(query);

    roleTable.generalTableQuery(mainMenu);
}

function viewAllDep() {

    const query = `SELECT department.name
                    FROM department`

    const depTable = new SQLquery(query);

    depTable.generalTableQuery(mainMenu);
}

function addRole() {

    const queryDeps = "SELECT department.name FROM department;"
    connection.query(queryDeps, function (err, res) {

        if (err) throw err

        let depNameArr = []
        for (let i = 0; i < res.length; i++) {
            depNameArr.push(res[i].name)
        }

        const whatRole = new InquirerFunctions(inquirerTypes[0], 'role_to_add', questions.newRole)
        const whatSalary = new InquirerFunctions(inquirerTypes[0], 'role_salary', questions.salary)
        const whatdepartment = new InquirerFunctions(inquirerTypes[2], 'department', questions.department, depNameArr)


        Promise.all([whatRole.ask(), whatSalary.ask(), whatdepartment.ask()]).then(prompts => {
            inquirer.prompt(prompts).then(userChoices => {

                const getDepId = `SELECT department.id FROM department WHERE department.name = (?);`
                connection.query(getDepId, userChoices.department, function (err, res) {
                    if (err) {
                        throw err
                    }

                    const addRolequery = `INSERT INTO role (role.title, role.salary, role.department_id)
                                    VALUES ( (?), (?), (?));`
                    const addRole = new SQLquery(addRolequery, [userChoices.role_to_add, userChoices.role_salary, res[0].id]);

                    addRole.update(mainMenu, "Role added!");
                })
            })
        })
    })
}


function deleteRole(compRolesArr) {

    console.log("You've entered role delete")

    const whatRole = new InquirerFunctions(inquirerTypes[2], 'role_to_delete', questions.deleteRole, compRolesArr);
    inquirer.prompt([whatRole.ask()]).then(userChoice => {

        const role_id_Query = `SELECT role.id FROM role WHERE role.title = (?);`
        connection.query(role_id_Query, userChoice.role_to_delete, function (err, res) {

            const roleDeleteID = res[0].id;
            const roleDeleteTitle = userChoice.role_to_delete;

            //This if statment checks to see if more that one role exist with that title.
            //If it does the user is prompted with a role title and department name to aid the selection of the role they want to delete
            if (res.length > 1) {
                //Tell user role exists in multiple departments and make sure they want to delete it
                console.log("Role found in multiple departments!");

                const departmentsWithRolequery = `SELECT department.name, role.department_id
                                                FROM department
                                                INNER JOIN role on role.department_id = department.id AND role.title = (?);`

                connection.query(departmentsWithRolequery, userChoice.role_to_delete, function (err, res) {
                    if (err) throw err
                    const departmentsWithRoleArr = [];
                    for (let department of res) {
                        departmentsWithRoleArr.push(department);
                    }

                    const whichDeparment = new InquirerFunctions(inquirerTypes[2], 'department_to_delete_Role_From', questions.departmentDeleteRole, departmentsWithRoleArr);

                    inquirer.prompt([whichDeparment.ask()]).then(userChoice => {
                        console.log(res);
                        const departmentName_ID_Arr = res.filter(department => {
                            if (department.name == userChoice.department_to_delete_Role_From) {
                                return true;
                            }
                        })

                        deleteRoleQuery2 = "DELETE FROM role WHERE role.title = (?) AND role.department_id = (?)"
                        const deleteInstance2 = new SQLquery(deleteRoleQuery2, [roleDeleteTitle, departmentName_ID_Arr[0].department_id])
                        deleteInstance2.delete(mainMenu);
                    })
                })

            } else {
                const deleteRoleQuery = "DELETE FROM role WHERE role.id = (?);"
                const deleteInstance = new SQLquery(deleteRoleQuery, roleDeleteID);
                deleteInstance.delete(mainMenu);
            }
        })
    })
}

function addDep(depNameArr) {

    const whatDep = new InquirerFunctions(inquirerTypes[0], 'dep_to_add', questions.newDep)

    inquirer.prompt([whatDep.ask()]).then(userChoice => {

        const alreadyExist = depNameArr.filter(department => {

            if (department.name == userChoice.dep_to_add) return true;
        })

        if (alreadyExist.length >= 1) {
            console.log("Department Already exists!")
            mainMenu();
        } else {
            const addDepQuery = `INSERT INTO department (department.name) VALUES (?);`
            const addDep = new SQLquery(addDepQuery, userChoice.dep_to_add);

            addDep.update(mainMenu, "Department added!");
        }
    })
}

function removeDep(depNameArr) {

    const whatDepartment = new InquirerFunctions(inquirerTypes[0], 'dep_to_delete', questions.deleteDep)

    inquirer.prompt([whatDepartment.ask()]).then(userChoice => {

        const deleteDepQuery = `DELETE FROM department WHERE department.name = (?);`
        const deleteDep = new SQLquery(deleteDepQuery, userChoice.dep_to_delete);

        deleteDep.update(mainMenu, "Department deleted!");
    })
}



