import React from "react";
import enzyme from "enzyme";

import getOptions from "../getOptions";
import YAxisSettings from "./YAxisSettings";

function findByTestID(wrapper, testId) {
  return wrapper.find(`[data-test="${testId}"]`);
}

function elementExists(wrapper, testId) {
  return findByTestID(wrapper, testId).length > 0;
}

function mount(options, done) {
  options = getOptions(options);
  return enzyme.mount(
    <YAxisSettings
      visualizationName="Test"
      data={{ columns: [], rows: [] }}
      options={options}
      onOptionsChange={changedOptions => {
        expect(changedOptions).toMatchSnapshot();
        done();
      }}
    />
  );
}

describe("Visualizations -> Chart -> Editor -> Y-Axis Settings", () => {
  test("Изменяет тип оси", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      },
      done
    );

    findByTestID(el, "Chart.LeftYAxis.Type")
      .last()
      .simulate("click");
    findByTestID(el, "Chart.LeftYAxis.Type.Category")
      .last()
      .simulate("click");
  });

  test("Изменение имени оси", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      },
      done
    );

    findByTestID(el, "Chart.LeftYAxis.Name")
      .last()
      .simulate("change", { target: { value: "test" } });
  });

  test("Изменение минимального значения оси", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      },
      done
    );

    findByTestID(el, "Chart.LeftYAxis.RangeMin")
      .find("input")
      .last()
      .simulate("change", { target: { value: "50" } });
  });

  test("Changes axis max value", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      },
      done
    );

    findByTestID(el, "Chart.LeftYAxis.RangeMax")
      .find("input")
      .last()
      .simulate("change", { target: { value: "200" } });
  });

  describe("for non-heatmap", () => {
    test("Правая ось Y должна быть доступна", () => {
      const el = mount({
        globalSeriesType: "column",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      });

      expect(elementExists(el, "Chart.RightYAxis.Type")).toBeTruthy();
    });
  });

  describe("for heatmap", () => {
    test("Правая ось Y не должна быть доступна", () => {
      const el = mount({
        globalSeriesType: "heatmap",
        yAxis: [{ type: "linear" }, { type: "linear", opposite: true }],
      });

      expect(elementExists(el, "Chart.RightYAxis.Type")).toBeFalsy();
    });

    test("Устанавливает параметр Сортировать значения X", done => {
      const el = mount(
        {
          globalSeriesType: "heatmap",
          sortY: false,
        },
        done
      );

      findByTestID(el, "Chart.LeftYAxis.Sort")
        .last()
        .simulate("click");
    });

    test("Параметр устанавливает обратные значения Y", done => {
      const el = mount(
        {
          globalSeriesType: "heatmap",
          reverseY: false,
        },
        done
      );

      findByTestID(el, "Chart.LeftYAxis.Reverse")
        .last()
        .simulate("click");
    });
  });
});
