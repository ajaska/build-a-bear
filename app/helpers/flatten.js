export function flatten(arr) {
  if (arr.length === 0) {
    return [];
  }

  return arr.reduce((a, b) => a.concat(b));
}
