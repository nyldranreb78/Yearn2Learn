// Frontend + Backend
describe("Integration Tests - Frontend + Backend", () => {
  let testEmail = "intTest@email.com";
  let testPassword = "intTest123";

  // Before each test run, delete the registered user from the db
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/delete-test-user",
      body: { email: testEmail },
      failOnStatusCode: false,
    });
  });

  // User Registration Test via UI
  it("should register a user through the UI and redirect to the login page", () => {
    cy.visit("/#/register");

    cy.get("#username").type("intTest");
    cy.get("#first_name").type("Integration");
    cy.get("#last_name").type("Test");
    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get("#password_confirm").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to login page
    cy.url().should("include", "/#/login");
  });

  // User Login Test via UI - successful
  it("should log in through the UI and redirect to homepage", () => {
    cy.visit("/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    // Check if redirected to home page
    cy.url().should("include", "/");
  });

  // Test that user can't access the website if not logged in (unauthorized access)
  it("should prevent access to protected routes when not logged in", () => {
    cy.visit("/#/");

    cy.url().should("include", "/#/login");
  });

  //   User Login Test via UI - incorrect password
  it("should not log in with an incorrect password", () => {
    cy.visit("/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type("wrongPassword123");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/#/login");
  });

  // Prevent Logged-in user from accessing the login page
  it("should not allow an already logged-in user to go back to the login page", () => {
    cy.visit("/#/login");

    cy.get("#email").type(testEmail);
    cy.get("#password").type(testPassword);
    cy.get('button[type="submit"]').click();

    cy.visit("/#/login");

    cy.url().should("include", "/");
  });
});

// Backend + Database
describe("Integration Tests - Backend + Database", () => {
  let testEmail = "test123@test.com";
  let testPassword = "password123";

  // Before each test run, delete the registered user from the db
  beforeEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/delete-test-user",
      body: { email: testEmail },
      failOnStatusCode: false,
    });
  });

  // User Duplicate Registration Test
  it("should prevent duplicate registration", () => {
    // First registration
    cy.request("POST", "http://localhost:3000/api/auth/register", {
      username: "t_test",
      email: testEmail,
      first_name: "Test",
      last_name: "Integration",
      password: testPassword,
      password_confirm: testPassword,
    });

    // Second registration attempt (This should fail)
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/register",
      body: {
        username: "t_test",
        email: testEmail,
        first_name: "Test",
        last_name: "Integration",
        password: testPassword,
        password_confirm: testPassword,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(409);
    });
  });

  // Login via API - missing email
  it("should not log in because email is missing", () => {
    // Register the user
    cy.request("POST", "http://localhost:3000/api/auth/register", {
      username: "t_test",
      email: testEmail,
      first_name: "Test",
      last_name: "Integration",
      password: testPassword,
      password_confirm: testPassword,
    });

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: { email: "", password: testPassword },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(422);
      expect(response.body).to.have.property("message", "Missing fields");
    });
  });

  // Login via API - user does not exist
  it("should not log in because the user is not registered", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/login",
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property(
        "message",
        "Email or password is incorrect",
      );
    });
  });

  // Valid access token
  it("should refresh the access token using a valid refresh token", () => {
    // Register the user
    cy.request("POST", "http://localhost:3000/api/auth/register", {
      username: "t_test",
      email: testEmail,
      first_name: "Test",
      last_name: "Integration",
      password: testPassword,
      password_confirm: testPassword,
    });

    // Log in the user
    cy.request("POST", "http://localhost:3000/api/auth/login", {
      email: testEmail,
      password: testPassword,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("access_token");

      cy.setCookie("access_token", response.body.access_token);

      // Send refresh request
      cy.request({
        method: "POST",
        url: "http://localhost:3000/api/auth/refresh",
        withCredentials: true,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property("access_token");
      });
    });
  });

  //   Logout Test
  it("should log out and invalidate the refresh token", () => {
    // Register the user
    cy.request("POST", "http://localhost:3000/api/auth/register", {
      username: "t_test",
      email: testEmail,
      first_name: "Test",
      last_name: "Integration",
      password: testPassword,
      password_confirm: testPassword,
    });

    // Login user
    cy.request("POST", "http://localhost:3000/api/auth/login", {
      email: testEmail,
      password: testPassword,
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.setCookie("access_token", response.body.access_token);

      // Logout request
      cy.request("POST", "http://localhost:3000/api/auth/logout").then(
        (res) => {
          expect(res.status).to.eq(204);
        },
      );

      // Refreshing token should fail since it was cleared during logout
      cy.request({
        method: "POST",
        url: "http://localhost:3000/api/auth/refresh",
        withCredentials: true,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });
});
