import { extend, trim } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, ControlLabel, ContextHelp } from "@/components/visualizations/editor";
import { formatSimpleTemplate } from "@/lib/value-format";

function Editor({ column, onChange }) {
  const [onChangeDebounced] = useDebouncedCallback(onChange, 200);

  return (
    <React.Fragment>
      <Section>
        <Input
          label="URL template"
          data-test="Table.ColumnEditor.Image.UrlTemplate"
          defaultValue={column.imageUrlTemplate}
          onChange={event => onChangeDebounced({ imageUrlTemplate: event.target.value })}
        />
      </Section>

      <Section>
        <ControlLabel
          label={
            <React.Fragment>
              Size
              <ContextHelp placement="topLeft" arrowPointAtCenter>
                <div style={{ marginBottom: 5 }}>Любое положительное целое значение, задающее размер в пикселях.</div>
                <div>Оставьте пустым, чтобы использовать значение по умолчанию.</div>
              </ContextHelp>
            </React.Fragment>
          }>
          <div className="image-dimension-selector">
            <Input
              data-test="Table.ColumnEditor.Image.Width"
              placeholder="Ширина"
              defaultValue={column.imageWidth}
              onChange={event => onChangeDebounced({ imageWidth: event.target.value })}
            />
            <span className="image-dimension-selector-spacer">&times;</span>
            <Input
              data-test="Table.ColumnEditor.Image.Height"
              placeholder="Высота"
              defaultValue={column.imageHeight}
              onChange={event => onChangeDebounced({ imageHeight: event.target.value })}
            />
          </div>
        </ControlLabel>
      </Section>

      <Section>
        <Input
          label="Шаблон заголовка"
          data-test="Table.ColumnEditor.Image.TitleTemplate"
          defaultValue={column.imageTitleTemplate}
          onChange={event => onChangeDebounced({ imageTitleTemplate: event.target.value })}
        />
      </Section>

      <Section>
        <ContextHelp
          placement="topLeft"
          arrowPointAtCenter
          icon={<span style={{ cursor: "по умолчанию" }}>Format specs {ContextHelp.defaultIcon}</span>}>
          <div>
          На все столбцы можно ссылаться с помощью <code>{"{{ column_name }}"}</code> синтаксиса.
          </div>
          <div>
            Используйте <code>{"{{ @ }}"}</code> для ссылки на текущий (этот) столбец.
          </div>
          <div>Этот синтаксис применим к URL, название и размер.</div>
        </ContextHelp>
      </Section>
    </React.Fragment>
  );
}

Editor.propTypes = {
  column: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrlTemplate: PropTypes.string,
    imageWidth: PropTypes.string,
    imageHeight: PropTypes.string,
    imageTitleTemplate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function initImageColumn(column) {
  function prepareData(row) {
    row = extend({ "@": row[column.name] }, row);

    const src = trim(formatSimpleTemplate(column.imageUrlTemplate, row));
    if (src === "") {
      return {};
    }

    const width = parseInt(formatSimpleTemplate(column.imageWidth, row), 10);
    const height = parseInt(formatSimpleTemplate(column.imageHeight, row), 10);
    const title = trim(formatSimpleTemplate(column.imageTitleTemplate, row));

    const result = { src };

    if (Number.isFinite(width) && width > 0) {
      result.width = width;
    }
    if (Number.isFinite(height) && height > 0) {
      result.height = height;
    }
    if (title !== "") {
      result.text = title; // `text` is used for search
      result.title = title;
      result.alt = title;
    }

    return result;
  }

  function ImageColumn({ row }) {
    // eslint-disable-line react/prop-types
    const { text, ...props } = prepareData(row);
    return <img alt="" {...props} />;
  }

  ImageColumn.prepareData = prepareData;

  return ImageColumn;
}

initImageColumn.friendlyName = "Image";
initImageColumn.Editor = Editor;
