import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";

export default createTabbedEditor([
  { key: "General", title: "Общее", component: GeneralSettings },
  { key: "Appearance", title: "Внешность", component: AppearanceSettings },
]);
