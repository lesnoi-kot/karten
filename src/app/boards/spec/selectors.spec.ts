import { RootState } from "app";

import { selectBoardsIds } from "../selectors";

const store: RootState = {
  apiInteraction: {
    requestsInfo: {},
  },
  entities: {
    projects: {
      items: {
        sadPoe: {
          id: "1",
          name: "Board of sad Poe",
          avatarThumbnailURL: "",
          avatarURL: "",
        },
      },
    },
    boards: {
      items: {
        "1": {
          id: "1",
          projectId: "sadPoe",
          name: "Book ideas",
          favorite: false,
          archived: false,
          dateCreated: "2022-08-25T15:26:59.673Z",
          dateLastViewed: "2022-08-25T15:27:00.890Z",
          coverURL: "",
          color: "",
        },
      },
    },
    taskLists: {
      items: {
        A: {
          id: "A",
          boardId: "1",
          name: "To do",
          position: 1000,
          archived: false,
          dateCreated: "2022-08-25T15:26:59.673Z",
          color: "",
        },
        B: {
          id: "B",
          boardId: "1",
          name: "In progress",
          position: 2000,
          archived: false,
          dateCreated: "2022-08-25T15:26:59.673Z",
          color: "",
        },
        C: {
          id: "C",
          boardId: "1",
          name: "Done",
          position: 0,
          archived: false,
          dateCreated: "2022-08-25T15:26:59.673Z",
          color: "",
        },
      },
    },
    tasks: {
      items: {
        "1": {
          id: "1",
          taskListId: "A",
          position: 10000,
          name: "1 - Rework scenario",
          text: "Think about my new bestseller",
          dateCreated: "2022-08-25T15:26:59.673Z",
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "2": {
          id: "2",
          taskListId: "A",
          position: 20000,
          name: "2 - Clean house",
          text: "It's mess here!",
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "3": {
          id: "3",
          taskListId: "A",
          position: 30000,
          name: "3 - Mow the lawn",
          text: "It's pretty bad looking...",
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "4": {
          id: "4",
          taskListId: "B",
          name: "Developing Karten",
          text: "...",
          position: 100,
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "5": {
          id: "5",
          taskListId: "C",
          name: "Made a cup of great, no really, great tea!",
          text: "...",
          position: 200,
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "6": {
          id: "6",
          taskListId: "A",
          position: 40000,
          name: "6 - Nail with hammer",
          text: "...",
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
        "7": {
          id: "7",
          taskListId: "A",
          position: 50000,
          name: "7 - Get a smoke",
          text: "Gotta get high",
          dateCreated: "2022-08-25T15:26:59.673Z",
          comments: [],
          dueDate: "2022-08-25T15:26:59.673Z",
        },
      },
    },
    comments: {
      items: {
        "6w49_vkNIZtfYP9X0goV9": {
          id: "6w49_vkNIZtfYP9X0goV9",
          taskId: "1",
          author: "yuko",
          text: "To do or not TO DO?",
          dateCreated: "2022-08-25T15:26:59.673Z",
        },
        PO8tRIBdI4nkwFm5JW0XT: {
          id: "PO8tRIBdI4nkwFm5JW0XT",
          taskId: "1",
          author: "yuko",
          text: "Go go go guys",
          dateCreated: "2022-08-25T15:26:59.673Z",
        },
      },
    },
  },
  pages: {
    board: {
      boardId: "1",
      selectedTaskId: null,
      shouldRedirectToProject: false,
    },
  },
  widgets: {
    confirmDialog: {
      isOpen: false,
      title: "",
      text: "",
      okButtonText: "",
      cancelButtonText: "",
      okAction: null,
    },
    snackbars: {
      isOpen: false,
      message: "",
      type: "info",
    },
    drawerMenu: {
      isOpen: false,
    },
  },
};

describe("app/boards/selectors.ts", () => {
  it("selectBoardsIds", () => {
    expect(selectBoardsIds(store)).toEqual(["1"]);
  });
});
