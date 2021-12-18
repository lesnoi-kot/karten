import { normalizeBoards } from "../boards/utils";

describe("Check normalizr scheme", () => {
  it("Parse boards DTO", () => {
    const input = [
      {
        id: "1",
        taskLists: [
          {
            id: "A",
            boardId: "1",
            tasks: [
              {
                id: "1",
                taskListId: "A",
                comments: [],
              },
              {
                id: "2",
                taskListId: "A",
                comments: [],
              },
            ],
          },
          {
            id: "B",
            boardId: "1",
            tasks: [
              {
                id: "4",
                taskListId: "B",
                comments: [],
              },
            ],
          },
        ],
      },
      {
        id: "2",
        taskLists: [],
      },
    ];
    const output = normalizeBoards(input).entities;

    expect(output.boards).toEqual({
      1: {
        id: "1",
        taskLists: ["A", "B"],
      },
      2: {
        id: "2",
        taskLists: [],
      },
    });

    expect(output.taskLists).toEqual({
      A: {
        id: "A",
        boardId: "1",
        tasks: ["1", "2"],
      },
      B: {
        id: "B",
        boardId: "1",
        tasks: ["4"],
      },
    });

    expect(output.tasks).toEqual({
      1: {
        id: "1",
        taskListId: "A",
        comments: [],
      },
      2: {
        id: "2",
        taskListId: "A",
        comments: [],
      },
      4: {
        id: "4",
        taskListId: "B",
        comments: [],
      },
    });
  });
});
