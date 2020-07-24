/* global cy */

import { createDashboard, createQuery } from "../../support/redash-api";
import { createQueryAndAddWidget, editDashboard, resizeBy } from "../../support/dashboard";

describe("Widget", () => {
  beforeEach(function() {
    cy.login();
    createDashboard("Foo Bar").then(({ slug, id }) => {
      this.dashboardId = id;
      this.dashboardUrl = `/dashboard/${slug}`;
    });
  });

  const confirmDeletionInModal = () => {
    cy.get(".ant-modal .ant-btn")
      .contains("Удалить")
      .click({ force: true });
  };

  it("добавляет виджет", function() {
    createQuery().then(({ id: queryId }) => {
      cy.visit(this.dashboardUrl);
      editDashboard();
      cy.getByTestId("AddWidgetButton").click();
      cy.getByTestId("AddWidgetDialog").within(() => {
        cy.get(`.query-selector-result[data-test="QueryId${queryId}"]`).click();
      });
      cy.contains("button", "Добавить в панель мониторинга").click();
      cy.getByTestId("AddWidgetDialog").should("not.exist");
      cy.get(".widget-wrapper").should("exist");
    });
  });

  it("удаляет виджет", function() {
    createQueryAndAddWidget(this.dashboardId).then(elTestId => {
      cy.visit(this.dashboardUrl);
      editDashboard();
      cy.getByTestId(elTestId).within(() => {
        cy.getByTestId("WidgetDeleteButton").click();
      });

      confirmDeletionInModal();
      cy.getByTestId(elTestId).should("not.exist");
    });
  });

  describe("Автоматическая высота для визуализации таблицы", () => {
    it("renders correct height for 2 table rows", function() {
      const queryData = {
        query: "select s.a FROM generate_series(1,2) AS s(a)",
      };

      createQueryAndAddWidget(this.dashboardId, queryData).then(elTestId => {
        cy.visit(this.dashboardUrl);
        cy.getByTestId(elTestId)
          .its("0.offsetHeight")
          .should("eq", 235);
      });
    });

    it("отображает правильную высоту для 5 строк таблицы", function() {
      const queryData = {
        query: "select s.a FROM generate_series(1,5) AS s(a)",
      };

      createQueryAndAddWidget(this.dashboardId, queryData).then(elTestId => {
        cy.visit(this.dashboardUrl);
        cy.getByTestId(elTestId)
          .its("0.offsetHeight")
          .should("eq", 335);
      });
    });

    describe("Поведение высоты при обновлении", () => {
      const paramName = "count";
      const queryData = {
        query: `select s.a FROM generate_series(1,{{ ${paramName} }}) AS s(a)`,
        options: {
          parameters: [
            {
              title: paramName,
              name: paramName,
              type: "text",
            },
          ],
        },
      };

      beforeEach(function() {
        createQueryAndAddWidget(this.dashboardId, queryData).then(elTestId => {
          cy.visit(this.dashboardUrl);
          cy.getByTestId(elTestId)
            .as("widget")
            .within(() => {
              cy.getByTestId("RefreshButton").as("refreshButton");
            });
          cy.getByTestId(`ParameterName-${paramName}`).within(() => {
            cy.getByTestId("TextParamInput").as("paramInput");
          });
        });
      });

      it("растет при динамическом добавлении строк таблицы", () => {
        // listen to results
        cy.server();
        cy.route("GET", "api/query_results/*").as("FreshResults");

        // start with 1 table row
        cy.get("@paramInput")
          .clear()
          .type("1");
        cy.getByTestId("ParameterApplyButton").click();
        cy.wait("@FreshResults", { timeout: 10000 });
        cy.get("@widget")
          .invoke("height")
          .should("eq", 285);

        // add 4 table rows
        cy.get("@paramInput")
          .clear()
          .type("5");
        cy.getByTestId("ParameterApplyButton").click();
        cy.wait("@FreshResults", { timeout: 10000 });

        // expect to height to grow by 1 grid grow
        cy.get("@widget")
          .invoke("height")
          .should("eq", 435);
      });

      it("отменяет автоматическую высоту после ручной регулировки высоты", () => {
        // listen to results
        cy.server();
        cy.route("GET", "api/query_results/*").as("FreshResults");

        editDashboard();

        // start with 1 table row
        cy.get("@paramInput")
          .clear()
          .type("1");
        cy.getByTestId("ParameterApplyButton").click();
        cy.wait("@FreshResults");
        cy.get("@widget")
          .invoke("height")
          .should("eq", 285);

        // resize height by 1 grid row
        resizeBy(cy.get("@widget"), 0, 50)
          .then(() => cy.get("@widget"))
          .invoke("height")
          .should("eq", 335); // resized by 50, , 135 -> 185

        // add 4 table rows
        cy.get("@paramInput")
          .clear()
          .type("5");
        cy.getByTestId("ParameterApplyButton").click();
        cy.wait("@FreshResults");

        // expect height to stay unchanged (would have been 435)
        cy.get("@widget")
          .invoke("height")
          .should("eq", 335);
      });
    });
  });

  it("задает правильную высоту визуализации таблицы", function() {
    const queryData = {
      query: `select '${"loremipsum".repeat(15)}' FROM generate_series(1,15)`,
    };

    const widgetOptions = { position: { col: 0, row: 0, sizeX: 3, sizeY: 10, autoHeight: false } };

    createQueryAndAddWidget(this.dashboardId, queryData, widgetOptions).then(() => {
      cy.visit(this.dashboardUrl);
      cy.getByTestId("TableVisualization")
        .its("0.offsetHeight")
        .should("eq", 381);
      cy.percySnapshot("Показывает правильную высоту визуализации таблицы");
    });
  });

  it("показывает фиксированную нумерацию страниц при переполнении табличного содержимого ", function() {
    const queryData = {
      query: "выберите 'lorem ipsum' FROM generate_series(1,50)",
    };

    const widgetOptions = { position: { col: 0, row: 0, sizeX: 3, sizeY: 10, autoHeight: false } };

    createQueryAndAddWidget(this.dashboardId, queryData, widgetOptions).then(() => {
      cy.visit(this.dashboardUrl);
      cy.getByTestId("TableVisualization")
        .next(".ant-pagination.mini")
        .should("be.visible");
      cy.percySnapshot("Показывает фиксированное мини-разбиение на страницы для переполнения табличного содержимого");
    });
  });

  it("сохраняет результаты на экране во время обновления", function() {
    const queryData = {
      query: "select pg_sleep({{sleep-time}}), 'sleep time: {{sleep-time}}' as sleeptime",
      options: { parameters: [{ name: "sleep-time", title: "Время сна", type: "number", value: 0 }] },
    };

    createQueryAndAddWidget(this.dashboardId, queryData).then(elTestId => {
      cy.visit(this.dashboardUrl);
      cy.getByTestId(elTestId).within(() => {
        cy.getByTestId("TableVisualization").should("contain", "sleep time: 0");
        cy.get(".refresh-indicator").should("not.be.visible");

        cy.getByTestId("ParameterName-sleep-time").type("10");
        cy.getByTestId("ParameterApplyButton").click();
        cy.get(".refresh-indicator").should("be.visible");
        cy.getByTestId("TableVisualization").should("contain", "sleep time: 0");
      });
    });
  });
});
