import { useCallback } from "react";
import useUpdateQuery from "./useUpdateQuery";
import recordEvent from "@/services/recordEvent";
import { clientConfig } from "@/services/auth";

export default function useRenameQuery(query, onChange) {
  const updateQuery = useUpdateQuery(query, onChange);

  return useCallback(
    name => {
      recordEvent("edit_name", "query", query.id);
      const changes = { name };
      const options = {};

      if (query.is_draft && clientConfig.autoPublishNamedQueries && name !== "Новый запрос") {
        changes.is_draft = false;
        options.successMessage = "Запрос сохранен и опубликован";
      }

      updateQuery(changes, options);
    },
    [query.id, query.is_draft, updateQuery]
  );
}
