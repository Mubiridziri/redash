import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import GroupsSettings from "./GroupsSettings";
import FormatSettings from "./FormatSettings";
import StyleSettings from "./StyleSettings";

export default createTabbedEditor([
  { key: "General", title: "Общие", component: GeneralSettings },
  { key: "Groups", title: "Группы", component: GroupsSettings },
  { key: "Format", title: "Формат", component: FormatSettings },
  { key: "Style", title: "Стиль", component: StyleSettings },
]);
