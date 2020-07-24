import React from "react";
import PropTypes from "prop-types";
import BigMessage from "@/components/BigMessage";
import NoTaggedObjectsFound from "@/components/NoTaggedObjectsFound";
import EmptyState from "@/components/empty-state/EmptyState";

export default function QueriesListEmptyState({ page, searchTerm, selectedTags }) {
  if (searchTerm !== "") {
    return <BigMessage message="Извините, мы ничего не смогли найти." icon="fa-search" />;
  }
  if (selectedTags.length > 0) {
    return <NoTaggedObjectsFound objectType="queries" tags={selectedTags} />;
  }
  switch (page) {
    case "favorites":
      return <BigMessage message="Отметьте запросы как избранные, чтобы они оказались здесь." icon="fa-star" />;
    case "archive":
      return <BigMessage message="Архивные запросы будут перечислены здесь." icon="fa-archive" />;
    case "my":
      return (
        <div className="tiled bg-white p-15">
          <a href="queries/new" className="btn btn-primary btn-sm">
            Создайте свой первый запрос
          </a>{" "}
          чтобы заполнить мой список запросов. Нужна помощь? Ознакомьтесь с нашей{" "}
          <a href="https://redash.io/help/user-guide/querying/writing-queries">документацией по написанию запросов</a>.
        </div>
      );
    default:
      return (
        <EmptyState
          icon="fa fa-code"
          illustration="query"
          description="Получение данных из ваших источников данных."
          helpLink="https://help.redash.io/category/21-querying"
        />
      );
  }
}

QueriesListEmptyState.propTypes = {
  page: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};
