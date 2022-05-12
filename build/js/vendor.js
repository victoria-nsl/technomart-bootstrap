/*!
  * Bootstrap v5.0.1 (https://getbootstrap.com/)
  * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@popperjs/core')) :
  typeof define === 'function' && define.amd ? define(['@popperjs/core'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.bootstrap = factory(global.Popper));
}(this, (function (Popper) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/selector-engine.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NODE_TEXT = 3;
  const SelectorEngine = {
    find(selector, element = document.documentElement) {
      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
    },

    findOne(selector, element = document.documentElement) {
      return Element.prototype.querySelector.call(element, selector);
    },

    children(element, selector) {
      return [].concat(...element.children).filter(child => child.matches(selector));
    },

    parents(element, selector) {
      const parents = [];
      let ancestor = element.parentNode;

      while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
        if (ancestor.matches(selector)) {
          parents.push(ancestor);
        }

        ancestor = ancestor.parentNode;
      }

      return parents;
    },

    prev(element, selector) {
      let previous = element.previousElementSibling;

      while (previous) {
        if (previous.matches(selector)) {
          return [previous];
        }

        previous = previous.previousElementSibling;
      }

      return [];
    },

    next(element, selector) {
      let next = element.nextElementSibling;

      while (next) {
        if (next.matches(selector)) {
          return [next];
        }

        next = next.nextElementSibling;
      }

      return [];
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;
  const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  const toType = obj => {
    if (obj === null || obj === undefined) {
      return `${obj}`;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  };
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  const getUID = prefix => {
    do {
      prefix += Math.floor(Math.random() * MAX_UID);
    } while (document.getElementById(prefix));

    return prefix;
  };

  const getSelector = element => {
    let selector = element.getAttribute('data-bs-target');

    if (!selector || selector === '#') {
      let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
      // `document.querySelector` will rightfully complain it is invalid.
      // See https://github.com/twbs/bootstrap/issues/32273

      if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
        return null;
      } // Just in case some CMS puts out a full URL with the anchor appended


      if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
        hrefAttr = `#${hrefAttr.split('#')[1]}`;
      }

      selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
    }

    return selector;
  };

  const getSelectorFromElement = element => {
    const selector = getSelector(element);

    if (selector) {
      return document.querySelector(selector) ? selector : null;
    }

    return null;
  };

  const getElementFromSelector = element => {
    const selector = getSelector(element);
    return selector ? document.querySelector(selector) : null;
  };

  const getTransitionDurationFromElement = element => {
    if (!element) {
      return 0;
    } // Get transition-duration of the element


    let {
      transitionDuration,
      transitionDelay
    } = window.getComputedStyle(element);
    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    } // If multiple durations are defined, take the first


    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  };

  const triggerTransitionEnd = element => {
    element.dispatchEvent(new Event(TRANSITION_END));
  };

  const isElement = obj => {
    if (!obj || typeof obj !== 'object') {
      return false;
    }

    if (typeof obj.jquery !== 'undefined') {
      obj = obj[0];
    }

    return typeof obj.nodeType !== 'undefined';
  };

  const getElement = obj => {
    if (isElement(obj)) {
      // it's a jQuery object or a node element
      return obj.jquery ? obj[0] : obj;
    }

    if (typeof obj === 'string' && obj.length > 0) {
      return SelectorEngine.findOne(obj);
    }

    return null;
  };

  const emulateTransitionEnd = (element, duration) => {
    let called = false;
    const durationPadding = 5;
    const emulatedDuration = duration + durationPadding;

    function listener() {
      called = true;
      element.removeEventListener(TRANSITION_END, listener);
    }

    element.addEventListener(TRANSITION_END, listener);
    setTimeout(() => {
      if (!called) {
        triggerTransitionEnd(element);
      }
    }, emulatedDuration);
  };

  const typeCheckConfig = (componentName, config, configTypes) => {
    Object.keys(configTypes).forEach(property => {
      const expectedTypes = configTypes[property];
      const value = config[property];
      const valueType = value && isElement(value) ? 'element' : toType(value);

      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    });
  };

  const isVisible = element => {
    if (!element) {
      return false;
    }

    if (element.style && element.parentNode && element.parentNode.style) {
      const elementStyle = getComputedStyle(element);
      const parentNodeStyle = getComputedStyle(element.parentNode);
      return elementStyle.display !== 'none' && parentNodeStyle.display !== 'none' && elementStyle.visibility !== 'hidden';
    }

    return false;
  };

  const isDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }

    if (element.classList.contains('disabled')) {
      return true;
    }

    if (typeof element.disabled !== 'undefined') {
      return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
  };

  const findShadowRoot = element => {
    if (!document.documentElement.attachShadow) {
      return null;
    } // Can find the shadow root otherwise it'll return the document


    if (typeof element.getRootNode === 'function') {
      const root = element.getRootNode();
      return root instanceof ShadowRoot ? root : null;
    }

    if (element instanceof ShadowRoot) {
      return element;
    } // when we don't find a shadow root


    if (!element.parentNode) {
      return null;
    }

    return findShadowRoot(element.parentNode);
  };

  const noop = () => {};

  const reflow = element => element.offsetHeight;

  const getjQuery = () => {
    const {
      jQuery
    } = window;

    if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
      return jQuery;
    }

    return null;
  };

  const onDOMContentLoaded = callback => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  const isRTL = () => document.documentElement.dir === 'rtl';

  const defineJQueryPlugin = plugin => {
    onDOMContentLoaded(() => {
      const $ = getjQuery();
      /* istanbul ignore if */

      if ($) {
        const name = plugin.NAME;
        const JQUERY_NO_CONFLICT = $.fn[name];
        $.fn[name] = plugin.jQueryInterface;
        $.fn[name].Constructor = plugin;

        $.fn[name].noConflict = () => {
          $.fn[name] = JQUERY_NO_CONFLICT;
          return plugin.jQueryInterface;
        };
      }
    });
  };

  const execute = callback => {
    if (typeof callback === 'function') {
      callback();
    }
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/data.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const elementMap = new Map();
  var Data = {
    set(element, key, instance) {
      if (!elementMap.has(element)) {
        elementMap.set(element, new Map());
      }

      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
      // can be removed later when multiple key/instances are fine to be used

      if (!instanceMap.has(key) && instanceMap.size !== 0) {
        // eslint-disable-next-line no-console
        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
        return;
      }

      instanceMap.set(key, instance);
    },

    get(element, key) {
      if (elementMap.has(element)) {
        return elementMap.get(element).get(key) || null;
      }

      return null;
    },

    remove(element, key) {
      if (!elementMap.has(element)) {
        return;
      }

      const instanceMap = elementMap.get(element);
      instanceMap.delete(key); // free up element references if there are no instances left for an element

      if (instanceMap.size === 0) {
        elementMap.delete(element);
      }
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/event-handler.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
  const stripNameRegex = /\..*/;
  const stripUidRegex = /::\d+$/;
  const eventRegistry = {}; // Events storage

  let uidEvent = 1;
  const customEvents = {
    mouseenter: 'mouseover',
    mouseleave: 'mouseout'
  };
  const customEventsRegex = /^(mouseenter|mouseleave)/i;
  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
  /**
   * ------------------------------------------------------------------------
   * Private methods
   * ------------------------------------------------------------------------
   */

  function getUidEvent(element, uid) {
    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
  }

  function getEvent(element) {
    const uid = getUidEvent(element);
    element.uidEvent = uid;
    eventRegistry[uid] = eventRegistry[uid] || {};
    return eventRegistry[uid];
  }

  function bootstrapHandler(element, fn) {
    return function handler(event) {
      event.delegateTarget = element;

      if (handler.oneOff) {
        EventHandler.off(element, event.type, fn);
      }

      return fn.apply(element, [event]);
    };
  }

  function bootstrapDelegationHandler(element, selector, fn) {
    return function handler(event) {
      const domElements = element.querySelectorAll(selector);

      for (let {
        target
      } = event; target && target !== this; target = target.parentNode) {
        for (let i = domElements.length; i--;) {
          if (domElements[i] === target) {
            event.delegateTarget = target;

            if (handler.oneOff) {
              // eslint-disable-next-line unicorn/consistent-destructuring
              EventHandler.off(element, event.type, selector, fn);
            }

            return fn.apply(target, [event]);
          }
        }
      } // To please ESLint


      return null;
    };
  }

  function findHandler(events, handler, delegationSelector = null) {
    const uidEventList = Object.keys(events);

    for (let i = 0, len = uidEventList.length; i < len; i++) {
      const event = events[uidEventList[i]];

      if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
        return event;
      }
    }

    return null;
  }

  function normalizeParams(originalTypeEvent, handler, delegationFn) {
    const delegation = typeof handler === 'string';
    const originalHandler = delegation ? delegationFn : handler;
    let typeEvent = getTypeEvent(originalTypeEvent);
    const isNative = nativeEvents.has(typeEvent);

    if (!isNative) {
      typeEvent = originalTypeEvent;
    }

    return [delegation, originalHandler, typeEvent];
  }

  function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }

    if (!handler) {
      handler = delegationFn;
      delegationFn = null;
    } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
    // this prevents the handler from being dispatched the same way as mouseover or mouseout does


    if (customEventsRegex.test(originalTypeEvent)) {
      const wrapFn = fn => {
        return function (event) {
          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
            return fn.call(this, event);
          }
        };
      };

      if (delegationFn) {
        delegationFn = wrapFn(delegationFn);
      } else {
        handler = wrapFn(handler);
      }
    }

    const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
    const events = getEvent(element);
    const handlers = events[typeEvent] || (events[typeEvent] = {});
    const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

    if (previousFn) {
      previousFn.oneOff = previousFn.oneOff && oneOff;
      return;
    }

    const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
    const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
    fn.delegationSelector = delegation ? handler : null;
    fn.originalHandler = originalHandler;
    fn.oneOff = oneOff;
    fn.uidEvent = uid;
    handlers[uid] = fn;
    element.addEventListener(typeEvent, fn, delegation);
  }

  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
    const fn = findHandler(events[typeEvent], handler, delegationSelector);

    if (!fn) {
      return;
    }

    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
    delete events[typeEvent][fn.uidEvent];
  }

  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
    const storeElementEvent = events[typeEvent] || {};
    Object.keys(storeElementEvent).forEach(handlerKey => {
      if (handlerKey.includes(namespace)) {
        const event = storeElementEvent[handlerKey];
        removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
      }
    });
  }

  function getTypeEvent(event) {
    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
    event = event.replace(stripNameRegex, '');
    return customEvents[event] || event;
  }

  const EventHandler = {
    on(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, false);
    },

    one(element, event, handler, delegationFn) {
      addHandler(element, event, handler, delegationFn, true);
    },

    off(element, originalTypeEvent, handler, delegationFn) {
      if (typeof originalTypeEvent !== 'string' || !element) {
        return;
      }

      const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
      const inNamespace = typeEvent !== originalTypeEvent;
      const events = getEvent(element);
      const isNamespace = originalTypeEvent.startsWith('.');

      if (typeof originalHandler !== 'undefined') {
        // Simplest case: handler is passed, remove that listener ONLY.
        if (!events || !events[typeEvent]) {
          return;
        }

        removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
        return;
      }

      if (isNamespace) {
        Object.keys(events).forEach(elementEvent => {
          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
        });
      }

      const storeElementEvent = events[typeEvent] || {};
      Object.keys(storeElementEvent).forEach(keyHandlers => {
        const handlerKey = keyHandlers.replace(stripUidRegex, '');

        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
          const event = storeElementEvent[keyHandlers];
          removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
        }
      });
    },

    trigger(element, event, args) {
      if (typeof event !== 'string' || !element) {
        return null;
      }

      const $ = getjQuery();
      const typeEvent = getTypeEvent(event);
      const inNamespace = event !== typeEvent;
      const isNative = nativeEvents.has(typeEvent);
      let jQueryEvent;
      let bubbles = true;
      let nativeDispatch = true;
      let defaultPrevented = false;
      let evt = null;

      if (inNamespace && $) {
        jQueryEvent = $.Event(event, args);
        $(element).trigger(jQueryEvent);
        bubbles = !jQueryEvent.isPropagationStopped();
        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
        defaultPrevented = jQueryEvent.isDefaultPrevented();
      }

      if (isNative) {
        evt = document.createEvent('HTMLEvents');
        evt.initEvent(typeEvent, bubbles, true);
      } else {
        evt = new CustomEvent(event, {
          bubbles,
          cancelable: true
        });
      } // merge custom information in our event


      if (typeof args !== 'undefined') {
        Object.keys(args).forEach(key => {
          Object.defineProperty(evt, key, {
            get() {
              return args[key];
            }

          });
        });
      }

      if (defaultPrevented) {
        evt.preventDefault();
      }

      if (nativeDispatch) {
        element.dispatchEvent(evt);
      }

      if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
        jQueryEvent.preventDefault();
      }

      return evt;
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): base-component.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const VERSION = '5.0.1';

  class BaseComponent {
    constructor(element) {
      element = getElement(element);

      if (!element) {
        return;
      }

      this._element = element;
      Data.set(this._element, this.constructor.DATA_KEY, this);
    }

    dispose() {
      Data.remove(this._element, this.constructor.DATA_KEY);
      EventHandler.off(this._element, this.constructor.EVENT_KEY);
      Object.getOwnPropertyNames(this).forEach(propertyName => {
        this[propertyName] = null;
      });
    }

    _queueCallback(callback, element, isAnimated = true) {
      if (!isAnimated) {
        execute(callback);
        return;
      }

      const transitionDuration = getTransitionDurationFromElement(element);
      EventHandler.one(element, 'transitionend', () => execute(callback));
      emulateTransitionEnd(element, transitionDuration);
    }
    /** Static */


    static getInstance(element) {
      return Data.get(element, this.DATA_KEY);
    }

    static get VERSION() {
      return VERSION;
    }

    static get NAME() {
      throw new Error('You have to implement the static method "NAME", for each component!');
    }

    static get DATA_KEY() {
      return `bs.${this.NAME}`;
    }

    static get EVENT_KEY() {
      return `.${this.DATA_KEY}`;
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): alert.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$c = 'alert';
  const DATA_KEY$b = 'bs.alert';
  const EVENT_KEY$b = `.${DATA_KEY$b}`;
  const DATA_API_KEY$8 = '.data-api';
  const SELECTOR_DISMISS = '[data-bs-dismiss="alert"]';
  const EVENT_CLOSE = `close${EVENT_KEY$b}`;
  const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
  const EVENT_CLICK_DATA_API$7 = `click${EVENT_KEY$b}${DATA_API_KEY$8}`;
  const CLASS_NAME_ALERT = 'alert';
  const CLASS_NAME_FADE$6 = 'fade';
  const CLASS_NAME_SHOW$9 = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$c;
    } // Public


    close(element) {
      const rootElement = element ? this._getRootElement(element) : this._element;

      const customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent === null || customEvent.defaultPrevented) {
        return;
      }

      this._removeElement(rootElement);
    } // Private


    _getRootElement(element) {
      return getElementFromSelector(element) || element.closest(`.${CLASS_NAME_ALERT}`);
    }

    _triggerCloseEvent(element) {
      return EventHandler.trigger(element, EVENT_CLOSE);
    }

    _removeElement(element) {
      element.classList.remove(CLASS_NAME_SHOW$9);
      const isAnimated = element.classList.contains(CLASS_NAME_FADE$6);

      this._queueCallback(() => this._destroyElement(element), element, isAnimated);
    }

    _destroyElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }

      EventHandler.trigger(element, EVENT_CLOSED);
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$b);

        if (!data) {
          data = new Alert(this);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    }

    static handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$7, SELECTOR_DISMISS, Alert.handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Alert to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Alert);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$b = 'button';
  const DATA_KEY$a = 'bs.button';
  const EVENT_KEY$a = `.${DATA_KEY$a}`;
  const DATA_API_KEY$7 = '.data-api';
  const CLASS_NAME_ACTIVE$3 = 'active';
  const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
  const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$7}`;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Button extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$b;
    } // Public


    toggle() {
      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$a);

        if (!data) {
          data = new Button(this);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
    event.preventDefault();
    const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
    let data = Data.get(button, DATA_KEY$a);

    if (!data) {
      data = new Button(button);
    }

    data.toggle();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Button to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Button);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dom/manipulator.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  function normalizeData(val) {
    if (val === 'true') {
      return true;
    }

    if (val === 'false') {
      return false;
    }

    if (val === Number(val).toString()) {
      return Number(val);
    }

    if (val === '' || val === 'null') {
      return null;
    }

    return val;
  }

  function normalizeDataKey(key) {
    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
  }

  const Manipulator = {
    setDataAttribute(element, key, value) {
      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
    },

    removeDataAttribute(element, key) {
      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
    },

    getDataAttributes(element) {
      if (!element) {
        return {};
      }

      const attributes = {};
      Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
        let pureKey = key.replace(/^bs/, '');
        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
        attributes[pureKey] = normalizeData(element.dataset[key]);
      });
      return attributes;
    },

    getDataAttribute(element, key) {
      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
    },

    offset(element) {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    },

    position(element) {
      return {
        top: element.offsetTop,
        left: element.offsetLeft
      };
    }

  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): carousel.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$a = 'carousel';
  const DATA_KEY$9 = 'bs.carousel';
  const EVENT_KEY$9 = `.${DATA_KEY$9}`;
  const DATA_API_KEY$6 = '.data-api';
  const ARROW_LEFT_KEY = 'ArrowLeft';
  const ARROW_RIGHT_KEY = 'ArrowRight';
  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  const SWIPE_THRESHOLD = 40;
  const Default$9 = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  const DefaultType$9 = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  const ORDER_NEXT = 'next';
  const ORDER_PREV = 'prev';
  const DIRECTION_LEFT = 'left';
  const DIRECTION_RIGHT = 'right';
  const EVENT_SLIDE = `slide${EVENT_KEY$9}`;
  const EVENT_SLID = `slid${EVENT_KEY$9}`;
  const EVENT_KEYDOWN = `keydown${EVENT_KEY$9}`;
  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$9}`;
  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$9}`;
  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
  const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
  const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
  const EVENT_DRAG_START = `dragstart${EVENT_KEY$9}`;
  const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$9}${DATA_API_KEY$6}`;
  const CLASS_NAME_CAROUSEL = 'carousel';
  const CLASS_NAME_ACTIVE$2 = 'active';
  const CLASS_NAME_SLIDE = 'slide';
  const CLASS_NAME_END = 'carousel-item-end';
  const CLASS_NAME_START = 'carousel-item-start';
  const CLASS_NAME_NEXT = 'carousel-item-next';
  const CLASS_NAME_PREV = 'carousel-item-prev';
  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  const SELECTOR_ITEM = '.carousel-item';
  const SELECTOR_ITEM_IMG = '.carousel-item img';
  const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  const SELECTOR_INDICATORS = '.carousel-indicators';
  const SELECTOR_INDICATOR = '[data-bs-target]';
  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
  const POINTER_TYPE_TOUCH = 'touch';
  const POINTER_TYPE_PEN = 'pen';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Carousel extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent);

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$9;
    }

    static get NAME() {
      return NAME$a;
    } // Public


    next() {
      if (!this._isSliding) {
        this._slide(ORDER_NEXT);
      }
    }

    nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && isVisible(this._element)) {
        this.next();
      }
    }

    prev() {
      if (!this._isSliding) {
        this._slide(ORDER_PREV);
      }
    }

    pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
        triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    }

    cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config && this._config.interval && !this._isPaused) {
        this._updateInterval();

        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    }

    to(index) {
      this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

      this._slide(order, this._items[index]);
    } // Private


    _getConfig(config) {
      config = { ...Default$9,
        ...config
      };
      typeCheckConfig(NAME$a, config, DefaultType$9);
      return config;
    }

    _handleSwipe() {
      const absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      const direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0;

      if (!direction) {
        return;
      }

      this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }

    _addEventListeners() {
      if (this._config.keyboard) {
        EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
      }

      if (this._config.pause === 'hover') {
        EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
        EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
      }

      if (this._config.touch && this._touchSupported) {
        this._addTouchEventListeners();
      }
    }

    _addTouchEventListeners() {
      const start = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchStartX = event.clientX;
        } else if (!this._pointerEvent) {
          this.touchStartX = event.touches[0].clientX;
        }
      };

      const move = event => {
        // ensure swiping with one touch and not pinching
        this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
      };

      const end = event => {
        if (this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH)) {
          this.touchDeltaX = event.clientX - this.touchStartX;
        }

        this._handleSwipe();

        if (this._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          this.pause();

          if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
          }

          this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
        }
      };

      SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
        EventHandler.on(itemImg, EVENT_DRAG_START, e => e.preventDefault());
      });

      if (this._pointerEvent) {
        EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
        EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
        EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
        EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
      }
    }

    _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      if (event.key === ARROW_LEFT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_RIGHT);
      } else if (event.key === ARROW_RIGHT_KEY) {
        event.preventDefault();

        this._slide(DIRECTION_LEFT);
      }
    }

    _getItemIndex(element) {
      this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
      return this._items.indexOf(element);
    }

    _getItemByOrder(order, activeElement) {
      const isNext = order === ORDER_NEXT;
      const isPrev = order === ORDER_PREV;

      const activeIndex = this._getItemIndex(activeElement);

      const lastItemIndex = this._items.length - 1;
      const isGoingToWrap = isPrev && activeIndex === 0 || isNext && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      const delta = isPrev ? -1 : 1;
      const itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    }

    _triggerSlideEvent(relatedTarget, eventDirectionName) {
      const targetIndex = this._getItemIndex(relatedTarget);

      const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

      return EventHandler.trigger(this._element, EVENT_SLIDE, {
        relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
    }

    _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
        activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
        activeIndicator.removeAttribute('aria-current');
        const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

        for (let i = 0; i < indicators.length; i++) {
          if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
            indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
            indicators[i].setAttribute('aria-current', 'true');
            break;
          }
        }
      }
    }

    _updateInterval() {
      const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      if (!element) {
        return;
      }

      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

      if (elementInterval) {
        this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
        this._config.interval = elementInterval;
      } else {
        this._config.interval = this._config.defaultInterval || this._config.interval;
      }
    }

    _slide(directionOrOrder, element) {
      const order = this._directionToOrder(directionOrOrder);

      const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

      const activeElementIndex = this._getItemIndex(activeElement);

      const nextElement = element || this._getItemByOrder(order, activeElement);

      const nextElementIndex = this._getItemIndex(nextElement);

      const isCycling = Boolean(this._interval);
      const isNext = order === ORDER_NEXT;
      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

      const eventDirectionName = this._orderToDirection(order);

      if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
        this._isSliding = false;
        return;
      }

      const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.defaultPrevented) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      this._activeElement = nextElement;

      const triggerSlidEvent = () => {
        EventHandler.trigger(this._element, EVENT_SLID, {
          relatedTarget: nextElement,
          direction: eventDirectionName,
          from: activeElementIndex,
          to: nextElementIndex
        });
      };

      if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
        nextElement.classList.add(orderClassName);
        reflow(nextElement);
        activeElement.classList.add(directionalClassName);
        nextElement.classList.add(directionalClassName);

        const completeCallBack = () => {
          nextElement.classList.remove(directionalClassName, orderClassName);
          nextElement.classList.add(CLASS_NAME_ACTIVE$2);
          activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
          this._isSliding = false;
          setTimeout(triggerSlidEvent, 0);
        };

        this._queueCallback(completeCallBack, activeElement, true);
      } else {
        activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
        nextElement.classList.add(CLASS_NAME_ACTIVE$2);
        this._isSliding = false;
        triggerSlidEvent();
      }

      if (isCycling) {
        this.cycle();
      }
    }

    _directionToOrder(direction) {
      if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
        return direction;
      }

      if (isRTL()) {
        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
      }

      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
    }

    _orderToDirection(order) {
      if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
        return order;
      }

      if (isRTL()) {
        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
    } // Static


    static carouselInterface(element, config) {
      let data = Data.get(element, DATA_KEY$9);
      let _config = { ...Default$9,
        ...Manipulator.getDataAttributes(element)
      };

      if (typeof config === 'object') {
        _config = { ..._config,
          ...config
        };
      }

      const action = typeof config === 'string' ? config : _config.slide;

      if (!data) {
        data = new Carousel(element, _config);
      }

      if (typeof config === 'number') {
        data.to(config);
      } else if (typeof action === 'string') {
        if (typeof data[action] === 'undefined') {
          throw new TypeError(`No method named "${action}"`);
        }

        data[action]();
      } else if (_config.interval && _config.ride) {
        data.pause();
        data.cycle();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Carousel.carouselInterface(this, config);
      });
    }

    static dataApiClickHandler(event) {
      const target = getElementFromSelector(this);

      if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
        return;
      }

      const config = { ...Manipulator.getDataAttributes(target),
        ...Manipulator.getDataAttributes(this)
      };
      const slideIndex = this.getAttribute('data-bs-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel.carouselInterface(target, config);

      if (slideIndex) {
        Data.get(target, DATA_KEY$9).to(slideIndex);
      }

      event.preventDefault();
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
  EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
    const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

    for (let i = 0, len = carousels.length; i < len; i++) {
      Carousel.carouselInterface(carousels[i], Data.get(carousels[i], DATA_KEY$9));
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Carousel to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Carousel);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): collapse.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$9 = 'collapse';
  const DATA_KEY$8 = 'bs.collapse';
  const EVENT_KEY$8 = `.${DATA_KEY$8}`;
  const DATA_API_KEY$5 = '.data-api';
  const Default$8 = {
    toggle: true,
    parent: ''
  };
  const DefaultType$8 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  const EVENT_SHOW$5 = `show${EVENT_KEY$8}`;
  const EVENT_SHOWN$5 = `shown${EVENT_KEY$8}`;
  const EVENT_HIDE$5 = `hide${EVENT_KEY$8}`;
  const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$8}`;
  const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
  const CLASS_NAME_SHOW$8 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const WIDTH = 'width';
  const HEIGHT = 'height';
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._isTransitioning = false;
      this._config = this._getConfig(config);
      this._triggerArray = SelectorEngine.find(`${SELECTOR_DATA_TOGGLE$4}[href="#${this._element.id}"],` + `${SELECTOR_DATA_TOGGLE$4}[data-bs-target="#${this._element.id}"]`);
      const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = getSelectorFromElement(elem);
        const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

        if (selector !== null && filterElement.length) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    static get Default() {
      return Default$8;
    }

    static get NAME() {
      return NAME$9;
    } // Public


    toggle() {
      if (this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        this.hide();
      } else {
        this.show();
      }
    }

    show() {
      if (this._isTransitioning || this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      let actives;
      let activesData;

      if (this._parent) {
        actives = SelectorEngine.find(SELECTOR_ACTIVES, this._parent).filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-bs-parent') === this._config.parent;
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      const container = SelectorEngine.findOne(this._selector);

      if (actives) {
        const tempActiveData = actives.find(elem => container !== elem);
        activesData = tempActiveData ? Data.get(tempActiveData, DATA_KEY$8) : null;

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      if (actives) {
        actives.forEach(elemActive => {
          if (container !== elemActive) {
            Collapse.collapseInterface(elemActive, 'hide');
          }

          if (!activesData) {
            Data.set(elemActive, DATA_KEY$8, null);
          }
        });
      }

      const dimension = this._getDimension();

      this._element.classList.remove(CLASS_NAME_COLLAPSE);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        this._triggerArray.forEach(element => {
          element.classList.remove(CLASS_NAME_COLLAPSED);
          element.setAttribute('aria-expanded', true);
        });
      }

      this.setTransitioning(true);

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

        this._element.style[dimension] = '';
        this.setTransitioning(false);
        EventHandler.trigger(this._element, EVENT_SHOWN$5);
      };

      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = `scroll${capitalizedDimension}`;

      this._queueCallback(complete, this._element, true);

      this._element.style[dimension] = `${this._element[scrollSize]}px`;
    }

    hide() {
      if (this._isTransitioning || !this._element.classList.contains(CLASS_NAME_SHOW$8)) {
        return;
      }

      const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

      if (startEvent.defaultPrevented) {
        return;
      }

      const dimension = this._getDimension();

      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
      reflow(this._element);

      this._element.classList.add(CLASS_NAME_COLLAPSING);

      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$8);

      const triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const elem = getElementFromSelector(trigger);

          if (elem && !elem.classList.contains(CLASS_NAME_SHOW$8)) {
            trigger.classList.add(CLASS_NAME_COLLAPSED);
            trigger.setAttribute('aria-expanded', false);
          }
        }
      }

      this.setTransitioning(true);

      const complete = () => {
        this.setTransitioning(false);

        this._element.classList.remove(CLASS_NAME_COLLAPSING);

        this._element.classList.add(CLASS_NAME_COLLAPSE);

        EventHandler.trigger(this._element, EVENT_HIDDEN$5);
      };

      this._element.style[dimension] = '';

      this._queueCallback(complete, this._element, true);
    }

    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    } // Private


    _getConfig(config) {
      config = { ...Default$8,
        ...config
      };
      config.toggle = Boolean(config.toggle); // Coerce string values

      typeCheckConfig(NAME$9, config, DefaultType$8);
      return config;
    }

    _getDimension() {
      return this._element.classList.contains(WIDTH) ? WIDTH : HEIGHT;
    }

    _getParent() {
      let {
        parent
      } = this._config;
      parent = getElement(parent);
      const selector = `${SELECTOR_DATA_TOGGLE$4}[data-bs-parent="${parent}"]`;
      SelectorEngine.find(selector, parent).forEach(element => {
        const selected = getElementFromSelector(element);

        this._addAriaAndCollapsedClass(selected, [element]);
      });
      return parent;
    }

    _addAriaAndCollapsedClass(element, triggerArray) {
      if (!element || !triggerArray.length) {
        return;
      }

      const isOpen = element.classList.contains(CLASS_NAME_SHOW$8);
      triggerArray.forEach(elem => {
        if (isOpen) {
          elem.classList.remove(CLASS_NAME_COLLAPSED);
        } else {
          elem.classList.add(CLASS_NAME_COLLAPSED);
        }

        elem.setAttribute('aria-expanded', isOpen);
      });
    } // Static


    static collapseInterface(element, config) {
      let data = Data.get(element, DATA_KEY$8);
      const _config = { ...Default$8,
        ...Manipulator.getDataAttributes(element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
        _config.toggle = false;
      }

      if (!data) {
        data = new Collapse(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Collapse.collapseInterface(this, config);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
      event.preventDefault();
    }

    const triggerData = Manipulator.getDataAttributes(this);
    const selector = getSelectorFromElement(this);
    const selectorElements = SelectorEngine.find(selector);
    selectorElements.forEach(element => {
      const data = Data.get(element, DATA_KEY$8);
      let config;

      if (data) {
        // update parent attribute
        if (data._parent === null && typeof triggerData.parent === 'string') {
          data._config.parent = triggerData.parent;
          data._parent = data._getParent();
        }

        config = 'toggle';
      } else {
        config = triggerData;
      }

      Collapse.collapseInterface(element, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Collapse to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Collapse);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): dropdown.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$8 = 'dropdown';
  const DATA_KEY$7 = 'bs.dropdown';
  const EVENT_KEY$7 = `.${DATA_KEY$7}`;
  const DATA_API_KEY$4 = '.data-api';
  const ESCAPE_KEY$2 = 'Escape';
  const SPACE_KEY = 'Space';
  const TAB_KEY = 'Tab';
  const ARROW_UP_KEY = 'ArrowUp';
  const ARROW_DOWN_KEY = 'ArrowDown';
  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

  const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
  const EVENT_HIDE$4 = `hide${EVENT_KEY$7}`;
  const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$7}`;
  const EVENT_SHOW$4 = `show${EVENT_KEY$7}`;
  const EVENT_SHOWN$4 = `shown${EVENT_KEY$7}`;
  const EVENT_CLICK = `click${EVENT_KEY$7}`;
  const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$7}${DATA_API_KEY$4}`;
  const CLASS_NAME_SHOW$7 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPEND = 'dropend';
  const CLASS_NAME_DROPSTART = 'dropstart';
  const CLASS_NAME_NAVBAR = 'navbar';
  const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
  const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
  const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
  const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
  const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
  const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
  const Default$7 = {
    offset: [0, 2],
    boundary: 'clippingParents',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null,
    autoClose: true
  };
  const DefaultType$7 = {
    offset: '(array|string|function)',
    boundary: '(string|element)',
    reference: '(string|element|object)',
    display: 'string',
    popperConfig: '(null|object|function)',
    autoClose: '(boolean|string)'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Dropdown extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    static get Default() {
      return Default$7;
    }

    static get DefaultType() {
      return DefaultType$7;
    }

    static get NAME() {
      return NAME$8;
    } // Public


    toggle() {
      if (isDisabled(this._element)) {
        return;
      }

      const isActive = this._element.classList.contains(CLASS_NAME_SHOW$7);

      if (isActive) {
        this.hide();
        return;
      }

      this.show();
    }

    show() {
      if (isDisabled(this._element) || this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const parent = Dropdown.getParentFromElement(this._element);
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

      if (showEvent.defaultPrevented) {
        return;
      } // Totally disable Popper for Dropdowns in Navbar


      if (this._inNavbar) {
        Manipulator.setDataAttribute(this._menu, 'popper', 'none');
      } else {
        if (typeof Popper__namespace === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }

        let referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (isElement(this._config.reference)) {
          referenceElement = getElement(this._config.reference);
        } else if (typeof this._config.reference === 'object') {
          referenceElement = this._config.reference;
        }

        const popperConfig = this._getPopperConfig();

        const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
        this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

        if (isDisplayStatic) {
          Manipulator.setDataAttribute(this._menu, 'popper', 'static');
        }
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
        [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      this._menu.classList.toggle(CLASS_NAME_SHOW$7);

      this._element.classList.toggle(CLASS_NAME_SHOW$7);

      EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
    }

    hide() {
      if (isDisabled(this._element) || !this._menu.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      const relatedTarget = {
        relatedTarget: this._element
      };

      this._completeHide(relatedTarget);
    }

    dispose() {
      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper) {
        this._popper.update();
      }
    } // Private


    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK, event => {
        event.preventDefault();
        this.toggle();
      });
    }

    _completeHide(relatedTarget) {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

      if (hideEvent.defaultPrevented) {
        return;
      } // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
      }

      if (this._popper) {
        this._popper.destroy();
      }

      this._menu.classList.remove(CLASS_NAME_SHOW$7);

      this._element.classList.remove(CLASS_NAME_SHOW$7);

      this._element.setAttribute('aria-expanded', 'false');

      Manipulator.removeDataAttribute(this._menu, 'popper');
      EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
    }

    _getConfig(config) {
      config = { ...this.constructor.Default,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$8, config, this.constructor.DefaultType);

      if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
        // Popper virtual elements require a getBoundingClientRect method
        throw new TypeError(`${NAME$8.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
      }

      return config;
    }

    _getMenuElement() {
      return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
    }

    _getPlacement() {
      const parentDropdown = this._element.parentNode;

      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
        return PLACEMENT_RIGHT;
      }

      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
        return PLACEMENT_LEFT;
      } // We need to trim the value because custom properties can also include spaces


      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      }

      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
    }

    _detectNavbar() {
      return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig() {
      const defaultBsPopperConfig = {
        placement: this._getPlacement(),
        modifiers: [{
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }]
      }; // Disable Popper if we have a static display

      if (this._config.display === 'static') {
        defaultBsPopperConfig.modifiers = [{
          name: 'applyStyles',
          enabled: false
        }];
      }

      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _selectMenuItem(event) {
      const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

      if (!items.length) {
        return;
      }

      let index = items.indexOf(event.target); // Up

      if (event.key === ARROW_UP_KEY && index > 0) {
        index--;
      } // Down


      if (event.key === ARROW_DOWN_KEY && index < items.length - 1) {
        index++;
      } // index is -1 if the first keydown is an ArrowUp


      index = index === -1 ? 0 : index;
      items[index].focus();
    } // Static


    static dropdownInterface(element, config) {
      let data = Data.get(element, DATA_KEY$7);

      const _config = typeof config === 'object' ? config : null;

      if (!data) {
        data = new Dropdown(element, _config);
      }

      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      }
    }

    static jQueryInterface(config) {
      return this.each(function () {
        Dropdown.dropdownInterface(this, config);
      });
    }

    static clearMenus(event) {
      if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY)) {
        return;
      }

      const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

      for (let i = 0, len = toggles.length; i < len; i++) {
        const context = Data.get(toggles[i], DATA_KEY$7);

        if (!context || context._config.autoClose === false) {
          continue;
        }

        if (!context._element.classList.contains(CLASS_NAME_SHOW$7)) {
          continue;
        }

        const relatedTarget = {
          relatedTarget: context._element
        };

        if (event) {
          const composedPath = event.composedPath();
          const isMenuTarget = composedPath.includes(context._menu);

          if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
            continue;
          } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


          if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
            continue;
          }

          if (event.type === 'click') {
            relatedTarget.clickEvent = event;
          }
        }

        context._completeHide(relatedTarget);
      }
    }

    static getParentFromElement(element) {
      return getElementFromSelector(element) || element.parentNode;
    }

    static dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
        return;
      }

      const isActive = this.classList.contains(CLASS_NAME_SHOW$7);

      if (!isActive && event.key === ESCAPE_KEY$2) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isDisabled(this)) {
        return;
      }

      const getToggleButton = () => this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];

      if (event.key === ESCAPE_KEY$2) {
        getToggleButton().focus();
        Dropdown.clearMenus();
        return;
      }

      if (!isActive && (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY)) {
        getToggleButton().click();
        return;
      }

      if (!isActive || event.key === SPACE_KEY) {
        Dropdown.clearMenus();
        return;
      }

      Dropdown.getInstance(getToggleButton())._selectMenuItem(event);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
  EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    event.preventDefault();
    Dropdown.dropdownInterface(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Dropdown to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Dropdown);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/scrollBar.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';

  const getWidth = () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  };

  const hide = (width = getWidth()) => {
    _disableOverFlow(); // give padding to element to balances the hidden scrollbar width


    _setElementAttributes('body', 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements, to keep shown fullwidth


    _setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

    _setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
  };

  const _disableOverFlow = () => {
    const actualValue = document.body.style.overflow;

    if (actualValue) {
      Manipulator.setDataAttribute(document.body, 'overflow', actualValue);
    }

    document.body.style.overflow = 'hidden';
  };

  const _setElementAttributes = (selector, styleProp, callback) => {
    const scrollbarWidth = getWidth();
    SelectorEngine.find(selector).forEach(element => {
      if (element !== document.body && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }

      const actualValue = element.style[styleProp];
      const calculatedValue = window.getComputedStyle(element)[styleProp];
      Manipulator.setDataAttribute(element, styleProp, actualValue);
      element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
    });
  };

  const reset = () => {
    _resetElementAttributes('body', 'overflow');

    _resetElementAttributes('body', 'paddingRight');

    _resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

    _resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
  };

  const _resetElementAttributes = (selector, styleProp) => {
    SelectorEngine.find(selector).forEach(element => {
      const value = Manipulator.getDataAttribute(element, styleProp);

      if (typeof value === 'undefined') {
        element.style.removeProperty(styleProp);
      } else {
        Manipulator.removeDataAttribute(element, styleProp);
        element.style[styleProp] = value;
      }
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/backdrop.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const Default$6 = {
    isVisible: true,
    // if false, we use the backdrop helper without adding any element to the dom
    isAnimated: false,
    rootElement: document.body,
    // give the choice to place backdrop under different elements
    clickCallback: null
  };
  const DefaultType$6 = {
    isVisible: 'boolean',
    isAnimated: 'boolean',
    rootElement: 'element',
    clickCallback: '(function|null)'
  };
  const NAME$7 = 'backdrop';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_FADE$5 = 'fade';
  const CLASS_NAME_SHOW$6 = 'show';
  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$7}`;

  class Backdrop {
    constructor(config) {
      this._config = this._getConfig(config);
      this._isAppended = false;
      this._element = null;
    }

    show(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._append();

      if (this._config.isAnimated) {
        reflow(this._getElement());
      }

      this._getElement().classList.add(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        execute(callback);
      });
    }

    hide(callback) {
      if (!this._config.isVisible) {
        execute(callback);
        return;
      }

      this._getElement().classList.remove(CLASS_NAME_SHOW$6);

      this._emulateAnimation(() => {
        this.dispose();
        execute(callback);
      });
    } // Private


    _getElement() {
      if (!this._element) {
        const backdrop = document.createElement('div');
        backdrop.className = CLASS_NAME_BACKDROP;

        if (this._config.isAnimated) {
          backdrop.classList.add(CLASS_NAME_FADE$5);
        }

        this._element = backdrop;
      }

      return this._element;
    }

    _getConfig(config) {
      config = { ...Default$6,
        ...(typeof config === 'object' ? config : {})
      };
      config.rootElement = config.rootElement || document.body;
      typeCheckConfig(NAME$7, config, DefaultType$6);
      return config;
    }

    _append() {
      if (this._isAppended) {
        return;
      }

      this._config.rootElement.appendChild(this._getElement());

      EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
        execute(this._config.clickCallback);
      });
      this._isAppended = true;
    }

    dispose() {
      if (!this._isAppended) {
        return;
      }

      EventHandler.off(this._element, EVENT_MOUSEDOWN);

      this._getElement().parentNode.removeChild(this._element);

      this._isAppended = false;
    }

    _emulateAnimation(callback) {
      if (!this._config.isAnimated) {
        execute(callback);
        return;
      }

      const backdropTransitionDuration = getTransitionDurationFromElement(this._getElement());
      EventHandler.one(this._getElement(), 'transitionend', () => execute(callback));
      emulateTransitionEnd(this._getElement(), backdropTransitionDuration);
    }

  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): modal.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$6 = 'modal';
  const DATA_KEY$6 = 'bs.modal';
  const EVENT_KEY$6 = `.${DATA_KEY$6}`;
  const DATA_API_KEY$3 = '.data-api';
  const ESCAPE_KEY$1 = 'Escape';
  const Default$5 = {
    backdrop: true,
    keyboard: true,
    focus: true
  };
  const DefaultType$5 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean'
  };
  const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
  const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
  const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
  const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
  const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$6}`;
  const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
  const EVENT_CLICK_DISMISS$2 = `click.dismiss${EVENT_KEY$6}`;
  const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
  const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$4 = 'fade';
  const CLASS_NAME_SHOW$5 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
  const SELECTOR_DATA_DISMISS$2 = '[data-bs-dismiss="modal"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Modal extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
      this._backdrop = this._initializeBackDrop();
      this._isShown = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
    } // Getters


    static get Default() {
      return Default$5;
    }

    static get NAME() {
      return NAME$6;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }

      if (this._isAnimated()) {
        this._isTransitioning = true;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
        relatedTarget
      });

      if (this._isShown || showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      hide();
      document.body.classList.add(CLASS_NAME_OPEN);

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, SELECTOR_DATA_DISMISS$2, event => this.hide(event));
      EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
        EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
          if (event.target === this._element) {
            this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(() => this._showElement(relatedTarget));
    }

    hide(event) {
      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

      if (hideEvent.defaultPrevented) {
        return;
      }

      this._isShown = false;

      const isAnimated = this._isAnimated();

      if (isAnimated) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      EventHandler.off(document, EVENT_FOCUSIN$2);

      this._element.classList.remove(CLASS_NAME_SHOW$5);

      EventHandler.off(this._element, EVENT_CLICK_DISMISS$2);
      EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

      this._queueCallback(() => this._hideModal(), this._element, isAnimated);
    }

    dispose() {
      [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

      this._backdrop.dispose();

      super.dispose();
      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */

      EventHandler.off(document, EVENT_FOCUSIN$2);
    }

    handleUpdate() {
      this._adjustDialog();
    } // Private


    _initializeBackDrop() {
      return new Backdrop({
        isVisible: Boolean(this._config.backdrop),
        // 'static' option will be translated to true, and booleans will keep their value
        isAnimated: this._isAnimated()
      });
    }

    _getConfig(config) {
      config = { ...Default$5,
        ...Manipulator.getDataAttributes(this._element),
        ...config
      };
      typeCheckConfig(NAME$6, config, DefaultType$5);
      return config;
    }

    _showElement(relatedTarget) {
      const isAnimated = this._isAnimated();

      const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.scrollTop = 0;

      if (modalBody) {
        modalBody.scrollTop = 0;
      }

      if (isAnimated) {
        reflow(this._element);
      }

      this._element.classList.add(CLASS_NAME_SHOW$5);

      if (this._config.focus) {
        this._enforceFocus();
      }

      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }

        this._isTransitioning = false;
        EventHandler.trigger(this._element, EVENT_SHOWN$3, {
          relatedTarget
        });
      };

      this._queueCallback(transitionComplete, this._dialog, isAnimated);
    }

    _enforceFocus() {
      EventHandler.off(document, EVENT_FOCUSIN$2); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$2, event => {
        if (document !== event.target && this._element !== event.target && !this._element.contains(event.target)) {
          this._element.focus();
        }
      });
    }

    _setEscapeEvent() {
      if (this._isShown) {
        EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
          if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
            this._triggerBackdropTransition();
          }
        });
      } else {
        EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
      }
    }

    _setResizeEvent() {
      if (this._isShown) {
        EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
      } else {
        EventHandler.off(window, EVENT_RESIZE);
      }
    }

    _hideModal() {
      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._backdrop.hide(() => {
        document.body.classList.remove(CLASS_NAME_OPEN);

        this._resetAdjustments();

        reset();
        EventHandler.trigger(this._element, EVENT_HIDDEN$3);
      });
    }

    _showBackdrop(callback) {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$2, event => {
        if (this._ignoreBackdropClick) {
          this._ignoreBackdropClick = false;
          return;
        }

        if (event.target !== event.currentTarget) {
          return;
        }

        if (this._config.backdrop === true) {
          this.hide();
        } else if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
        }
      });

      this._backdrop.show(callback);
    }

    _isAnimated() {
      return this._element.classList.contains(CLASS_NAME_FADE$4);
    }

    _triggerBackdropTransition() {
      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }

      this._element.classList.add(CLASS_NAME_STATIC);

      const modalTransitionDuration = getTransitionDurationFromElement(this._dialog);
      EventHandler.off(this._element, 'transitionend');
      EventHandler.one(this._element, 'transitionend', () => {
        this._element.classList.remove(CLASS_NAME_STATIC);

        if (!isModalOverflowing) {
          EventHandler.one(this._element, 'transitionend', () => {
            this._element.style.overflowY = '';
          });
          emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      });
      emulateTransitionEnd(this._element, modalTransitionDuration);

      this._element.focus();
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // ----------------------------------------------------------------------


    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      const scrollbarWidth = getWidth();
      const isBodyOverflowing = scrollbarWidth > 0;

      if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
        this._element.style.paddingLeft = `${scrollbarWidth}px`;
      }

      if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
        this._element.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    } // Static


    static jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        const data = Modal.getInstance(this) || new Modal(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](relatedTarget);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    EventHandler.one(target, EVENT_SHOW$3, showEvent => {
      if (showEvent.defaultPrevented) {
        // only register focus restorer if modal will actually get shown
        return;
      }

      EventHandler.one(target, EVENT_HIDDEN$3, () => {
        if (isVisible(this)) {
          this.focus();
        }
      });
    });
    const data = Modal.getInstance(target) || new Modal(target);
    data.toggle(this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Modal to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Modal);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): offcanvas.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$5 = 'offcanvas';
  const DATA_KEY$5 = 'bs.offcanvas';
  const EVENT_KEY$5 = `.${DATA_KEY$5}`;
  const DATA_API_KEY$2 = '.data-api';
  const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const ESCAPE_KEY = 'Escape';
  const Default$4 = {
    backdrop: true,
    keyboard: true,
    scroll: false
  };
  const DefaultType$4 = {
    backdrop: 'boolean',
    keyboard: 'boolean',
    scroll: 'boolean'
  };
  const CLASS_NAME_SHOW$4 = 'show';
  const OPEN_SELECTOR = '.offcanvas.show';
  const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
  const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
  const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
  const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
  const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$5}`;
  const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
  const EVENT_CLICK_DISMISS$1 = `click.dismiss${EVENT_KEY$5}`;
  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
  const SELECTOR_DATA_DISMISS$1 = '[data-bs-dismiss="offcanvas"]';
  const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Offcanvas extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._isShown = false;
      this._backdrop = this._initializeBackDrop();

      this._addEventListeners();
    } // Getters


    static get NAME() {
      return NAME$5;
    }

    static get Default() {
      return Default$4;
    } // Public


    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }

    show(relatedTarget) {
      if (this._isShown) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
        relatedTarget
      });

      if (showEvent.defaultPrevented) {
        return;
      }

      this._isShown = true;
      this._element.style.visibility = 'visible';

      this._backdrop.show();

      if (!this._config.scroll) {
        hide();

        this._enforceFocusOnElement(this._element);
      }

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      this._element.classList.add(CLASS_NAME_SHOW$4);

      const completeCallBack = () => {
        EventHandler.trigger(this._element, EVENT_SHOWN$2, {
          relatedTarget
        });
      };

      this._queueCallback(completeCallBack, this._element, true);
    }

    hide() {
      if (!this._isShown) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

      if (hideEvent.defaultPrevented) {
        return;
      }

      EventHandler.off(document, EVENT_FOCUSIN$1);

      this._element.blur();

      this._isShown = false;

      this._element.classList.remove(CLASS_NAME_SHOW$4);

      this._backdrop.hide();

      const completeCallback = () => {
        this._element.setAttribute('aria-hidden', true);

        this._element.removeAttribute('aria-modal');

        this._element.removeAttribute('role');

        this._element.style.visibility = 'hidden';

        if (!this._config.scroll) {
          reset();
        }

        EventHandler.trigger(this._element, EVENT_HIDDEN$2);
      };

      this._queueCallback(completeCallback, this._element, true);
    }

    dispose() {
      this._backdrop.dispose();

      super.dispose();
      EventHandler.off(document, EVENT_FOCUSIN$1);
    } // Private


    _getConfig(config) {
      config = { ...Default$4,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' ? config : {})
      };
      typeCheckConfig(NAME$5, config, DefaultType$4);
      return config;
    }

    _initializeBackDrop() {
      return new Backdrop({
        isVisible: this._config.backdrop,
        isAnimated: true,
        rootElement: this._element.parentNode,
        clickCallback: () => this.hide()
      });
    }

    _enforceFocusOnElement(element) {
      EventHandler.off(document, EVENT_FOCUSIN$1); // guard against infinite focus loop

      EventHandler.on(document, EVENT_FOCUSIN$1, event => {
        if (document !== event.target && element !== event.target && !element.contains(event.target)) {
          element.focus();
        }
      });
      element.focus();
    }

    _addEventListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, () => this.hide());
      EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
        if (this._config.keyboard && event.key === ESCAPE_KEY) {
          this.hide();
        }
      });
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$5) || new Offcanvas(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config](this);
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    const target = getElementFromSelector(this);

    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    EventHandler.one(target, EVENT_HIDDEN$2, () => {
      // focus on trigger when it is closed
      if (isVisible(this)) {
        this.focus();
      }
    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

    const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

    if (allReadyOpen && allReadyOpen !== target) {
      Offcanvas.getInstance(allReadyOpen).hide();
    }

    const data = Data.get(target, DATA_KEY$5) || new Offcanvas(target);
    data.toggle(this);
  });
  EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
    SelectorEngine.find(OPEN_SELECTOR).forEach(el => (Data.get(el, DATA_KEY$5) || new Offcanvas(el)).show());
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  defineJQueryPlugin(Offcanvas);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): util/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  const uriAttrs = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/i;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  const allowedAttribute = (attr, allowedAttributeList) => {
    const attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.includes(attrName)) {
      if (uriAttrs.has(attrName)) {
        return Boolean(SAFE_URL_PATTERN.test(attr.nodeValue) || DATA_URL_PATTERN.test(attr.nodeValue));
      }

      return true;
    }

    const regExp = allowedAttributeList.filter(attrRegex => attrRegex instanceof RegExp); // Check if a regular expression validates the attribute.

    for (let i = 0, len = regExp.length; i < len; i++) {
      if (regExp[i].test(attrName)) {
        return true;
      }
    }

    return false;
  };

  const DefaultAllowlist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
    if (!unsafeHtml.length) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    const domParser = new window.DOMParser();
    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    const allowlistKeys = Object.keys(allowList);
    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

    for (let i = 0, len = elements.length; i < len; i++) {
      const el = elements[i];
      const elName = el.nodeName.toLowerCase();

      if (!allowlistKeys.includes(elName)) {
        el.parentNode.removeChild(el);
        continue;
      }

      const attributeList = [].concat(...el.attributes);
      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elName] || []);
      attributeList.forEach(attr => {
        if (!allowedAttribute(attr, allowedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tooltip.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$4 = 'tooltip';
  const DATA_KEY$4 = 'bs.tooltip';
  const EVENT_KEY$4 = `.${DATA_KEY$4}`;
  const CLASS_PREFIX$1 = 'bs-tooltip';
  const BSCLS_PREFIX_REGEX$1 = new RegExp(`(^|\\s)${CLASS_PREFIX$1}\\S+`, 'g');
  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
  const DefaultType$3 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(array|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacements: 'array',
    boundary: '(string|element)',
    customClass: '(string|function)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    allowList: 'object',
    popperConfig: '(null|object|function)'
  };
  const AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: isRTL() ? 'left' : 'right',
    BOTTOM: 'bottom',
    LEFT: isRTL() ? 'right' : 'left'
  };
  const Default$3 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: [0, 0],
    container: false,
    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
    boundary: 'clippingParents',
    customClass: '',
    sanitize: true,
    sanitizeFn: null,
    allowList: DefaultAllowlist,
    popperConfig: null
  };
  const Event$2 = {
    HIDE: `hide${EVENT_KEY$4}`,
    HIDDEN: `hidden${EVENT_KEY$4}`,
    SHOW: `show${EVENT_KEY$4}`,
    SHOWN: `shown${EVENT_KEY$4}`,
    INSERTED: `inserted${EVENT_KEY$4}`,
    CLICK: `click${EVENT_KEY$4}`,
    FOCUSIN: `focusin${EVENT_KEY$4}`,
    FOCUSOUT: `focusout${EVENT_KEY$4}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
  };
  const CLASS_NAME_FADE$3 = 'fade';
  const CLASS_NAME_MODAL = 'modal';
  const CLASS_NAME_SHOW$3 = 'show';
  const HOVER_STATE_SHOW = 'show';
  const HOVER_STATE_OUT = 'out';
  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  const TRIGGER_HOVER = 'hover';
  const TRIGGER_FOCUS = 'focus';
  const TRIGGER_CLICK = 'click';
  const TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tooltip extends BaseComponent {
    constructor(element, config) {
      if (typeof Popper__namespace === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
      }

      super(element); // private

      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this._config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    static get Default() {
      return Default$3;
    }

    static get NAME() {
      return NAME$4;
    }

    static get Event() {
      return Event$2;
    }

    static get DefaultType() {
      return DefaultType$3;
    } // Public


    enable() {
      this._isEnabled = true;
    }

    disable() {
      this._isEnabled = false;
    }

    toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    }

    toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        const context = this._initializeOnDelegatedTarget(event);

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$3)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    }

    dispose() {
      clearTimeout(this._timeout);
      EventHandler.off(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this.tip && this.tip.parentNode) {
        this.tip.parentNode.removeChild(this.tip);
      }

      if (this._popper) {
        this._popper.destroy();
      }

      super.dispose();
    }

    show() {
      if (this._element.style.display === 'none') {
        throw new Error('Please use show on visible elements');
      }

      if (!(this.isWithContent() && this._isEnabled)) {
        return;
      }

      const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
      const shadowRoot = findShadowRoot(this._element);
      const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

      if (showEvent.defaultPrevented || !isInTheDom) {
        return;
      }

      const tip = this.getTipElement();
      const tipId = getUID(this.constructor.NAME);
      tip.setAttribute('id', tipId);

      this._element.setAttribute('aria-describedby', tipId);

      this.setContent();

      if (this._config.animation) {
        tip.classList.add(CLASS_NAME_FADE$3);
      }

      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

      const attachment = this._getAttachment(placement);

      this._addAttachmentClass(attachment);

      const {
        container
      } = this._config;
      Data.set(tip, this.constructor.DATA_KEY, this);

      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
        container.appendChild(tip);
        EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
      }

      if (this._popper) {
        this._popper.update();
      } else {
        this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
      }

      tip.classList.add(CLASS_NAME_SHOW$3);
      const customClass = typeof this._config.customClass === 'function' ? this._config.customClass() : this._config.customClass;

      if (customClass) {
        tip.classList.add(...customClass.split(' '));
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => {
          EventHandler.on(element, 'mouseover', noop);
        });
      }

      const complete = () => {
        const prevHoverState = this._hoverState;
        this._hoverState = null;
        EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

        if (prevHoverState === HOVER_STATE_OUT) {
          this._leave(null, this);
        }
      };

      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);
    }

    hide() {
      if (!this._popper) {
        return;
      }

      const tip = this.getTipElement();

      const complete = () => {
        if (this._isWithActiveTrigger()) {
          return;
        }

        if (this._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        this._cleanTipClass();

        this._element.removeAttribute('aria-describedby');

        EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

        if (this._popper) {
          this._popper.destroy();

          this._popper = null;
        }
      };

      const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      tip.classList.remove(CLASS_NAME_SHOW$3); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;
      const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$3);

      this._queueCallback(complete, this.tip, isAnimated);

      this._hoverState = '';
    }

    update() {
      if (this._popper !== null) {
        this._popper.update();
      }
    } // Protected


    isWithContent() {
      return Boolean(this.getTitle());
    }

    getTipElement() {
      if (this.tip) {
        return this.tip;
      }

      const element = document.createElement('div');
      element.innerHTML = this._config.template;
      this.tip = element.children[0];
      return this.tip;
    }

    setContent() {
      const tip = this.getTipElement();
      this.setElementContent(SelectorEngine.findOne(SELECTOR_TOOLTIP_INNER, tip), this.getTitle());
      tip.classList.remove(CLASS_NAME_FADE$3, CLASS_NAME_SHOW$3);
    }

    setElementContent(element, content) {
      if (element === null) {
        return;
      }

      if (isElement(content)) {
        content = getElement(content); // content is a DOM node or a jQuery

        if (this._config.html) {
          if (content.parentNode !== element) {
            element.innerHTML = '';
            element.appendChild(content);
          }
        } else {
          element.textContent = content.textContent;
        }

        return;
      }

      if (this._config.html) {
        if (this._config.sanitize) {
          content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
        }

        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }

    getTitle() {
      let title = this._element.getAttribute('data-bs-original-title');

      if (!title) {
        title = typeof this._config.title === 'function' ? this._config.title.call(this._element) : this._config.title;
      }

      return title;
    }

    updateAttachment(attachment) {
      if (attachment === 'right') {
        return 'end';
      }

      if (attachment === 'left') {
        return 'start';
      }

      return attachment;
    } // Private


    _initializeOnDelegatedTarget(event, context) {
      const dataKey = this.constructor.DATA_KEY;
      context = context || Data.get(event.delegateTarget, dataKey);

      if (!context) {
        context = new this.constructor(event.delegateTarget, this._getDelegateConfig());
        Data.set(event.delegateTarget, dataKey, context);
      }

      return context;
    }

    _getOffset() {
      const {
        offset
      } = this._config;

      if (typeof offset === 'string') {
        return offset.split(',').map(val => Number.parseInt(val, 10));
      }

      if (typeof offset === 'function') {
        return popperData => offset(popperData, this._element);
      }

      return offset;
    }

    _getPopperConfig(attachment) {
      const defaultBsPopperConfig = {
        placement: attachment,
        modifiers: [{
          name: 'flip',
          options: {
            fallbackPlacements: this._config.fallbackPlacements
          }
        }, {
          name: 'offset',
          options: {
            offset: this._getOffset()
          }
        }, {
          name: 'preventOverflow',
          options: {
            boundary: this._config.boundary
          }
        }, {
          name: 'arrow',
          options: {
            element: `.${this.constructor.NAME}-arrow`
          }
        }, {
          name: 'onChange',
          enabled: true,
          phase: 'afterWrite',
          fn: data => this._handlePopperPlacementChange(data)
        }],
        onFirstUpdate: data => {
          if (data.options.placement !== data.placement) {
            this._handlePopperPlacementChange(data);
          }
        }
      };
      return { ...defaultBsPopperConfig,
        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
      };
    }

    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX$1}-${this.updateAttachment(attachment)}`);
    }

    _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    }

    _setListeners() {
      const triggers = this._config.trigger.split(' ');

      triggers.forEach(trigger => {
        if (trigger === 'click') {
          EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
        } else if (trigger !== TRIGGER_MANUAL) {
          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
          EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
          EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
        }
      });

      this._hideModalHandler = () => {
        if (this._element) {
          this.hide();
        }
      };

      EventHandler.on(this._element.closest(`.${CLASS_NAME_MODAL}`), 'hide.bs.modal', this._hideModalHandler);

      if (this._config.selector) {
        this._config = { ...this._config,
          trigger: 'manual',
          selector: ''
        };
      } else {
        this._fixTitle();
      }
    }

    _fixTitle() {
      const title = this._element.getAttribute('title');

      const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

      if (title || originalTitleType !== 'string') {
        this._element.setAttribute('data-bs-original-title', title || '');

        if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
          this._element.setAttribute('aria-label', title);
        }

        this._element.setAttribute('title', '');
      }
    }

    _enter(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$3) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context._config.delay || !context._config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context._config.delay.show);
    }

    _leave(event, context) {
      context = this._initializeOnDelegatedTarget(event, context);

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context._config.delay || !context._config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(() => {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context._config.delay.hide);
    }

    _isWithActiveTrigger() {
      for (const trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    }

    _getConfig(config) {
      const dataAttributes = Manipulator.getDataAttributes(this._element);
      Object.keys(dataAttributes).forEach(dataAttr => {
        if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
          delete dataAttributes[dataAttr];
        }
      });
      config = { ...this.constructor.Default,
        ...dataAttributes,
        ...(typeof config === 'object' && config ? config : {})
      };
      config.container = config.container === false ? document.body : getElement(config.container);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
      }

      return config;
    }

    _getDelegateConfig() {
      const config = {};

      if (this._config) {
        for (const key in this._config) {
          if (this.constructor.Default[key] !== this._config[key]) {
            config[key] = this._config[key];
          }
        }
      }

      return config;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    }

    _handlePopperPlacementChange(popperData) {
      const {
        state
      } = popperData;

      if (!state) {
        return;
      }

      this.tip = state.elements.popper;

      this._cleanTipClass();

      this._addAttachmentClass(this._getAttachment(state.placement));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$4);

        const _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tooltip to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Tooltip);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): popover.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$3 = 'popover';
  const DATA_KEY$3 = 'bs.popover';
  const EVENT_KEY$3 = `.${DATA_KEY$3}`;
  const CLASS_PREFIX = 'bs-popover';
  const BSCLS_PREFIX_REGEX = new RegExp(`(^|\\s)${CLASS_PREFIX}\\S+`, 'g');
  const Default$2 = { ...Tooltip.Default,
    placement: 'right',
    offset: [0, 8],
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
  };
  const DefaultType$2 = { ...Tooltip.DefaultType,
    content: '(string|element|function)'
  };
  const Event$1 = {
    HIDE: `hide${EVENT_KEY$3}`,
    HIDDEN: `hidden${EVENT_KEY$3}`,
    SHOW: `show${EVENT_KEY$3}`,
    SHOWN: `shown${EVENT_KEY$3}`,
    INSERTED: `inserted${EVENT_KEY$3}`,
    CLICK: `click${EVENT_KEY$3}`,
    FOCUSIN: `focusin${EVENT_KEY$3}`,
    FOCUSOUT: `focusout${EVENT_KEY$3}`,
    MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
    MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
  };
  const CLASS_NAME_FADE$2 = 'fade';
  const CLASS_NAME_SHOW$2 = 'show';
  const SELECTOR_TITLE = '.popover-header';
  const SELECTOR_CONTENT = '.popover-body';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Popover extends Tooltip {
    // Getters
    static get Default() {
      return Default$2;
    }

    static get NAME() {
      return NAME$3;
    }

    static get Event() {
      return Event$1;
    }

    static get DefaultType() {
      return DefaultType$2;
    } // Overrides


    isWithContent() {
      return this.getTitle() || this._getContent();
    }

    setContent() {
      const tip = this.getTipElement(); // we use append for html objects to maintain js events

      this.setElementContent(SelectorEngine.findOne(SELECTOR_TITLE, tip), this.getTitle());

      let content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this._element);
      }

      this.setElementContent(SelectorEngine.findOne(SELECTOR_CONTENT, tip), content);
      tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    } // Private


    _addAttachmentClass(attachment) {
      this.getTipElement().classList.add(`${CLASS_PREFIX}-${this.updateAttachment(attachment)}`);
    }

    _getContent() {
      return this._element.getAttribute('data-bs-content') || this._config.content;
    }

    _cleanTipClass() {
      const tip = this.getTipElement();
      const tabClass = tip.getAttribute('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY$3);

        const _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          Data.set(this, DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Popover to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Popover);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): scrollspy.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$2 = 'scrollspy';
  const DATA_KEY$2 = 'bs.scrollspy';
  const EVENT_KEY$2 = `.${DATA_KEY$2}`;
  const DATA_API_KEY$1 = '.data-api';
  const Default$1 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  const DefaultType$1 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
  const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
  const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  const CLASS_NAME_ACTIVE$1 = 'active';
  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
  const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  const SELECTOR_NAV_LINKS = '.nav-link';
  const SELECTOR_NAV_ITEMS = '.nav-item';
  const SELECTOR_LIST_ITEMS = '.list-group-item';
  const SELECTOR_DROPDOWN$1 = '.dropdown';
  const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  const METHOD_OFFSET = 'offset';
  const METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class ScrollSpy extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
      this._config = this._getConfig(config);
      this._selector = `${this._config.target} ${SELECTOR_NAV_LINKS}, ${this._config.target} ${SELECTOR_LIST_ITEMS}, ${this._config.target} .${CLASS_NAME_DROPDOWN_ITEM}`;
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
      this.refresh();

      this._process();
    } // Getters


    static get Default() {
      return Default$1;
    }

    static get NAME() {
      return NAME$2;
    } // Public


    refresh() {
      const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      const targets = SelectorEngine.find(this._selector);
      targets.map(element => {
        const targetSelector = getSelectorFromElement(element);
        const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

        if (target) {
          const targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
        this._offsets.push(item[0]);

        this._targets.push(item[1]);
      });
    }

    dispose() {
      EventHandler.off(this._scrollElement, EVENT_KEY$2);
      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default$1,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };

      if (typeof config.target !== 'string' && isElement(config.target)) {
        let {
          id
        } = config.target;

        if (!id) {
          id = getUID(NAME$2);
          config.target.id = id;
        }

        config.target = `#${id}`;
      }

      typeCheckConfig(NAME$2, config, DefaultType$1);
      return config;
    }

    _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    }

    _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }

    _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    }

    _process() {
      const scrollTop = this._getScrollTop() + this._config.offset;

      const scrollHeight = this._getScrollHeight();

      const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        const target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (let i = this._offsets.length; i--;) {
        const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    }

    _activate(target) {
      this._activeTarget = target;

      this._clear();

      const queries = this._selector.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);

      const link = SelectorEngine.findOne(queries.join(','));

      if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
        SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
        link.classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        // Set triggered link as active
        link.classList.add(CLASS_NAME_ACTIVE$1);
        SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
          // Set triggered links parents as active
          // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
          SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

          SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
            SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
          });
        });
      }

      EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
        relatedTarget: target
      });
    }

    _clear() {
      SelectorEngine.find(this._selector).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = ScrollSpy.getInstance(this) || new ScrollSpy(this, typeof config === 'object' ? config : {});

        if (typeof config !== 'string') {
          return;
        }

        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }

        data[config]();
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
    SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .ScrollSpy to jQuery only if jQuery is present
   */

  defineJQueryPlugin(ScrollSpy);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME$1 = 'tab';
  const DATA_KEY$1 = 'bs.tab';
  const EVENT_KEY$1 = `.${DATA_KEY$1}`;
  const DATA_API_KEY = '.data-api';
  const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
  const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
  const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
  const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
  const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = ':scope > li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Tab extends BaseComponent {
    // Getters
    static get NAME() {
      return NAME$1;
    } // Public


    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
        return;
      }

      let previous;
      const target = getElementFromSelector(this._element);

      const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = SelectorEngine.find(itemSelector, listElement);
        previous = previous[previous.length - 1];
      }

      const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
        relatedTarget: this._element
      }) : null;
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
        relatedTarget: previous
      });

      if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
        return;
      }

      this._activate(this._element, listElement);

      const complete = () => {
        EventHandler.trigger(previous, EVENT_HIDDEN$1, {
          relatedTarget: this._element
        });
        EventHandler.trigger(this._element, EVENT_SHOWN$1, {
          relatedTarget: previous
        });
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    } // Private


    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

      const complete = () => this._transitionComplete(element, active, callback);

      if (active && isTransitioning) {
        active.classList.remove(CLASS_NAME_SHOW$1);

        this._queueCallback(complete, element, true);
      } else {
        complete();
      }
    }

    _transitionComplete(element, active, callback) {
      if (active) {
        active.classList.remove(CLASS_NAME_ACTIVE);
        const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

        if (dropdownChild) {
          dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      element.classList.add(CLASS_NAME_ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$1)) {
        element.classList.add(CLASS_NAME_SHOW$1);
      }

      let parent = element.parentNode;

      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }

      if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = element.closest(SELECTOR_DROPDOWN);

        if (dropdownElement) {
          SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        const data = Data.get(this, DATA_KEY$1) || new Tab(this);

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config]();
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }

    if (isDisabled(this)) {
      return;
    }

    const data = Data.get(this, DATA_KEY$1) || new Tab(this);
    data.show();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Tab to jQuery only if jQuery is present
   */

  defineJQueryPlugin(Tab);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): toast.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'toast';
  const DATA_KEY = 'bs.toast';
  const EVENT_KEY = `.${DATA_KEY}`;
  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
  const EVENT_HIDE = `hide${EVENT_KEY}`;
  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
  const EVENT_SHOW = `show${EVENT_KEY}`;
  const EVENT_SHOWN = `shown${EVENT_KEY}`;
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_HIDE = 'hide';
  const CLASS_NAME_SHOW = 'show';
  const CLASS_NAME_SHOWING = 'showing';
  const DefaultType = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  const Default = {
    animation: true,
    autohide: true,
    delay: 5000
  };
  const SELECTOR_DATA_DISMISS = '[data-bs-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Toast extends BaseComponent {
    constructor(element, config) {
      super(element);
      this._config = this._getConfig(config);
      this._timeout = null;
      this._hasMouseInteraction = false;
      this._hasKeyboardInteraction = false;

      this._setListeners();
    } // Getters


    static get DefaultType() {
      return DefaultType;
    }

    static get Default() {
      return Default;
    }

    static get NAME() {
      return NAME;
    } // Public


    show() {
      const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

      if (showEvent.defaultPrevented) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE);
      }

      const complete = () => {
        this._element.classList.remove(CLASS_NAME_SHOWING);

        this._element.classList.add(CLASS_NAME_SHOW);

        EventHandler.trigger(this._element, EVENT_SHOWN);

        this._maybeScheduleHide();
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
        return;
      }

      const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

      if (hideEvent.defaultPrevented) {
        return;
      }

      const complete = () => {
        this._element.classList.add(CLASS_NAME_HIDE);

        EventHandler.trigger(this._element, EVENT_HIDDEN);
      };

      this._element.classList.remove(CLASS_NAME_SHOW);

      this._queueCallback(complete, this._element, this._config.animation);
    }

    dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW)) {
        this._element.classList.remove(CLASS_NAME_SHOW);
      }

      super.dispose();
    } // Private


    _getConfig(config) {
      config = { ...Default,
        ...Manipulator.getDataAttributes(this._element),
        ...(typeof config === 'object' && config ? config : {})
      };
      typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    }

    _maybeScheduleHide() {
      if (!this._config.autohide) {
        return;
      }

      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
        return;
      }

      this._timeout = setTimeout(() => {
        this.hide();
      }, this._config.delay);
    }

    _onInteraction(event, isInteracting) {
      switch (event.type) {
        case 'mouseover':
        case 'mouseout':
          this._hasMouseInteraction = isInteracting;
          break;

        case 'focusin':
        case 'focusout':
          this._hasKeyboardInteraction = isInteracting;
          break;
      }

      if (isInteracting) {
        this._clearTimeout();

        return;
      }

      const nextElement = event.relatedTarget;

      if (this._element === nextElement || this._element.contains(nextElement)) {
        return;
      }

      this._maybeScheduleHide();
    }

    _setListeners() {
      EventHandler.on(this._element, EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, () => this.hide());
      EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
      EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
      EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
    }

    _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static


    static jQueryInterface(config) {
      return this.each(function () {
        let data = Data.get(this, DATA_KEY);

        const _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError(`No method named "${config}"`);
          }

          data[config](this);
        }
      });
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .Toast to jQuery only if jQuery is present
   */


  defineJQueryPlugin(Toast);

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v5.0.1): index.umd.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var index_umd = {
    Alert,
    Button,
    Carousel,
    Collapse,
    Dropdown,
    Modal,
    Offcanvas,
    Popover,
    ScrollSpy,
    Tab,
    Toast,
    Tooltip
  };

  return index_umd;

})));
//# sourceMappingURL=bootstrap.js.map
(function(factory) {
  if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
  } else if (typeof exports === "object") {
      // Node/CommonJS
      module.exports = factory();
  } else {
      // Browser globals
      window.noUiSlider = factory();
  }
})(function() {
  "use strict";

  var VERSION = "%%REPLACE_THIS_WITH_VERSION%%";

  //region Helper Methods

  function isValidFormatter(entry) {
      return typeof entry === "object" && typeof entry.to === "function" && typeof entry.from === "function";
  }

  function removeElement(el) {
      el.parentElement.removeChild(el);
  }

  function isSet(value) {
      return value !== null && value !== undefined;
  }

  // Bindable version
  function preventDefault(e) {
      e.preventDefault();
  }

  // Removes duplicates from an array.
  function unique(array) {
      return array.filter(function(a) {
          return !this[a] ? (this[a] = true) : false;
      }, {});
  }

  // Round a value to the closest 'to'.
  function closest(value, to) {
      return Math.round(value / to) * to;
  }

  // Current position of an element relative to the document.
  function offset(elem, orientation) {
      var rect = elem.getBoundingClientRect();
      var doc = elem.ownerDocument;
      var docElem = doc.documentElement;
      var pageOffset = getPageOffset(doc);

      // getBoundingClientRect contains left scroll in Chrome on Android.
      // I haven't found a feature detection that proves this. Worst case
      // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
      if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
          pageOffset.x = 0;
      }

      return orientation
          ? rect.top + pageOffset.y - docElem.clientTop
          : rect.left + pageOffset.x - docElem.clientLeft;
  }

  // Checks whether a value is numerical.
  function isNumeric(a) {
      return typeof a === "number" && !isNaN(a) && isFinite(a);
  }

  // Sets a class and removes it after [duration] ms.
  function addClassFor(element, className, duration) {
      if (duration > 0) {
          addClass(element, className);
          setTimeout(function() {
              removeClass(element, className);
          }, duration);
      }
  }

  // Limits a value to 0 - 100
  function limit(a) {
      return Math.max(Math.min(a, 100), 0);
  }

  // Wraps a variable as an array, if it isn't one yet.
  // Note that an input array is returned by reference!
  function asArray(a) {
      return Array.isArray(a) ? a : [a];
  }

  // Counts decimals
  function countDecimals(numStr) {
      numStr = String(numStr);
      var pieces = numStr.split(".");
      return pieces.length > 1 ? pieces[1].length : 0;
  }

  // http://youmightnotneedjquery.com/#add_class
  function addClass(el, className) {
      if (el.classList && !/\s/.test(className)) {
          el.classList.add(className);
      } else {
          el.className += " " + className;
      }
  }

  // http://youmightnotneedjquery.com/#remove_class
  function removeClass(el, className) {
      if (el.classList && !/\s/.test(className)) {
          el.classList.remove(className);
      } else {
          el.className = el.className.replace(
              new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"),
              " "
          );
      }
  }

  // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
  function hasClass(el, className) {
      return el.classList
          ? el.classList.contains(className)
          : new RegExp("\\b" + className + "\\b").test(el.className);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
  function getPageOffset(doc) {
      var supportPageOffset = window.pageXOffset !== undefined;
      var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
      var x = supportPageOffset
          ? window.pageXOffset
          : isCSS1Compat
              ? doc.documentElement.scrollLeft
              : doc.body.scrollLeft;
      var y = supportPageOffset
          ? window.pageYOffset
          : isCSS1Compat
              ? doc.documentElement.scrollTop
              : doc.body.scrollTop;

      return {
          x: x,
          y: y
      };
  }

  // we provide a function to compute constants instead
  // of accessing window.* as soon as the module needs it
  // so that we do not compute anything if not needed
  function getActions() {
      // Determine the events to bind. IE11 implements pointerEvents without
      // a prefix, which breaks compatibility with the IE10 implementation.
      return window.navigator.pointerEnabled
          ? {
                start: "pointerdown",
                move: "pointermove",
                end: "pointerup"
            }
          : window.navigator.msPointerEnabled
              ? {
                    start: "MSPointerDown",
                    move: "MSPointerMove",
                    end: "MSPointerUp"
                }
              : {
                    start: "mousedown touchstart",
                    move: "mousemove touchmove",
                    end: "mouseup touchend"
                };
  }

  // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
  // Issue #785
  function getSupportsPassive() {
      var supportsPassive = false;

      /* eslint-disable */
      try {
          var opts = Object.defineProperty({}, "passive", {
              get: function() {
                  supportsPassive = true;
              }
          });

          window.addEventListener("test", null, opts);
      } catch (e) {}
      /* eslint-enable */

      return supportsPassive;
  }

  function getSupportsTouchActionNone() {
      return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
  }

  //endregion

  //region Range Calculation

  // Determine the size of a sub-range in relation to a full range.
  function subRangeRatio(pa, pb) {
      return 100 / (pb - pa);
  }

  // (percentage) How many percent is this value of this range?
  function fromPercentage(range, value, startRange) {
      return (value * 100) / (range[startRange + 1] - range[startRange]);
  }

  // (percentage) Where is this value on this range?
  function toPercentage(range, value) {
      return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
  }

  // (value) How much is this percentage on this range?
  function isPercentage(range, value) {
      return (value * (range[1] - range[0])) / 100 + range[0];
  }

  function getJ(value, arr) {
      var j = 1;

      while (value >= arr[j]) {
          j += 1;
      }

      return j;
  }

  // (percentage) Input a value, find where, on a scale of 0-100, it applies.
  function toStepping(xVal, xPct, value) {
      if (value >= xVal.slice(-1)[0]) {
          return 100;
      }

      var j = getJ(value, xVal);
      var va = xVal[j - 1];
      var vb = xVal[j];
      var pa = xPct[j - 1];
      var pb = xPct[j];

      return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
  }

  // (value) Input a percentage, find where it is on the specified range.
  function fromStepping(xVal, xPct, value) {
      // There is no range group that fits 100
      if (value >= 100) {
          return xVal.slice(-1)[0];
      }

      var j = getJ(value, xPct);
      var va = xVal[j - 1];
      var vb = xVal[j];
      var pa = xPct[j - 1];
      var pb = xPct[j];

      return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
  }

  // (percentage) Get the step that applies at a certain value.
  function getStep(xPct, xSteps, snap, value) {
      if (value === 100) {
          return value;
      }

      var j = getJ(value, xPct);
      var a = xPct[j - 1];
      var b = xPct[j];

      // If 'snap' is set, steps are used as fixed points on the slider.
      if (snap) {
          // Find the closest position, a or b.
          if (value - a > (b - a) / 2) {
              return b;
          }

          return a;
      }

      if (!xSteps[j - 1]) {
          return value;
      }

      return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
  }

  function handleEntryPoint(index, value, that) {
      var percentage;

      // Wrap numerical input in an array.
      if (typeof value === "number") {
          value = [value];
      }

      // Reject any invalid input, by testing whether value is an array.
      if (!Array.isArray(value)) {
          throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
      }

      // Covert min/max syntax to 0 and 100.
      if (index === "min") {
          percentage = 0;
      } else if (index === "max") {
          percentage = 100;
      } else {
          percentage = parseFloat(index);
      }

      // Check for correct input.
      if (!isNumeric(percentage) || !isNumeric(value[0])) {
          throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
      }

      // Store values.
      that.xPct.push(percentage);
      that.xVal.push(value[0]);

      // NaN will evaluate to false too, but to keep
      // logging clear, set step explicitly. Make sure
      // not to override the 'step' setting with false.
      if (!percentage) {
          if (!isNaN(value[1])) {
              that.xSteps[0] = value[1];
          }
      } else {
          that.xSteps.push(isNaN(value[1]) ? false : value[1]);
      }

      that.xHighestCompleteStep.push(0);
  }

  function handleStepPoint(i, n, that) {
      // Ignore 'false' stepping.
      if (!n) {
          return;
      }

      // Step over zero-length ranges (#948);
      if (that.xVal[i] === that.xVal[i + 1]) {
          that.xSteps[i] = that.xHighestCompleteStep[i] = that.xVal[i];

          return;
      }

      // Factor to range ratio
      that.xSteps[i] =
          fromPercentage([that.xVal[i], that.xVal[i + 1]], n, 0) / subRangeRatio(that.xPct[i], that.xPct[i + 1]);

      var totalSteps = (that.xVal[i + 1] - that.xVal[i]) / that.xNumSteps[i];
      var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
      var step = that.xVal[i] + that.xNumSteps[i] * highestStep;

      that.xHighestCompleteStep[i] = step;
  }

  //endregion

  //region Spectrum

  function Spectrum(entry, snap, singleStep) {
      this.xPct = [];
      this.xVal = [];
      this.xSteps = [singleStep || false];
      this.xNumSteps = [false];
      this.xHighestCompleteStep = [];

      this.snap = snap;

      var index;
      var ordered = []; // [0, 'min'], [1, '50%'], [2, 'max']

      // Map the object keys to an array.
      for (index in entry) {
          if (entry.hasOwnProperty(index)) {
              ordered.push([entry[index], index]);
          }
      }

      // Sort all entries by value (numeric sort).
      if (ordered.length && typeof ordered[0][0] === "object") {
          ordered.sort(function(a, b) {
              return a[0][0] - b[0][0];
          });
      } else {
          ordered.sort(function(a, b) {
              return a[0] - b[0];
          });
      }

      // Convert all entries to subranges.
      for (index = 0; index < ordered.length; index++) {
          handleEntryPoint(ordered[index][1], ordered[index][0], this);
      }

      // Store the actual step values.
      // xSteps is sorted in the same order as xPct and xVal.
      this.xNumSteps = this.xSteps.slice(0);

      // Convert all numeric steps to the percentage of the subrange they represent.
      for (index = 0; index < this.xNumSteps.length; index++) {
          handleStepPoint(index, this.xNumSteps[index], this);
      }
  }

  Spectrum.prototype.getDistance = function(value) {
      var index;
      var distances = [];

      for (index = 0; index < this.xNumSteps.length - 1; index++) {
          // last "range" can't contain step size as it is purely an endpoint.
          var step = this.xNumSteps[index];

          if (step && (value / step) % 1 !== 0) {
              throw new Error(
                  "noUiSlider (" +
                      VERSION +
                      "): 'limit', 'margin' and 'padding' of " +
                      this.xPct[index] +
                      "% range must be divisible by step."
              );
          }

          // Calculate percentual distance in current range of limit, margin or padding
          distances[index] = fromPercentage(this.xVal, value, index);
      }

      return distances;
  };

  // Calculate the percentual distance over the whole scale of ranges.
  // direction: 0 = backwards / 1 = forwards
  Spectrum.prototype.getAbsoluteDistance = function(value, distances, direction) {
      var xPct_index = 0;

      // Calculate range where to start calculation
      if (value < this.xPct[this.xPct.length - 1]) {
          while (value > this.xPct[xPct_index + 1]) {
              xPct_index++;
          }
      } else if (value === this.xPct[this.xPct.length - 1]) {
          xPct_index = this.xPct.length - 2;
      }

      // If looking backwards and the value is exactly at a range separator then look one range further
      if (!direction && value === this.xPct[xPct_index + 1]) {
          xPct_index++;
      }

      var start_factor;
      var rest_factor = 1;

      var rest_rel_distance = distances[xPct_index];

      var range_pct = 0;

      var rel_range_distance = 0;
      var abs_distance_counter = 0;
      var range_counter = 0;

      // Calculate what part of the start range the value is
      if (direction) {
          start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      } else {
          start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
      }

      // Do until the complete distance across ranges is calculated
      while (rest_rel_distance > 0) {
          // Calculate the percentage of total range
          range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];

          // Detect if the margin, padding or limit is larger then the current range and calculate
          if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
              // If larger then take the percentual distance of the whole range
              rel_range_distance = range_pct * start_factor;
              // Rest factor of relative percentual distance still to be calculated
              rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
              // Set start factor to 1 as for next range it does not apply.
              start_factor = 1;
          } else {
              // If smaller or equal then take the percentual distance of the calculate percentual part of that range
              rel_range_distance = ((distances[xPct_index + range_counter] * range_pct) / 100) * rest_factor;
              // No rest left as the rest fits in current range
              rest_factor = 0;
          }

          if (direction) {
              abs_distance_counter = abs_distance_counter - rel_range_distance;
              // Limit range to first range when distance becomes outside of minimum range
              if (this.xPct.length + range_counter >= 1) {
                  range_counter--;
              }
          } else {
              abs_distance_counter = abs_distance_counter + rel_range_distance;
              // Limit range to last range when distance becomes outside of maximum range
              if (this.xPct.length - range_counter >= 1) {
                  range_counter++;
              }
          }

          // Rest of relative percentual distance still to be calculated
          rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
      }

      return value + abs_distance_counter;
  };

  Spectrum.prototype.toStepping = function(value) {
      value = toStepping(this.xVal, this.xPct, value);

      return value;
  };

  Spectrum.prototype.fromStepping = function(value) {
      return fromStepping(this.xVal, this.xPct, value);
  };

  Spectrum.prototype.getStep = function(value) {
      value = getStep(this.xPct, this.xSteps, this.snap, value);

      return value;
  };

  Spectrum.prototype.getDefaultStep = function(value, isDown, size) {
      var j = getJ(value, this.xPct);

      // When at the top or stepping down, look at the previous sub-range
      if (value === 100 || (isDown && value === this.xPct[j - 1])) {
          j = Math.max(j - 1, 1);
      }

      return (this.xVal[j] - this.xVal[j - 1]) / size;
  };

  Spectrum.prototype.getNearbySteps = function(value) {
      var j = getJ(value, this.xPct);

      return {
          stepBefore: {
              startValue: this.xVal[j - 2],
              step: this.xNumSteps[j - 2],
              highestStep: this.xHighestCompleteStep[j - 2]
          },
          thisStep: {
              startValue: this.xVal[j - 1],
              step: this.xNumSteps[j - 1],
              highestStep: this.xHighestCompleteStep[j - 1]
          },
          stepAfter: {
              startValue: this.xVal[j],
              step: this.xNumSteps[j],
              highestStep: this.xHighestCompleteStep[j]
          }
      };
  };

  Spectrum.prototype.countStepDecimals = function() {
      var stepDecimals = this.xNumSteps.map(countDecimals);
      return Math.max.apply(null, stepDecimals);
  };

  // Outside testing
  Spectrum.prototype.convert = function(value) {
      return this.getStep(this.toStepping(value));
  };

  //endregion

  //region Options

  /*	Every input option is tested and parsed. This'll prevent
      endless validation in internal methods. These tests are
      structured with an item for every option available. An
      option can be marked as required by setting the 'r' flag.
      The testing function is provided with three arguments:
          - The provided value for the option;
          - A reference to the options object;
          - The name for the option;

      The testing function returns false when an error is detected,
      or true when everything is OK. It can also modify the option
      object, to make sure all values can be correctly looped elsewhere. */

  //region Defaults

  var defaultFormatter = {
      to: function(value) {
          return value !== undefined && value.toFixed(2);
      },
      from: Number
  };

  var cssClasses = {
      target: "target",
      base: "base",
      origin: "origin",
      handle: "handle",
      handleLower: "handle-lower",
      handleUpper: "handle-upper",
      touchArea: "touch-area",
      horizontal: "horizontal",
      vertical: "vertical",
      background: "background",
      connect: "connect",
      connects: "connects",
      ltr: "ltr",
      rtl: "rtl",
      textDirectionLtr: "txt-dir-ltr",
      textDirectionRtl: "txt-dir-rtl",
      draggable: "draggable",
      drag: "state-drag",
      tap: "state-tap",
      active: "active",
      tooltip: "tooltip",
      pips: "pips",
      pipsHorizontal: "pips-horizontal",
      pipsVertical: "pips-vertical",
      marker: "marker",
      markerHorizontal: "marker-horizontal",
      markerVertical: "marker-vertical",
      markerNormal: "marker-normal",
      markerLarge: "marker-large",
      markerSub: "marker-sub",
      value: "value",
      valueHorizontal: "value-horizontal",
      valueVertical: "value-vertical",
      valueNormal: "value-normal",
      valueLarge: "value-large",
      valueSub: "value-sub"
  };

  // Namespaces of internal event listeners
  var INTERNAL_EVENT_NS = {
      tooltips: ".__tooltips",
      aria: ".__aria"
  };

  //endregion

  function validateFormat(entry) {
      // Any object with a to and from method is supported.
      if (isValidFormatter(entry)) {
          return true;
      }

      throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
  }

  function testStep(parsed, entry) {
      if (!isNumeric(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
      }

      // The step option can still be used to set stepping
      // for linear sliders. Overwritten if set in 'range'.
      parsed.singleStep = entry;
  }

  function testKeyboardPageMultiplier(parsed, entry) {
      if (!isNumeric(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'keyboardPageMultiplier' is not numeric.");
      }

      parsed.keyboardPageMultiplier = entry;
  }

  function testKeyboardDefaultStep(parsed, entry) {
      if (!isNumeric(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'keyboardDefaultStep' is not numeric.");
      }

      parsed.keyboardDefaultStep = entry;
  }

  function testRange(parsed, entry) {
      // Filter incorrect input.
      if (typeof entry !== "object" || Array.isArray(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
      }

      // Catch missing start or end.
      if (entry.min === undefined || entry.max === undefined) {
          throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
      }

      // Catch equal start or end.
      if (entry.min === entry.max) {
          throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
      }

      parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.singleStep);
  }

  function testStart(parsed, entry) {
      entry = asArray(entry);

      // Validate input. Values aren't tested, as the public .val method
      // will always provide a valid location.
      if (!Array.isArray(entry) || !entry.length) {
          throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
      }

      // Store the number of handles.
      parsed.handles = entry.length;

      // When the slider is initialized, the .val method will
      // be called with the start options.
      parsed.start = entry;
  }

  function testSnap(parsed, entry) {
      // Enforce 100% stepping within subranges.
      parsed.snap = entry;

      if (typeof entry !== "boolean") {
          throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
      }
  }

  function testAnimate(parsed, entry) {
      // Enforce 100% stepping within subranges.
      parsed.animate = entry;

      if (typeof entry !== "boolean") {
          throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
      }
  }

  function testAnimationDuration(parsed, entry) {
      parsed.animationDuration = entry;

      if (typeof entry !== "number") {
          throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
      }
  }

  function testConnect(parsed, entry) {
      var connect = [false];
      var i;

      // Map legacy options
      if (entry === "lower") {
          entry = [true, false];
      } else if (entry === "upper") {
          entry = [false, true];
      }

      // Handle boolean options
      if (entry === true || entry === false) {
          for (i = 1; i < parsed.handles; i++) {
              connect.push(entry);
          }

          connect.push(false);
      }

      // Reject invalid input
      else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
          throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
      } else {
          connect = entry;
      }

      parsed.connect = connect;
  }

  function testOrientation(parsed, entry) {
      // Set orientation to an a numerical value for easy
      // array selection.
      switch (entry) {
          case "horizontal":
              parsed.ort = 0;
              break;
          case "vertical":
              parsed.ort = 1;
              break;
          default:
              throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
      }
  }

  function testMargin(parsed, entry) {
      if (!isNumeric(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
      }

      // Issue #582
      if (entry === 0) {
          return;
      }

      parsed.margin = parsed.spectrum.getDistance(entry);
  }

  function testLimit(parsed, entry) {
      if (!isNumeric(entry)) {
          throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
      }

      parsed.limit = parsed.spectrum.getDistance(entry);

      if (!parsed.limit || parsed.handles < 2) {
          throw new Error(
              "noUiSlider (" +
                  VERSION +
                  "): 'limit' option is only supported on linear sliders with 2 or more handles."
          );
      }
  }

  function testPadding(parsed, entry) {
      var index;

      if (!isNumeric(entry) && !Array.isArray(entry)) {
          throw new Error(
              "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
          );
      }

      if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
          throw new Error(
              "noUiSlider (" + VERSION + "): 'padding' option must be numeric or array of exactly 2 numbers."
          );
      }

      if (entry === 0) {
          return;
      }

      if (!Array.isArray(entry)) {
          entry = [entry, entry];
      }

      // 'getDistance' returns false for invalid values.
      parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];

      for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
          // last "range" can't contain step size as it is purely an endpoint.
          if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
              throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number(s).");
          }
      }

      var totalPadding = entry[0] + entry[1];
      var firstValue = parsed.spectrum.xVal[0];
      var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];

      if (totalPadding / (lastValue - firstValue) > 1) {
          throw new Error("noUiSlider (" + VERSION + "): 'padding' option must not exceed 100% of the range.");
      }
  }

  function testDirection(parsed, entry) {
      // Set direction as a numerical value for easy parsing.
      // Invert connection for RTL sliders, so that the proper
      // handles get the connect/background classes.
      switch (entry) {
          case "ltr":
              parsed.dir = 0;
              break;
          case "rtl":
              parsed.dir = 1;
              break;
          default:
              throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
      }
  }

  function testBehaviour(parsed, entry) {
      // Make sure the input is a string.
      if (typeof entry !== "string") {
          throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
      }

      // Check if the string contains any keywords.
      // None are required.
      var tap = entry.indexOf("tap") >= 0;
      var drag = entry.indexOf("drag") >= 0;
      var fixed = entry.indexOf("fixed") >= 0;
      var snap = entry.indexOf("snap") >= 0;
      var hover = entry.indexOf("hover") >= 0;
      var unconstrained = entry.indexOf("unconstrained") >= 0;

      if (fixed) {
          if (parsed.handles !== 2) {
              throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
          }

          // Use margin to enforce fixed state
          testMargin(parsed, parsed.start[1] - parsed.start[0]);
      }

      if (unconstrained && (parsed.margin || parsed.limit)) {
          throw new Error(
              "noUiSlider (" + VERSION + "): 'unconstrained' behaviour cannot be used with margin or limit"
          );
      }

      parsed.events = {
          tap: tap || snap,
          drag: drag,
          fixed: fixed,
          snap: snap,
          hover: hover,
          unconstrained: unconstrained
      };
  }

  function testTooltips(parsed, entry) {
      if (entry === false) {
          return;
      }

      if (entry === true) {
          parsed.tooltips = [];

          for (var i = 0; i < parsed.handles; i++) {
              parsed.tooltips.push(true);
          }
      } else {
          parsed.tooltips = asArray(entry);

          if (parsed.tooltips.length !== parsed.handles) {
              throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
          }

          parsed.tooltips.forEach(function(formatter) {
              if (
                  typeof formatter !== "boolean" &&
                  (typeof formatter !== "object" || typeof formatter.to !== "function")
              ) {
                  throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
              }
          });
      }
  }

  function testAriaFormat(parsed, entry) {
      parsed.ariaFormat = entry;
      validateFormat(entry);
  }

  function testFormat(parsed, entry) {
      parsed.format = entry;
      validateFormat(entry);
  }

  function testKeyboardSupport(parsed, entry) {
      parsed.keyboardSupport = entry;

      if (typeof entry !== "boolean") {
          throw new Error("noUiSlider (" + VERSION + "): 'keyboardSupport' option must be a boolean.");
      }
  }

  function testDocumentElement(parsed, entry) {
      // This is an advanced option. Passed values are used without validation.
      parsed.documentElement = entry;
  }

  function testCssPrefix(parsed, entry) {
      if (typeof entry !== "string" && entry !== false) {
          throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
      }

      parsed.cssPrefix = entry;
  }

  function testCssClasses(parsed, entry) {
      if (typeof entry !== "object") {
          throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
      }

      if (typeof parsed.cssPrefix === "string") {
          parsed.cssClasses = {};

          for (var key in entry) {
              if (!entry.hasOwnProperty(key)) {
                  continue;
              }

              parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
          }
      } else {
          parsed.cssClasses = entry;
      }
  }

  // Test all developer settings and parse to assumption-safe values.
  function testOptions(options) {
      // To prove a fix for #537, freeze options here.
      // If the object is modified, an error will be thrown.
      // Object.freeze(options);

      var parsed = {
          margin: 0,
          limit: 0,
          padding: 0,
          animate: true,
          animationDuration: 300,
          ariaFormat: defaultFormatter,
          format: defaultFormatter
      };

      // Tests are executed in the order they are presented here.
      var tests = {
          step: { r: false, t: testStep },
          keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
          keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
          start: { r: true, t: testStart },
          connect: { r: true, t: testConnect },
          direction: { r: true, t: testDirection },
          snap: { r: false, t: testSnap },
          animate: { r: false, t: testAnimate },
          animationDuration: { r: false, t: testAnimationDuration },
          range: { r: true, t: testRange },
          orientation: { r: false, t: testOrientation },
          margin: { r: false, t: testMargin },
          limit: { r: false, t: testLimit },
          padding: { r: false, t: testPadding },
          behaviour: { r: true, t: testBehaviour },
          ariaFormat: { r: false, t: testAriaFormat },
          format: { r: false, t: testFormat },
          tooltips: { r: false, t: testTooltips },
          keyboardSupport: { r: true, t: testKeyboardSupport },
          documentElement: { r: false, t: testDocumentElement },
          cssPrefix: { r: true, t: testCssPrefix },
          cssClasses: { r: true, t: testCssClasses }
      };

      var defaults = {
          connect: false,
          direction: "ltr",
          behaviour: "tap",
          orientation: "horizontal",
          keyboardSupport: true,
          cssPrefix: "noUi-",
          cssClasses: cssClasses,
          keyboardPageMultiplier: 5,
          keyboardDefaultStep: 10
      };

      // AriaFormat defaults to regular format, if any.
      if (options.format && !options.ariaFormat) {
          options.ariaFormat = options.format;
      }

      // Run all options through a testing mechanism to ensure correct
      // input. It should be noted that options might get modified to
      // be handled properly. E.g. wrapping integers in arrays.
      Object.keys(tests).forEach(function(name) {
          // If the option isn't set, but it is required, throw an error.
          if (!isSet(options[name]) && defaults[name] === undefined) {
              if (tests[name].r) {
                  throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
              }

              return true;
          }

          tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
      });

      // Forward pips options
      parsed.pips = options.pips;

      // All recent browsers accept unprefixed transform.
      // We need -ms- for IE9 and -webkit- for older Android;
      // Assume use of -webkit- if unprefixed and -ms- are not supported.
      // https://caniuse.com/#feat=transforms2d
      var d = document.createElement("div");
      var msPrefix = d.style.msTransform !== undefined;
      var noPrefix = d.style.transform !== undefined;

      parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";

      // Pips don't move, so we can place them using left/top.
      var styles = [["left", "top"], ["right", "bottom"]];

      parsed.style = styles[parsed.dir][parsed.ort];

      return parsed;
  }

  //endregion

  function scope(target, options, originalOptions) {
      var actions = getActions();
      var supportsTouchActionNone = getSupportsTouchActionNone();
      var supportsPassive = supportsTouchActionNone && getSupportsPassive();

      // All variables local to 'scope' are prefixed with 'scope_'

      // Slider DOM Nodes
      var scope_Target = target;
      var scope_Base;
      var scope_Handles;
      var scope_Connects;
      var scope_Pips;
      var scope_Tooltips;

      // Slider state values
      var scope_Spectrum = options.spectrum;
      var scope_Values = [];
      var scope_Locations = [];
      var scope_HandleNumbers = [];
      var scope_ActiveHandlesCount = 0;
      var scope_Events = {};

      // Exposed API
      var scope_Self;

      // Document Nodes
      var scope_Document = target.ownerDocument;
      var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
      var scope_Body = scope_Document.body;

      // Pips constants
      var PIPS_NONE = -1;
      var PIPS_NO_VALUE = 0;
      var PIPS_LARGE_VALUE = 1;
      var PIPS_SMALL_VALUE = 2;

      // For horizontal sliders in standard ltr documents,
      // make .noUi-origin overflow to the left so the document doesn't scroll.
      var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;

      // Creates a node, adds it to target, returns the new node.
      function addNodeTo(addTarget, className) {
          var div = scope_Document.createElement("div");

          if (className) {
              addClass(div, className);
          }

          addTarget.appendChild(div);

          return div;
      }

      // Append a origin to the base
      function addOrigin(base, handleNumber) {
          var origin = addNodeTo(base, options.cssClasses.origin);
          var handle = addNodeTo(origin, options.cssClasses.handle);

          addNodeTo(handle, options.cssClasses.touchArea);

          handle.setAttribute("data-handle", handleNumber);

          if (options.keyboardSupport) {
              // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
              // 0 = focusable and reachable
              handle.setAttribute("tabindex", "0");
              handle.addEventListener("keydown", function(event) {
                  return eventKeydown(event, handleNumber);
              });
          }

          handle.setAttribute("role", "slider");
          handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");

          if (handleNumber === 0) {
              addClass(handle, options.cssClasses.handleLower);
          } else if (handleNumber === options.handles - 1) {
              addClass(handle, options.cssClasses.handleUpper);
          }

          return origin;
      }

      // Insert nodes for connect elements
      function addConnect(base, add) {
          if (!add) {
              return false;
          }

          return addNodeTo(base, options.cssClasses.connect);
      }

      // Add handles to the slider base.
      function addElements(connectOptions, base) {
          var connectBase = addNodeTo(base, options.cssClasses.connects);

          scope_Handles = [];
          scope_Connects = [];

          scope_Connects.push(addConnect(connectBase, connectOptions[0]));

          // [::::O====O====O====]
          // connectOptions = [0, 1, 1, 1]

          for (var i = 0; i < options.handles; i++) {
              // Keep a list of all added handles.
              scope_Handles.push(addOrigin(base, i));
              scope_HandleNumbers[i] = i;
              scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
          }
      }

      // Initialize a single slider.
      function addSlider(addTarget) {
          // Apply classes and data to the target.
          addClass(addTarget, options.cssClasses.target);

          if (options.dir === 0) {
              addClass(addTarget, options.cssClasses.ltr);
          } else {
              addClass(addTarget, options.cssClasses.rtl);
          }

          if (options.ort === 0) {
              addClass(addTarget, options.cssClasses.horizontal);
          } else {
              addClass(addTarget, options.cssClasses.vertical);
          }

          var textDirection = getComputedStyle(addTarget).direction;

          if (textDirection === "rtl") {
              addClass(addTarget, options.cssClasses.textDirectionRtl);
          } else {
              addClass(addTarget, options.cssClasses.textDirectionLtr);
          }

          return addNodeTo(addTarget, options.cssClasses.base);
      }

      function addTooltip(handle, handleNumber) {
          if (!options.tooltips[handleNumber]) {
              return false;
          }

          return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
      }

      function isSliderDisabled() {
          return scope_Target.hasAttribute("disabled");
      }

      // Disable the slider dragging if any handle is disabled
      function isHandleDisabled(handleNumber) {
          var handleOrigin = scope_Handles[handleNumber];
          return handleOrigin.hasAttribute("disabled");
      }

      function removeTooltips() {
          if (scope_Tooltips) {
              removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
              scope_Tooltips.forEach(function(tooltip) {
                  if (tooltip) {
                      removeElement(tooltip);
                  }
              });
              scope_Tooltips = null;
          }
      }

      // The tooltips option is a shorthand for using the 'update' event.
      function tooltips() {
          removeTooltips();

          // Tooltips are added with options.tooltips in original order.
          scope_Tooltips = scope_Handles.map(addTooltip);

          bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function(values, handleNumber, unencoded) {
              if (!scope_Tooltips[handleNumber]) {
                  return;
              }

              var formattedValue = values[handleNumber];

              if (options.tooltips[handleNumber] !== true) {
                  formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
              }

              scope_Tooltips[handleNumber].innerHTML = formattedValue;
          });
      }

      function aria() {
          removeEvent("update" + INTERNAL_EVENT_NS.aria);
          bindEvent("update" + INTERNAL_EVENT_NS.aria, function(values, handleNumber, unencoded, tap, positions) {
              // Update Aria Values for all handles, as a change in one changes min and max values for the next.
              scope_HandleNumbers.forEach(function(index) {
                  var handle = scope_Handles[index];

                  var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
                  var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);

                  var now = positions[index];

                  // Formatted value for display
                  var text = options.ariaFormat.to(unencoded[index]);

                  // Map to slider range values
                  min = scope_Spectrum.fromStepping(min).toFixed(1);
                  max = scope_Spectrum.fromStepping(max).toFixed(1);
                  now = scope_Spectrum.fromStepping(now).toFixed(1);

                  handle.children[0].setAttribute("aria-valuemin", min);
                  handle.children[0].setAttribute("aria-valuemax", max);
                  handle.children[0].setAttribute("aria-valuenow", now);
                  handle.children[0].setAttribute("aria-valuetext", text);
              });
          });
      }

      function getGroup(mode, values, stepped) {
          // Use the range.
          if (mode === "range" || mode === "steps") {
              return scope_Spectrum.xVal;
          }

          if (mode === "count") {
              if (values < 2) {
                  throw new Error("noUiSlider (" + VERSION + "): 'values' (>= 2) required for mode 'count'.");
              }

              // Divide 0 - 100 in 'count' parts.
              var interval = values - 1;
              var spread = 100 / interval;

              values = [];

              // List these parts and have them handled as 'positions'.
              while (interval--) {
                  values[interval] = interval * spread;
              }

              values.push(100);

              mode = "positions";
          }

          if (mode === "positions") {
              // Map all percentages to on-range values.
              return values.map(function(value) {
                  return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
              });
          }

          if (mode === "values") {
              // If the value must be stepped, it needs to be converted to a percentage first.
              if (stepped) {
                  return values.map(function(value) {
                      // Convert to percentage, apply step, return to value.
                      return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
                  });
              }

              // Otherwise, we can simply use the values.
              return values;
          }
      }

      function generateSpread(density, mode, group) {
          function safeIncrement(value, increment) {
              // Avoid floating point variance by dropping the smallest decimal places.
              return (value + increment).toFixed(7) / 1;
          }

          var indexes = {};
          var firstInRange = scope_Spectrum.xVal[0];
          var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
          var ignoreFirst = false;
          var ignoreLast = false;
          var prevPct = 0;

          // Create a copy of the group, sort it and filter away all duplicates.
          group = unique(
              group.slice().sort(function(a, b) {
                  return a - b;
              })
          );

          // Make sure the range starts with the first element.
          if (group[0] !== firstInRange) {
              group.unshift(firstInRange);
              ignoreFirst = true;
          }

          // Likewise for the last one.
          if (group[group.length - 1] !== lastInRange) {
              group.push(lastInRange);
              ignoreLast = true;
          }

          group.forEach(function(current, index) {
              // Get the current step and the lower + upper positions.
              var step;
              var i;
              var q;
              var low = current;
              var high = group[index + 1];
              var newPct;
              var pctDifference;
              var pctPos;
              var type;
              var steps;
              var realSteps;
              var stepSize;
              var isSteps = mode === "steps";

              // When using 'steps' mode, use the provided steps.
              // Otherwise, we'll step on to the next subrange.
              if (isSteps) {
                  step = scope_Spectrum.xNumSteps[index];
              }

              // Default to a 'full' step.
              if (!step) {
                  step = high - low;
              }

              // Low can be 0, so test for false. Index 0 is already handled.
              if (low === false) {
                  return;
              }

              // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
              if (high === undefined) {
                  high = low;
              }

              // Make sure step isn't 0, which would cause an infinite loop (#654)
              step = Math.max(step, 0.0000001);

              // Find all steps in the subrange.
              for (i = low; i <= high; i = safeIncrement(i, step)) {
                  // Get the percentage value for the current step,
                  // calculate the size for the subrange.
                  newPct = scope_Spectrum.toStepping(i);
                  pctDifference = newPct - prevPct;

                  steps = pctDifference / density;
                  realSteps = Math.round(steps);

                  // This ratio represents the amount of percentage-space a point indicates.
                  // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
                  // Round the percentage offset to an even number, then divide by two
                  // to spread the offset on both sides of the range.
                  stepSize = pctDifference / realSteps;

                  // Divide all points evenly, adding the correct number to this subrange.
                  // Run up to <= so that 100% gets a point, event if ignoreLast is set.
                  for (q = 1; q <= realSteps; q += 1) {
                      // The ratio between the rounded value and the actual size might be ~1% off.
                      // Correct the percentage offset by the number of points
                      // per subrange. density = 1 will result in 100 points on the
                      // full range, 2 for 50, 4 for 25, etc.
                      pctPos = prevPct + q * stepSize;
                      indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
                  }

                  // Determine the point type.
                  type = group.indexOf(i) > -1 ? PIPS_LARGE_VALUE : isSteps ? PIPS_SMALL_VALUE : PIPS_NO_VALUE;

                  // Enforce the 'ignoreFirst' option by overwriting the type for 0.
                  if (!index && ignoreFirst && i !== high) {
                      type = 0;
                  }

                  if (!(i === high && ignoreLast)) {
                      // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
                      indexes[newPct.toFixed(5)] = [i, type];
                  }

                  // Update the percentage count.
                  prevPct = newPct;
              }
          });

          return indexes;
      }

      function addMarking(spread, filterFunc, formatter) {
          var element = scope_Document.createElement("div");

          var valueSizeClasses = [];
          valueSizeClasses[PIPS_NO_VALUE] = options.cssClasses.valueNormal;
          valueSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.valueLarge;
          valueSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.valueSub;

          var markerSizeClasses = [];
          markerSizeClasses[PIPS_NO_VALUE] = options.cssClasses.markerNormal;
          markerSizeClasses[PIPS_LARGE_VALUE] = options.cssClasses.markerLarge;
          markerSizeClasses[PIPS_SMALL_VALUE] = options.cssClasses.markerSub;

          var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
          var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];

          addClass(element, options.cssClasses.pips);
          addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);

          function getClasses(type, source) {
              var a = source === options.cssClasses.value;
              var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
              var sizeClasses = a ? valueSizeClasses : markerSizeClasses;

              return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
          }

          function addSpread(offset, value, type) {
              // Apply the filter function, if it is set.
              type = filterFunc ? filterFunc(value, type) : type;

              if (type === PIPS_NONE) {
                  return;
              }

              // Add a marker for every point
              var node = addNodeTo(element, false);
              node.className = getClasses(type, options.cssClasses.marker);
              node.style[options.style] = offset + "%";

              // Values are only appended for points marked '1' or '2'.
              if (type > PIPS_NO_VALUE) {
                  node = addNodeTo(element, false);
                  node.className = getClasses(type, options.cssClasses.value);
                  node.setAttribute("data-value", value);
                  node.style[options.style] = offset + "%";
                  node.innerHTML = formatter.to(value);
              }
          }

          // Append all points.
          Object.keys(spread).forEach(function(offset) {
              addSpread(offset, spread[offset][0], spread[offset][1]);
          });

          return element;
      }

      function removePips() {
          if (scope_Pips) {
              removeElement(scope_Pips);
              scope_Pips = null;
          }
      }

      function pips(grid) {
          // Fix #669
          removePips();

          var mode = grid.mode;
          var density = grid.density || 1;
          var filter = grid.filter || false;
          var values = grid.values || false;
          var stepped = grid.stepped || false;
          var group = getGroup(mode, values, stepped);
          var spread = generateSpread(density, mode, group);
          var format = grid.format || {
              to: Math.round
          };

          scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));

          return scope_Pips;
      }

      // Shorthand for base dimensions.
      function baseSize() {
          var rect = scope_Base.getBoundingClientRect();
          var alt = "offset" + ["Width", "Height"][options.ort];
          return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
      }

      // Handler for attaching events trough a proxy.
      function attachEvent(events, element, callback, data) {
          // This function can be used to 'filter' events to the slider.
          // element is a node, not a nodeList

          var method = function(e) {
              e = fixEvent(e, data.pageOffset, data.target || element);

              // fixEvent returns false if this event has a different target
              // when handling (multi-) touch events;
              if (!e) {
                  return false;
              }

              // doNotReject is passed by all end events to make sure released touches
              // are not rejected, leaving the slider "stuck" to the cursor;
              if (isSliderDisabled() && !data.doNotReject) {
                  return false;
              }

              // Stop if an active 'tap' transition is taking place.
              if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
                  return false;
              }

              // Ignore right or middle clicks on start #454
              if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
                  return false;
              }

              // Ignore right or middle clicks on start #454
              if (data.hover && e.buttons) {
                  return false;
              }

              // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
              // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
              // touch-action: manipulation, but that allows panning, which breaks
              // sliders after zooming/on non-responsive pages.
              // See: https://bugs.webkit.org/show_bug.cgi?id=133112
              if (!supportsPassive) {
                  e.preventDefault();
              }

              e.calcPoint = e.points[options.ort];

              // Call the event handler with the event [ and additional data ].
              callback(e, data);
          };

          var methods = [];

          // Bind a closure on the target for every event type.
          events.split(" ").forEach(function(eventName) {
              element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
              methods.push([eventName, method]);
          });

          return methods;
      }

      // Provide a clean event with standardized offset values.
      function fixEvent(e, pageOffset, eventTarget) {
          // Filter the event to register the type, which can be
          // touch, mouse or pointer. Offset changes need to be
          // made on an event specific basis.
          var touch = e.type.indexOf("touch") === 0;
          var mouse = e.type.indexOf("mouse") === 0;
          var pointer = e.type.indexOf("pointer") === 0;

          var x;
          var y;

          // IE10 implemented pointer events with a prefix;
          if (e.type.indexOf("MSPointer") === 0) {
              pointer = true;
          }

          // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
          // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
          // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
          if (e.type === "mousedown" && !e.buttons && !e.touches) {
              return false;
          }

          // The only thing one handle should be concerned about is the touches that originated on top of it.
          if (touch) {
              // Returns true if a touch originated on the target.
              var isTouchOnTarget = function(checkTouch) {
                  return (
                      checkTouch.target === eventTarget ||
                      eventTarget.contains(checkTouch.target) ||
                      (checkTouch.target.shadowRoot && checkTouch.target.shadowRoot.contains(eventTarget))
                  );
              };

              // In the case of touchstart events, we need to make sure there is still no more than one
              // touch on the target so we look amongst all touches.
              if (e.type === "touchstart") {
                  var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);

                  // Do not support more than one touch per handle.
                  if (targetTouches.length > 1) {
                      return false;
                  }

                  x = targetTouches[0].pageX;
                  y = targetTouches[0].pageY;
              } else {
                  // In the other cases, find on changedTouches is enough.
                  var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);

                  // Cancel if the target touch has not moved.
                  if (!targetTouch) {
                      return false;
                  }

                  x = targetTouch.pageX;
                  y = targetTouch.pageY;
              }
          }

          pageOffset = pageOffset || getPageOffset(scope_Document);

          if (mouse || pointer) {
              x = e.clientX + pageOffset.x;
              y = e.clientY + pageOffset.y;
          }

          e.pageOffset = pageOffset;
          e.points = [x, y];
          e.cursor = mouse || pointer; // Fix #435

          return e;
      }

      // Translate a coordinate in the document to a percentage on the slider
      function calcPointToPercentage(calcPoint) {
          var location = calcPoint - offset(scope_Base, options.ort);
          var proposal = (location * 100) / baseSize();

          // Clamp proposal between 0% and 100%
          // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
          // are used (e.g. contained handles feature)
          proposal = limit(proposal);

          return options.dir ? 100 - proposal : proposal;
      }

      // Find handle closest to a certain percentage on the slider
      function getClosestHandle(clickedPosition) {
          var smallestDifference = 100;
          var handleNumber = false;

          scope_Handles.forEach(function(handle, index) {
              // Disabled handles are ignored
              if (isHandleDisabled(index)) {
                  return;
              }

              var handlePosition = scope_Locations[index];
              var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);

              // Initial state
              var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;

              // Difference with this handle is smaller than the previously checked handle
              var isCloser = differenceWithThisHandle < smallestDifference;
              var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;

              if (isCloser || isCloserAfter || clickAtEdge) {
                  handleNumber = index;
                  smallestDifference = differenceWithThisHandle;
              }
          });

          return handleNumber;
      }

      // Fire 'end' when a mouse or pen leaves the document.
      function documentLeave(event, data) {
          if (event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null) {
              eventEnd(event, data);
          }
      }

      // Handle movement on document for handle and range drag.
      function eventMove(event, data) {
          // Fix #498
          // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
          // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
          // IE9 has .buttons and .which zero on mousemove.
          // Firefox breaks the spec MDN defines.
          if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
              return eventEnd(event, data);
          }

          // Check if we are moving up or down
          var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);

          // Convert the movement into a percentage of the slider width/height
          var proposal = (movement * 100) / data.baseSize;

          moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
      }

      // Unbind move events on document, call callbacks.
      function eventEnd(event, data) {
          // The handle is no longer active, so remove the class.
          if (data.handle) {
              removeClass(data.handle, options.cssClasses.active);
              scope_ActiveHandlesCount -= 1;
          }

          // Unbind the move and end events, which are added on 'start'.
          data.listeners.forEach(function(c) {
              scope_DocumentElement.removeEventListener(c[0], c[1]);
          });

          if (scope_ActiveHandlesCount === 0) {
              // Remove dragging class.
              removeClass(scope_Target, options.cssClasses.drag);
              setZindex();

              // Remove cursor styles and text-selection events bound to the body.
              if (event.cursor) {
                  scope_Body.style.cursor = "";
                  scope_Body.removeEventListener("selectstart", preventDefault);
              }
          }

          data.handleNumbers.forEach(function(handleNumber) {
              fireEvent("change", handleNumber);
              fireEvent("set", handleNumber);
              fireEvent("end", handleNumber);
          });
      }

      // Bind move events on document.
      function eventStart(event, data) {
          // Ignore event if any handle is disabled
          if (data.handleNumbers.some(isHandleDisabled)) {
              return false;
          }

          var handle;

          if (data.handleNumbers.length === 1) {
              var handleOrigin = scope_Handles[data.handleNumbers[0]];

              handle = handleOrigin.children[0];
              scope_ActiveHandlesCount += 1;

              // Mark the handle as 'active' so it can be styled.
              addClass(handle, options.cssClasses.active);
          }

          // A drag should never propagate up to the 'tap' event.
          event.stopPropagation();

          // Record the event listeners.
          var listeners = [];

          // Attach the move and end events.
          var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
              // The event target has changed so we need to propagate the original one so that we keep
              // relying on it to extract target touches.
              target: event.target,
              handle: handle,
              listeners: listeners,
              startCalcPoint: event.calcPoint,
              baseSize: baseSize(),
              pageOffset: event.pageOffset,
              handleNumbers: data.handleNumbers,
              buttonsProperty: event.buttons,
              locations: scope_Locations.slice()
          });

          var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
              target: event.target,
              handle: handle,
              listeners: listeners,
              doNotReject: true,
              handleNumbers: data.handleNumbers
          });

          var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
              target: event.target,
              handle: handle,
              listeners: listeners,
              doNotReject: true,
              handleNumbers: data.handleNumbers
          });

          // We want to make sure we pushed the listeners in the listener list rather than creating
          // a new one as it has already been passed to the event handlers.
          listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));

          // Text selection isn't an issue on touch devices,
          // so adding cursor styles can be skipped.
          if (event.cursor) {
              // Prevent the 'I' cursor and extend the range-drag cursor.
              scope_Body.style.cursor = getComputedStyle(event.target).cursor;

              // Mark the target with a dragging state.
              if (scope_Handles.length > 1) {
                  addClass(scope_Target, options.cssClasses.drag);
              }

              // Prevent text selection when dragging the handles.
              // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
              // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
              // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
              // The 'cursor' flag is false.
              // See: http://caniuse.com/#search=selectstart
              scope_Body.addEventListener("selectstart", preventDefault, false);
          }

          data.handleNumbers.forEach(function(handleNumber) {
              fireEvent("start", handleNumber);
          });
      }

      // Move closest handle to tapped location.
      function eventTap(event) {
          // The tap event shouldn't propagate up
          event.stopPropagation();

          var proposal = calcPointToPercentage(event.calcPoint);
          var handleNumber = getClosestHandle(proposal);

          // Tackle the case that all handles are 'disabled'.
          if (handleNumber === false) {
              return false;
          }

          // Flag the slider as it is now in a transitional state.
          // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
          if (!options.events.snap) {
              addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
          }

          setHandle(handleNumber, proposal, true, true);

          setZindex();

          fireEvent("slide", handleNumber, true);
          fireEvent("update", handleNumber, true);
          fireEvent("change", handleNumber, true);
          fireEvent("set", handleNumber, true);

          if (options.events.snap) {
              eventStart(event, { handleNumbers: [handleNumber] });
          }
      }

      // Fires a 'hover' event for a hovered mouse/pen position.
      function eventHover(event) {
          var proposal = calcPointToPercentage(event.calcPoint);

          var to = scope_Spectrum.getStep(proposal);
          var value = scope_Spectrum.fromStepping(to);

          Object.keys(scope_Events).forEach(function(targetEvent) {
              if ("hover" === targetEvent.split(".")[0]) {
                  scope_Events[targetEvent].forEach(function(callback) {
                      callback.call(scope_Self, value);
                  });
              }
          });
      }

      // Handles keydown on focused handles
      // Don't move the document when pressing arrow keys on focused handles
      function eventKeydown(event, handleNumber) {
          if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
              return false;
          }

          var horizontalKeys = ["Left", "Right"];
          var verticalKeys = ["Down", "Up"];
          var largeStepKeys = ["PageDown", "PageUp"];
          var edgeKeys = ["Home", "End"];

          if (options.dir && !options.ort) {
              // On an right-to-left slider, the left and right keys act inverted
              horizontalKeys.reverse();
          } else if (options.ort && !options.dir) {
              // On a top-to-bottom slider, the up and down keys act inverted
              verticalKeys.reverse();
              largeStepKeys.reverse();
          }

          // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
          var key = event.key.replace("Arrow", "");

          var isLargeDown = key === largeStepKeys[0];
          var isLargeUp = key === largeStepKeys[1];
          var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
          var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
          var isMin = key === edgeKeys[0];
          var isMax = key === edgeKeys[1];

          if (!isDown && !isUp && !isMin && !isMax) {
              return true;
          }

          event.preventDefault();

          var to;

          if (isUp || isDown) {
              var multiplier = options.keyboardPageMultiplier;
              var direction = isDown ? 0 : 1;
              var steps = getNextStepsForHandle(handleNumber);
              var step = steps[direction];

              // At the edge of a slider, do nothing
              if (step === null) {
                  return false;
              }

              // No step set, use the default of 10% of the sub-range
              if (step === false) {
                  step = scope_Spectrum.getDefaultStep(
                      scope_Locations[handleNumber],
                      isDown,
                      options.keyboardDefaultStep
                  );
              }

              if (isLargeUp || isLargeDown) {
                  step *= multiplier;
              }

              // Step over zero-length ranges (#948);
              step = Math.max(step, 0.0000001);

              // Decrement for down steps
              step = (isDown ? -1 : 1) * step;

              to = scope_Values[handleNumber] + step;
          } else if (isMax) {
              // End key
              to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
          } else {
              // Home key
              to = options.spectrum.xVal[0];
          }

          setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);

          fireEvent("slide", handleNumber);
          fireEvent("update", handleNumber);
          fireEvent("change", handleNumber);
          fireEvent("set", handleNumber);

          return false;
      }

      // Attach events to several slider parts.
      function bindSliderEvents(behaviour) {
          // Attach the standard drag event to the handles.
          if (!behaviour.fixed) {
              scope_Handles.forEach(function(handle, index) {
                  // These events are only bound to the visual handle
                  // element, not the 'real' origin element.
                  attachEvent(actions.start, handle.children[0], eventStart, {
                      handleNumbers: [index]
                  });
              });
          }

          // Attach the tap event to the slider base.
          if (behaviour.tap) {
              attachEvent(actions.start, scope_Base, eventTap, {});
          }

          // Fire hover events
          if (behaviour.hover) {
              attachEvent(actions.move, scope_Base, eventHover, {
                  hover: true
              });
          }

          // Make the range draggable.
          if (behaviour.drag) {
              scope_Connects.forEach(function(connect, index) {
                  if (connect === false || index === 0 || index === scope_Connects.length - 1) {
                      return;
                  }

                  var handleBefore = scope_Handles[index - 1];
                  var handleAfter = scope_Handles[index];
                  var eventHolders = [connect];

                  addClass(connect, options.cssClasses.draggable);

                  // When the range is fixed, the entire range can
                  // be dragged by the handles. The handle in the first
                  // origin will propagate the start event upward,
                  // but it needs to be bound manually on the other.
                  if (behaviour.fixed) {
                      eventHolders.push(handleBefore.children[0]);
                      eventHolders.push(handleAfter.children[0]);
                  }

                  eventHolders.forEach(function(eventHolder) {
                      attachEvent(actions.start, eventHolder, eventStart, {
                          handles: [handleBefore, handleAfter],
                          handleNumbers: [index - 1, index]
                      });
                  });
              });
          }
      }

      // Attach an event to this slider, possibly including a namespace
      function bindEvent(namespacedEvent, callback) {
          scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
          scope_Events[namespacedEvent].push(callback);

          // If the event bound is 'update,' fire it immediately for all handles.
          if (namespacedEvent.split(".")[0] === "update") {
              scope_Handles.forEach(function(a, index) {
                  fireEvent("update", index);
              });
          }
      }

      function isInternalNamespace(namespace) {
          return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
      }

      // Undo attachment of event
      function removeEvent(namespacedEvent) {
          var event = namespacedEvent && namespacedEvent.split(".")[0];
          var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;

          Object.keys(scope_Events).forEach(function(bind) {
              var tEvent = bind.split(".")[0];
              var tNamespace = bind.substring(tEvent.length);
              if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
                  // only delete protected internal event if intentional
                  if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
                      delete scope_Events[bind];
                  }
              }
          });
      }

      // External event handling
      function fireEvent(eventName, handleNumber, tap) {
          Object.keys(scope_Events).forEach(function(targetEvent) {
              var eventType = targetEvent.split(".")[0];

              if (eventName === eventType) {
                  scope_Events[targetEvent].forEach(function(callback) {
                      callback.call(
                          // Use the slider public API as the scope ('this')
                          scope_Self,
                          // Return values as array, so arg_1[arg_2] is always valid.
                          scope_Values.map(options.format.to),
                          // Handle index, 0 or 1
                          handleNumber,
                          // Un-formatted slider values
                          scope_Values.slice(),
                          // Event is fired by tap, true or false
                          tap || false,
                          // Left offset of the handle, in relation to the slider
                          scope_Locations.slice(),
                          // add the slider public API to an accessible parameter when this is unavailable
                          scope_Self
                      );
                  });
              }
          });
      }

      // Split out the handle positioning logic so the Move event can use it, too
      function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
          var distance;

          // For sliders with multiple handles, limit movement to the other handle.
          // Apply the margin option by adding it to the handle positions.
          if (scope_Handles.length > 1 && !options.events.unconstrained) {
              if (lookBackward && handleNumber > 0) {
                  distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, 0);
                  to = Math.max(to, distance);
              }

              if (lookForward && handleNumber < scope_Handles.length - 1) {
                  distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, 1);
                  to = Math.min(to, distance);
              }
          }

          // The limit option has the opposite effect, limiting handles to a
          // maximum distance from another. Limit must be > 0, as otherwise
          // handles would be unmovable.
          if (scope_Handles.length > 1 && options.limit) {
              if (lookBackward && handleNumber > 0) {
                  distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, 0);
                  to = Math.min(to, distance);
              }

              if (lookForward && handleNumber < scope_Handles.length - 1) {
                  distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, 1);
                  to = Math.max(to, distance);
              }
          }

          // The padding option keeps the handles a certain distance from the
          // edges of the slider. Padding must be > 0.
          if (options.padding) {
              if (handleNumber === 0) {
                  distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], 0);
                  to = Math.max(to, distance);
              }

              if (handleNumber === scope_Handles.length - 1) {
                  distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], 1);
                  to = Math.min(to, distance);
              }
          }

          to = scope_Spectrum.getStep(to);

          // Limit percentage to the 0 - 100 range
          to = limit(to);

          // Return false if handle can't move
          if (to === reference[handleNumber] && !getValue) {
              return false;
          }

          return to;
      }

      // Uses slider orientation to create CSS rules. a = base value;
      function inRuleOrder(v, a) {
          var o = options.ort;
          return (o ? a : v) + ", " + (o ? v : a);
      }

      // Moves handle(s) by a percentage
      // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
      function moveHandles(upward, proposal, locations, handleNumbers) {
          var proposals = locations.slice();

          var b = [!upward, upward];
          var f = [upward, !upward];

          // Copy handleNumbers so we don't change the dataset
          handleNumbers = handleNumbers.slice();

          // Check to see which handle is 'leading'.
          // If that one can't move the second can't either.
          if (upward) {
              handleNumbers.reverse();
          }

          // Step 1: get the maximum percentage that any of the handles can move
          if (handleNumbers.length > 1) {
              handleNumbers.forEach(function(handleNumber, o) {
                  var to = checkHandlePosition(
                      proposals,
                      handleNumber,
                      proposals[handleNumber] + proposal,
                      b[o],
                      f[o],
                      false
                  );

                  // Stop if one of the handles can't move.
                  if (to === false) {
                      proposal = 0;
                  } else {
                      proposal = to - proposals[handleNumber];
                      proposals[handleNumber] = to;
                  }
              });
          }

          // If using one handle, check backward AND forward
          else {
              b = f = [true];
          }

          var state = false;

          // Step 2: Try to set the handles with the found percentage
          handleNumbers.forEach(function(handleNumber, o) {
              state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
          });

          // Step 3: If a handle moved, fire events
          if (state) {
              handleNumbers.forEach(function(handleNumber) {
                  fireEvent("update", handleNumber);
                  fireEvent("slide", handleNumber);
              });
          }
      }

      // Takes a base value and an offset. This offset is used for the connect bar size.
      // In the initial design for this feature, the origin element was 1% wide.
      // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
      // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
      function transformDirection(a, b) {
          return options.dir ? 100 - a - b : a;
      }

      // Updates scope_Locations and scope_Values, updates visual state
      function updateHandlePosition(handleNumber, to) {
          // Update locations.
          scope_Locations[handleNumber] = to;

          // Convert the value to the slider stepping/range.
          scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);

          var translation = 10 * (transformDirection(to, 0) - scope_DirOffset);
          var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";

          scope_Handles[handleNumber].style[options.transformRule] = translateRule;

          updateConnect(handleNumber);
          updateConnect(handleNumber + 1);
      }

      // Handles before the slider middle are stacked later = higher,
      // Handles after the middle later is lower
      // [[7] [8] .......... | .......... [5] [4]
      function setZindex() {
          scope_HandleNumbers.forEach(function(handleNumber) {
              var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
              var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
              scope_Handles[handleNumber].style.zIndex = zIndex;
          });
      }

      // Test suggested values and apply margin, step.
      // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
      function setHandle(handleNumber, to, lookBackward, lookForward, exactInput) {
          if (!exactInput) {
              to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);
          }

          if (to === false) {
              return false;
          }

          updateHandlePosition(handleNumber, to);

          return true;
      }

      // Updates style attribute for connect nodes
      function updateConnect(index) {
          // Skip connects set to false
          if (!scope_Connects[index]) {
              return;
          }

          var l = 0;
          var h = 100;

          if (index !== 0) {
              l = scope_Locations[index - 1];
          }

          if (index !== scope_Connects.length - 1) {
              h = scope_Locations[index];
          }

          // We use two rules:
          // 'translate' to change the left/top offset;
          // 'scale' to change the width of the element;
          // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
          var connectWidth = h - l;
          var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
          var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";

          scope_Connects[index].style[options.transformRule] = translateRule + " " + scaleRule;
      }

      // Parses value passed to .set method. Returns current value if not parse-able.
      function resolveToValue(to, handleNumber) {
          // Setting with null indicates an 'ignore'.
          // Inputting 'false' is invalid.
          if (to === null || to === false || to === undefined) {
              return scope_Locations[handleNumber];
          }

          // If a formatted number was passed, attempt to decode it.
          if (typeof to === "number") {
              to = String(to);
          }

          to = options.format.from(to);
          to = scope_Spectrum.toStepping(to);

          // If parsing the number failed, use the current value.
          if (to === false || isNaN(to)) {
              return scope_Locations[handleNumber];
          }

          return to;
      }

      // Set the slider value.
      function valueSet(input, fireSetEvent, exactInput) {
          var values = asArray(input);
          var isInit = scope_Locations[0] === undefined;

          // Event fires by default
          fireSetEvent = fireSetEvent === undefined ? true : !!fireSetEvent;

          // Animation is optional.
          // Make sure the initial values were set before using animated placement.
          if (options.animate && !isInit) {
              addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
          }

          // First pass, without lookAhead but with lookBackward. Values are set from left to right.
          scope_HandleNumbers.forEach(function(handleNumber) {
              setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
          });

          var i = scope_HandleNumbers.length === 1 ? 0 : 1;

          // Secondary passes. Now that all base values are set, apply constraints.
          // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
          for (; i < scope_HandleNumbers.length; ++i) {
              scope_HandleNumbers.forEach(function(handleNumber) {
                  setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
              });
          }

          setZindex();

          scope_HandleNumbers.forEach(function(handleNumber) {
              fireEvent("update", handleNumber);

              // Fire the event only for handles that received a new value, as per #579
              if (values[handleNumber] !== null && fireSetEvent) {
                  fireEvent("set", handleNumber);
              }
          });
      }

      // Reset slider to initial values
      function valueReset(fireSetEvent) {
          valueSet(options.start, fireSetEvent);
      }

      // Set value for a single handle
      function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
          // Ensure numeric input
          handleNumber = Number(handleNumber);

          if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
              throw new Error("noUiSlider (" + VERSION + "): invalid handle number, got: " + handleNumber);
          }

          // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
          // The exactInput argument can be used to ignore slider stepping (#436)
          setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);

          fireEvent("update", handleNumber);

          if (fireSetEvent) {
              fireEvent("set", handleNumber);
          }
      }

      // Get the slider value.
      function valueGet() {
          var values = scope_Values.map(options.format.to);

          // If only one handle is used, return a single value.
          if (values.length === 1) {
              return values[0];
          }

          return values;
      }

      // Removes classes from the root and empties it.
      function destroy() {
          // remove protected internal listeners
          removeEvent(INTERNAL_EVENT_NS.aria);
          removeEvent(INTERNAL_EVENT_NS.tooltips);

          for (var key in options.cssClasses) {
              if (!options.cssClasses.hasOwnProperty(key)) {
                  continue;
              }
              removeClass(scope_Target, options.cssClasses[key]);
          }

          while (scope_Target.firstChild) {
              scope_Target.removeChild(scope_Target.firstChild);
          }

          delete scope_Target.noUiSlider;
      }

      function getNextStepsForHandle(handleNumber) {
          var location = scope_Locations[handleNumber];
          var nearbySteps = scope_Spectrum.getNearbySteps(location);
          var value = scope_Values[handleNumber];
          var increment = nearbySteps.thisStep.step;
          var decrement = null;

          // If snapped, directly use defined step value
          if (options.snap) {
              return [
                  value - nearbySteps.stepBefore.startValue || null,
                  nearbySteps.stepAfter.startValue - value || null
              ];
          }

          // If the next value in this step moves into the next step,
          // the increment is the start of the next step - the current value
          if (increment !== false) {
              if (value + increment > nearbySteps.stepAfter.startValue) {
                  increment = nearbySteps.stepAfter.startValue - value;
              }
          }

          // If the value is beyond the starting point
          if (value > nearbySteps.thisStep.startValue) {
              decrement = nearbySteps.thisStep.step;
          } else if (nearbySteps.stepBefore.step === false) {
              decrement = false;
          }

          // If a handle is at the start of a step, it always steps back into the previous step first
          else {
              decrement = value - nearbySteps.stepBefore.highestStep;
          }

          // Now, if at the slider edges, there is no in/decrement
          if (location === 100) {
              increment = null;
          } else if (location === 0) {
              decrement = null;
          }

          // As per #391, the comparison for the decrement step can have some rounding issues.
          var stepDecimals = scope_Spectrum.countStepDecimals();

          // Round per #391
          if (increment !== null && increment !== false) {
              increment = Number(increment.toFixed(stepDecimals));
          }

          if (decrement !== null && decrement !== false) {
              decrement = Number(decrement.toFixed(stepDecimals));
          }

          return [decrement, increment];
      }

      // Get the current step size for the slider.
      function getNextSteps() {
          return scope_HandleNumbers.map(getNextStepsForHandle);
      }

      // Updateable: margin, limit, padding, step, range, animate, snap
      function updateOptions(optionsToUpdate, fireSetEvent) {
          // Spectrum is created using the range, snap, direction and step options.
          // 'snap' and 'step' can be updated.
          // If 'snap' and 'step' are not passed, they should remain unchanged.
          var v = valueGet();

          var updateAble = [
              "margin",
              "limit",
              "padding",
              "range",
              "animate",
              "snap",
              "step",
              "format",
              "pips",
              "tooltips"
          ];

          // Only change options that we're actually passed to update.
          updateAble.forEach(function(name) {
              // Check for undefined. null removes the value.
              if (optionsToUpdate[name] !== undefined) {
                  originalOptions[name] = optionsToUpdate[name];
              }
          });

          var newOptions = testOptions(originalOptions);

          // Load new options into the slider state
          updateAble.forEach(function(name) {
              if (optionsToUpdate[name] !== undefined) {
                  options[name] = newOptions[name];
              }
          });

          scope_Spectrum = newOptions.spectrum;

          // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
          options.margin = newOptions.margin;
          options.limit = newOptions.limit;
          options.padding = newOptions.padding;

          // Update pips, removes existing.
          if (options.pips) {
              pips(options.pips);
          } else {
              removePips();
          }

          // Update tooltips, removes existing.
          if (options.tooltips) {
              tooltips();
          } else {
              removeTooltips();
          }

          // Invalidate the current positioning so valueSet forces an update.
          scope_Locations = [];
          valueSet(optionsToUpdate.start || v, fireSetEvent);
      }

      // Initialization steps
      function setupSlider() {
          // Create the base element, initialize HTML and set classes.
          // Add handles and connect elements.
          scope_Base = addSlider(scope_Target);

          addElements(options.connect, scope_Base);

          // Attach user events.
          bindSliderEvents(options.events);

          // Use the public value method to set the start values.
          valueSet(options.start);

          if (options.pips) {
              pips(options.pips);
          }

          if (options.tooltips) {
              tooltips();
          }

          aria();
      }

      setupSlider();

      // noinspection JSUnusedGlobalSymbols
      scope_Self = {
          destroy: destroy,
          steps: getNextSteps,
          on: bindEvent,
          off: removeEvent,
          get: valueGet,
          set: valueSet,
          setHandle: valueSetHandle,
          reset: valueReset,
          // Exposed for unit testing, don't use this in your application.
          __moveHandles: function(a, b, c) {
              moveHandles(a, b, scope_Locations, c);
          },
          options: originalOptions, // Issue #600, #678
          updateOptions: updateOptions,
          target: scope_Target, // Issue #597
          removePips: removePips,
          removeTooltips: removeTooltips,
          getTooltips: function() {
              return scope_Tooltips;
          },
          getOrigins: function() {
              return scope_Handles;
          },
          pips: pips // Issue #594
      };

      return scope_Self;
  }

  // Run the standard initializer
  function initialize(target, originalOptions) {
      if (!target || !target.nodeName) {
          throw new Error("noUiSlider (" + VERSION + "): create requires a single element, got: " + target);
      }

      // Throw an error if the slider was already initialized.
      if (target.noUiSlider) {
          throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
      }

      // Test the options and create the slider environment;
      var options = testOptions(originalOptions, target);
      var api = scope(target, options, originalOptions);

      target.noUiSlider = api;

      return api;
  }

  // Use an object instead of a function for future expandability;
  return {
      // Exposed for unit testing, don't use this in your application.
      __spectrum: Spectrum,
      version: VERSION,
      // A reference to the default classes, allows global changes.
      // Use the cssClasses option for changes to one slider.
      cssClasses: cssClasses,
      create: initialize
  };
});
