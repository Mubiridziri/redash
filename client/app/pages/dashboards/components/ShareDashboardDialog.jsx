import { replace } from "lodash";
import React from "react";
import { axios } from "@/services/axios";
import PropTypes from "prop-types";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";
import Form from "antd/lib/form";
import Alert from "antd/lib/alert";
import notification from "@/services/notification";
import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import InputWithCopy from "@/components/InputWithCopy";

const API_SHARE_URL = "api/dashboards/{id}/share";

class ShareDashboardDialog extends React.Component {
  static propTypes = {
    dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    hasOnlySafeQueries: PropTypes.bool.isRequired,
    dialog: DialogPropType.isRequired,
  };

  formItemProps = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { marginBottom: 7 },
  };

  constructor(props) {
    super(props);
    const { dashboard } = this.props;

    this.state = {
      saving: false,
    };

    this.apiUrl = replace(API_SHARE_URL, "{id}", dashboard.id);
    this.enabled = this.props.hasOnlySafeQueries || dashboard.publicAccessEnabled;
  }

  static get headerContent() {
    return (
      <React.Fragment>
        Поделиться панелью
        <div className="modal-header-desc">
          Разрешить публичный доступ к этой панели с секретным адресом.
        </div>
      </React.Fragment>
    );
  }

  enableAccess = () => {
    const { dashboard } = this.props;
    this.setState({ saving: true });

    axios
      .post(this.apiUrl)
      .then(data => {
        dashboard.publicAccessEnabled = true;
        dashboard.public_url = data.public_url;
      })
      .catch(() => {
        notification.error("Failed to turn on sharing for this dashboard");
      })
      .finally(() => {
        this.setState({ saving: false });
      });
  };

  disableAccess = () => {
    const { dashboard } = this.props;
    this.setState({ saving: true });

    axios
      .delete(this.apiUrl)
      .then(() => {
        dashboard.publicAccessEnabled = false;
        delete dashboard.public_url;
      })
      .catch(() => {
        notification.error("Failed to turn off sharing for this dashboard");
      })
      .finally(() => {
        this.setState({ saving: false });
      });
  };

  onChange = checked => {
    if (checked) {
      this.enableAccess();
    } else {
      this.disableAccess();
    }
  };

  render() {
    const { dialog, dashboard } = this.props;

    return (
      <Modal {...dialog.props} title={this.constructor.headerContent} footer={null}>
        <Form layout="horizontal">
          {!this.props.hasOnlySafeQueries && (
            <Form.Item>
              <Alert
                message="В целях безопасности совместное использование в настоящее время не поддерживается для панелей мониторинга, содержащих запросы с текстовыми параметрами. Попробуйте изменить текстовые параметры в вашем запросе на другой тип."
                type="error"
              />
            </Form.Item>
          )}
          <Form.Item label="Разрешить публичный доступ" {...this.formItemProps}>
            <Switch
              checked={dashboard.publicAccessEnabled}
              onChange={this.onChange}
              loading={this.state.saving}
              disabled={!this.enabled}
              data-test="PublicAccessEnabled"
            />
          </Form.Item>
          {dashboard.public_url && (
            <Form.Item label="Секретный адрес" {...this.formItemProps}>
              <InputWithCopy value={dashboard.public_url} data-test="SecretAddress" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    );
  }
}

export default wrapDialog(ShareDashboardDialog);
