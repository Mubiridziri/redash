import { includes, map, extend, fromPairs } from "lodash";
import React, { useMemo, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import Table from "antd/lib/table";
import Input from "antd/lib/input";
import Radio from "antd/lib/radio";
import { sortableElement } from "react-sortable-hoc";
import { SortableContainer, DragHandle } from "@/components/sortable";
import { EditorPropTypes } from "@/visualizations/prop-types";
import ChartTypeSelect from "./ChartTypeSelect";
import getChartData from "../getChartData";

const SortableBodyRow = sortableElement(props => <tr {...props} />);

function getTableColumns(options, updateSeriesOption, debouncedUpdateSeriesOption) {
  const result = [
    {
      title: "Порядок",
      dataIndex: "zIndex",
      render: (item) => (
        <span className="series-settings-order">
          <DragHandle />
          {item.zIndex + 1}
        </span>
      ),
    },
    {
      title: "Метка",
      dataIndex: "name",
      render: (item) => (
        <Input
          data-test={`Chart.Series.${item.key}.Label`}
          placeholder={item.key}
          defaultValue={item.name}
          onChange={event => debouncedUpdateSeriesOption(item.key, "name", event.target.value)}
        />
      ),
    },
  ];

  if (!includes(["pie", "heatmap"], options.globalSeriesType)) {
    result.push({
      title: "Y Ось",
      dataIndex: "yAxis",
      render: (item) => (
        <Radio.Group
          className="series-settings-y-axis"
          value={item.yAxis === 1 ? 1 : 0}
          onChange={event => updateSeriesOption(item.key, "yAxis", event.target.value)}>
          <Radio value={0} data-test={`Chart.Series.${item.key}.UseLeftAxis`}>
            слева
          </Radio>
          <Radio value={1} data-test={`Chart.Series.${item.key}.UseRightAxis`}>
            справа
          </Radio>
        </Radio.Group>
      ),
    });
    result.push({
      title: "Тип",
      dataIndex: "type",
      render: (item) => (
        <ChartTypeSelect
          data-test={`Chart.Series.${item.key}.Type`}
          dropdownMatchSelectWidth={false}
          value={item.type}
          onChange={value => updateSeriesOption(item.key, "type", value)}
        />
      ),
    });
  }

  return result;
}

export default function SeriesSettings({ options, data, onOptionsChange }) {
  const series = useMemo(
    () =>
      map(
        getChartData(data.rows, options), // returns sorted series
        ({ name }, zIndex) =>
          extend({ key: name, type: options.globalSeriesType }, options.seriesOptions[name], { zIndex })
      ),
    [options, data]
  );

  const handleSortEnd = useCallback(
    ({ oldIndex, newIndex }) => {
      const seriesOptions = [...series];
      seriesOptions.splice(newIndex, 0, ...seriesOptions.splice(oldIndex, 1));
      onOptionsChange({ seriesOptions: fromPairs(map(seriesOptions, ({ key }, zIndex) => [key, { zIndex }])) });
    },
    [onOptionsChange, series]
  );

  const updateSeriesOption = useCallback(
    (key, prop, value) => {
      onOptionsChange({
        seriesOptions: {
          [key]: {
            [prop]: value,
          },
        },
      });
    },
    [onOptionsChange]
  );
  const [debouncedUpdateSeriesOption] = useDebouncedCallback(updateSeriesOption, 200);

  const columns = useMemo(() => getTableColumns(options, updateSeriesOption, debouncedUpdateSeriesOption), [
    options,
    updateSeriesOption,
    debouncedUpdateSeriesOption,
  ]);

  return (
    <SortableContainer
      axis="y"
      lockAxis="y"
      lockToContainerEdges
      useDragHandle
      helperClass="chart-editor-series-dragged-item"
      helperContainer={container => container.querySelector("tbody")}
      onSortEnd={handleSortEnd}
      containerProps={{
        className: "chart-editor-series",
      }}>
      <Table
        dataSource={series}
        columns={columns}
        components={{
          body: {
            row: SortableBodyRow,
          },
        }}
        onRow={item => ({ index: item.zIndex })}
        pagination={false}
      />
    </SortableContainer>
  );
}

SeriesSettings.propTypes = EditorPropTypes;
