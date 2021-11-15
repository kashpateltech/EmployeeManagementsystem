//what would you like to do?
//what is the name of the role?
//what is the saleary of the role?
//which department does the role belong to?

const questions = {
    mainMenuPrompt: "what would you like to do?",
    addEmployee1: "What is employee's first name?",
    addEmployee2: "What is employee's last name?",
    addEmployee3: "What is employee's role?",
    addEmployee4: "Who is emloyee's manager?",
    deleteEmployee1: "There are multiple employees with the same name. Who would you like to delete?",
    deleteEmployee2: "Are you sure you want to delete?",
    viewAllEmployeeByDep: "Which department would you like to view?",
    viewAllEmployeeByRole: "Which role would you like to search?",
    updateRole: "Please select the employee role?",
    newManager: "Who will be the new manager of the employee?",
    searchTheManager: "Choose the employee whose manager you would like to view?",
    newRole: "What is the name of the new role?",
    deleteRole: "Which role would you like to delete?",
    departmentDeleteRole: "From which department would you like to delete the role from?",
    salary: "What is the salary of the role?",
    department: "which department would you like to add a role to?",
    newDep: "What is the name of the new department you would like to add?",
    deleteDep: "Which department would you like to delete?"  
}

module.exports = questions;