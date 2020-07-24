import { createParameter } from "..";
import { getDynamicDateFromString } from "../DateParameter";
import moment from "moment";

describe("DateParameter", () => {
  let type = "date";
  let param;

  beforeEach(() => {
    param = createParameter({ name: "param", title: "Param", type });
  });

  describe("getExecutionValue", () => {
    beforeEach(() => {
      param.setValue(moment("2019-10-06 10:00:00"));
    });

    test("форматирует значение в виде Строковой даты", () => {
      const executionValue = param.getExecutionValue();
      expect(executionValue).toBe("2019-10-06");
    });

    describe("type is datetime-local", () => {
      beforeAll(() => {
        type = "datetime-local";
      });

      test("форматирует значение в виде строки datetime", () => {
        const executionValue = param.getExecutionValue();
        expect(executionValue).toBe("2019-10-06 10:00");
      });
    });

    describe("type is datetime-with-seconds", () => {
      beforeAll(() => {
        type = "datetime-with-seconds";
      });

      test("форматирует значение в виде строки datetime с секундами", () => {
        const executionValue = param.getExecutionValue();
        expect(executionValue).toBe("2019-10-06 10:00:00");
      });
    });
  });

  describe("normalizeValue", () => {
    test("распознает даты из строк", () => {
      const normalizedValue = param.normalizeValue("2019-10-06");
      expect(moment.isMoment(normalizedValue)).toBeTruthy();
      expect(normalizedValue.format("YYYY-MM-DD")).toBe("2019-10-06");
    });

    test("распознает даты по значениям моментов", () => {
      const normalizedValue = param.normalizeValue(moment("2019-10-06"));
      expect(moment.isMoment(normalizedValue)).toBeTruthy();
      expect(normalizedValue.format("YYYY-MM-DD")).toBe("2019-10-06");
    });

    test("нормализует нераспознанные значения как ноль", () => {
      const normalizedValue = param.normalizeValue("value");
      expect(normalizedValue).toBeNull();
    });

    describe("Dynamic values", () => {
      test("распознает динамические значения из строкового индекса", () => {
        const normalizedValue = param.normalizeValue("d_now");
        expect(normalizedValue).not.toBeNull();
        expect(normalizedValue).toEqual(getDynamicDateFromString("d_now"));
      });

      test("распознает динамические значения из динамической даты", () => {
        const dynamicDate = getDynamicDateFromString("d_now");
        const normalizedValue = param.normalizeValue(dynamicDate);
        expect(normalizedValue).not.toBeNull();
        expect(normalizedValue).toEqual(dynamicDate);
      });
    });
  });
});
