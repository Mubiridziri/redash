function fillProfileDataAndSave(name, email) {
  cy.getByTestId("Name").type(`{selectall}${name}`);
  cy.getByTestId("Email").type(`{selectall}${email}{enter}`);
  cy.contains("Сохранено.");
}

function fillChangePasswordAndSave(currentPassword, newPassword, repeatPassword) {
  cy.getByTestId("CurrentPassword").type(currentPassword);
  cy.getByTestId("NewPassword").type(newPassword);
  cy.getByTestId("RepeatPassword").type(`${repeatPassword}{enter}`);
}

describe("Редактировать профиль", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/users/me");
  });

  it("обновляет пользователя после сохранения", () => {
    fillProfileDataAndSave("Jian Yang", "jian.yang@redash.io");
    cy.logout();
    cy.login("jian.yang@redash.io")
      .its("status")
      .should("eq", 200);
    cy.visit("/users/me");
    cy.contains("Jian Yang");
    fillProfileDataAndSave("Пример администратора", "admin@redash.io");
  });

  it("регенерирует API ключ", () => {
    cy.getByTestId("ApiKey").then($apiKey => {
      const previousApiKey = $apiKey.val();

      cy.getByTestId("RegenerateApiKey").click();
      cy.get(".ant-btn-primary")
        .contains("Регенерировать")
        .click({ force: true });

      cy.getByTestId("ApiKey").should("not.eq", previousApiKey);
    });
  });

  it("рендерит страницу и делает скриншот", () => {
    cy.getByTestId("Groups").should("contain", "admin");
    cy.percySnapshot("Профиль пользователя");
  });

  context("changing password", () => {
    beforeEach(() => {
      cy.getByTestId("ChangePassword").click();
    });

    it("обновляет пароль пользователя, если пароль верный", () => {
      fillChangePasswordAndSave("password", "newpassword", "newpassword");
      cy.contains("Сохранено.");
      cy.logout();
      cy.login(undefined, "newpassword")
        .its("status")
        .should("eq", 200);
      cy.visit("/users/me");
      cy.getByTestId("ChangePassword").click();
      fillChangePasswordAndSave("newpassword", "password", "password");
      cy.contains("Сохранено.");
    });

    it("показывает ошибку, если текущий пароль неверен", () => {
      fillChangePasswordAndSave("wrongpassword", "newpassword", "newpassword");
      cy.contains("Неверный текущий пароль.");
    });
  });
});
