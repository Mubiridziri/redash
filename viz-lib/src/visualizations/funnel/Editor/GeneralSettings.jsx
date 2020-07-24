import { map } from "lodash";
import React, { useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Select, Input, Checkbox } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

export default function GeneralSettings({ options, data, onOptionsChange }) {
  const columnNames = useMemo(() => map(data.columns, c => c.name), [data]);

  const [onOptionsChangeDebounced] = useDebouncedCallback(onOptionsChange, 200);

  return (
    <React.Fragment>
      <Section>
        <Select
          layout="horizontal"
          label="Шаг столбца"
          data-test="Funnel.StepColumn"
          placeholder="Выберите столбец..."
          defaultValue={options.stepCol.colName || undefined}
          onChange={colName => onOptionsChange({ stepCol: { colName: colName || null } })}>
          {map(columnNames, col => (
            <Select.Option key={col} data-test={`Funnel.StepColumn.${col}`}>
              {col}
            </Select.Option>
          ))}
        </Select>
      </Section>

      <Section>
        <Input
          layout="horizontal"
          label="Заголовок столбца шага"
          data-test="Funnel.StepColumnTitle"
          defaultValue={options.stepCol.displayAs}
          onChange={event => onOptionsChangeDebounced({ stepCol: { displayAs: event.target.value } })}
        />
      </Section>

      <Section>
        <Select
          layout="horizontal"
          label="Значение столбца"
          data-test="Funnel.ValueColumn"
          placeholder="Выберите столбец..."
          defaultValue={options.valueCol.colName || undefined}
          onChange={colName => onOptionsChange({ valueCol: { colName: colName || null } })}>
          {map(columnNames, col => (
            <Select.Option key={col} data-test={`Funnel.ValueColumn.${col}`}>
              {col}
            </Select.Option>
          ))}
        </Select>
      </Section>

      <Section>
        <Input
          layout="horizontal"
          label="Заголовок столбца значение"
          data-test="Funnel.ValueColumnTitle"
          defaultValue={options.valueCol.displayAs}
          onChange={event => onOptionsChangeDebounced({ valueCol: { displayAs: event.target.value } })}
        />
      </Section>

      <Section>
        <Checkbox
          data-test="Funnel.CustomSort"
          checked={!options.autoSort}
          onChange={event => onOptionsChange({ autoSort: !event.target.checked })}>
          Выборочная сортировка
        </Checkbox>
      </Section>

      {!options.autoSort && (
        <React.Fragment>
          <Section>
            <Select
              layout="horizontal"
              label="Сортировать столбец"
              data-test="Funnel.SortColumn"
              allowClear
              placeholder="Выберите столбец..."
              defaultValue={options.sortKeyCol.colName || undefined}
              onChange={colName => onOptionsChange({ sortKeyCol: { colName: colName || null } })}>
              {map(columnNames, col => (
                <Select.Option key={col} data-test={`Funnel.SortColumn.${col}`}>
                  {col}
                </Select.Option>
              ))}
            </Select>
          </Section>

          <Section>
            <Select
              layout="horizontal"
              label="Порядок сортировки"
              data-test="Funnel.SortDirection"
              disabled={!options.sortKeyCol.colName}
              defaultValue={options.sortKeyCol.reverse ? "desc" : "asc"}
              onChange={order => onOptionsChange({ sortKeyCol: { reverse: order === "desc" } })}>
              <Select.Option value="asc" data-test="Funnel.SortDirection.Ascending">
                по возрастанию
              </Select.Option>
              <Select.Option value="desc" data-test="Funnel.SortDirection.Descending">
                по убыванию
              </Select.Option>
            </Select>
          </Section>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

GeneralSettings.propTypes = EditorPropTypes;
