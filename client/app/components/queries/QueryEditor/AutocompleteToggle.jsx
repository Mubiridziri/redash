import React, { useCallback } from "react";
import Tooltip from "antd/lib/tooltip";
import Button from "antd/lib/button";
import PropTypes from "prop-types";
import "@/redash-font/style.less";
import recordEvent from "@/services/recordEvent";

export default function AutocompleteToggle({ available, enabled, onToggle }) {
  let tooltipMessage = "Автозаполнение в реальном времени включено";
  let icon = "icon-flash";
  if (!enabled) {
    tooltipMessage = "Автозаполнение в реальном времени выключено";
    icon = "icon-flash-off";
  }

  if (!available) {
    tooltipMessage = "Автозаполнение в реальном времени недоступно (используйте Ctrl + Пробел для запуска)";
    icon = "icon-flash-off";
  }

  const handleClick = useCallback(() => {
    recordEvent("toggle_autocomplete", "screen", "query_editor", { state: !enabled });
    onToggle(!enabled);
  }, [enabled, onToggle]);

  return (
    <Tooltip placement="top" title={tooltipMessage}>
      <Button className="query-editor-controls-button m-r-5" disabled={!available} onClick={handleClick}>
        <i className={"icon " + icon} />
      </Button>
    </Tooltip>
  );
}

AutocompleteToggle.propTypes = {
  available: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};
