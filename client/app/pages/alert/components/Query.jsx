import React from "react";
import PropTypes from "prop-types";

import QuerySelector from "@/components/QuerySelector";
import SchedulePhrase from "@/components/queries/SchedulePhrase";
import { Query as QueryType } from "@/components/proptypes";

import Tooltip from "antd/lib/tooltip";
import Icon from "antd/lib/icon";

import "./Query.less";

export default function QueryFormItem({ query, queryResult, onChange, editMode }) {
  const queryHint =
    query && query.schedule ? (
      <small>
        Запланированное обновление{" "}
        <i className="alert-query-schedule">
          <SchedulePhrase schedule={query.schedule} isNew={false} />
        </i>
      </small>
    ) : (
      <small>
        <Icon type="warning" theme="filled" className="warning-icon-danger" /> Этот запрос не имеет <i>обновления расписания</i>
        .{" "}
        <Tooltip title="Расписание запросов не обязательно, но настоятельно рекомендуется для оповещений. Оповещение без расписания запросов будет отправлять уведомления только в том случае, если пользователь в вашей организации выполняет этот запрос вручную.">
          <a>
          Почему it&apos;s рекомендуется<Icon type="question-circle" theme="twoTone" />
          </a>
        </Tooltip>
      </small>
    );

  return (
    <>
      {editMode ? (
        <QuerySelector onChange={onChange} selectedQuery={query} className="alert-query-selector" type="select" />
      ) : (
        <Tooltip title="Открыть запрос в новой вкладке.">
          <a href={`queries/${query.id}`} target="_blank" rel="noopener noreferrer" className="alert-query-link">
            {query.name}
            <i className="fa fa-external-link" />
          </a>
        </Tooltip>
      )}
      <div className="ant-form-explain">{query && queryHint}</div>
      {query && !queryResult && (
        <div className="m-t-30">
          <Icon type="loading" className="m-r-5" /> Загрузка данных запроса
        </div>
      )}
    </>
  );
}

QueryFormItem.propTypes = {
  query: QueryType,
  queryResult: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func,
  editMode: PropTypes.bool,
};

QueryFormItem.defaultProps = {
  query: null,
  queryResult: null,
  onChange: () => {},
  editMode: false,
};
