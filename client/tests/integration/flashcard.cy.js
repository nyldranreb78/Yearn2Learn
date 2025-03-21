describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "1@email.com";
  let testPassword = "1";

  it("should log in through the UI and redirect to homepage", () => {
    cy.visit("/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
  });
  it("we should be able to access the flashcards from the homepage (from features section)", () => {
      
  });
});
