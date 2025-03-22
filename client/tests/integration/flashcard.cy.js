describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "intTest@email.com";
  let testPassword = "intTest123";

  // Before all tests are run, register and login the user
  before(() => {
    cy.request("POST", "http://localhost:3000/api/auth/register", {
      username: "t_test",
      email: testEmail,
      first_name: "Test",
      last_name: "Integration",
      password: testPassword,
      password_confirm: testPassword,
    });
  });

  beforeEach(() => {
    cy.request("POST", "http://localhost:3000/api/auth/login", {
      email: testEmail,
      password: testPassword,
    });
  });

  // After all tests are run, delete the user
  after(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/delete-test-user",
      body: { email: testEmail },
      failOnStatusCode: false,
    });
  });

  it("we should be able to access the flashcards from the homepage (from features section)", () => {
    cy.visit("/");

    cy.contains(".card", "Flash Cards").click();
    cy.url().should("include", "/flashcards");
  });

  it("we should be able to access the flashcards from the homepage (from widgetbar)", () => {
    cy.visit("/");

    cy.contains(".nav-item", "Flash Cards").click();
    cy.url().should("include", "/flashcards");
  });

  it("we shouldn't see any flashcards at this point", () => {
    cy.visit("/#/flashcards");

    cy.get('[class="col text-center m-4"]').should(
      "have.text",
      'There are no questions to show. Click on the "Create Flashcard" button to add one.',
    );
  });

  it("should create a single flash card", () => {
    cy.visit("/#/flashcards");

    //<button type="button" class="btn btn-sm btn-primary w-100"><i class="bi bi-plus-lg me-1"></i> Create Flashcard </button>
    cy.get("#createFlashcard").click();
    cy.get("#questionInput").type("unique question 1");
    cy.get("#answerInput").type("unique answer 1");
    cy.get("#newFlashcardSet").type("Group1");
    cy.get("#createOrSaveChanges").click();
    //cy.get('[class="col-3 border-end"]').should('have.text','Some witty unique question #1')
    cy.get("#cardList").contains("unique question 1");
  });

  it("should check that the set name Group1 was added to the filter", () => {
    cy.visit("/#/flashcards");

    cy.get(".form-select").should("exist");
    cy.get(".form-select").contains("Group1").should("exist");
  });

  it("should flip the flashcard when it is clicked", () => {
    cy.visit("/#/flashcards");

    cy.get("#currFlashcard").should("have.text", "unique question 1").click();
    cy.get("#currFlashcard").should("have.text", "unique answer 1");
    //<button type="button" class="btn btn-sm btn-primary w-100"><i class="bi bi-plus-lg me-1"></i> Create Flashcard </button>
  });

  it("should create one more card for the same set(Group1)", () => {
    cy.visit("/#/flashcards");

    cy.get("#createFlashcard").click();
    cy.get("#questionInput").type("unique question 2");
    cy.get("#answerInput").type("unique answer 2");
    cy.get("#newFlashcardSet").type("Group1");
    cy.get("#createOrSaveChanges").click();

    cy.get(".form-select").should("exist");
    cy.get(".form-select").contains("Group1").should("exist");

    cy.get("#cardList").contains("unique question 1").should("be.visible");
    cy.get("#cardList").contains("unique question 2").should("be.visible");
  });

  it("should change flash cards", () => {
    cy.visit("/#/flashcards");

    cy.get("#turnRight").click();
    cy.get("#currFlashcard").should("have.text", "unique question 1");
    cy.get("#turnLeft").click();
    cy.get("#currFlashcard").should("have.text", "unique question 2");
  });

  it("should hide list when the 'Hide List' Button is clicked", () => {
    cy.visit("/#/flashcards");

    cy.get("#cardList").should("be.visible");

    cy.get("button").contains("Hide List").click();
    cy.get("#cardList").should("not.be.visible");
  });
});
