import React from "react";
import Checkbox from "antd/lib/checkbox";
import Form from "antd/lib/form";
import DynamicComponent from "@/components/DynamicComponent";
import { SettingsEditorPropTypes, SettingsEditorDefaultProps } from "../prop-types";

export default function FeatureFlagsSettings(props) {
  const { values, onChange } = props;

  return (
    <DynamicComponent name="OrganizationSettings.FeatureFlagsSettings" {...props}>
      <Form.Item label="Особенность флагов">
        <Checkbox
          name="feature_show_permissions_control"
          checked={values.feature_show_permissions_control}
          onChange={e => onChange({ feature_show_permissions_control: e.target.checked })}>
          Включить экспериментальную поддержку нескольких владельцев
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox
          name="send_email_on_failed_scheduled_queries"
          checked={values.send_email_on_failed_scheduled_queries}
          onChange={e => onChange({ send_email_on_failed_scheduled_queries: e.target.checked })}>
          Отправлять владельцам запросов сообщения на электронную почту при сбое запланированных запросов
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Checkbox
          name="multi_byte_search_enabled"
          checked={values.multi_byte_search_enabled}
          onChange={e => onChange({ multi_byte_search_enabled: e.target.checked })}>
          Включить многобайтовый (китайский, японский и корейский) поиск имен и описаний запросов (медленнее)
        </Checkbox>
      </Form.Item>
    </DynamicComponent>
  );
}

FeatureFlagsSettings.propTypes = SettingsEditorPropTypes;

FeatureFlagsSettings.defaultProps = SettingsEditorDefaultProps;
