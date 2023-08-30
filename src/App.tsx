import { useState } from "react";
import { useAtom } from "jotai";
import "./styles.css";
import { cellFamily } from "./atoms";

const Cell = ({ id }: { id: string }) => {
  const [editing, setEditing] = useState(false);
  const [{ exp, val }, setExp] = useAtom(cellFamily(id));
  const onDone = (e: any) => {
    setExp(e.target.value);
    setEditing(false);
  };
  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      onDone(e);
    }
  };
  return (
    <td onClick={() => setEditing(true)}>
      {editing ? (
        <input
          defaultValue={exp}
          autoFocus
          onBlur={onDone}
          onKeyPress={onKeyPress}
        />
      ) : (
        val
      )}
    </td>
  );
};

const COLUMNS = Array.from(Array(26).keys()).map((i) =>
  String.fromCharCode("A".charCodeAt(0) + i)
);

const ROWS = Array.from(Array(100).keys()).map((i) => String(i));

const Cells = () => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          {COLUMNS.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r}>
            <th>{r}</th>
            {COLUMNS.map((c) => (
              <Cell key={`${c}${r}`} id={`${c}${r}`} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const App = () => (
  <div className="App">
    <Cells />
  </div>
);

export default App;
