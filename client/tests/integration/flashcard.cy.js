describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "1@email.com";
  let testPassword = "1";

  

  // User Login Test via UI - successful
  it("should log in through the UI and redirect to homepage", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
  });
  it("we should be able to access the flashcards from the homepage (from features section)", () => {
    cy.visit("http://localhost:8080/#/");
    //cy.wait(2500);
    
    cy.contains('.card','Flash Cards').click()
    //cy.wait(2500);
    cy.url().should("include", "/flashcards");
    //cy.get('.card-body').should('have.attr', 'href').and('include', '#/flashcards');
  });
  it("we should be able to access the flashcards from the homepage (from widgetbar)", () => {
    cy.visit("http://localhost:8080/#/");
    //cy.wait(2500);
    cy.contains('.nav-item','Flash Cards').click()
   
  });
 
});
