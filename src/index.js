import xs from 'xstream';
import Cycle from '@cycle/xstream-run';
import { makeDOMDriver, div, a } from '@cycle/dom';
import { routerDriver } from './routerDriver';

function HomeComponent(sources) {
  const router = sources.DOM.select('a').events('click')
    .debug(ev => ev.preventDefault())
    .map(ev => ev.target.pathname)

  return {
    DOM: xs.of(a({ props: { href: '/other' } }, 'Link to Other')),
    router
  }
}

function OtherComponent(sources) {
  const router = sources.DOM.select('a').events('click')
    .debug(ev => ev.preventDefault())
    .map(ev => ev.target.pathname)

  return {
    DOM: xs.of(a({ props: { href: '/' } }, 'Link to Home')),
    router
  }

}

function main(sources) {
  const match$ = sources.router.define({
    '/': HomeComponent,
    '/other': OtherComponent
  });

  const page$ = match$.map(({path, value}) => {
    return value(Object.assign({}, sources, {
      router: sources.router.path(path)
    }));
  });

  return {
    DOM: page$.map(c => c.DOM).flatten(),
    router: page$.map(c => c.router).flatten()
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#app'),
  router: routerDriver
});