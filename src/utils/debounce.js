/**
 * Debounce Utility - Prevents excessive function calls
 */

/**
 * @typedef {Object} DebouncedFunction
 * @property {Function} cancel - Cancel pending execution
 * @property {Function} flush - Execute immediately
 * @property {Function} pending - Check if execution is pending
 */

/**
 * Creates a debounced function that delays invoking func until after wait
 * milliseconds have elapsed since the last time the debounced function was invoked.
 * 
 * @template T
 * @param {T} func - The function to debounce
 * @param {number} wait - Delay in milliseconds
 * @param {Object} options - Options
 * @param {boolean} [options.leading=false] - Execute on leading edge
 * @param {boolean} [options.trailing=true] - Execute on trailing edge
 * @param {number} [options.maxWait] - Maximum wait time before forced execution
 * @returns {T & DebouncedFunction} Debounced function
 */
export function debounce(func, wait, options = {}) {
  const { leading = false, trailing = true, maxWait } = options;
  
  /** @type {ReturnType<typeof setTimeout> | null} */
  let timeout = null;
  
  /** @type {number | null} */
  let lastCallTime = null;
  
  /** @type {number | null} */
  let lastInvokeTime = 0;
  
  /** @type {any[]} */
  let lastArgs = [];
  
  /** @type {any} */
  let lastThis = null;
  
  /** @type {any} */
  let result;

  /**
   * Check if we should invoke the function
   * @param {number} time - Current timestamp
   * @returns {boolean}
   */
  function shouldInvoke(time) {
    const timeSinceLastCall = lastCallTime !== null ? time - lastCallTime : wait;
    const timeSinceLastInvoke = time - lastInvokeTime;
    
    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  /**
   * Invoke the function
   * @param {number} time - Current timestamp
   */
  function invokeFunc(time) {
    lastInvokeTime = time;
    result = func.apply(lastThis, lastArgs);
    lastArgs = [];
    lastThis = null;
    return result;
  }

  /**
   * Start the timer
   * @param {number} pendingWait - Time to wait
   */
  function startTimer(pendingWait) {
    timeout = setTimeout(timerExpired, pendingWait);
  }

  /**
   * Calculate remaining wait time
   * @param {number} time - Current timestamp
   * @returns {number}
   */
  function remainingWait(time) {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  /**
   * Handle timer expiration
   */
  function timerExpired() {
    const time = Date.now();
    
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    
    startTimer(remainingWait(time));
  }

  /**
   * Handle trailing edge execution
   * @param {number} time - Current timestamp
   */
  function trailingEdge(time) {
    timeout = null;
    
    if (trailing && lastArgs.length) {
      return invokeFunc(time);
    }
    
    lastArgs = [];
    lastThis = null;
    return result;
  }

  /**
   * Cancel any pending execution
   */
  function cancel() {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastArgs = [];
    lastCallTime = null;
    lastThis = null;
    timeout = null;
  }

  /**
   * Immediately execute if pending
   */
  function flush() {
    if (timeout === null) {
      return result;
    }
    return trailingEdge(Date.now());
  }

  /**
   * Check if execution is pending
   * @returns {boolean}
   */
  function pending() {
    return timeout !== null;
  }

  /**
   * The debounced function
   * @param {...any} args - Arguments to pass to the function
   */
  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        // Start timer for leading edge
        lastInvokeTime = time;
        startTimer(wait);
        
        if (leading) {
          return invokeFunc(time);
        }
        return result;
      }
      
      if (maxWait !== undefined) {
        // Handle maxWait case
        startTimer(wait);
        return invokeFunc(time);
      }
    }
    
    if (timeout === null) {
      startTimer(wait);
    }
    
    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

/**
 * Creates a throttled function that only invokes func at most once per
 * every wait milliseconds.
 * 
 * @template T
 * @param {T} func - The function to throttle
 * @param {number} wait - Minimum time between invocations
 * @param {Object} options - Options
 * @param {boolean} [options.leading=true] - Execute on leading edge
 * @param {boolean} [options.trailing=true] - Execute on trailing edge
 * @returns {T & DebouncedFunction} Throttled function
 */
export function throttle(func, wait, options = {}) {
  const { leading = true, trailing = true } = options;
  return debounce(func, wait, { leading, trailing, maxWait: wait });
}

/**
 * Input debouncer for text areas - waits until user stops typing
 * @param {HTMLElement} element - Input element
 * @param {Function} callback - Callback when typing stops
 * @param {number} wait - Debounce wait time (default 300ms)
 * @returns {Function} Cleanup function
 */
export function debounceInput(element, callback, wait = 300) {
  const debouncedCallback = debounce(callback, wait);
  
  const handler = (event) => {
    debouncedCallback(event.target.value, event);
  };
  
  element.addEventListener('input', handler);
  
  return () => {
    element.removeEventListener('input', handler);
    debouncedCallback.cancel();
  };
}

export default { debounce, throttle, debounceInput };
