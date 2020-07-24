import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import ColumnsSettings from "./ColumnsSettings";
import GridSettings from "./GridSettings";

import "./editor.less";

export default createTabbedEditor([
  { key: "Columns", title: "Столбцы", component: ColumnsSettings },
  { key: "Grid", title: "Сетка", component: GridSettings },
]);
