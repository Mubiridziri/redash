import React from "react";
import PropTypes from "prop-types";
import Tabs from "antd/lib/tabs";
import PageHeader from "@/components/PageHeader";

import "./layout.less";

export default function Layout({ activeTab, children }) {
  return (
    <div className="admin-page-layout">
      <div className="container">
        <PageHeader title="Администратор" />

        <div className="bg-white tiled">
          <Tabs className="admin-page-layout-tabs" defaultActiveKey={activeTab} animated={false} tabBarGutter={0}>
            <Tabs.TabPane key="system_status" tab={<a href="admin/status">Состояние системы</a>}>
              {activeTab === "system_status" ? children : null}
            </Tabs.TabPane>
            <Tabs.TabPane key="jobs" tab={<a href="admin/queries/jobs">RQ Статус</a>}>
              {activeTab === "jobs" ? children : null}
            </Tabs.TabPane>
            <Tabs.TabPane key="outdated_queries" tab={<a href="admin/queries/outdated">Устаревшие запросы</a>}>
              {activeTab === "outdated_queries" ? children : null}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

Layout.propTypes = {
  activeTab: PropTypes.string,
  children: PropTypes.node,
};

Layout.defaultProps = {
  activeTab: "system_status",
  children: null,
};
