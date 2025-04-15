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

    cy.contains(".card", "Flashcards").click();
    cy.url().should("include", "/flashcards");
  });

  it("we should be able to access the flashcards from the homepage (from widgetbar)", () => {
    cy.visit("/");

    cy.contains(".nav-item", "Flashcards").click();
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
    cy.get("#create_flashcard").click();
    cy.get("#question_input").type("unique question 1");
    cy.get("#answer_input").type("unique answer 1");
    cy.get("#new_flashcard_set").type("Group1");
    cy.get("#create_or_save_changes").click();
    cy.get("#card_list").contains("unique question 1");
  });

  it("should check that the set name Group1 was added to the filter", () => {
    cy.visit("/#/flashcards");

    cy.get(".form-select").should("exist");
    cy.get(".form-select").contains("Group1").should("exist");
  });

  it("should flip the flashcard when it is clicked", () => {
    cy.visit("/#/flashcards");

    cy.get("#current_flashcard").should("have.text", "unique question 1").click();
    cy.get("#current_flashcard").should("have.text", "unique answer 1");
    
  });

  it("should create one more card for the same set(Group1)", () => {
    cy.visit("/#/flashcards");

    cy.get("#create_flashcard").click();
    cy.get("#question_input").type("unique question 2");
    cy.get("#answer_input").type("unique answer 2");
    cy.get("#new_flashcard_set").type("Group1");
    cy.get("#create_or_save_changes").click();

    cy.get(".form-select").should("exist");
    cy.get(".form-select").contains("Group1").should("exist");

    cy.get("#card_list").contains("unique question 1").should("be.visible");
    cy.get("#card_list").contains("unique question 2").should("be.visible");
  });

  it("should change Flashcards", () => {
    cy.visit("/#/flashcards");

    cy.get("#turn_right").click();
    cy.get("#current_flashcard").should("have.text", "unique question 1");
    cy.get("#turn_left").click();
    cy.get("#current_flashcard").should("have.text", "unique question 2");
  });

  it("should show list when the 'Show Question List' button is clicked", () => {
    cy.visit("/#/flashcards");

    cy.get("button").contains("Show Question List").click();
    cy.get("#card_list").should("be.visible");
  });

  it("should delete the most recent flashcard", () => {
    cy.visit("/#/flashcards");
    cy.get("button").contains("Show Question List").click();
    cy.get('.btn.btn-sm.shadow-none.border-0.note-menu').first().click();
    cy.get('.dropdown-item.px-2.text-danger').contains("Delete").click()
    cy.get('.btn.btn-sm.btn-danger').contains("Confirm Deletion").click()
    cy.get("#card_list").contains("unique question 2").should('not.exist');
  });

  it("should delete last flashcard", () => {
    cy.visit("/#/flashcards");
    cy.get("button").contains("Show Question List").click();
    cy.get('.btn.btn-sm.shadow-none.border-0.note-menu').first().click();
    cy.get('.dropdown-item.px-2.text-danger').contains("Delete").click()
    cy.get('.btn.btn-sm.btn-danger').contains("Confirm Deletion").click()
    cy.get("#card_list").contains("unique question 1").should('not.exist');
  });

  it("shouldn't see any flashcards at this point", () => {
    cy.visit("/#/flashcards");

    cy.get('[class="col text-center m-4"]').should(
      "have.text",
      'There are no questions to show. Click on the "Create Flashcard" button to add one.',
    );
  });

});
