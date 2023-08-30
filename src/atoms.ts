import { atom, Getter } from "jotai";
import { atomFamily } from "jotai/utils";

const baseCellFamily = atomFamily(() => atom(""));

const evalCell = (exp: string, getCellVal: (cellId: string) => unknown) => {
  if (!exp.startsWith("=")) {
    return exp;
  }
  try {
    // eslint-disable-next-line no-new-func
    const fn = Function(
      "get",
      `
      return ${exp
        .slice(1)
        .replace(/\b([A-Z]\d{1,2})\b/g, (m) => `get('${m}')`)};
      `
    );
    return fn((cellId: string) => {
      const val = getCellVal(cellId);
      const num = Number(val);
      return Number.isFinite(num) ? num : val;
    });
  } catch (e) {
    return `#ERROR ${e}`;
  }
};

export const cellFamily = atomFamily((cellId: string) =>
  atom(
    (get) => {
      const exp = get(baseCellFamily(cellId));
      const val = evalCell(exp, (cellId) => get(cellFamily(cellId)).val);
      return { exp, val };
    },
    (_get, set, exp: string) => {
      set(baseCellFamily(cellId), exp);
    }
  )
);
