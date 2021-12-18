import "jest";

type ID = string | number;

type Item = {
  value: string;
  id: ID;
};

const genItems = (values: string): Item[] =>
  Array.from(values).map((char) => ({ value: char, id: char }));

const items2String = (items: Item[]) =>
  items.map((item) => item.value).join("");

function move(items: Item[], id: ID, afterId: ID | null): Item[] {
  const isAfter =
    items.findIndex((item) => item.id === id) >
    items.findIndex((item) => item.id === afterId);

  //

  return [];
}

describe("Список элементов", () => {
  describe("Изменение порядка", () => {
    it("Перенести c на место b", () => {
      const items = genItems("abcd");
      const items2 = move(items, "c", "a");

      expect(items2String(items2)).toEqual("acbd");
    });
  });
});
