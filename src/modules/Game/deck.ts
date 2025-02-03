import _ from "lodash";

export function initDummy() {
  const dummy = Array.from({ length: 98 }, (_, i) => i + 2);

  return _.shuffle(dummy);
}

export function popDummy(dummy: number[]): [number, number[]] | [null] {
  if (dummy.length === 0) {
    console.log("dummy is empty");
    return [null];
  }

  return [dummy[0], dummy.slice(1)];
}
