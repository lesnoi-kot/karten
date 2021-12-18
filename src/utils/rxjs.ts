import { Observable } from "rxjs";
import { tap, toArray } from "rxjs/operators";

export const observableToArray = async <T>(o: Observable<T>): Promise<T[]> =>
  new Promise((resolve) => {
    o.pipe(toArray()).subscribe((items) => {
      resolve(items);
    });
  });

export const getReturnedValues = <T>(
  o: Observable<T>
): [Observable<T>, T[]] => {
  const returnedValues: T[] = [];

  const oo = o.pipe(
    tap((value) => {
      returnedValues.push(value);
    })
  );

  return [oo, returnedValues];
};

export const kickOff = (o: Observable<any>) => {
  let notifyCompleted: () => void, notifyError: (error: any) => void;

  const completed = new Promise<void>((resolve, reject) => {
    notifyCompleted = resolve;
    notifyError = reject;
  });

  const subscription = o.subscribe({
    complete() {
      notifyCompleted();
    },
    error(error) {
      notifyError(error);
    },
  });

  return { subscription, completed };
};
