import { of, Subject } from "rxjs";
import { StateObservable } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { createMemoryHistory } from "history";

import { sleep } from "utils/async";
import { getReturnedValues, kickOff } from "utils/rxjs";
import { RootState } from "app";
import { MockAPI } from "services/api";
import mock from "services/api/mocks";
import { rootReducer } from "app/reducers";
import { selectTaskIds } from "app/taskLists/selectors";
import { tasksDeleted } from "app/tasks";

import { taskListClearEpic } from "../taskListsEpics";
import { actions } from "../slice";

jest.mock("app/taskLists/selectors");

describe("app/apiInteraction/taskListsEpics", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  const history = createMemoryHistory();
  const store = configureStore({
    reducer: rootReducer,
  });
  const store$ = new StateObservable<RootState>(
    new Subject(),
    store.getState(),
  );
  const api = new MockAPI(mock);
  const epicsDeps = { api, history };

  it("taskListClearEpic - optimistic update", async () => {
    api.deleteTasks = async (args: any) => {
      await sleep(500);
    };

    (
      selectTaskIds as jest.MockedFunction<typeof selectTaskIds>
    ).mockReturnValueOnce(["a", "b", "c"]);

    const inputActions = of(actions.clearTaskListRequest("test"));
    const [outputActions$, returnedValues] = getReturnedValues(
      taskListClearEpic(inputActions, store$, epicsDeps),
    );

    const { completed } = kickOff(outputActions$);
    expect(returnedValues).toEqual([tasksDeleted(["a", "b", "c"])]);

    jest.advanceTimersByTime(600);
    await completed;

    expect(returnedValues).toEqual([
      tasksDeleted(["a", "b", "c"]),
      actions.deleteTasksRequestLoaded(),
    ]);
  });
});
