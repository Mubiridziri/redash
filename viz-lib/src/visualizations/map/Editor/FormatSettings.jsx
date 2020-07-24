import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, Checkbox, TextArea, ContextHelp } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

function TemplateFormatHint() {
  // eslint-disable-line react/prop-types
  return (
    <ContextHelp placement="topLeft" arrowPointAtCenter>
      <div style={{ paddingBottom: 5 }}>
      На все столбцы результатов запроса можно ссылаться с использованием<code>{"{{ column_name }}"}</code> синтаксиса. 
      </div>
      <div style={{ paddingBottom: 5 }}>Оставьте это поле пустым, чтобы использовать шаблон по умолчанию.</div>
    </ContextHelp>
  );
}

export default function FormatSettings({ options, onOptionsChange }) {
  const [onOptionsChangeDebounced] = useDebouncedCallback(onOptionsChange, 200);

  const templateFormatHint = <TemplateFormatHint />;

  return (
    <div className="map-visualization-editor-format-settings">
      <Section>
        <Checkbox
          data-test="Map.Editor.TooltipEnabled"
          checked={options.tooltip.enabled}
          onChange={event => onOptionsChange({ tooltip: { enabled: event.target.checked } })}>
          Показать подсказку
        </Checkbox>
      </Section>

      <Section>
        <Input
          label={<React.Fragment>Tooltip template {templateFormatHint}</React.Fragment>}
          data-test="Map.Editor.TooltipTemplate"
          disabled={!options.tooltip.enabled}
          placeholder="Шаблон по умолчанию"
          defaultValue={options.tooltip.template}
          onChange={event => onOptionsChangeDebounced({ tooltip: { template: event.target.value } })}
        />
      </Section>

      <Section>
        <Checkbox
          data-test="Map.Editor.PopupEnabled"
          checked={options.popup.enabled}
          onChange={event => onOptionsChange({ popup: { enabled: event.target.checked } })}>
          Показать всплывающее окно
        </Checkbox>
      </Section>

      <Section>
        <TextArea
          label={<React.Fragment>Popup template {templateFormatHint}</React.Fragment>}
          data-test="Map.Editor.PopupTemplate"
          disabled={!options.popup.enabled}
          rows={4}
          placeholder="Шаблон по умолчанию"
          defaultValue={options.popup.template}
          onChange={event => onOptionsChangeDebounced({ popup: { template: event.target.value } })}
        />
      </Section>
    </div>
  );
}

FormatSettings.propTypes = EditorPropTypes;
