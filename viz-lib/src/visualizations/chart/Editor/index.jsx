/* eslint-disable react/prop-types */
import React from "react";
import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import XAxisSettings from "./XAxisSettings";
import YAxisSettings from "./YAxisSettings";
import SeriesSettings from "./SeriesSettings";
import ColorsSettings from "./ColorsSettings";
import DataLabelsSettings from "./DataLabelsSettings";
import CustomChartSettings from "./CustomChartSettings";

import "./editor.less";

const isCustomChart = options => options.globalSeriesType === "custom";
const isPieChart = options => options.globalSeriesType === "pie";

export default createTabbedEditor([
  {
    key: "General",
    title: "Общее",
    component: props => (
      <React.Fragment>
        <GeneralSettings {...props} />
        {isCustomChart(props.options) && <CustomChartSettings {...props} />}
      </React.Fragment>
    ),
  },
  {
    key: "XAxis",
    title: "X Ось",
    component: XAxisSettings,
    isAvailable: options => !isCustomChart(options) && !isPieChart(options),
  },
  {
    key: "YAxis",
    title: "Y Ось",
    component: YAxisSettings,
    isAvailable: options => !isCustomChart(options) && !isPieChart(options),
  },
  {
    key: "Series",
    title: "Серии",
    component: SeriesSettings,
    isAvailable: options => !isCustomChart(options),
  },
  {
    key: "Colors",
    title: "Цвета",
    component: ColorsSettings,
    isAvailable: options => !isCustomChart(options),
  },
  {
    key: "DataLabels",
    title: "Метки данных",
    component: DataLabelsSettings,
    isAvailable: options => !isCustomChart(options),
  },
]);
