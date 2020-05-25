import { boardItemData } from "../components/boards/Board/Board";
import { cloneDeep } from "lodash";
import { getOptionalItemsForNextMove, makeMove } from "./logic";

export const replace2Items = (item1: boardItemData, item2: boardItemData) => {
  const item1Value = item1.value;
  item1.value = item2.value;
  item2.value = item1Value;
};

function getRandomFromArray(items: []) {
  return items[Math.floor(Math.random() * items.length)];
}

export function moveRandomOnce(board: boardItemData[][]): boardItemData[][] {
  let copy = cloneDeep(board);
  const options = getOptionalItemsForNextMove(copy);
  const rndItem = getRandomFromArray(options);
  return makeMove(copy, rndItem);
}

// shuffle policy is a bit of brut force but safe. The board is actually
// making 200 moves on the actual board, each move is random from the current optional
// moves
export const shuffleArray = (board: boardItemData[][]): boardItemData[][] => {
  let copy = cloneDeep(board);
  const shuffleVolume = 2;
  for (var i = 0; i < shuffleVolume; i++) {
    copy = moveRandomOnce(copy);
  }
  return copy;
};

export const printBoard = (board: boardItemData[][]) => {
  console.log(">>>>        [*************************] ");
  board.forEach((line) => {
    console.log(
      ">>>> ",
      line.map((i) => `${i.value}-${i.index} -> R${i.allowedDirection}`)
    );
  });
  console.log(">>>>        [*************************] ");
};

export const convertToBoardItems = (
  data: [][],
  index: number
): boardItemData[][] => {
  const fill = [];
  data.forEach((line) => {
    line.forEach((item) => {
      const bi: boardItemData = { value: item, index: 1 };
      return bi;
    });
  });
  return data;
};

export enum directions {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export const pad = (n: number) => {
  if (n >= 100) {
    n = Math.round(n / 10);
  }
  return n < 10 ? "0" + n : n;
};
export const msToTime = (s: number) => {
  // Pad to 2 or 3 digits, default is 2
  let ms = s % 1000;
  s = (s - ms) / 1000;
  let secs = s % 60;
  s = (s - secs) / 60;
  let mins = s % 60;
  let hrs = (s - mins) / 60;
  return pad(mins) + ":" + pad(secs) + "." + pad(ms);
};
