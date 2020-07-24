import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import ColorsSettings from "./ColorsSettings";
import FormatSettings from "./FormatSettings";
import BoundsSettings from "./BoundsSettings";

export default createTabbedEditor([
  { key: "General", title: "Общее", component: GeneralSettings },
  { key: "Colors", title: "Цвета", component: ColorsSettings },
  { key: "Format", title: "Формат", component: FormatSettings },
  { key: "Bounds", title: "Границы", component: BoundsSettings },
]);
