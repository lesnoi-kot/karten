import { of, Subject } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { StateObservable, ActionsObservable } from "redux-observable";
import { configureStore } from "@reduxjs/toolkit";
import { createMemoryHistory } from "history";

import { sleep } from "utils/async";
import { getReturnedValues, observableToArray, kickOff } from "utils/rxjs";
import { RootState } from "app";
import { MockAPI } from "services/api";
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
    store.getState()
  );
  const api = new MockAPI("sadPoe");
  const epicsDeps = { api, history };

  it("taskListClearEpic - optimistic update", async () => {
    api.deleteTasks = async (args: any) => {
      await sleep(500);
      return { data: null, error: null };
    };

    (
      selectTaskIds as jest.MockedFunction<typeof selectTaskIds>
    ).mockReturnValueOnce(["a", "b", "c"]);

    const inputActions = ActionsObservable.of(
      actions.clearTaskListRequest({ taskListId: "test" })
    );
    const [outputActions$, returnedValues] = getReturnedValues(
      taskListClearEpic(inputActions, store$, epicsDeps)
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
