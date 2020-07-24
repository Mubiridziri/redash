import { createAlert, createQuery } from "../../support/redash-api";

describe("Изменить оповещение", () => {
  beforeEach(() => {
    cy.login();
  });

  it("рендерит страницу и делает скриншот", () => {
    createQuery({ query: "select 1 as col_name" })
      .then(({ id: queryId }) => createAlert(queryId, { column: "col_name" }))
      .then(({ id: alertId }) => {
        cy.visit(`/alerts/${alertId}/edit`);
        cy.getByTestId("Criteria").should("exist");
        cy.percySnapshot("Изменить экран оповещения");
      });
  });

  it("редактирует шаблон уведомления и делает скриншот", () => {
    createQuery()
      .then(({ id: queryId }) => createAlert(queryId, { custom_subject: "FOO", custom_body: "BAR" }))
      .then(({ id: alertId }) => {
        cy.visit(`/alerts/${alertId}/edit`);
        cy.getByTestId("AlertCustomTemplate").should("exist");
        cy.percySnapshot("Экран пользовательского шаблона оповещения");
      });
  });

  it("предварительный просмотр правильно отрисованного шаблона", () => {
    const options = {
      value: "123",
      op: "==",
      custom_subject: "{{ ALERT_CONDITION }}",
      custom_body: "{{ ALERT_THRESHOLD }}",
    };

    createQuery()
      .then(({ id: queryId }) => createAlert(queryId, options))
      .then(({ id: alertId }) => {
        cy.visit(`/alerts/${alertId}/edit`);
        cy.get(".alert-template-preview").click();
        cy.getByTestId("CustomSubject").should("have.value", options.op);
        cy.getByTestId("CustomBody").should("have.value", options.value);
      });
  });
});
