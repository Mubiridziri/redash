import React from "react";
import BigMessage from "@/components/BigMessage";

// Default "list empty" message for list pages
export default function EmptyState(props) {
  return (
    <div className="text-center">
      <BigMessage icon="fa-search" message="К сожалению, мы ничего не смогли найти." {...props} />
    </div>
  );
}
