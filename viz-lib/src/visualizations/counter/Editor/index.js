import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import FormatSettings from "./FormatSettings";

export default createTabbedEditor([
  { key: "General", title: "Общее", component: GeneralSettings },
  { key: "Format", title: "Формат", component: FormatSettings },
]);
