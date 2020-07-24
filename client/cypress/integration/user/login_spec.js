describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("рендерит страницу и делает скриншот", () => {
    cy.contains("h3", "Login to Redash");

    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.percySnapshot("Login");
  });

  it("показывает сообщение о неудачном входе в систему", () => {
    cy.getByTestId("Email").type("admin@redash.io");
    cy.getByTestId("Password").type("wrongpassword{enter}");

    cy.getByTestId("ErrorMessage").should("contain", "Неверный адрес электронной почты или пароль.");
  });

  it("перенаправление на домашнюю страницу с успешным входом в систему", () => {
    cy.getByTestId("Email").type("admin@redash.io");
    cy.getByTestId("Password").type("password{enter}");

    cy.title().should("eq", "Redash");
    cy.get(`img.profile__image_thumb[alt="Example Admin"]`).should("exist");

    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.percySnapshot("Homepage");
  });
});
