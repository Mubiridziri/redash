describe("Редактировать группу", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/groups/1");
  });

  it("рендерит страницу и делает скриншот", () => {
    cy.getByTestId("Group").within(() => {
      cy.get("h3").should("contain", "admin");
      cy.get("td").should("contain", "Example Admin");
    });

    cy.percySnapshot("Group");
  });
});
