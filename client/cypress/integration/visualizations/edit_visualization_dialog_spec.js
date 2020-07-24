/* global cy */

import { createQuery } from "../../support/redash-api";

describe("Редактировать диалог визуализации", () => {
  beforeEach(() => {
    cy.login();
    createQuery().then(({ id }) => {
      cy.visit(`queries/${id}/source`);
      cy.getByTestId("ExecuteButton").click();
    });
  });

  it("открывает новый диалог визуализации", () => {
    cy.getByTestId("NewVisualization")
      .should("exist")
      .click();
    cy.getByTestId("EditVisualizationDialog").should("exist");
    // Default visualization should be selected
    cy.getByTestId("VisualizationType")
      .should("exist")
      .should("contain", "Chart");
    cy.getByTestId("VisualizationName")
      .should("exist")
      .should("have.value", "Chart");
  });

  it("открывает диалог редактирования визуализации", () => {
    cy.getByTestId("EditVisualization").click();
    cy.getByTestId("EditVisualizationDialog").should("exist");
    // Default `Table` visualization should be selected
    cy.getByTestId("VisualizationType")
      .should("exist")
      .should("contain", "Table");
    cy.getByTestId("VisualizationName")
      .should("exist")
      .should("have.value", "Table");
  });

  it("создает визуализацию с произвольным именем", () => {
    const visualizationName = "Custom name";

    cy.clickThrough(`
      NewVisualization
      VisualizationType
      VisualizationType.TABLE
    `);

    cy.getByTestId("VisualizationName")
      .clear()
      .type(visualizationName);

    cy.getByTestId("EditVisualizationDialog")
      .contains("button", "Сохранить")
      .click();
    cy.getByTestId("QueryPageVisualizationTabs")
      .contains("span", visualizationName)
      .should("exist");
  });
});
