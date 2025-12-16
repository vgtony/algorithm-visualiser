import { useState } from "react";
import "./BubbleSort.css";

const BubbleSort = () => {
  const [arr, setArr] = useState<number[]>(() =>
    Array.from({ length: 12 }, () => Math.floor(Math.random() * 101))
  );

  const generateRandomArray = () => {
    const randomArr = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 101)
    );
    setArr(randomArr);
  };

  const startSort = async () => {
    const sortedArr = [...arr];
    let temp = 0;
    const n = sortedArr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (sortedArr[j] > sortedArr[j + 1]) {
          temp = sortedArr[j];
          sortedArr[j] = sortedArr[j + 1];
          sortedArr[j + 1] = temp;
          setArr([...sortedArr]); // Update to show each step
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms between steps
        }
      }
    }
  };

  return (
    <div className="bubble-sort-container">
      <h1>Bubble Sort</h1>
      <div className="controls">
        <button onClick={generateRandomArray}>Generate Random Array</button>
        <button onClick={startSort}>Start Sorting</button>
      </div>
      <div className="arrayBar">
        {arr.map((value, index) => (
          <div
            key={index}
            data-value={value}
            style={{ height: `${value * 5 + 6}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BubbleSort;
