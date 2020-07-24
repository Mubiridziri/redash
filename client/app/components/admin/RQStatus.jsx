import { map } from "lodash";
import React from "react";
import PropTypes from "prop-types";

import Badge from "antd/lib/badge";
import Card from "antd/lib/card";
import Spin from "antd/lib/spin";
import Table from "antd/lib/table";
import { Columns } from "@/components/items-list/components/ItemsTable";

// CounterCard

export function CounterCard({ title, value, loading }) {
  return (
    <Spin spinning={loading}>
      <Card>
        {title}
        <div className="f-20">{value}</div>
      </Card>
    </Spin>
  );
}

CounterCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool.isRequired,
};

CounterCard.defaultProps = {
  value: "",
};

// Tables

const queryJobsColumns = [
  { title: "Очередь", dataIndex: "origin" },
  { title: "ID Очередь ", dataIndex: "meta.query_id" },
  { title: "Org ID", dataIndex: "meta.org_id" },
  { title: "ID Источника данных", dataIndex: "meta.data_source_id" },
  { title: "ID Пользователя", dataIndex: "meta.user_id" },
  Columns.custom(scheduled => scheduled.toString(), { title: "Запланированное", dataIndex: "meta.scheduled" }),
  Columns.timeAgo({ title: "Время начала", dataIndex: "started_at" }),
  Columns.timeAgo({ title: "Время запроса", dataIndex: "enqueued_at" }),
];

const otherJobsColumns = [
  { title: "Очередь", dataIndex: "origin" },
  { title: "Название работы", dataIndex: "name" },
  Columns.timeAgo({ title: "Время начала", dataIndex: "started_at" }),
  Columns.timeAgo({ title: "Время запроса", dataIndex: "enqueued_at" }),
];

const workersColumns = [
  Columns.custom(
    value => (
      <span>
        <Badge status={{ busy: "processing", idle: "default", started: "success", suspended: "warning" }[value]} />{" "}
        {value}
      </span>
    ),
    { title: "Состояние", dataIndex: "state" }
  ),
]
  .concat(
    map(["Имя хоста", "PID", "Имя", "Очереди", "Текущее место работы", "Успешная работа", "Неудачная работа"], c => ({
      title: c,
      dataIndex: c.toLowerCase().replace(/\s/g, "_"),
    }))
  )
  .concat([
    Columns.dateTime({ title: "Дата рождения", dataIndex: "birth_date" }),
    Columns.duration({ title: "Общая продолжительность рабочего времени", dataIndex: "total_working_time" }),
  ]);

const queuesColumns = map(["Name", "Started", "Queued"], c => ({ title: c, dataIndex: c.toLowerCase() }));

const TablePropTypes = {
  loading: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export function WorkersTable({ loading, items }) {
  return (
    <Table
      loading={loading}
      columns={workersColumns}
      rowKey="name"
      dataSource={items}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: ["10", "25", "50"],
        showSizeChanger: true,
      }}
    />
  );
}

WorkersTable.propTypes = TablePropTypes;

export function QueuesTable({ loading, items }) {
  return (
    <Table
      loading={loading}
      columns={queuesColumns}
      rowKey="name"
      dataSource={items}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: ["10", "25", "50"],
        showSizeChanger: true,
      }}
    />
  );
}

QueuesTable.propTypes = TablePropTypes;

export function QueryJobsTable({ loading, items }) {
  return (
    <Table
      loading={loading}
      columns={queryJobsColumns}
      rowKey="id"
      dataSource={items}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: ["10", "25", "50"],
        showSizeChanger: true,
      }}
    />
  );
}

QueryJobsTable.propTypes = TablePropTypes;

export function OtherJobsTable({ loading, items }) {
  return (
    <Table
      loading={loading}
      columns={otherJobsColumns}
      rowKey="id"
      dataSource={items}
      pagination={{
        defaultPageSize: 25,
        pageSizeOptions: ["10", "25", "50"],
        showSizeChanger: true,
      }}
    />
  );
}

OtherJobsTable.propTypes = TablePropTypes;
