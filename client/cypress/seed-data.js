exports.seedData = [
  {
    route: "/setup",
    type: "form",
    data: {
      name: "Пример администратора",
      email: "admin@redash.io",
      password: "пароль",
      org_name: "Redash",
    },
  },
  {
    route: "/login",
    type: "form",
    data: {
      email: "admin@redash.io",
      password: "пароль",
    },
  },
  {
    route: "/api/data_sources",
    type: "json",
    data: {
      name: "Тест PostgreSQL",
      options: {
        dbname: "postgres",
        host: "postgres",
        port: 5432,
        sslmode: "prefer",
        user: "postgres",
      },
      type: "pg",
    },
  },
  {
    route: "/api/destinations",
    type: "json",
    data: {
      name: "Проверить адрес электронной почты",
      options: {
        addresses: "test@example.com",
      },
      type: "email",
    },
  },
];
