import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import Modal from "antd/lib/modal";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";

export default function MenuButton({ doDelete, canEdit, mute, unmute, muted }) {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(action => {
    setLoading(true);
    action().finally(() => {
      setLoading(false);
    });
  }, []);

  const confirmDelete = useCallback(() => {
    Modal.confirm({
      title: "Удалить оповещение",
      content: "Вы уверены, что хотите удалить это оповещение?",
      okText: "Удалить",
      okType: "danger",
      onOk: () => {
        setLoading(true);
        doDelete().catch(() => {
          setLoading(false);
        });
      },
      maskClosable: true,
      autoFocusButton: null,
    });
  }, [doDelete]);

  return (
    <Dropdown
      className={cx("m-l-5", { disabled: !canEdit })}
      trigger={[canEdit ? "click" : undefined]}
      placement="bottomRight"
      overlay={
        <Menu>
          <Menu.Item>
            {muted ? (
              <a onClick={() => execute(unmute)}>Включить звук уведомлений</a>
            ) : (
              <a onClick={() => execute(mute)}>Выключить звук уведомлений</a>
            )}
          </Menu.Item>
          <Menu.Item>
            <a onClick={confirmDelete}>Удалить оповещение</a>
          </Menu.Item>
        </Menu>
      }>
      <Button>{loading ? <Icon type="loading" /> : <Icon type="ellipsis" rotate={90} />}</Button>
    </Dropdown>
  );
}

MenuButton.propTypes = {
  doDelete: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired,
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
  muted: PropTypes.bool,
};

MenuButton.defaultProps = {
  muted: false,
};
