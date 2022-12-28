/* eslint-disable security/detect-object-injection */
/*
 *  Copyright (c) 2018-present, Evgeny Nadymov
 *
 * This source code is licensed under the GPL v.3.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AnyValue } from '@mv-d/toolbelt';

type Event = AnyValue;
type Listener = (...args: AnyValue[]) => void;
type Observer = (...args: AnyValue[]) => void;

export class EventEmitter {
  observers: Record<Event, Observer[]> = {};

  constructor() {
    this.observers = {};
  }

  on(events: string, listener: Listener) {
    events.split(' ').forEach(event => {
      this.observers[event] = this.observers[event] || [];
      this.observers[event].push(listener);
    });
    return this;
  }

  off(event: Event, listener: Listener) {
    if (!this.observers[event]) return;

    if (!listener) {
      delete this.observers[event];
      return;
    }

    this.observers[event] = this.observers[event].filter(l => l !== listener);
  }

  emit(event: Event, ...args: unknown[]) {
    if (this.observers[event]) {
      [...this.observers[event]].forEach(observer => {
        observer(...args);
      });
    }

    if (this.observers['*']) {
      [...this.observers['*']].forEach(observer => {
        observer.apply(observer, [event, ...args]);
      });
    }
  }
}
