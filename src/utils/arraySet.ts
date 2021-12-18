export function removeOneIn(
  array: any[] | null | undefined,
  needle: any
): void {
  if (!array) {
    return;
  }

  const idx = array.indexOf(needle);

  if (idx >= 0) {
    array.splice(idx, 1);
  }
}

export function removeManyIn(
  array: any[] | null | undefined,
  needles: any[]
): void {
  if (!array) {
    return;
  }

  for (const needle of needles) {
    const idx = array.indexOf(needle);

    if (idx >= 0) {
      array.splice(idx, 1);
    }
  }
}

export function addOneIn(array: any[] | null | undefined, needle: any): any[] {
  if (!array) {
    return [];
  }

  array.push(needle);
  return array;
}
