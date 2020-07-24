import moment from "moment";
import { isFunction } from "lodash";

// Ensure that this image will be available in assets folder
import "@/assets/images/avatar.svg";

// Register visualizations
import "@redash/viz/lib";

// Register routes before registering extensions as they may want to override some
import "@/pages";

import "./antd-spinner";

moment.updateLocale("en", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: "прямо сейчас",
    m: "мин. назад",
    mm: "%d мин. назад",
    h: "час назад",
    hh: "%d часа назад",
    d: "день назад",
    dd: "%d дня назад",
    M: "месяц назад",
    MM: "%d месяцев назад",
    y: "год назад",
    yy: "%d лет назад",
  },
});

function requireImages() {
  // client/app/assets/images/<path> => /images/<path>
  const ctx = require.context("@/assets/images/", true, /\.(png|jpe?g|gif|svg)$/);
  ctx.keys().forEach(ctx);
}

function registerExtensions() {
  const context = require.context("extensions", true, /^((?![\\/.]test[\\./]).)*\.jsx?$/);
  const modules = context
    .keys()
    .map(context)
    .map(module => module.default);

  return modules
    .filter(isFunction)
    .filter(f => f.init)
    .map(f => f());
}

requireImages();
registerExtensions();
