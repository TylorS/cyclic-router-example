import { createHistory } from 'prehistoric';
import xs from 'xstream';

export function historyDriver(sink$) {
  const { push, replace, go, history } = createHistory();

  sink$.addListener({
    next: function (input) {
      if (typeof input === 'string')
        return push(input);

      if (input.type === 'push')
        return push(input.path, input.state);

      if (input.type === 'replace')
        return replace(input.path, input.state);

      if (input.type === 'go')
        return go(input.amount);

      if (input.type === 'goBack')
        return go(-1);

      if (input.type === 'goForward')
        return go(1);
    }
  });

  return xs.fromObservable(history).remember();
}