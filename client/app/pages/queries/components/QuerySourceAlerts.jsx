import React from "react";
import PropTypes from "prop-types";
import Card from "antd/lib/card";
import Icon from "antd/lib/icon";
import Button from "antd/lib/button";
import Typography from "antd/lib/typography";
import { currentUser } from "@/services/auth";

import useQueryFlags from "../hooks/useQueryFlags";
import "./QuerySourceAlerts.less";

export default function QuerySourceAlerts({ query, dataSourcesAvailable }) {
  const queryFlags = useQueryFlags(query); // we don't use flags that depend on data source

  let message = null;
  if (queryFlags.isNew && !queryFlags.canCreate) {
    message = (
      <React.Fragment>
        <Typography.Title level={4}>
          У вас нет разрешения на создание новых запросов ни в одном из доступных вам источников данных.
        </Typography.Title>
        <p>
          <Typography.Text type="secondary">
            Вы можете <a href="queries">либо спросить дополнительные разрешения у своего администратора Redash</a>, либо запросить их у него.
          </Typography.Text>
        </p>
      </React.Fragment>
    );
  } else if (!dataSourcesAvailable) {
    if (currentUser.isAdmin) {
      message = (
        <React.Fragment>
          <Typography.Title level={4}>
            Похоже, источники данных еще не созданы или ни один из них не доступен для группы (групп), членом которой вы являетесь.
          </Typography.Title>
          <p>
            <Typography.Text type="secondary">Пожалуйста, сначала создайте, а затем начните запрашивать.</Typography.Text>
          </p>

          <div className="query-source-alerts-actions">
            <Button type="primary" href="data_sources/new">
              Создать источник данных
            </Button>
            <Button type="default" href="groups">
              Управление разрешениями группы
            </Button>
          </div>
        </React.Fragment>
      );
    } else {
      message = (
        <React.Fragment>
          <Typography.Title level={4}>
            Похоже, источники данных еще не созданы или ни один из них не доступен для группы (групп), членом которой вы являетесь.
          </Typography.Title>
          <p>
            <Typography.Text type="secondary">Пожалуйста, попросите вашего администратора Redash создать его первым.</Typography.Text>
          </p>
        </React.Fragment>
      );
    }
  }

  if (!message) {
    return null;
  }

  return (
    <div className="query-source-alerts">
      <Card>
        <div className="query-source-alerts-icon">
          <Icon type="warning" theme="filled" />
        </div>
        {message}
      </Card>
    </div>
  );
}

QuerySourceAlerts.propTypes = {
  query: PropTypes.object.isRequired,
  dataSourcesAvailable: PropTypes.bool,
};

QuerySourceAlerts.defaultProps = {
  dataSourcesAvailable: false,
};
