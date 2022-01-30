import { useEffect, useState } from "react";
import logo from "./logo.svg";
import styled from "styled-components";
import "./App.css";
import { SlotState } from "./SlotState.ts";

function App() {
  const [wordGrid, setWordGrid] = useState([]);
  const NUM_GUESSES = 6;
  const WORD_SIZE = 5;

  useEffect(() => {
    function initializeWordGrid() {
      let newWordGrid = [];
      //create the rows (from guesses)
      for (let i = 0; i < NUM_GUESSES; i++) {
        newWordGrid.push([]);
      }

      //initialize empty spots
      for (let i = 0; i < NUM_GUESSES; i++) {
        for (let j = 0; j < WORD_SIZE; j++) {
          newWordGrid[i].push({ letter: "a", state: SlotState.empty });
        }
      }

      setWordGrid(newWordGrid);
    }
    if (wordGrid.length === 0) {
      initializeWordGrid();
    }
  });

  return (
    <Div>
      {wordGrid.map((row) => (
        <RowWrapper>
          {row.map((col) => (
            <div> {col.letter}</div>
          ))}
        </RowWrapper>
      ))}
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export default App;
