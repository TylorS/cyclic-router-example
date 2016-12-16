import Cycle from '@cycle/xstream-run';
import { makeDOMDriver, div, a } from '@cycle/dom';
import switchPath from 'switch-path';
import { historyDriver } from './historyDriver';

export function routerDriver(sink$) {
  return new RouterSource(historyDriver(sink$), []);
}

class RouterSource {
  constructor(_history$, _previousRoutes) {
    this._history$ = _history$
    this._previousRoutes = _previousRoutes
  }

  history() {
    return this._history$;
  }

  path(path) {
    const scopedNamespace =
      this._previousRoutes.concat(splitPath(path));

    const scopedHistory$ =
      this._history$.filter(isStrictlyInScope(scopedNamespace)).remember()

    return new RouterSource(scopedHistory$, scopedNamespace);
  }

  define(routes) {
    const previousRoutes = this._previousRoutes;
    const createHref = this.createHref.bind(this);

    return this._history$
      .map(function matchRoute(location) {
        const filteredPath = getFilteredPath(previousRoutes, location.path);
        const { path, value } = switchPath(filteredPath, routes)
        return { path, value, location, createHref };
      })
      .remember()
  }

  createHref(path) {
    const previousRoutes = this._previousRoutes;

    if (previousRoutes.length === 0)
      return pathJoin(['/', path]);

    return pathJoin(['/', ...previousRoutes, path]);
  }
}

function isStrictlyInScope(namespace) {
  return function (location) {
    const pathParts = splitPath(location.path);
    return namespace.every((v, i) => pathParts[i] === v);
  };
}

function getFilteredPath(namespace, path) {
  return '/' + filterPath(splitPath(path), namespace);
}

function getUnfilteredPath(namespace, path) {
  return path.replace(getFilteredPath(namespace, path), '');
};

function newLocation(location, pathname) {
  const l = {};

  const keys =
    Object.keys(location);

  for (let i = 0; i < keys.length; ++i) {
    l[keys[i]] = location[keys[i]];
  }

  l.pathname = pathname;

  return l;
}

function splitPath(path) {
  return path.split('/').filter(p => p.length > 0);
}

function filterPath(pathParts, namespace) {
  return pathParts.filter(part => namespace.indexOf(part) < 0).join('/');
}

function pathJoin(parts) {
   const replace = new RegExp('/{1,}', 'g');
   return parts.join('/').replace(replace, '/');
}
