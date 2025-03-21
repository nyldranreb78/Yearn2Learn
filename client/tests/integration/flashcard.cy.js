describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "1@email.com";
  let testPassword = "1";

  
  
  it("we should be able to access the flashcards from the homepage (from features section)", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
    
    cy.contains('.card','Flash Cards', {timeout:10_000}).click()
    //cy.wait(2500);
    cy.url().should("include", "/flashcards");
    //cy.get('.card-body').should('have.attr', 'href').and('include', '#/flashcards');
  });
  it("we should be able to access the flashcards from the homepage (from widgetbar)", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
    
    //cy.wait(2500);
    cy.contains('.nav-item','Flash Cards', {timeout:10_000}).click()
   
  });
  it("we shouldn't see any flashcards at this point", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
    
    //cy.wait(2500);
    cy.contains('.nav-item','Flash Cards', {timeout:10_000}).click();
    cy.get('[class="col text-center m-4"]').should('have.text','There are no questions to show. Click on the "Create Flashcard" button to add one.')
  });

  it("should create a single flash card", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
    
    //cy.wait(2500);
    cy.contains('.nav-item','Flash Cards', {timeout:10_000}).click();
    //<button type="button" class="btn btn-sm btn-primary w-100"><i class="bi bi-plus-lg me-1"></i> Create Flashcard </button>
    cy.get("#createFlashcard").click()
    cy.get("#questionInput").type("Some witty unique question #1");
    cy.get("#answerInput").type("Some witty unique answer #1");
    cy.get("#newFlashcardSet").type("Group1");
    cy.get("#createOrSaveChanges").click();
    cy.get('[class="col-3 border-end"]').should('have.text','Some witty unique question #1')

  });
  it("should flip card", () => {
    cy.visit("http://localhost:8080/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
    
    //cy.wait(2500);
    cy.contains('.nav-item','Flash Cards', {timeout:10_000}).click();
    cy.reload()
    cy.get("#currFlashcard").should('have.text','Some witty unique question #1').click()
    cy.get("#currFlashcard").should('have.text','Some witty unique answer #1')
    //<button type="button" class="btn btn-sm btn-primary w-100"><i class="bi bi-plus-lg me-1"></i> Create Flashcard </button>
    
  });
  //class="col btn btn-light flash-card flash-card-ui border text-center text-truncate"
});
