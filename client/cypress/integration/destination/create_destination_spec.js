import { createDestination } from "../../support/redash-api";

describe("Создать место назначения", () => {
  beforeEach(() => {
    cy.login();
  });

  it("рендерит страницу и делает скриншот", function() {
    cy.visit("/destinations/new");
    cy.server();
    cy.route("api/destinations/types").as("DestinationTypesRequest");

    cy.wait("@DestinationTypesRequest")
      .then(({ response }) => response.body.filter(type => type.deprecated))
      .then(deprecatedTypes => deprecatedTypes.map(type => type.type))
      .as("deprecatedTypes");

    cy.getByTestId("PreviewItem")
      .then($previewItems => Cypress.$.map($previewItems, item => Cypress.$(item).attr("data-test-type")))
      .then(availableTypes => expect(availableTypes).not.to.contain.members(this.deprecatedTypes));

    cy.getByTestId("CreateSourceDialog").should("contain", "Email");
    cy.wait(1000); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.percySnapshot("Создать место назначения - Типы");
  });

  it("показывает пользовательское сообщение об ошибке, когда имя получателя уже занято", () => {
    createDestination("Slack Destination", "slack").then(() => {
      cy.visit("/destinations/new");

      cy.getByTestId("SearchSource").type("Slack");
      cy.getByTestId("CreateSourceDialog")
        .contains("Slack")
        .click();

      cy.getByTestId("Name").type("Slack Destination");
      cy.getByTestId("CreateSourceButton").click();

      cy.contains("Alert Destination with the name Slack Destination already exists.");
    });
  });
});
