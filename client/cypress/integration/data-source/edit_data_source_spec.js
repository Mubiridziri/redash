describe("Изменить источник данных", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/data_sources/1");
  });

  it("рендерит страницу и делает скриншот", () => {
    cy.getByTestId("DataSource").within(() => {
      cy.getByTestId("Name").should("have.value", "Test PostgreSQL");
      cy.getByTestId("Host").should("have.value", "postgres");
    });

    cy.percySnapshot("Изменить источник данных - PostgreSQL");
  });
});
