import React from "react";
import Alert from "antd/lib/alert";
import Form from "antd/lib/form";
import Checkbox from "antd/lib/checkbox";
import Tooltip from "antd/lib/tooltip";
import DynamicComponent from "@/components/DynamicComponent";
import { clientConfig } from "@/services/auth";
import { SettingsEditorPropTypes, SettingsEditorDefaultProps } from "../prop-types";

export default function PasswordLoginSettings(props) {
  const { settings, values, onChange } = props;

  const isTheOnlyAuthMethod =
    !clientConfig.googleLoginEnabled && !clientConfig.ldapLoginEnabled && !values.auth_saml_enabled;

  return (
    <DynamicComponent name="OrganizationSettings.PasswordLoginSettings" {...props}>
      {!settings.auth_password_login_enabled && (
        <Alert
          message="Вход на основе пароля в настоящее время отключен, и пользователи смогут войти только с включенными опциями единого входа."
          type="warning"
          className="m-t-15 m-b-15"
        />
      )}
      <Form.Item>
        <Checkbox
          checked={values.auth_password_login_enabled}
          disabled={isTheOnlyAuthMethod}
          onChange={e => onChange({ auth_password_login_enabled: e.target.checked })}>
          <Tooltip
            title={
              isTheOnlyAuthMethod ? "Вход с паролем может быть отключен, только если включен другой способ входа." : null
            }
            placement="right">
            Пароль и логин включены
          </Tooltip>
        </Checkbox>
      </Form.Item>
    </DynamicComponent>
  );
}

PasswordLoginSettings.propTypes = SettingsEditorPropTypes;

PasswordLoginSettings.defaultProps = SettingsEditorDefaultProps;
