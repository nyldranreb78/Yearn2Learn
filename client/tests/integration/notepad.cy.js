// Frontend + Backend
describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "test2@email.com";
  let testPassword = "test345";

  // Before each test run, log in the user
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false,
    });
  });

  // Redirect to the notepad page and fetch the notes and folders
  it("should redirect to the notepad page", () => {
    cy.visit("/#/notes");

    cy.url().should("include", "/#/notes");
  });

  // Add a new folder that is not a class and check if it is added
  it("should add a new folder", () => {
    cy.visit("/#/notes");

    cy.get(".btn-circle").first().click();
    cy.contains("Add New Folder").click();

    cy.get("#folderName").type("Test Folder");
    cy.get("#addFolderButton").click();
    cy.contains("Test Folder").should("be.visible");
  });

  // Add a new folder that is a class and check if it is added
  it("should add a new class folder", () => {
    cy.visit("/#/notes");

    cy.get(".btn-circle").first().click();
    cy.contains("Add New Folder").click();

    cy.get("#folderName").type("Test Class Folder with Priority");
    cy.get("#classToggle").click();
    cy.get(".form-select").should("be.visible").last().select("true");
    cy.get("#addFolderButton").click();
    cy.contains("Test Class Folder with Priority").should("be.visible");
  });

  // Add a new note into the folder and check if it is added
  it("should add a new note into the class folder then write to it", () => {
    cy.visit("/#/notes");

    cy.get(".btn-circle").first().click();
    cy.get(".accordion-item").first().click();
    cy.contains("Create new note").click();
    cy.get("#noteTitle").type("Test Note Title");

    cy.get("#submitNoteButton").click();

    // Delete one folder
    it("should delete one folders", () => {
        cy.visit("/#/notes");

  // Delete the note that was added
  it("should delete the note", () => {
    cy.visit("/#/notes");
    cy.get(".btn-circle").first().click();
    cy.get(".accordion-item").first().click();
    cy.get(".note-menu").click();
    cy.contains("Delete").click();

    cy.get("button").contains("Delete").click();
  });

  // Delete the all the folders
  it("should delete all folders", () => {
    cy.visit("/#/notes");

    cy.get(".btn-circle").first().click();
    cy.get("#editFolderButton").click();
    cy.contains("Test Folder").get(".bi-trash3-fill").first().click();
    cy.get("#delete_form button").contains("Delete").click();
  });
});

describe("Integration Tests - Backend + Database", () => {
  let testEmail = "test2@email.com";
  let testPassword = "test345";
  let testFolderId;
  let authToken;

  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: { email: testEmail, password: testPassword },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("access_token");
      authToken = response.body.access_token;
    });
  });

    // Create a new folder with note in it with authorization
    it("should add a new folder with note", () => {
        // Create a new note
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/note/create",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: { title: "Test Note Title", content: "Test Note Content" },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("note");
        });
        // Create a new folder
        cy.request({
            method: "POST",
            url: "http://localhost:3000/api/folder/create",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },  
            body: { name: "Test Folder" },
            failOnStatusCode: false,
        }).then((response) => {
            console.log(response.body);
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("folder");
        });
    });
  });

  // Get all folders with authorization
  it("should get all folders", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:3000/api/folder",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("folders");
      testFolderId = response.body.folders[0]._id;
      console.log(response.body);
    });
  });

  // Get a specific folder with authorization
  it("should get a specific folder", () => {
    cy.request({
      method: "GET",
      url: `http://localhost:3000/api/folder/${testFolderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("folder");
    });
  });

    // Update a specific folder with authorization
    it("should update a specific folder", () => {
        cy.request({
            method: "PATCH",
            url: `http://localhost:3000/api/folder/${testFolderId}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: { name: "Updated Test Folder" },
        }).then((response) => {
            console.log(response.body);
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("folder");
        });
    });
  });

  // Delete a specific folder with authorization
  it("should delete a specific folder", () => {
    cy.request({
      method: "DELETE",
      url: `http://localhost:3000/api/folder/${testFolderId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  // Delete all folders for integration tests
  it("should delete all folders", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/folder/delete-all-folders",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
