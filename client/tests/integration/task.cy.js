// Frontend + Backend
describe("Integration Tests Task Management - Frontend + Backend", () => {
    let testEmail = "test2@email.com";
    let testPassword = "test345";
    let authToken;

    // Before each test run, log in a user
    beforeEach(() => {
        cy.request({
        method: "POST",
        url: "http://localhost:3000/api/auth/login",
            body: {
                email: testEmail,
                password: testPassword,
            },
            failOnStatusCode: false,
        }).then((response) => {
            authToken = response.body.access_token;
        });
    });

    // Create a new task with no class associated
    it("should create a new task", () => {
        cy.visit("/#/tasks");
        
        cy.contains("New Task").click();
        cy.get("#taskName").type("Test Task Title");
        cy.get("#taskDeadline").type("2030-12-31T12:00");
        cy.get("button").contains("Create").click();
        cy.contains("Test Task Title").should("exist");
    });

    // Create a new task with a class associated
    it("should create a new task with a class associated", () => {
        // First create a class(folder)
        cy.request({
        method: "POST",
        url: "http://localhost:3000/api/folder/create",
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: {
            name: "Test Class",
            priority: true
        },
        });

        cy.visit("/#/tasks");
        
        cy.contains("New Task").click();
        cy.get("#taskName").type("Test Task 2 Title");
        cy.get("#taskDeadline").type("2030-12-31T12:00");
        cy.get("#isForClass").click();
        cy.get(".form-select").last().select("Test Class");
        cy.get("#taskGrade").type("20");
        cy.get("button").contains("Create").click();
        cy.contains("Test Task 2").should("exist");
    });

    // Mark a task as completed
    it("should edit an existing task", () => {
        cy.visit("/#/tasks");
        
        cy.get(".row").contains("Test Task 2 Title").first().click();
        cy.get(".bi-three-dots-vertical").click();
        cy.contains('Mark As "Finished"').click();
        cy.get(".row").contains("Finished").should("exist");
    });

    // Edit an existing task
    it("should edit an existing task", () => {
        cy.visit("/#/tasks");
        
        cy.get(".row").contains("Test Task 2 Title").first().click();
        cy.get(".bi-three-dots-vertical").click();
        cy.contains("Edit Details").click();
        cy.get("#taskName").clear().type("Test Edited");
        cy.get("button").contains("Save").click();
        cy.contains("Test Edited").should("exist");
    });

    // Delete a task
    it("should delete an existing task", () => {
        cy.visit("/#/tasks");
        
        cy.get(".row").contains("Test Edited").first().click();
        cy.get(".bi-three-dots-vertical").click();
        cy.contains("Delete").click();
        cy.contains("Confirm Deletion").click();
        cy.contains("Test Edited").should("not.exist");
    });
});

// Backend + Database
describe("Integration Tests Task Management - Backend + Database", () => {
    let testEmail = "test2@email.com";
    let testPassword = "test345";
    let authToken;
    let taskID;

    // Before each test run, log in a user
    beforeEach(() => {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/auth/login",
                body: {
                    email: testEmail,
                    password: testPassword,
                },
                failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("access_token");
            authToken = response.body.access_token;
        });
    });

    // Create a new task with no class associated
    it("should create a new task", () => {
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/task/create",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                name: "Test Task Title",
                deadline: "2030-12-31T12:00",
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("task");
        });
    });

    // Create a new task with a class associated
    it("should create a new task with a class associated", () => {
        let folderID;
        // First create a class(folder)
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/folder/create",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                name: "Test Class",
                priority: true
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("folder");
            folderID = response.body.folder._id;
        });

        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/task/create",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                name: "Test Task 2 Title",
                deadline: "2030-12-31T12:00",
                folderID: folderID,
                taskGrade: 20,
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("task");
        });
    });

    // Get all tasks
    it("should get all tasks", () => {
        cy.request({
            method: "GET",
            url: "http://localhost:3000/api/task/",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("tasks");
            taskID = response.body.tasks[0]._id;
            console.log(taskID);
        });
    });

    // Update a task 
    it("should edit an existing task", () => {
        cy.request({
            method: "PATCH",
            url: `http://localhost:3000/api/task/${taskID}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                name: "Test Edited",
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("task");
        });
    });

    // Delete a task
    it("should delete an existing task", () => {
        cy.request({
            method: "DELETE",
            url: `http://localhost:3000/api/task/${taskID}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });

    // Delete all task for integration testing
    it("should delete all tasks and folder for testing purpose", () => { 
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/folder/delete-all-folders",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
        });

        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/task/delete-all-tasks",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
        });
    });
});