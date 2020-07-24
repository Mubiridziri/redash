import { get, find, toUpper } from "lodash";
import React from "react";
import PropTypes from "prop-types";

import Modal from "antd/lib/modal";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import navigateTo from "@/components/ApplicationArea/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
import DynamicForm from "@/components/dynamic-form/DynamicForm";
import helper from "@/components/dynamic-form/dynamicFormHelper";
import wrapSettingsTab from "@/components/SettingsWrapper";

import DataSource, { IMG_ROOT } from "@/services/data-source";
import notification from "@/services/notification";
import routes from "@/services/routes";

class EditDataSource extends React.Component {
  static propTypes = {
    dataSourceId: PropTypes.string.isRequired,
    onError: PropTypes.func,
  };

  static defaultProps = {
    onError: () => {},
  };

  state = {
    dataSource: null,
    type: null,
    loading: true,
  };

  componentDidMount() {
    DataSource.get({ id: this.props.dataSourceId })
      .then(dataSource => {
        const { type } = dataSource;
        this.setState({ dataSource });
        DataSource.types().then(types => this.setState({ type: find(types, { type }), loading: false }));
      })
      .catch(error => this.props.onError(error));
  }

  saveDataSource = (values, successCallback, errorCallback) => {
    const { dataSource } = this.state;
    helper.updateTargetWithValues(dataSource, values);
    DataSource.save(dataSource)
      .then(() => successCallback("Сохранено."))
      .catch(error => {
        const message = get(error, "response.data.message", "Failed saving.");
        errorCallback(message);
      });
  };

  deleteDataSource = callback => {
    const { dataSource } = this.state;

    const doDelete = () => {
      DataSource.delete(dataSource)
        .then(() => {
          notification.success("Источник данных успешно удален.");
          navigateTo("data_sources");
        })
        .catch(() => {
          callback();
        });
    };

    Modal.confirm({
      title: "Удалить источник данных",
      content: "Вы уверены, что хотите удалить этот источник данных?",
      cancelText: "Отмена",
      okText: "Удалить",
      okType: "danger",
      onOk: doDelete,
      onCancel: callback,
      maskClosable: true,
      autoFocusButton: null,
    });
  };

  testConnection = callback => {
    const { dataSource } = this.state;
    DataSource.test({ id: dataSource.id })
      .then(httpResponse => {
        if (httpResponse.ok) {
          notification.success("Успех");
        } else {
          notification.error("Проверка соединения не пройдена:", httpResponse.message, { duration: 10 });
        }
        callback();
      })
      .catch(() => {
        notification.error(
          "Проверка соединения не пройдена:",
          "Произошла неизвестная ошибка при выполнении проверки соединения. Пожалуйста, попробуйте позже.",
          { duration: 10 }
        );
        callback();
      });
  };

  renderForm() {
    const { dataSource, type } = this.state;
    const fields = helper.getFields(type, dataSource);
    const helpTriggerType = `DS_${toUpper(type.type)}`;
    const formProps = {
      fields,
      type,
      actions: [
        { name: "Удалить", type: "danger", callback: this.deleteDataSource },
        { name: "Тестовое соединение", pullRight: true, callback: this.testConnection, disableWhenDirty: true },
      ],
      onSubmit: this.saveDataSource,
      feedbackIcons: true,
    };

    return (
      <div className="row" data-test="DataSource">
        <div className="text-center m-b-10">
          <img className="p-5" src={`${IMG_ROOT}/${type.type}.png`} alt={type.name} width="64" />
          <h3 className="m-0">{type.name}</h3>
        </div>
        <div className="col-md-4 col-md-offset-4 m-b-10">
          <DynamicForm {...formProps} />
        </div>
      </div>
    );
  }

  render() {
    return this.state.loading ? <LoadingState className="" /> : this.renderForm();
  }
}

const EditDataSourcePage = wrapSettingsTab("DataSources.Edit", null, EditDataSource);

routes.register(
  "DataSources.Edit",
  routeWithUserSession({
    path: "/data_sources/:dataSourceId",
    title: "Источники данных",
    render: pageProps => <EditDataSourcePage {...pageProps} />,
  })
);
