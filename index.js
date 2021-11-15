const inquirer = require('inquirer');
const figlet = require('figlet');
const connection = require('./lib/SQL_login');
const questions = require('./lib/questions');
const commandMenuChoices = require('./lib/commandmenu');
const SQL_query = require('./lib/SQL_query');
const InquirerFunctions = require('./lib/inquirer');
const { mainMenuPrompt, viewAllEmployeeByDep } = require('./lib/questions');
const { off } = require('./lib/SQL_login');
const inquirerTypes = [ 'input', 'confirm', 'list'];


console.log(figlet.textSync('Employee Management System', {font: 'Standard',
horizontalLayout: 'default',
verticalLayout: 'default'
}))


mainMenu()

function mainMenu() {
    const menuPrompt = new InquirerFunctions(inquirerType[2], 'menuChoice', questions.mainMenuPrompt, commandMenuChoices)

    inquirer
    .prompt([menuPrompt.ask()]).then(operation =>{
        const query1 = "SELECT role.title FROM role"
        const compRolesArrayQuery = new SQL_query(query1)

        const depNameQuery = "SELECT department.name FROM department"
        const depNamesArrayQuery = new SQL_query(depNameQuery)

        switch(operation.menuChoice){
            case commandMenuChoices[2]:
                return viewAllEmp()
            
            case commandMenuChoices[3]:
                depNamesArrayQuery.queryReturnResult(viewAllEmpDep)
                break;

            case commandMenuChoices[4]:
                const actionChoice5 = "VIEW MY MANAGER"
                dummyArr = []
                EmpInfoPrompts (dummyArr, actionChoice5)
                break;

            case commandMenuChoices[5]:
                compRolesArrayQuery.getQueryNoRepeats(viewAllEmpRole)
                break;

            case commandMenuChoices[6]:
                return viewAllManager()

            case commandMenuChoices[11]:
                const actionChoice1 = "ADD"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice1)
                break;

            case commandMenuChoices[12]:
                const actionChoice2 = "DELETE"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice2)
                break;

            case commandMenuChoices[13]:
                const actionChoice3 = "UPDATE EMP ROLE"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice3)
                break;

            case commandMenuChoices[14]:
                const actionChoice4 = "UPDATE EMP MANAGER"
                compRolesArrayQuery.getQueryNoRepeats(EmpInfoPrompts, actionChoice4)
                break;

            case commandMenuChoices[1]:
                return viewAllRoles()

            case commandeMenuChoices[9]:
                return addRole()

            case commandMenuChoices[10]:
                const actionChoice7 = "DELETE ROLE"
                compRolesArrayQuery.getQueryNoRepeats(deleteRole, actionChoice7)
                break;
               
            case commandMenuChoices[0]:
                return viewAllDep()

            case commandMenuChoices[7]:
                depNamesArrayQuery.queryReturnResult(addDep)
                break;

            case commandMenuChoices[8]:
                depNamesArrayQuery.queryReturnResult(removeDep)
                break;
        }
    })
}

function viewAllEmp(){
    const query = 
    `SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name 
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = employee.department_id;`

    const empTable = new SQL_query(query)
    empTable.generalTableQuery(mainMenu)    
}

function viewAllEmpDep() {
    const departmentNamePrompt = new InquirerFunctions(inquirerTypes[2], 'department_name', questions.viewAllEmpByDep, depNamesArray);

    inquirer.prompt(departmentNamePrompt.ask()).then(userResp => {
        const query = `
        SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name 
        FROM employee
        INNER JOIN role ON role.id = employee.role_id
        INNER JOIN department ON department.id = role.department_id AND department.name = ?; `

        const empByDepTable = new SQL_query(query, userResp.department_Name)
        empByDepTable.generalTableQuery(mainMenu)
    })
}

function viewAllEmpManager() {
    const chosenManager = new InquirerFunctions(
        inquirerTypes[2], 'manager_choice', questions.searchByManager, namesArr
    ) 

    inquirer.prompt([chosenManager.ask()]).then(userChoice => {
        console.log(`Manager Searched By: ${userChoice.manager_choice} `)
        let chosenManagerID = 0
        const chosenManagerName = userChoice.manager_choice.split("", 2)

        for(manager of ManagerObj){
            if(chosenManagerName[1] == manager.lastName){
                chosenManagerID = manager.ID
            }
        }
        const queryManagerSearch = `
        SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name 
        FROM employee
        INNER JOIN role ON role.id = employee.role_id
        INNER JOIN department ON department.id = role.department_id
        WHERE employee.manager_id = (?);`

        const managerSearch = new SQL_query(queryManagerSearch, chosenManagerID)
        managerSearch.generalTableQuery(mainMenu)
    })
}

function viewAllEmpRole(compRoles) {
    const rolePrompt = new InquirerFunctions(inquirerTypes[2], 'role_title', questions.viewAllEmployeeByRole, compRoles)

    inquirer.prompt(rolePrompt.ask()).then(userResp => {
        const query = `
        SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name 
        FROM employee
        INNER JOIN role ON role.id = employee.role_id AND role.title = (?)
        INNER JOIN department ON department.id = role.department_id;`

        const empByRoleTable = new SQL_query(query, userResp.role_Title)
        empByRoleTable.generalTableQuery(mainMenu)
    })
}

function viewAllManager(){
    const query =  `
    SELECT employee.id, employee.firstName, employee.lastName, role.title, role.salary, department.name 
    FROM employee
    INNER JOIN role ON role.id = employee.role_id
    INNER JOIN department ON department.id = role.department_id
    WHERE employee.id IN (SELECT employee.manager_id FROM employee);`
    
    const managerTable = new SQL_query(query)
    managerTable.generalTableQuery(mainMenu)
}

function EmpInfoPrompts (compRoles, actionChoice){
    const query = "SELECT id, first_name, last_name FROM employee WHERE employee.id IN (SELECT employee.manager_id FROM employee)"

    connection.query(query, function(err, res) {
        if(err) throw err
    })
}

