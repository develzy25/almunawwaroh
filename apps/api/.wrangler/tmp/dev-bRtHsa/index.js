var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-JtmmPv/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// ../../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// ../../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// ../../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// ../../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../../node_modules/hono/dist/compose.js
var compose = /* @__PURE__ */ __name((middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index2 = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index2) {
        throw new Error("next() called multiple times");
      }
      index2 = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context2.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context2, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
    __name(dispatch, "dispatch");
  };
}, "compose");

// ../../node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/hono/dist/utils/body.js
var parseBody = /* @__PURE__ */ __name(async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
}, "parseBody");
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
__name(parseFormData, "parseFormData");
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
__name(convertFormDataToBodyData, "convertFormDataToBodyData");
var handleParsingAllValues = /* @__PURE__ */ __name((form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      ;
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
}, "handleParsingAllValues");
var handleParsingNestedValues = /* @__PURE__ */ __name((form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index2) => {
    if (index2 === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
}, "handleParsingNestedValues");

// ../../node_modules/hono/dist/utils/url.js
var splitPath = /* @__PURE__ */ __name((path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
}, "splitPath");
var splitRoutingPath = /* @__PURE__ */ __name((routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
}, "splitRoutingPath");
var extractGroupsFromPath = /* @__PURE__ */ __name((path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index2) => {
    const mark = `@${index2}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
}, "extractGroupsFromPath");
var replaceGroupMarks = /* @__PURE__ */ __name((paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
}, "replaceGroupMarks");
var patternCache = {};
var getPattern = /* @__PURE__ */ __name((label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
}, "getPattern");
var tryDecode = /* @__PURE__ */ __name((str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
}, "tryDecode");
var tryDecodeURI = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURI), "tryDecodeURI");
var getPath = /* @__PURE__ */ __name((request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
}, "getPath");
var getPathNoStrict = /* @__PURE__ */ __name((request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
}, "getPathNoStrict");
var mergePath = /* @__PURE__ */ __name((base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
}, "mergePath");
var checkOptionalParameter = /* @__PURE__ */ __name((path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
}, "checkOptionalParameter");
var _decodeURI = /* @__PURE__ */ __name((value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
}, "_decodeURI");
var _getQueryParam = /* @__PURE__ */ __name((url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
}, "_getQueryParam");
var getQueryParam = _getQueryParam;
var getQueryParams = /* @__PURE__ */ __name((url, key) => {
  return _getQueryParam(url, key, true);
}, "getQueryParams");
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/hono/dist/request.js
var tryDecodeURIComponent = /* @__PURE__ */ __name((str) => tryDecode(str, decodeURIComponent_), "tryDecodeURIComponent");
var HonoRequest = /* @__PURE__ */ __name(class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text2) => JSON.parse(text2));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * `.bytes()` parses the request body as a `Uint8Array`.
   *
   * @see {@link https://hono.dev/docs/api/request#bytes}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.bytes()
   * })
   * ```
   */
  bytes() {
    return this.#cachedBody("arrayBuffer").then((buffer) => new Uint8Array(buffer));
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
}, "HonoRequest");

// ../../node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = /* @__PURE__ */ __name((value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
}, "raw");
var resolveCallback = /* @__PURE__ */ __name(async (str, phase, preserveCallbacks, context2, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context: context2 }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context2, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
}, "resolveCallback");

// ../../node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = /* @__PURE__ */ __name((contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
}, "setDefaultContentType");
var createResponseInstance = /* @__PURE__ */ __name((body, init) => new Response(body, init), "createResponseInstance");
var Context = /* @__PURE__ */ __name(class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name);
    } else if (options?.append) {
      headers.append(name, value);
    } else {
      headers.set(name, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text2, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text2) : this.#newResponse(
      text2,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = /* @__PURE__ */ __name((html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers)), "res");
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
}, "Context");

// ../../node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = /* @__PURE__ */ __name(class extends Error {
}, "UnsupportedPathError");

// ../../node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/hono/dist/hono-base.js
var notFoundHandler = /* @__PURE__ */ __name((c) => {
  return c.text("404 Not Found", 404);
}, "notFoundHandler");
var errorHandler = /* @__PURE__ */ __name((err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
}, "errorHandler");
var Hono = /* @__PURE__ */ __name(class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app2) {
    const subApp = this.basePath(path);
    app2.routes.map((r) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = /* @__PURE__ */ __name(async (c, next) => (await compose([], app2.errorHandler)(c, () => r.handler(c, next))).res, "handler");
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler, r.basePath);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = /* @__PURE__ */ __name((request) => request, "replaceRequest");
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = this.getPath(request).slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = /* @__PURE__ */ __name(async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    }, "handler");
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler, baseRoutePath) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = {
      basePath: baseRoutePath !== void 0 ? mergePath(this._basePath, baseRoutePath) : this._basePath,
      path,
      method,
      handler
    };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env2, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env2, "GET")))();
    }
    const path = this.getPath(request, { env: env2 });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env: env2,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context2 = await composed(c);
        if (!context2.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context2.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
}, "_Hono");

// ../../node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = /* @__PURE__ */ __name((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index2 = match3.indexOf("", 1);
    return [matcher[1][index2], match3];
  }, "match2");
  this.match = match2;
  return match2(method, path);
}
__name(match, "match");

// ../../node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
__name(compareKey, "compareKey");
var Node = /* @__PURE__ */ __name(class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index2, paramMap, context2, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index2;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name !== "") {
          node.#varIndex = context2.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index2, paramMap, context2, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
}, "_Node");

// ../../node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = /* @__PURE__ */ __name(class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index2, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index2, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
}, "Trie");

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
__name(buildWildcardRegExp, "buildWildcardRegExp");
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
__name(clearWildcardRegExpCache, "clearWildcardRegExpCache");
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
__name(buildMatcherFromPreprocessedRoutes, "buildMatcherFromPreprocessedRoutes");
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
__name(findMiddleware, "findMiddleware");
var RegExpRouter = /* @__PURE__ */ __name(class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
}, "RegExpRouter");

// ../../node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = /* @__PURE__ */ __name(class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
}, "SmartRouter");

// ../../node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = /* @__PURE__ */ __name((children) => {
  for (const _ in children) {
    return true;
  }
  return false;
}, "hasChildren");
var Node2 = /* @__PURE__ */ __name(class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
}, "_Node");

// ../../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = /* @__PURE__ */ __name(class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
}, "TrieRouter");

// ../../node_modules/hono/dist/hono.js
var Hono2 = /* @__PURE__ */ __name(class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
}, "Hono");

// ../../node_modules/hono/dist/middleware/cors/index.js
var cors = /* @__PURE__ */ __name((options) => {
  const opts = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: [],
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return /* @__PURE__ */ __name(async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    __name(set, "set");
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  }, "cors2");
}, "cors");

// ../../node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var trimCookieWhitespace = /* @__PURE__ */ __name((value) => {
  let start = 0;
  let end = value.length;
  while (start < end) {
    const charCode = value.charCodeAt(start);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    start++;
  }
  while (end > start) {
    const charCode = value.charCodeAt(end - 1);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    end--;
  }
  return start === 0 && end === value.length ? value : value.slice(start, end);
}, "trimCookieWhitespace");
var parse = /* @__PURE__ */ __name((cookie, name) => {
  if (name && cookie.indexOf(name) === -1) {
    return {};
  }
  const pairs = cookie.split(";");
  const parsedCookie = /* @__PURE__ */ Object.create(null);
  for (const pairStr of pairs) {
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = trimCookieWhitespace(pairStr.substring(0, valueStartPos));
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName) || cookieName in parsedCookie) {
      continue;
    }
    let cookieValue = trimCookieWhitespace(pairStr.substring(valueStartPos + 1));
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name) {
        break;
      }
    }
  }
  return parsedCookie;
}, "parse");
var _serialize = /* @__PURE__ */ __name((name, value, opt = {}) => {
  if (!validCookieNameRegEx.test(name)) {
    throw new Error("Invalid cookie name");
  }
  let cookie = `${name}=${value}`;
  if (name.startsWith("__Secure-") && !opt.secure) {
    throw new Error("__Secure- Cookie must have Secure attributes");
  }
  if (name.startsWith("__Host-")) {
    if (!opt.secure) {
      throw new Error("__Host- Cookie must have Secure attributes");
    }
    if (opt.path !== "/") {
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    }
    if (opt.domain) {
      throw new Error("__Host- Cookie must not have Domain attributes");
    }
  }
  for (const key of ["domain", "path", "sameSite", "priority"]) {
    if (opt[key] && /[;\r\n]/.test(opt[key])) {
      throw new Error(`${key} must not contain ";", "\\r", or "\\n"`);
    }
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) {
      throw new Error(
        "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration."
      );
    }
    cookie += `; Max-Age=${opt.maxAge | 0}`;
  }
  if (opt.domain && opt.prefix !== "host") {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) {
      throw new Error(
        "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future."
      );
    }
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  }
  if (opt.priority) {
    cookie += `; Priority=${opt.priority.charAt(0).toUpperCase() + opt.priority.slice(1)}`;
  }
  if (opt.partitioned) {
    if (!opt.secure) {
      throw new Error("Partitioned Cookie must have Secure attributes");
    }
    cookie += "; Partitioned";
  }
  return cookie;
}, "_serialize");
var serialize = /* @__PURE__ */ __name((name, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
}, "serialize");

// ../../node_modules/hono/dist/helper/cookie/index.js
var getCookie = /* @__PURE__ */ __name((c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
}, "getCookie");
var generateCookie = /* @__PURE__ */ __name((name, value, opt) => {
  let cookie;
  if (opt?.prefix === "secure") {
    cookie = serialize("__Secure-" + name, value, { path: "/", ...opt, secure: true });
  } else if (opt?.prefix === "host") {
    cookie = serialize("__Host-" + name, value, {
      ...opt,
      path: "/",
      secure: true,
      domain: void 0
    });
  } else {
    cookie = serialize(name, value, { path: "/", ...opt });
  }
  return cookie;
}, "generateCookie");
var setCookie = /* @__PURE__ */ __name((c, name, value, opt) => {
  const cookie = generateCookie(name, value, opt);
  c.header("Set-Cookie", cookie, { append: true });
}, "setCookie");
var deleteCookie = /* @__PURE__ */ __name((c, name, opt) => {
  const deletedCookie = getCookie(c, name, opt?.prefix);
  setCookie(c, name, "", { ...opt, maxAge: 0 });
  return deletedCookie;
}, "deleteCookie");

// ../../node_modules/drizzle-orm/entity.js
var entityKind = Symbol.for("drizzle:entityKind");
var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = value.constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
__name(is, "is");

// ../../node_modules/drizzle-orm/logger.js
var _a;
var ConsoleLogWriter = class {
  write(message) {
    console.log(message);
  }
};
__name(ConsoleLogWriter, "ConsoleLogWriter");
_a = entityKind;
__publicField(ConsoleLogWriter, _a, "ConsoleLogWriter");
var _a2;
var DefaultLogger = class {
  writer;
  constructor(config2) {
    this.writer = config2?.writer ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
};
__name(DefaultLogger, "DefaultLogger");
_a2 = entityKind;
__publicField(DefaultLogger, _a2, "DefaultLogger");
var _a3;
var NoopLogger = class {
  logQuery() {
  }
};
__name(NoopLogger, "NoopLogger");
_a3 = entityKind;
__publicField(NoopLogger, _a3, "NoopLogger");

// ../../node_modules/drizzle-orm/table.js
var TableName = Symbol.for("drizzle:Name");
var Schema = Symbol.for("drizzle:Schema");
var Columns = Symbol.for("drizzle:Columns");
var OriginalName = Symbol.for("drizzle:OriginalName");
var BaseName = Symbol.for("drizzle:BaseName");
var IsAlias = Symbol.for("drizzle:IsAlias");
var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
var _a4;
var Table = class {
  /**
   * @internal
   * Can be changed if the table is aliased.
   */
  [(_a4 = entityKind, TableName)];
  /**
   * @internal
   * Used to store the original name of the table, before any aliasing.
   */
  [OriginalName];
  /** @internal */
  [Schema];
  /** @internal */
  [Columns];
  /**
   *  @internal
   * Used to store the table name before the transformation via the `tableCreator` functions.
   */
  [BaseName];
  /** @internal */
  [IsAlias] = false;
  /** @internal */
  [ExtraConfigBuilder] = void 0;
  [IsDrizzleTable] = true;
  constructor(name, schema, baseName) {
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema;
    this[BaseName] = baseName;
  }
};
__name(Table, "Table");
__publicField(Table, _a4, "Table");
/** @internal */
__publicField(Table, "Symbol", {
  Name: TableName,
  Schema,
  OriginalName,
  Columns,
  BaseName,
  IsAlias,
  ExtraConfigBuilder
});
function isTable(table3) {
  return typeof table3 === "object" && table3 !== null && IsDrizzleTable in table3;
}
__name(isTable, "isTable");
function getTableName(table3) {
  return table3[TableName];
}
__name(getTableName, "getTableName");

// ../../node_modules/drizzle-orm/column.js
var _a5;
var Column = class {
  constructor(table3, config2) {
    this.table = table3;
    this.config = config2;
    this.name = config2.name;
    this.notNull = config2.notNull;
    this.default = config2.default;
    this.defaultFn = config2.defaultFn;
    this.onUpdateFn = config2.onUpdateFn;
    this.hasDefault = config2.hasDefault;
    this.primary = config2.primaryKey;
    this.isUnique = config2.isUnique;
    this.uniqueName = config2.uniqueName;
    this.uniqueType = config2.uniqueType;
    this.dataType = config2.dataType;
    this.columnType = config2.columnType;
  }
  name;
  primary;
  notNull;
  default;
  defaultFn;
  onUpdateFn;
  hasDefault;
  isUnique;
  uniqueName;
  uniqueType;
  dataType;
  columnType;
  enumValues = void 0;
  config;
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
};
__name(Column, "Column");
_a5 = entityKind;
__publicField(Column, _a5, "Column");

// ../../node_modules/drizzle-orm/pg-core/table.js
var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
var _a6;
var PgTable = class extends Table {
  /**@internal */
  [(_a6 = entityKind, InlineForeignKeys)] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
__name(PgTable, "PgTable");
__publicField(PgTable, _a6, "PgTable");
/** @internal */
__publicField(PgTable, "Symbol", Object.assign({}, Table.Symbol, {
  InlineForeignKeys
}));

// ../../node_modules/drizzle-orm/pg-core/primary-keys.js
var _a7;
var PrimaryKeyBuilder = class {
  /** @internal */
  columns;
  /** @internal */
  name;
  constructor(columns, name) {
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table3) {
    return new PrimaryKey(table3, this.columns, this.name);
  }
};
__name(PrimaryKeyBuilder, "PrimaryKeyBuilder");
_a7 = entityKind;
__publicField(PrimaryKeyBuilder, _a7, "PgPrimaryKeyBuilder");
var _a8;
var PrimaryKey = class {
  constructor(table3, columns, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name;
  }
  columns;
  name;
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
};
__name(PrimaryKey, "PrimaryKey");
_a8 = entityKind;
__publicField(PrimaryKey, _a8, "PgPrimaryKey");

// ../../node_modules/drizzle-orm/column-builder.js
var _a9;
var ColumnBuilder = class {
  config;
  constructor(name, dataType, columnType) {
    this.config = {
      name,
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $defaultFn}.
   */
  $default = this.$defaultFn;
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Alias for {@link $onUpdateFn}.
   */
  $onUpdate = this.$onUpdateFn;
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
};
__name(ColumnBuilder, "ColumnBuilder");
_a9 = entityKind;
__publicField(ColumnBuilder, _a9, "ColumnBuilder");

// ../../node_modules/drizzle-orm/pg-core/foreign-keys.js
var _a10;
var ForeignKeyBuilder = class {
  /** @internal */
  reference;
  /** @internal */
  _onUpdate = "no action";
  /** @internal */
  _onDelete = "no action";
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action === void 0 ? "no action" : action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action === void 0 ? "no action" : action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey(table3, this);
  }
};
__name(ForeignKeyBuilder, "ForeignKeyBuilder");
_a10 = entityKind;
__publicField(ForeignKeyBuilder, _a10, "PgForeignKeyBuilder");
var _a11;
var ForeignKey = class {
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[PgTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[PgTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};
__name(ForeignKey, "ForeignKey");
_a11 = entityKind;
__publicField(ForeignKey, _a11, "PgForeignKey");

// ../../node_modules/drizzle-orm/tracing-utils.js
function iife(fn, ...args) {
  return fn(...args);
}
__name(iife, "iife");

// ../../node_modules/drizzle-orm/pg-core/unique-constraint.js
function uniqueKeyName(table3, columns) {
  return `${table3[PgTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName, "uniqueKeyName");
var _a12;
var UniqueConstraintBuilder = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  /** @internal */
  columns;
  /** @internal */
  nullsNotDistinctConfig = false;
  nullsNotDistinct() {
    this.nullsNotDistinctConfig = true;
    return this;
  }
  /** @internal */
  build(table3) {
    return new UniqueConstraint(table3, this.columns, this.nullsNotDistinctConfig, this.name);
  }
};
__name(UniqueConstraintBuilder, "UniqueConstraintBuilder");
_a12 = entityKind;
__publicField(UniqueConstraintBuilder, _a12, "PgUniqueConstraintBuilder");
var _a13;
var UniqueOnConstraintBuilder = class {
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder(columns, this.name);
  }
};
__name(UniqueOnConstraintBuilder, "UniqueOnConstraintBuilder");
_a13 = entityKind;
__publicField(UniqueOnConstraintBuilder, _a13, "PgUniqueOnConstraintBuilder");
var _a14;
var UniqueConstraint = class {
  constructor(table3, columns, nullsNotDistinct, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
    this.nullsNotDistinct = nullsNotDistinct;
  }
  columns;
  name;
  nullsNotDistinct = false;
  getName() {
    return this.name;
  }
};
__name(UniqueConstraint, "UniqueConstraint");
_a14 = entityKind;
__publicField(UniqueConstraint, _a14, "PgUniqueConstraint");

// ../../node_modules/drizzle-orm/pg-core/utils/array.js
function parsePgArrayValue(arrayString, startFrom, inQuotes) {
  for (let i = startFrom; i < arrayString.length; i++) {
    const char = arrayString[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
    }
    if (inQuotes) {
      continue;
    }
    if (char === "," || char === "}") {
      return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
    }
  }
  return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
}
__name(parsePgArrayValue, "parsePgArrayValue");
function parsePgNestedArray(arrayString, startFrom = 0) {
  const result = [];
  let i = startFrom;
  let lastCharIsComma = false;
  while (i < arrayString.length) {
    const char = arrayString[i];
    if (char === ",") {
      if (lastCharIsComma || i === startFrom) {
        result.push("");
      }
      lastCharIsComma = true;
      i++;
      continue;
    }
    lastCharIsComma = false;
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === '"') {
      const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    if (char === "}") {
      return [result, i + 1];
    }
    if (char === "{") {
      const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
      result.push(value2);
      i = startFrom2;
      continue;
    }
    const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
    result.push(value);
    i = newStartFrom;
  }
  return [result, i];
}
__name(parsePgNestedArray, "parsePgNestedArray");
function parsePgArray(arrayString) {
  const [result] = parsePgNestedArray(arrayString, 1);
  return result;
}
__name(parsePgArray, "parsePgArray");
function makePgArray(array) {
  return `{${array.map((item) => {
    if (Array.isArray(item)) {
      return makePgArray(item);
    }
    if (typeof item === "string") {
      return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    }
    return `${item}`;
  }).join(",")}}`;
}
__name(makePgArray, "makePgArray");

// ../../node_modules/drizzle-orm/pg-core/columns/common.js
var _a15;
var PgColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  array(size) {
    return new PgArrayBuilder(this.config.name, this, size);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name, config2) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    this.config.uniqueType = config2?.nulls;
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return iife(
        (ref2, actions2) => {
          const builder = new ForeignKeyBuilder(() => {
            const foreignColumn = ref2();
            return { columns: [column], foreignColumns: [foreignColumn] };
          });
          if (actions2.onUpdate) {
            builder.onUpdate(actions2.onUpdate);
          }
          if (actions2.onDelete) {
            builder.onDelete(actions2.onDelete);
          }
          return builder.build(table3);
        },
        ref,
        actions
      );
    });
  }
};
__name(PgColumnBuilder, "PgColumnBuilder");
_a15 = entityKind;
__publicField(PgColumnBuilder, _a15, "PgColumnBuilder");
var _a16;
var PgColumn = class extends Column {
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
};
__name(PgColumn, "PgColumn");
_a16 = entityKind;
__publicField(PgColumn, _a16, "PgColumn");
var _a17;
var PgArrayBuilder = class extends PgColumnBuilder {
  constructor(name, baseBuilder, size) {
    super(name, "array", "PgArray");
    this.config.baseBuilder = baseBuilder;
    this.config.size = size;
  }
  /** @internal */
  build(table3) {
    const baseColumn = this.config.baseBuilder.build(table3);
    return new PgArray(
      table3,
      this.config,
      baseColumn
    );
  }
};
__name(PgArrayBuilder, "PgArrayBuilder");
_a17 = entityKind;
__publicField(PgArrayBuilder, _a17, "PgArrayBuilder");
var _a18;
var _PgArray = class extends PgColumn {
  constructor(table3, config2, baseColumn, range) {
    super(table3, config2);
    this.baseColumn = baseColumn;
    this.range = range;
    this.size = config2.size;
  }
  size;
  getSQLType() {
    return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
  }
  mapFromDriverValue(value) {
    if (typeof value === "string") {
      value = parsePgArray(value);
    }
    return value.map((v) => this.baseColumn.mapFromDriverValue(v));
  }
  mapToDriverValue(value, isNestedArray = false) {
    const a = value.map(
      (v) => v === null ? null : is(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
    );
    if (isNestedArray)
      return a;
    return makePgArray(a);
  }
};
var PgArray = _PgArray;
__name(PgArray, "PgArray");
_a18 = entityKind;
__publicField(PgArray, _a18, "PgArray");

// ../../node_modules/drizzle-orm/pg-core/columns/enum.js
var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
__name(isPgEnum, "isPgEnum");
var _a19;
var PgEnumColumnBuilder = class extends PgColumnBuilder {
  constructor(name, enumInstance) {
    super(name, "string", "PgEnumColumn");
    this.config.enum = enumInstance;
  }
  /** @internal */
  build(table3) {
    return new PgEnumColumn(
      table3,
      this.config
    );
  }
};
__name(PgEnumColumnBuilder, "PgEnumColumnBuilder");
_a19 = entityKind;
__publicField(PgEnumColumnBuilder, _a19, "PgEnumColumnBuilder");
var _a20;
var PgEnumColumn = class extends PgColumn {
  enum = this.config.enum;
  enumValues = this.config.enum.enumValues;
  constructor(table3, config2) {
    super(table3, config2);
    this.enum = config2.enum;
  }
  getSQLType() {
    return this.enum.enumName;
  }
};
__name(PgEnumColumn, "PgEnumColumn");
_a20 = entityKind;
__publicField(PgEnumColumn, _a20, "PgEnumColumn");

// ../../node_modules/drizzle-orm/subquery.js
var _a21;
var Subquery = class {
  constructor(sql2, selection, alias, isWith = false) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: selection,
      alias,
      isWith
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
};
__name(Subquery, "Subquery");
_a21 = entityKind;
__publicField(Subquery, _a21, "Subquery");
var _a22;
var WithSubquery = class extends Subquery {
};
__name(WithSubquery, "WithSubquery");
_a22 = entityKind;
__publicField(WithSubquery, _a22, "WithSubquery");

// ../../node_modules/drizzle-orm/version.js
var version2 = "0.30.10";

// ../../node_modules/drizzle-orm/tracing.js
var otel;
var rawTracer;
var tracer = {
  startActiveSpan(name, fn) {
    if (!otel) {
      return fn();
    }
    if (!rawTracer) {
      rawTracer = otel.trace.getTracer("drizzle-orm", version2);
    }
    return iife(
      (otel2, rawTracer2) => rawTracer2.startActiveSpan(
        name,
        (span) => {
          try {
            return fn(span);
          } catch (e) {
            span.setStatus({
              code: otel2.SpanStatusCode.ERROR,
              message: e instanceof Error ? e.message : "Unknown error"
              // eslint-disable-line no-instanceof/no-instanceof
            });
            throw e;
          } finally {
            span.end();
          }
        }
      ),
      otel,
      rawTracer
    );
  }
};

// ../../node_modules/drizzle-orm/view-common.js
var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");

// ../../node_modules/drizzle-orm/sql/sql.js
var _a23;
var FakePrimitiveParam = class {
};
__name(FakePrimitiveParam, "FakePrimitiveParam");
_a23 = entityKind;
__publicField(FakePrimitiveParam, _a23, "FakePrimitiveParam");
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
__name(isSQLWrapper, "isSQLWrapper");
function mergeQueries(queries) {
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if (query.typings?.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
__name(mergeQueries, "mergeQueries");
var _a24;
var StringChunk = class {
  value;
  constructor(value) {
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(StringChunk, "StringChunk");
_a24 = entityKind;
__publicField(StringChunk, _a24, "StringChunk");
var _a25;
var _SQL = class {
  constructor(queryChunks) {
    this.queryChunks = queryChunks;
  }
  /** @internal */
  decoder = noopDecoder;
  shouldInlineParams = false;
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config2) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config2);
      span?.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config2 = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config2;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config2);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config2,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        return { sql: escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(chunk.name), params: [] };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config2);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config2), params: [] };
        }
        let typings;
        if (prepareTyping !== void 0) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config2);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config2);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config2), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
var SQL = _SQL;
__name(SQL, "SQL");
_a25 = entityKind;
__publicField(SQL, _a25, "SQL");
var _a26;
var Name = class {
  constructor(value) {
    this.value = value;
  }
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
__name(Name, "Name");
_a26 = entityKind;
__publicField(Name, _a26, "Name");
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
__name(isDriverValueEncoder, "isDriverValueEncoder");
var noopDecoder = {
  mapFromDriverValue: (value) => value
};
var noopEncoder = {
  mapToDriverValue: (value) => value
};
var noopMapper = {
  ...noopDecoder,
  ...noopEncoder
};
var _a27;
var Param = class {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    this.value = value;
    this.encoder = encoder;
  }
  brand;
  getSQL() {
    return new SQL([this]);
  }
};
__name(Param, "Param");
_a27 = entityKind;
__publicField(Param, _a27, "Param");
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
__name(sql, "sql");
((sql2) => {
  function empty() {
    return new SQL([]);
  }
  __name(empty, "empty");
  sql2.empty = empty;
  function fromList(list) {
    return new SQL(list);
  }
  __name(fromList, "fromList");
  sql2.fromList = fromList;
  function raw2(str) {
    return new SQL([new StringChunk(str)]);
  }
  __name(raw2, "raw");
  sql2.raw = raw2;
  function join(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  __name(join, "join");
  sql2.join = join;
  function identifier(value) {
    return new Name(value);
  }
  __name(identifier, "identifier");
  sql2.identifier = identifier;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  __name(placeholder2, "placeholder2");
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  __name(param2, "param2");
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  class Aliased {
    constructor(sql2, fieldAlias) {
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    static [entityKind] = "SQL.Aliased";
    /** @internal */
    isSelectionField = false;
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new Aliased(this.sql, this.fieldAlias);
    }
  }
  __name(Aliased, "Aliased");
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
var _a28;
var Placeholder = class {
  constructor(name2) {
    this.name = name2;
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(Placeholder, "Placeholder");
_a28 = entityKind;
__publicField(Placeholder, _a28, "Placeholder");
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    return p;
  });
}
__name(fillPlaceholders, "fillPlaceholders");
var _a29;
var View = class {
  /** @internal */
  [(_a29 = entityKind, ViewBaseConfig)];
  constructor({ name: name2, schema, selectedFields, query }) {
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
};
__name(View, "View");
__publicField(View, _a29, "View");
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};

// ../../node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
__name(bindIfParam, "bindIfParam");
var eq = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} = ${bindIfParam(right, left)}`;
}, "eq");
var ne = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <> ${bindIfParam(right, left)}`;
}, "ne");
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
__name(and, "and");
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
__name(or, "or");
function not(condition) {
  return sql`not ${condition}`;
}
__name(not, "not");
var gt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} > ${bindIfParam(right, left)}`;
}, "gt");
var gte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} >= ${bindIfParam(right, left)}`;
}, "gte");
var lt = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} < ${bindIfParam(right, left)}`;
}, "lt");
var lte = /* @__PURE__ */ __name((left, right) => {
  return sql`${left} <= ${bindIfParam(right, left)}`;
}, "lte");
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("inArray requires at least one value");
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
__name(inArray, "inArray");
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("notInArray requires at least one value");
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
__name(notInArray, "notInArray");
function isNull(value) {
  return sql`${value} is null`;
}
__name(isNull, "isNull");
function isNotNull(value) {
  return sql`${value} is not null`;
}
__name(isNotNull, "isNotNull");
function exists(subquery) {
  return sql`exists ${subquery}`;
}
__name(exists, "exists");
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
__name(notExists, "notExists");
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
__name(between, "between");
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
__name(notBetween, "notBetween");
function like(column, value) {
  return sql`${column} like ${value}`;
}
__name(like, "like");
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
__name(notLike, "notLike");
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
__name(ilike, "ilike");
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
__name(notIlike, "notIlike");

// ../../node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
  return sql`${column} asc`;
}
__name(asc, "asc");
function desc(column) {
  return sql`${column} desc`;
}
__name(desc, "desc");

// ../../node_modules/drizzle-orm/relations.js
var _a30;
var Relation = class {
  constructor(sourceTable, referencedTable, relationName) {
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
  referencedTableName;
  fieldName;
};
__name(Relation, "Relation");
_a30 = entityKind;
__publicField(Relation, _a30, "Relation");
var _a31;
var Relations = class {
  constructor(table3, config2) {
    this.table = table3;
    this.config = config2;
  }
};
__name(Relations, "Relations");
_a31 = entityKind;
__publicField(Relations, _a31, "Relations");
var _a32;
var _One = class extends Relation {
  constructor(sourceTable, referencedTable, config2, isNullable) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
    this.isNullable = isNullable;
  }
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var One = _One;
__name(One, "One");
_a32 = entityKind;
__publicField(One, _a32, "One");
var _a33;
var _Many = class extends Relation {
  constructor(sourceTable, referencedTable, config2) {
    super(sourceTable, referencedTable, config2?.relationName);
    this.config = config2;
  }
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
var Many = _Many;
__name(Many, "Many");
_a33 = entityKind;
__publicField(Many, _a33, "Many");
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
__name(getOperators, "getOperators");
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
__name(getOrderByOperators, "getOrderByOperators");
function extractTablesRelationalConfig(schema, configHelpers) {
  if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) {
    schema = schema["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema)) {
    if (isTable(value)) {
      const dbName = value[Table.Symbol.Name];
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: bufferedRelations?.relations ?? {},
        primaryKey: bufferedRelations?.primaryKey ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = value.table[Table.Symbol.Name];
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
          if (primaryKey) {
            tableConfig.primaryKey.push(...primaryKey);
          }
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
__name(extractTablesRelationalConfig, "extractTablesRelationalConfig");
function createOne(sourceTable) {
  return /* @__PURE__ */ __name(function one(table3, config2) {
    return new One(
      sourceTable,
      table3,
      config2,
      config2?.fields.reduce((res, f) => res && f.notNull, true) ?? false
    );
  }, "one");
}
__name(createOne, "createOne");
function createMany(sourceTable) {
  return /* @__PURE__ */ __name(function many(referencedTable, config2) {
    return new Many(sourceTable, referencedTable, config2);
  }, "many");
}
__name(createMany, "createMany");
function normalizeRelation(schema, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[relation.referencedTable[Table.Symbol.Name]];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[sourceTable[Table.Symbol.Name]];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
__name(normalizeRelation, "normalizeRelation");
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
__name(createTableRelationsHelpers, "createTableRelationsHelpers");
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
__name(mapRelationalRow, "mapRelationalRow");

// ../../node_modules/drizzle-orm/alias.js
var _a34;
var ColumnAliasProxyHandler = class {
  constructor(table3) {
    this.table = table3;
  }
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
};
__name(ColumnAliasProxyHandler, "ColumnAliasProxyHandler");
_a34 = entityKind;
__publicField(ColumnAliasProxyHandler, _a34, "ColumnAliasProxyHandler");
var _a35;
var TableAliasProxyHandler = class {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
};
__name(TableAliasProxyHandler, "TableAliasProxyHandler");
_a35 = entityKind;
__publicField(TableAliasProxyHandler, _a35, "TableAliasProxyHandler");
var _a36;
var RelationTableAliasProxyHandler = class {
  constructor(alias) {
    this.alias = alias;
  }
  get(target, prop) {
    if (prop === "sourceTable") {
      return aliasedTable(target.sourceTable, this.alias);
    }
    return target[prop];
  }
};
__name(RelationTableAliasProxyHandler, "RelationTableAliasProxyHandler");
_a36 = entityKind;
__publicField(RelationTableAliasProxyHandler, _a36, "RelationTableAliasProxyHandler");
function aliasedTable(table3, tableAlias) {
  return new Proxy(table3, new TableAliasProxyHandler(tableAlias, false));
}
__name(aliasedTable, "aliasedTable");
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
__name(aliasedTableColumn, "aliasedTableColumn");
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
__name(mapColumnsInAliasedSQLToAlias, "mapColumnsInAliasedSQLToAlias");
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
__name(mapColumnsInSQLToAlias, "mapColumnsInSQLToAlias");

// ../../node_modules/drizzle-orm/selection-proxy.js
var _a37;
var _SelectionProxyHandler = class {
  config;
  constructor(config2) {
    this.config = { ...config2 };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};
var SelectionProxyHandler = _SelectionProxyHandler;
__name(SelectionProxyHandler, "SelectionProxyHandler");
_a37 = entityKind;
__publicField(SelectionProxyHandler, _a37, "SelectionProxyHandler");

// ../../node_modules/drizzle-orm/query-promise.js
var _a38;
var QueryPromise = class {
  [(_a38 = entityKind, Symbol.toStringTag)] = "QueryPromise";
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally?.();
        return value;
      },
      (reason) => {
        onFinally?.();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
};
__name(QueryPromise, "QueryPromise");
__publicField(QueryPromise, _a38, "QueryPromise");

// ../../node_modules/drizzle-orm/sqlite-core/table.js
var InlineForeignKeys2 = Symbol.for("drizzle:SQLiteInlineForeignKeys");
var _a39;
var SQLiteTable = class extends Table {
  /** @internal */
  [(_a39 = entityKind, Table.Symbol.Columns)];
  /** @internal */
  [InlineForeignKeys2] = [];
  /** @internal */
  [Table.Symbol.ExtraConfigBuilder] = void 0;
};
__name(SQLiteTable, "SQLiteTable");
__publicField(SQLiteTable, _a39, "SQLiteTable");
/** @internal */
__publicField(SQLiteTable, "Symbol", Object.assign({}, Table.Symbol, {
  InlineForeignKeys: InlineForeignKeys2
}));
function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
  const rawTable = new SQLiteTable(name, schema, baseName);
  const builtColumns = Object.fromEntries(
    Object.entries(columns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys2].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table3 = Object.assign(rawTable, builtColumns);
  table3[Table.Symbol.Columns] = builtColumns;
  if (extraConfig) {
    table3[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table3;
}
__name(sqliteTableBase, "sqliteTableBase");
var sqliteTable = /* @__PURE__ */ __name((name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
}, "sqliteTable");

// ../../node_modules/drizzle-orm/utils.js
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node = result2;
      for (const [pathChunkIndex, pathChunk] of path.entries()) {
        if (pathChunkIndex < path.length - 1) {
          if (!(pathChunk in node)) {
            node[pathChunk] = {};
          }
          node = node[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path.length === 2) {
            const objectName = path[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
__name(mapResultRow, "mapResultRow");
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
__name(orderSelectedFields, "orderSelectedFields");
function haveSameKeys(left, right) {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
__name(haveSameKeys, "haveSameKeys");
function mapUpdateSet(table3, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL)) {
      return [key, value];
    } else {
      return [key, new Param(value, table3[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
__name(mapUpdateSet, "mapUpdateSet");
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
__name(applyMixins, "applyMixins");
function getTableColumns(table3) {
  return table3[Table.Symbol.Columns];
}
__name(getTableColumns, "getTableColumns");
function getTableLikeName(table3) {
  return is(table3, Subquery) ? table3._.alias : is(table3, View) ? table3[ViewBaseConfig].name : is(table3, SQL) ? void 0 : table3[Table.Symbol.IsAlias] ? table3[Table.Symbol.Name] : table3[Table.Symbol.BaseName];
}
__name(getTableLikeName, "getTableLikeName");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/delete.js
var _a40;
var SQLiteDeleteBase = class extends QueryPromise {
  constructor(table3, session, dialect, withList) {
    super();
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.config = { table: table3, withList };
  }
  /** @internal */
  config;
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute(placeholderValues) {
    return this._prepare().execute(placeholderValues);
  }
  $dynamic() {
    return this;
  }
};
__name(SQLiteDeleteBase, "SQLiteDeleteBase");
_a40 = entityKind;
__publicField(SQLiteDeleteBase, _a40, "SQLiteDelete");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/insert.js
var _a41;
var SQLiteInsertBuilder = class {
  constructor(table3, session, dialect, withList) {
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
  }
};
__name(SQLiteInsertBuilder, "SQLiteInsertBuilder");
_a41 = entityKind;
__publicField(SQLiteInsertBuilder, _a41, "SQLiteInsertBuilder");
var _a42;
var SQLiteInsertBase = class extends QueryPromise {
  constructor(table3, values, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { table: table3, values, withList };
  }
  /** @internal */
  config;
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config2 = {}) {
    if (config2.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      const targetSql = Array.isArray(config2.target) ? sql`${config2.target}` : sql`${[config2.target]}`;
      const whereSql = config2.where ? sql` where ${config2.where}` : sql``;
      this.config.onConflict = sql`${targetSql} do nothing${whereSql}`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config2) {
    if (config2.where && (config2.targetWhere || config2.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config2.where ? sql` where ${config2.where}` : void 0;
    const targetWhereSql = config2.targetWhere ? sql` where ${config2.targetWhere}` : void 0;
    const setWhereSql = config2.setWhere ? sql` where ${config2.setWhere}` : void 0;
    const targetSql = Array.isArray(config2.target) ? sql`${config2.target}` : sql`${[config2.target]}`;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config2.set));
    this.config.onConflict = sql`${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};
__name(SQLiteInsertBase, "SQLiteInsertBase");
_a42 = entityKind;
__publicField(SQLiteInsertBase, _a42, "SQLiteInsert");

// ../../node_modules/drizzle-orm/errors.js
var _a43;
var DrizzleError = class extends Error {
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
};
__name(DrizzleError, "DrizzleError");
_a43 = entityKind;
__publicField(DrizzleError, _a43, "DrizzleError");
var _a44;
var TransactionRollbackError = class extends DrizzleError {
  constructor() {
    super({ message: "Rollback" });
  }
};
__name(TransactionRollbackError, "TransactionRollbackError");
_a44 = entityKind;
__publicField(TransactionRollbackError, _a44, "TransactionRollbackError");

// ../../node_modules/drizzle-orm/sqlite-core/foreign-keys.js
var _a45;
var ForeignKeyBuilder2 = class {
  /** @internal */
  reference;
  /** @internal */
  _onUpdate;
  /** @internal */
  _onDelete;
  constructor(config2, actions) {
    this.reference = () => {
      const { name, columns, foreignColumns } = config2();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table3) {
    return new ForeignKey2(table3, this);
  }
};
__name(ForeignKeyBuilder2, "ForeignKeyBuilder");
_a45 = entityKind;
__publicField(ForeignKeyBuilder2, _a45, "SQLiteForeignKeyBuilder");
var _a46;
var ForeignKey2 = class {
  constructor(table3, builder) {
    this.table = table3;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  reference;
  onUpdate;
  onDelete;
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[SQLiteTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[SQLiteTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
};
__name(ForeignKey2, "ForeignKey");
_a46 = entityKind;
__publicField(ForeignKey2, _a46, "SQLiteForeignKey");

// ../../node_modules/drizzle-orm/sqlite-core/unique-constraint.js
function uniqueKeyName2(table3, columns) {
  return `${table3[SQLiteTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
__name(uniqueKeyName2, "uniqueKeyName");
var _a47;
var UniqueConstraintBuilder2 = class {
  constructor(columns, name) {
    this.name = name;
    this.columns = columns;
  }
  /** @internal */
  columns;
  /** @internal */
  build(table3) {
    return new UniqueConstraint2(table3, this.columns, this.name);
  }
};
__name(UniqueConstraintBuilder2, "UniqueConstraintBuilder");
_a47 = entityKind;
__publicField(UniqueConstraintBuilder2, _a47, "SQLiteUniqueConstraintBuilder");
var _a48;
var UniqueOnConstraintBuilder2 = class {
  /** @internal */
  name;
  constructor(name) {
    this.name = name;
  }
  on(...columns) {
    return new UniqueConstraintBuilder2(columns, this.name);
  }
};
__name(UniqueOnConstraintBuilder2, "UniqueOnConstraintBuilder");
_a48 = entityKind;
__publicField(UniqueOnConstraintBuilder2, _a48, "SQLiteUniqueOnConstraintBuilder");
var _a49;
var UniqueConstraint2 = class {
  constructor(table3, columns, name) {
    this.table = table3;
    this.columns = columns;
    this.name = name ?? uniqueKeyName2(this.table, this.columns.map((column) => column.name));
  }
  columns;
  name;
  getName() {
    return this.name;
  }
};
__name(UniqueConstraint2, "UniqueConstraint");
_a49 = entityKind;
__publicField(UniqueConstraint2, _a49, "SQLiteUniqueConstraint");

// ../../node_modules/drizzle-orm/sqlite-core/columns/common.js
var _a50;
var SQLiteColumnBuilder = class extends ColumnBuilder {
  foreignKeyConfigs = [];
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table3) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder2(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table3);
      })(ref, actions);
    });
  }
};
__name(SQLiteColumnBuilder, "SQLiteColumnBuilder");
_a50 = entityKind;
__publicField(SQLiteColumnBuilder, _a50, "SQLiteColumnBuilder");
var _a51;
var SQLiteColumn = class extends Column {
  constructor(table3, config2) {
    if (!config2.uniqueName) {
      config2.uniqueName = uniqueKeyName2(table3, [config2.name]);
    }
    super(table3, config2);
    this.table = table3;
  }
};
__name(SQLiteColumn, "SQLiteColumn");
_a51 = entityKind;
__publicField(SQLiteColumn, _a51, "SQLiteColumn");

// ../../node_modules/drizzle-orm/sqlite-core/columns/integer.js
var _a52;
var SQLiteBaseIntegerBuilder = class extends SQLiteColumnBuilder {
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config2) {
    if (config2?.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
};
__name(SQLiteBaseIntegerBuilder, "SQLiteBaseIntegerBuilder");
_a52 = entityKind;
__publicField(SQLiteBaseIntegerBuilder, _a52, "SQLiteBaseIntegerBuilder");
var _a53;
var SQLiteBaseInteger = class extends SQLiteColumn {
  autoIncrement = this.config.autoIncrement;
  getSQLType() {
    return "integer";
  }
};
__name(SQLiteBaseInteger, "SQLiteBaseInteger");
_a53 = entityKind;
__publicField(SQLiteBaseInteger, _a53, "SQLiteBaseInteger");
var _a54;
var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table3) {
    return new SQLiteInteger(
      table3,
      this.config
    );
  }
};
__name(SQLiteIntegerBuilder, "SQLiteIntegerBuilder");
_a54 = entityKind;
__publicField(SQLiteIntegerBuilder, _a54, "SQLiteIntegerBuilder");
var _a55;
var SQLiteInteger = class extends SQLiteBaseInteger {
};
__name(SQLiteInteger, "SQLiteInteger");
_a55 = entityKind;
__publicField(SQLiteInteger, _a55, "SQLiteInteger");
var _a56;
var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table3) {
    return new SQLiteTimestamp(
      table3,
      this.config
    );
  }
};
__name(SQLiteTimestampBuilder, "SQLiteTimestampBuilder");
_a56 = entityKind;
__publicField(SQLiteTimestampBuilder, _a56, "SQLiteTimestampBuilder");
var _a57;
var SQLiteTimestamp = class extends SQLiteBaseInteger {
  mode = this.config.mode;
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
};
__name(SQLiteTimestamp, "SQLiteTimestamp");
_a57 = entityKind;
__publicField(SQLiteTimestamp, _a57, "SQLiteTimestamp");
var _a58;
var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table3) {
    return new SQLiteBoolean(
      table3,
      this.config
    );
  }
};
__name(SQLiteBooleanBuilder, "SQLiteBooleanBuilder");
_a58 = entityKind;
__publicField(SQLiteBooleanBuilder, _a58, "SQLiteBooleanBuilder");
var _a59;
var SQLiteBoolean = class extends SQLiteBaseInteger {
  mode = this.config.mode;
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
};
__name(SQLiteBoolean, "SQLiteBoolean");
_a59 = entityKind;
__publicField(SQLiteBoolean, _a59, "SQLiteBoolean");
function integer(name, config2) {
  if (config2?.mode === "timestamp" || config2?.mode === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config2.mode);
  }
  if (config2?.mode === "boolean") {
    return new SQLiteBooleanBuilder(name, config2.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
__name(integer, "integer");

// ../../node_modules/drizzle-orm/sqlite-core/columns/text.js
var _a60;
var SQLiteTextBuilder = class extends SQLiteColumnBuilder {
  constructor(name, config2) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config2.enum;
    this.config.length = config2.length;
  }
  /** @internal */
  build(table3) {
    return new SQLiteText(table3, this.config);
  }
};
__name(SQLiteTextBuilder, "SQLiteTextBuilder");
_a60 = entityKind;
__publicField(SQLiteTextBuilder, _a60, "SQLiteTextBuilder");
var _a61;
var SQLiteText = class extends SQLiteColumn {
  enumValues = this.config.enumValues;
  length = this.config.length;
  constructor(table3, config2) {
    super(table3, config2);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
};
__name(SQLiteText, "SQLiteText");
_a61 = entityKind;
__publicField(SQLiteText, _a61, "SQLiteText");
var _a62;
var SQLiteTextJsonBuilder = class extends SQLiteColumnBuilder {
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table3) {
    return new SQLiteTextJson(
      table3,
      this.config
    );
  }
};
__name(SQLiteTextJsonBuilder, "SQLiteTextJsonBuilder");
_a62 = entityKind;
__publicField(SQLiteTextJsonBuilder, _a62, "SQLiteTextJsonBuilder");
var _a63;
var SQLiteTextJson = class extends SQLiteColumn {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
};
__name(SQLiteTextJson, "SQLiteTextJson");
_a63 = entityKind;
__publicField(SQLiteTextJson, _a63, "SQLiteTextJson");
function text(name, config2 = {}) {
  return config2.mode === "json" ? new SQLiteTextJsonBuilder(name) : new SQLiteTextBuilder(name, config2);
}
__name(text, "text");

// ../../node_modules/drizzle-orm/sqlite-core/view-base.js
var _a64;
var SQLiteViewBase = class extends View {
};
__name(SQLiteViewBase, "SQLiteViewBase");
_a64 = entityKind;
__publicField(SQLiteViewBase, _a64, "SQLiteViewBase");

// ../../node_modules/drizzle-orm/sqlite-core/dialect.js
var _a65;
var SQLiteDialect = class {
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!queries?.length)
      return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table: table3, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}delete from ${table3}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table3, set) {
    const tableColumns = table3[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set[colName] ?? sql.param(col.onUpdateFn(), col);
      const res = sql`${sql.identifier(col.name)} = ${value}`;
      if (i < setSize - 1) {
        return [res, sql.raw(", ")];
      }
      return [res];
    }));
  }
  buildUpdateQuery({ table: table3, set, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table3, set);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}update ${table3} set ${setSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, Column)) {
                  return sql.identifier(c.name);
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        const tableName = field.table[Table.Symbol.Name];
        const columnName = field.name;
        if (isSingleTable) {
          chunk.push(sql.identifier(columnName));
        } else {
          chunk.push(sql`${sql.identifier(tableName)}.${sql.identifier(columnName)}`);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table: table3,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table3, Subquery) ? table3._.alias : is(table3, SQLiteViewBase) ? table3[ViewBaseConfig].name : is(table3, SQL) ? void 0 : getTableName(table3)) && !((table22) => joins?.some(
        ({ alias }) => alias === (table22[Table.Symbol.IsAlias] ? getTableName(table22) : table22[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if (is(table3, Table) && table3[Table.Symbol.OriginalName] !== table3[Table.Symbol.Name]) {
        return sql`${sql.identifier(table3[Table.Symbol.OriginalName])} ${sql.identifier(table3[Table.Symbol.Name])}`;
      }
      return table3;
    })();
    const joinsArray = [];
    if (joins) {
      for (const [index2, joinMeta] of joins.entries()) {
        if (index2 === 0) {
          joinsArray.push(sql` `);
        }
        const table22 = joinMeta.table;
        if (is(table22, SQLiteTable)) {
          const tableName = table22[SQLiteTable.Symbol.Name];
          const tableSchema = table22[SQLiteTable.Symbol.Schema];
          const origTableName = table22[SQLiteTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
          );
        } else {
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${table22} on ${joinMeta.on}`
          );
        }
        if (index2 < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    const joinsSql = sql.join(joinsArray);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    const orderByList = [];
    if (orderBy) {
      for (const [index2, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index2 < orderBy.length - 1) {
          orderByList.push(sql`, `);
        }
      }
    }
    const groupByList = [];
    if (groupBy) {
      for (const [index2, groupByValue] of groupBy.entries()) {
        groupByList.push(groupByValue);
        if (index2 < groupBy.length - 1) {
          groupByList.push(sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
    const orderBySql = orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`${leftSelect.getSQL()} `;
    const rightChunk = sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, SQLiteColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
    }
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table: table3, values, onConflict, returning, withList }) {
    const valuesSqlList = [];
    const columns = table3[Table.Symbol.Columns];
    const colEntries = Object.entries(columns);
    const insertOrder = colEntries.map(([, column]) => sql.identifier(column.name));
    for (const [valueIndex, value] of values.entries()) {
      const valueList = [];
      for (const [fieldName, col] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
          let defaultValue;
          if (col.default !== null && col.default !== void 0) {
            defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
          } else if (col.defaultFn !== void 0) {
            const defaultFnResult = col.defaultFn();
            defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
          } else if (!col.default && col.onUpdateFn !== void 0) {
            const onUpdateFnResult = col.onUpdateFn();
            defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
          } else {
            defaultValue = sql`null`;
          }
          valueList.push(defaultValue);
        } else {
          valueList.push(colValue);
        }
      }
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(sql`, `);
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    return sql`${withSql}insert into ${table3} ${insertOrder} values ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema,
    tableNamesMap,
    table: table3,
    tableConfig,
    queryConfig: config2,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config2 === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config2.where) {
        const whereSql = typeof config2.where === "function" ? config2.where(aliasedColumns, getOperators()) : config2.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config2.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config2.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config2.columns?.[c] === true) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config2.with) {
        selectedRelations = Object.entries(config2.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config2.extras) {
        extras = typeof config2.extras === "function" ? config2.extras(aliasedColumns, { sql }) : config2.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config2.orderBy === "function" ? config2.orderBy(aliasedColumns, getOrderByOperators()) : config2.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config2.limit;
      offset = config2.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema, tableNamesMap, relation);
        const relationTableName = relation.referencedTable[Table.Symbol.Name];
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(
        selection.map(
          ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(field2.name) : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table3, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table3, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table3, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
};
__name(SQLiteDialect, "SQLiteDialect");
_a65 = entityKind;
__publicField(SQLiteDialect, _a65, "SQLiteDialect");
var _a66;
var SQLiteSyncDialect = class extends SQLiteDialect {
  migrate(migrations, session, config2) {
    const migrationsTable = config2 === void 0 ? "__drizzle_migrations" : typeof config2 === "string" ? "__drizzle_migrations" : config2.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session.run(migrationTableCreate);
    const dbMigrations = session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session.run(sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session.run(sql.raw(stmt));
          }
          session.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session.run(sql`COMMIT`);
    } catch (e) {
      session.run(sql`ROLLBACK`);
      throw e;
    }
  }
};
__name(SQLiteSyncDialect, "SQLiteSyncDialect");
_a66 = entityKind;
__publicField(SQLiteSyncDialect, _a66, "SQLiteSyncDialect");
var _a67;
var SQLiteAsyncDialect = class extends SQLiteDialect {
  async migrate(migrations, session, config2) {
    const migrationsTable = config2 === void 0 ? "__drizzle_migrations" : typeof config2 === "string" ? "__drizzle_migrations" : config2.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    await session.run(migrationTableCreate);
    const dbMigrations = await session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    await session.transaction(async (tx) => {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            await tx.run(sql.raw(stmt));
          }
          await tx.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
    });
  }
};
__name(SQLiteAsyncDialect, "SQLiteAsyncDialect");
_a67 = entityKind;
__publicField(SQLiteAsyncDialect, _a67, "SQLiteAsyncDialect");

// ../../node_modules/drizzle-orm/query-builders/query-builder.js
var _a68;
var TypedQueryBuilder = class {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
};
__name(TypedQueryBuilder, "TypedQueryBuilder");
_a68 = entityKind;
__publicField(TypedQueryBuilder, _a68, "TypedQueryBuilder");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/select.js
var _a69;
var SQLiteSelectBuilder = class {
  fields;
  session;
  dialect;
  withList;
  distinct;
  constructor(config2) {
    this.fields = config2.fields;
    this.session = config2.session;
    this.dialect = config2.dialect;
    this.withList = config2.withList;
    this.distinct = config2.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(source._.selectedFields).map((key) => [key, source[key]])
      );
    } else if (is(source, SQLiteViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new SQLiteSelectBase({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
};
__name(SQLiteSelectBuilder, "SQLiteSelectBuilder");
_a69 = entityKind;
__publicField(SQLiteSelectBuilder, _a69, "SQLiteSelectBuilder");
var _a70;
var SQLiteSelectQueryBuilderBase = class extends TypedQueryBuilder {
  _;
  /** @internal */
  config;
  joinsNotNullableMap;
  tableName;
  isPartialSelect;
  session;
  dialect;
  constructor({ table: table3, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    this.config = {
      withList,
      table: table3,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table3);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table3, on2) => {
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table3);
      if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table3, SQL)) {
          const selection = is(table3, Subquery) ? table3._.selectedFields : is(table3, View) ? table3[ViewBaseConfig].selectedFields : table3[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on2 === "function") {
        on2 = on2(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on: on2, table: table3, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  /**
   * Executes a `left join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .leftJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  leftJoin = this.createJoin("left");
  /**
   * Executes a `right join` operation by adding another table to the current query.
   *
   * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .rightJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  rightJoin = this.createJoin("right");
  /**
   * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
   *
   * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .innerJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  innerJoin = this.createJoin("inner");
  /**
   * Executes a `full join` operation by combining rows from two tables into a new table.
   *
   * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
   *
   * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
   *
   * @param table the table to join.
   * @param on the `on` clause.
   *
   * @example
   *
   * ```ts
   * // Select all users and their pets
   * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   *
   * // Select userId and petId
   * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
   *   userId: users.id,
   *   petId: pets.id,
   * })
   *   .from(users)
   *   .fullJoin(pets, eq(users.id, pets.ownerId))
   * ```
   */
  fullJoin = this.createJoin("full");
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /**
   * Adds `union` set operator to the query.
   *
   * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
   *
   * @example
   *
   * ```ts
   * // Select all unique names from customers and users tables
   * await db.select({ name: users.name })
   *   .from(users)
   *   .union(
   *     db.select({ name: customers.name }).from(customers)
   *   );
   * // or
   * import { union } from 'drizzle-orm/sqlite-core'
   *
   * await union(
   *   db.select({ name: users.name }).from(users),
   *   db.select({ name: customers.name }).from(customers)
   * );
   * ```
   */
  union = this.createSetOperator("union", false);
  /**
   * Adds `union all` set operator to the query.
   *
   * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
   *
   * @example
   *
   * ```ts
   * // Select all transaction ids from both online and in-store sales
   * await db.select({ transaction: onlineSales.transactionId })
   *   .from(onlineSales)
   *   .unionAll(
   *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   *   );
   * // or
   * import { unionAll } from 'drizzle-orm/sqlite-core'
   *
   * await unionAll(
   *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
   *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
   * );
   * ```
   */
  unionAll = this.createSetOperator("union", true);
  /**
   * Adds `intersect` set operator to the query.
   *
   * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
   *
   * @example
   *
   * ```ts
   * // Select course names that are offered in both departments A and B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .intersect(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { intersect } from 'drizzle-orm/sqlite-core'
   *
   * await intersect(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  intersect = this.createSetOperator("intersect", false);
  /**
   * Adds `except` set operator to the query.
   *
   * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
   *
   * @example
   *
   * ```ts
   * // Select all courses offered in department A but not in department B
   * await db.select({ courseName: depA.courseName })
   *   .from(depA)
   *   .except(
   *     db.select({ courseName: depB.courseName }).from(depB)
   *   );
   * // or
   * import { except } from 'drizzle-orm/sqlite-core'
   *
   * await except(
   *   db.select({ courseName: depA.courseName }).from(depA),
   *   db.select({ courseName: depB.courseName }).from(depB)
   * );
   * ```
   */
  except = this.createSetOperator("except", false);
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
};
__name(SQLiteSelectQueryBuilderBase, "SQLiteSelectQueryBuilderBase");
_a70 = entityKind;
__publicField(SQLiteSelectQueryBuilderBase, _a70, "SQLiteSelectQueryBuilder");
var _a71;
var SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      fieldsList,
      "all",
      true
    );
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.all();
  }
};
__name(SQLiteSelectBase, "SQLiteSelectBase");
_a71 = entityKind;
__publicField(SQLiteSelectBase, _a71, "SQLiteSelect");
applyMixins(SQLiteSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
__name(createSetOperator, "createSetOperator");
var getSQLiteSetOperators = /* @__PURE__ */ __name(() => ({
  union,
  unionAll,
  intersect,
  except
}), "getSQLiteSetOperators");
var union = createSetOperator("union", false);
var unionAll = createSetOperator("union", true);
var intersect = createSetOperator("intersect", false);
var except = createSetOperator("except", false);

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.js
var _a72;
var QueryBuilder = class {
  dialect;
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries
      });
    }
    __name(select, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    return { select, selectDistinct };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new SQLiteSyncDialect();
    }
    return this.dialect;
  }
};
__name(QueryBuilder, "QueryBuilder");
_a72 = entityKind;
__publicField(QueryBuilder, _a72, "SQLiteQueryBuilder");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/update.js
var _a73;
var SQLiteUpdateBuilder = class {
  constructor(table3, session, dialect, withList) {
    this.table = table3;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  set(values) {
    return new SQLiteUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    );
  }
};
__name(SQLiteUpdateBuilder, "SQLiteUpdateBuilder");
_a73 = entityKind;
__publicField(SQLiteUpdateBuilder, _a73, "SQLiteUpdateBuilder");
var _a74;
var SQLiteUpdateBase = class extends QueryPromise {
  constructor(table3, set, session, dialect, withList) {
    super();
    this.session = session;
    this.dialect = dialect;
    this.config = { set, table: table3, withList };
  }
  /** @internal */
  config;
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  run = (placeholderValues) => {
    return this._prepare().run(placeholderValues);
  };
  all = (placeholderValues) => {
    return this._prepare().all(placeholderValues);
  };
  get = (placeholderValues) => {
    return this._prepare().get(placeholderValues);
  };
  values = (placeholderValues) => {
    return this._prepare().values(placeholderValues);
  };
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
};
__name(SQLiteUpdateBase, "SQLiteUpdateBase");
_a74 = entityKind;
__publicField(SQLiteUpdateBase, _a74, "SQLiteUpdate");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/query.js
var _a75;
var RelationalQueryBuilder = class {
  constructor(mode, fullSchema, schema, tableNamesMap, table3, tableConfig, dialect, session) {
    this.mode = mode;
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table3;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  findMany(config2) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? config2 : {},
      "many"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? config2 : {},
      "many"
    );
  }
  findFirst(config2) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? { ...config2, limit: 1 } : { limit: 1 },
      "first"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config2 ? { ...config2, limit: 1 } : { limit: 1 },
      "first"
    );
  }
};
__name(RelationalQueryBuilder, "RelationalQueryBuilder");
_a75 = entityKind;
__publicField(RelationalQueryBuilder, _a75, "SQLiteAsyncRelationalQueryBuilder");
var _a76;
var SQLiteRelationalQuery = class extends QueryPromise {
  constructor(fullSchema, schema, tableNamesMap, table3, tableConfig, dialect, session, config2, mode) {
    super();
    this.fullSchema = fullSchema;
    this.schema = schema;
    this.tableNamesMap = tableNamesMap;
    this.table = table3;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config2;
    this.mode = mode;
  }
  /** @internal */
  mode;
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(isOneTimeQuery = false) {
    const { query, builtQuery } = this._toSQL();
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      builtQuery,
      void 0,
      this.mode === "first" ? "get" : "all",
      true,
      (rawRows, mapColumnValue) => {
        const rows = rawRows.map(
          (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
        );
        if (this.mode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    const query = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    if (this.mode === "first") {
      return this._prepare(false).get();
    }
    return this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
};
__name(SQLiteRelationalQuery, "SQLiteRelationalQuery");
_a76 = entityKind;
__publicField(SQLiteRelationalQuery, _a76, "SQLiteAsyncRelationalQuery");
var _a77;
var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
  sync() {
    return this.executeRaw();
  }
};
__name(SQLiteSyncRelationalQuery, "SQLiteSyncRelationalQuery");
_a77 = entityKind;
__publicField(SQLiteSyncRelationalQuery, _a77, "SQLiteSyncRelationalQuery");

// ../../node_modules/drizzle-orm/sqlite-core/query-builders/raw.js
var _a78;
var SQLiteRaw = class extends QueryPromise {
  constructor(execute, getSQL, action, dialect, mapBatchResult) {
    super();
    this.execute = execute;
    this.getSQL = getSQL;
    this.dialect = dialect;
    this.mapBatchResult = mapBatchResult;
    this.config = { action };
  }
  /** @internal */
  config;
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
};
__name(SQLiteRaw, "SQLiteRaw");
_a78 = entityKind;
__publicField(SQLiteRaw, _a78, "SQLiteRaw");

// ../../node_modules/drizzle-orm/sqlite-core/db.js
var _a79;
var BaseSQLiteDatabase = class {
  constructor(resultKind, dialect, session, schema) {
    this.resultKind = resultKind;
    this.dialect = dialect;
    this.session = session;
    this._ = schema ? {
      schema: schema.schema,
      fullSchema: schema.fullSchema,
      tableNamesMap: schema.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    };
    this.query = {};
    const query = this.query;
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        query[tableName] = new RelationalQueryBuilder(
          resultKind,
          schema.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
  }
  query;
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with(alias) {
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder());
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries
      });
    }
    __name(select, "select");
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self.session,
        dialect: self.dialect,
        withList: queries,
        distinct: true
      });
    }
    __name(selectDistinct, "selectDistinct");
    function update(table3) {
      return new SQLiteUpdateBuilder(table3, self.session, self.dialect, queries);
    }
    __name(update, "update");
    function insert(into) {
      return new SQLiteInsertBuilder(into, self.session, self.dialect, queries);
    }
    __name(insert, "insert");
    function delete_(from) {
      return new SQLiteDeleteBase(from, self.session, self.dialect, queries);
    }
    __name(delete_, "delete_");
    return { select, selectDistinct, update, insert, delete: delete_ };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table3) {
    return new SQLiteUpdateBuilder(table3, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(into) {
    return new SQLiteInsertBuilder(into, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(from) {
    return new SQLiteDeleteBase(from, this.session, this.dialect);
  }
  run(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.run(sql2),
        () => sql2,
        "run",
        this.dialect,
        this.session.extractRawRunValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.run(sql2);
  }
  all(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.all(sql2),
        () => sql2,
        "all",
        this.dialect,
        this.session.extractRawAllValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.all(sql2);
  }
  get(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.get(sql2),
        () => sql2,
        "get",
        this.dialect,
        this.session.extractRawGetValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.get(sql2);
  }
  values(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.values(sql2),
        () => sql2,
        "values",
        this.dialect,
        this.session.extractRawValuesValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.values(sql2);
  }
  transaction(transaction, config2) {
    return this.session.transaction(transaction, config2);
  }
};
__name(BaseSQLiteDatabase, "BaseSQLiteDatabase");
_a79 = entityKind;
__publicField(BaseSQLiteDatabase, _a79, "BaseSQLiteDatabase");

// ../../node_modules/drizzle-orm/sqlite-core/indexes.js
var _a80;
var IndexBuilderOn = class {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
};
__name(IndexBuilderOn, "IndexBuilderOn");
_a80 = entityKind;
__publicField(IndexBuilderOn, _a80, "SQLiteIndexBuilderOn");
var _a81;
var IndexBuilder = class {
  /** @internal */
  config;
  constructor(name, columns, unique) {
    this.config = {
      name,
      columns,
      unique,
      where: void 0
    };
  }
  /**
   * Condition for partial index.
   */
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table3) {
    return new Index(this.config, table3);
  }
};
__name(IndexBuilder, "IndexBuilder");
_a81 = entityKind;
__publicField(IndexBuilder, _a81, "SQLiteIndexBuilder");
var _a82;
var Index = class {
  config;
  constructor(config2, table3) {
    this.config = { ...config2, table: table3 };
  }
};
__name(Index, "Index");
_a82 = entityKind;
__publicField(Index, _a82, "SQLiteIndex");
function index(name) {
  return new IndexBuilderOn(name, false);
}
__name(index, "index");
function uniqueIndex(name) {
  return new IndexBuilderOn(name, true);
}
__name(uniqueIndex, "uniqueIndex");

// ../../node_modules/drizzle-orm/sqlite-core/session.js
var _a83;
var ExecuteResultSync = class extends QueryPromise {
  constructor(resultCb) {
    super();
    this.resultCb = resultCb;
  }
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
};
__name(ExecuteResultSync, "ExecuteResultSync");
_a83 = entityKind;
__publicField(ExecuteResultSync, _a83, "ExecuteResultSync");
var _a84;
var SQLitePreparedQuery = class {
  constructor(mode, executeMethod, query) {
    this.mode = mode;
    this.executeMethod = executeMethod;
    this.query = query;
  }
  /** @internal */
  joinsNotNullableMap;
  getQuery() {
    return this.query;
  }
  mapRunResult(result, _isFromBatch) {
    return result;
  }
  mapAllResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  mapGetResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  execute(placeholderValues) {
    if (this.mode === "async") {
      return this[this.executeMethod](placeholderValues);
    }
    return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
  }
  mapResult(response, isFromBatch) {
    switch (this.executeMethod) {
      case "run": {
        return this.mapRunResult(response, isFromBatch);
      }
      case "all": {
        return this.mapAllResult(response, isFromBatch);
      }
      case "get": {
        return this.mapGetResult(response, isFromBatch);
      }
    }
  }
};
__name(SQLitePreparedQuery, "SQLitePreparedQuery");
_a84 = entityKind;
__publicField(SQLitePreparedQuery, _a84, "PreparedQuery");
var _a85;
var SQLiteSession = class {
  constructor(dialect) {
    this.dialect = dialect;
  }
  prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode) {
    return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode);
  }
  run(query) {
    const staticQuery = this.dialect.sqlToQuery(query);
    try {
      return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
    } catch (err) {
      throw new DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(result) {
    return result;
  }
  all(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  get(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  values(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
};
__name(SQLiteSession, "SQLiteSession");
_a85 = entityKind;
__publicField(SQLiteSession, _a85, "SQLiteSession");
var _a86;
var SQLiteTransaction = class extends BaseSQLiteDatabase {
  constructor(resultType, dialect, session, schema, nestedIndex = 0) {
    super(resultType, dialect, session, schema);
    this.schema = schema;
    this.nestedIndex = nestedIndex;
  }
  rollback() {
    throw new TransactionRollbackError();
  }
};
__name(SQLiteTransaction, "SQLiteTransaction");
_a86 = entityKind;
__publicField(SQLiteTransaction, _a86, "SQLiteTransaction");

// ../../node_modules/drizzle-orm/d1/session.js
var _a87;
var SQLiteD1Session = class extends SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect);
    this.client = client;
    this.schema = schema;
    this.options = options;
    this.logger = options.logger ?? new NoopLogger();
  }
  logger;
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    const stmt = this.client.prepare(query.sql);
    return new D1PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  async batch(queries) {
    const preparedQueries = [];
    const builtQueries = [];
    for (const query of queries) {
      const preparedQuery = query._prepare();
      const builtQuery = preparedQuery.getQuery();
      preparedQueries.push(preparedQuery);
      if (builtQuery.params.length > 0) {
        builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
      } else {
        const builtQuery2 = preparedQuery.getQuery();
        builtQueries.push(
          this.client.prepare(builtQuery2.sql).bind(...builtQuery2.params)
        );
      }
    }
    const batchResults = await this.client.batch(builtQueries);
    return batchResults.map((result, i) => preparedQueries[i].mapResult(result, true));
  }
  extractRawAllValueFromBatchResult(result) {
    return result.results;
  }
  extractRawGetValueFromBatchResult(result) {
    return result.results[0];
  }
  extractRawValuesValueFromBatchResult(result) {
    return d1ToRawMapping(result.results);
  }
  async transaction(transaction, config2) {
    const tx = new D1Transaction("async", this.dialect, this, this.schema);
    await this.run(sql.raw(`begin${config2?.behavior ? " " + config2.behavior : ""}`));
    try {
      const result = await transaction(tx);
      await this.run(sql`commit`);
      return result;
    } catch (err) {
      await this.run(sql`rollback`);
      throw err;
    }
  }
};
__name(SQLiteD1Session, "SQLiteD1Session");
_a87 = entityKind;
__publicField(SQLiteD1Session, _a87, "SQLiteD1Session");
var _a88;
var _D1Transaction = class extends SQLiteTransaction {
  async transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _D1Transaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    await this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = await transaction(tx);
      await this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err) {
      await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err;
    }
  }
};
var D1Transaction = _D1Transaction;
__name(D1Transaction, "D1Transaction");
_a88 = entityKind;
__publicField(D1Transaction, _a88, "D1Transaction");
function d1ToRawMapping(results) {
  const rows = [];
  for (const row of results) {
    const entry = Object.keys(row).map((k) => row[k]);
    rows.push(entry);
  }
  return rows;
}
__name(d1ToRawMapping, "d1ToRawMapping");
var _a89;
var D1PreparedQuery = class extends SQLitePreparedQuery {
  constructor(stmt, query, logger, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("async", executeMethod, query);
    this.logger = logger;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
    this.fields = fields;
    this.stmt = stmt;
  }
  /** @internal */
  customResultMapper;
  /** @internal */
  fields;
  /** @internal */
  stmt;
  run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.bind(...params).run();
  }
  async all(placeholderValues) {
    const { fields, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
    }
    const rows = await this.values(placeholderValues);
    return this.mapAllResult(rows);
  }
  mapAllResult(rows, isFromBatch) {
    if (isFromBatch) {
      rows = d1ToRawMapping(rows.results);
    }
    if (!this.fields && !this.customResultMapper) {
      return rows;
    }
    if (this.customResultMapper) {
      return this.customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
  }
  async get(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger.logQuery(query.sql, params);
      return stmt.bind(...params).all().then(({ results }) => results[0]);
    }
    const rows = await this.values(placeholderValues);
    if (!rows[0]) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return mapResultRow(fields, rows[0], joinsNotNullableMap);
  }
  mapGetResult(result, isFromBatch) {
    if (isFromBatch) {
      result = d1ToRawMapping(result.results)[0];
    }
    if (!this.fields && !this.customResultMapper) {
      return result;
    }
    if (this.customResultMapper) {
      return this.customResultMapper([result]);
    }
    return mapResultRow(this.fields, result, this.joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.bind(...params).raw();
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
};
__name(D1PreparedQuery, "D1PreparedQuery");
_a89 = entityKind;
__publicField(D1PreparedQuery, _a89, "D1PreparedQuery");

// ../../node_modules/drizzle-orm/d1/driver.js
var _a90;
var DrizzleD1Database = class extends BaseSQLiteDatabase {
  async batch(batch) {
    return this.session.batch(batch);
  }
};
__name(DrizzleD1Database, "DrizzleD1Database");
_a90 = entityKind;
__publicField(DrizzleD1Database, _a90, "D1Database");
function drizzle(client, config2 = {}) {
  const dialect = new SQLiteAsyncDialect();
  let logger;
  if (config2.logger === true) {
    logger = new DefaultLogger();
  } else if (config2.logger !== false) {
    logger = config2.logger;
  }
  let schema;
  if (config2.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config2.schema,
      createTableRelationsHelpers
    );
    schema = {
      fullSchema: config2.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new SQLiteD1Session(client, dialect, schema, { logger });
  return new DrizzleD1Database("async", dialect, session, schema);
}
__name(drizzle, "drizzle");

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  jenjang: () => jenjang,
  kartuKeluarga: () => kartuKeluarga,
  pemasukan: () => pemasukan,
  pengeluaran: () => pengeluaran,
  penggajian: () => penggajian,
  santri: () => santri,
  santriDokumen: () => santriDokumen,
  sessions: () => sessions,
  syahriahPayment: () => syahriahPayment,
  tabunganSantri: () => tabunganSantri,
  users: () => users,
  ustadz: () => ustadz,
  ustadzDokumen: () => ustadzDokumen,
  ustadzJabatan: () => ustadzJabatan,
  yayasan: () => yayasan
});
var timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
};
var yayasan = sqliteTable("yayasan", {
  id: text("id").primaryKey(),
  // UUID
  nama: text("nama").notNull(),
  alamat: text("alamat").notNull(),
  nominalSyahriahDefault: integer("nominal_syahriah_default").default(0).notNull(),
  // Default monthly tuition fee
  ...timestamps
});
var jenjang = sqliteTable("jenjang", {
  id: text("id").primaryKey(),
  // UUID
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  nama: text("nama").notNull(),
  // 'TPQ' | 'RTQ' | etc.
  nominalSyahriah: integer("nominal_syahriah").notNull(),
  // Default fee for this program level
  ...timestamps
}, (table3) => ({
  yayasanJenjangIdx: index("jenjang_yayasan_idx").on(table3.yayasanId)
}));
var users = sqliteTable("users", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  username: text("username").notNull(),
  passwordHash: text("password_hash").notNull(),
  nama: text("nama").notNull(),
  role: text("role").notNull(),
  // 'ketua' | 'sekretariat' | 'bendahara'
  ...timestamps
}, (table3) => ({
  usernameIdx: uniqueIndex("users_username_idx").on(table3.username),
  yayasanIdx: index("users_yayasan_idx").on(table3.yayasanId)
}));
var sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expiresAt: integer("expires_at").notNull(),
  // Unix timestamp (seconds)
  ...timestamps
}, (table3) => ({
  userIdIdx: index("sessions_user_id_idx").on(table3.userId)
}));
var kartuKeluarga = sqliteTable("kartu_keluarga", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  nomorKk: text("nomor_kk").notNull(),
  alamat: text("alamat").notNull(),
  rt: text("rt").notNull(),
  rw: text("rw").notNull(),
  desa: text("desa").notNull(),
  kecamatan: text("kecamatan").notNull(),
  kabupaten: text("kabupaten").notNull(),
  provinsi: text("provinsi").notNull(),
  namaAyah: text("nama_ayah").notNull(),
  namaIbu: text("nama_ibu").notNull(),
  namaWali: text("nama_wali"),
  // Opsional
  ...timestamps
}, (table3) => ({
  yayasanKkIdx: uniqueIndex("kk_yayasan_kk_idx").on(table3.yayasanId, table3.nomorKk)
}));
var santri = sqliteTable("santri", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  kkId: text("kk_id").references(() => kartuKeluarga.id, { onDelete: "set null" }),
  jenjangId: text("jenjang_id").references(() => jenjang.id, { onDelete: "set null" }),
  // Program TPQ / RTQ
  nama: text("nama").notNull(),
  nik: text("nik"),
  // Nullable untuk tracking completeness
  jenisKelamin: text("jenis_kelamin").notNull(),
  // 'L' | 'P'
  tempatLahir: text("tempat_lahir").notNull(),
  tanggalLahir: text("tanggal_lahir").notNull(),
  // YYYY-MM-DD
  alamat: text("alamat").notNull(),
  sekolah: text("sekolah").notNull(),
  tanggalMasuk: text("tanggal_masuk").notNull(),
  // YYYY-MM-DD
  statusAktif: integer("status_aktif", { mode: "boolean" }).default(true).notNull(),
  syahriahStatus: text("syahriah_status").notNull(),
  // 'WAJIB' | 'GRATIS'
  syahriahNominalKustom: integer("syahriah_nominal_kustom"),
  // Override default nominal level jika perlu
  fotoCloudinaryId: text("foto_cloudinary_id"),
  fotoSecureUrl: text("foto_secure_url"),
  fotoWidth: integer("foto_width"),
  fotoHeight: integer("foto_height"),
  fotoBytes: integer("foto_bytes"),
  ...timestamps
}, (table3) => ({
  yayasanSantriIdx: index("santri_yayasan_idx").on(table3.yayasanId),
  kkIdx: index("santri_kk_idx").on(table3.kkId),
  jenjangIdx: index("santri_jenjang_idx").on(table3.jenjangId)
}));
var santriDokumen = sqliteTable("santri_dokumen", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  santriId: text("santri_id").references(() => santri.id, { onDelete: "cascade" }).notNull(),
  namaDokumen: text("nama_dokumen").notNull(),
  cloudinaryId: text("cloudinary_id").notNull(),
  secureUrl: text("secure_url").notNull(),
  bytes: integer("bytes").notNull(),
  ...timestamps
}, (table3) => ({
  yayasanSantriDokumenIdx: index("santri_dokumen_yayasan_idx").on(table3.yayasanId, table3.santriId)
}));
var ustadz = sqliteTable("ustadz", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  nomorInduk: text("nomor_induk"),
  namaLengkap: text("nama_lengkap").notNull(),
  namaPanggilan: text("nama_panggilan"),
  jenisKelamin: text("jenis_kelamin"),
  // 'L' | 'P'
  tempatLahir: text("tempat_lahir"),
  tanggalLahir: text("tanggal_lahir"),
  noHp: text("no_hp"),
  alamat: text("alamat"),
  foto: text("foto"),
  // Cloudinary URL / ID
  tmtMengajar: text("tmt_mengajar"),
  statusKeaktifan: text("status_keaktifan"),
  // 'Aktif' | 'Cuti' | 'Nonaktif' | 'Mengundurkan Diri'
  unitMengajar: text("unit_mengajar"),
  // 'TPQ' | 'RTQ' | 'TPQ & RTQ'
  hafalanJuz: integer("hafalan_juz"),
  // 0 - 30
  jenisBisyarah: text("jenis_bisyarah"),
  // 'Tidak Ada' | 'Bulanan' | 'Per Pertemuan' | 'Relawan'
  nominalBisyarah: integer("nominal_bisyarah"),
  ...timestamps
}, (table3) => ({
  yayasanUstadzIdx: index("ustadz_yayasan_idx").on(table3.yayasanId)
}));
var ustadzJabatan = sqliteTable("ustadz_jabatan", {
  id: text("id").primaryKey(),
  ustadzId: text("ustadz_id").references(() => ustadz.id, { onDelete: "cascade" }).notNull(),
  jabatan: text("jabatan").notNull(),
  tmtJabatan: text("tmt_jabatan"),
  tstJabatan: text("tst_jabatan"),
  status: text("status"),
  // Aktif / Nonaktif
  ...timestamps
}, (table3) => ({
  ustadzJabatanIdx: index("ustadz_jabatan_idx").on(table3.ustadzId)
}));
var ustadzDokumen = sqliteTable("ustadz_dokumen", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  ustadzId: text("ustadz_id").references(() => ustadz.id, { onDelete: "cascade" }).notNull(),
  jenisDokumen: text("jenis_dokumen"),
  // 'KTP' | 'Sertifikat Tahsin' | 'Sertifikat Tahfidz' | 'Syahadah/Sanad' | 'Lainnya'
  namaDokumen: text("nama_dokumen").notNull(),
  cloudinaryId: text("cloudinary_id").notNull(),
  secureUrl: text("secure_url").notNull(),
  bytes: integer("bytes").notNull(),
  ...timestamps
}, (table3) => ({
  yayasanUstadzDokumenIdx: index("ustadz_dokumen_yayasan_idx").on(table3.yayasanId, table3.ustadzId)
}));
var syahriahPayment = sqliteTable("syahriah_payment", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  santriId: text("santri_id").references(() => santri.id, { onDelete: "cascade" }).notNull(),
  bulan: integer("bulan").notNull(),
  // 1 - 12
  tahun: integer("tahun").notNull(),
  // e.g., 2026
  jumlahBayar: integer("jumlah_bayar").notNull(),
  tanggalBayar: text("tanggal_bayar").notNull(),
  // YYYY-MM-DD
  catatan: text("catatan"),
  ...timestamps
}, (table3) => ({
  yayasanSantriBulanTahunIdx: uniqueIndex("syahriah_unique_idx").on(table3.yayasanId, table3.santriId, table3.bulan, table3.tahun)
}));
var tabunganSantri = sqliteTable("tabungan_santri", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  santriId: text("santri_id").references(() => santri.id, { onDelete: "cascade" }).notNull(),
  jenisTransaksi: text("jenis_transaksi").notNull(),
  // 'SETOR' | 'TARIK'
  jumlah: integer("jumlah").notNull(),
  tanggalTransaksi: text("tanggal_transaksi").notNull(),
  // YYYY-MM-DD
  keterangan: text("keterangan"),
  ...timestamps
}, (table3) => ({
  yayasanSantriTabunganIdx: index("tabungan_santri_idx").on(table3.yayasanId, table3.santriId)
}));
var pemasukan = sqliteTable("pemasukan", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  tanggal: text("tanggal").notNull(),
  // YYYY-MM-DD
  jumlah: integer("jumlah").notNull(),
  sumber: text("sumber").notNull(),
  // e.g., 'SYAHRIAH', 'DONASI', etc.
  keterangan: text("keterangan"),
  ...timestamps
}, (table3) => ({
  yayasanPemasukanIdx: index("pemasukan_yayasan_idx").on(table3.yayasanId)
}));
var pengeluaran = sqliteTable("pengeluaran", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  tanggal: text("tanggal").notNull(),
  // YYYY-MM-DD
  jumlah: integer("jumlah").notNull(),
  kategori: text("kategori").notNull(),
  // e.g., 'GAJI', 'OPERASIONAL', etc.
  keterangan: text("keterangan"),
  ...timestamps
}, (table3) => ({
  yayasanPengeluaranIdx: index("pengeluaran_yayasan_idx").on(table3.yayasanId)
}));
var penggajian = sqliteTable("penggajian", {
  id: text("id").primaryKey(),
  yayasanId: text("yayasan_id").references(() => yayasan.id, { onDelete: "cascade" }).notNull(),
  ustadzId: text("ustadz_id").references(() => ustadz.id, { onDelete: "cascade" }).notNull(),
  bulan: integer("bulan").notNull(),
  // 1 - 12
  tahun: integer("tahun").notNull(),
  gajiPokok: integer("gaji_pokok").notNull(),
  tunjangan: integer("tunjangan").default(0).notNull(),
  potongan: integer("potongan").default(0).notNull(),
  totalDiterima: integer("total_diterima").notNull(),
  // (gajiPokok + tunjangan - potongan)
  tanggalDibayar: text("tanggal_dibayar").notNull(),
  // YYYY-MM-DD
  status: text("status").notNull(),
  // 'DIBAYAR'
  pengeluaranId: text("pengeluaran_id").references(() => pengeluaran.id, { onDelete: "set null" }),
  ...timestamps
}, (table3) => ({
  yayasanUstadzBulanTahunIdx: uniqueIndex("penggajian_unique_idx").on(table3.yayasanId, table3.ustadzId, table3.bulan, table3.tahun)
}));

// src/db/client.ts
function getDb(d1) {
  return drizzle(d1, { schema: schema_exports });
}
__name(getDb, "getDb");

// src/middleware/auth.ts
async function authMiddleware(c, next) {
  let sessionId = getCookie(c, "session_token");
  if (!sessionId) {
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7);
    }
  }
  if (!sessionId) {
    return c.json({ error: "Unauthorized: Session missing" }, 401);
  }
  const db = getDb(c.env.DB);
  const nowInSeconds = Math.floor(Date.now() / 1e3);
  const result = await db.select({
    session: sessions,
    user: users,
    yayasan
  }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).innerJoin(yayasan, eq(users.yayasanId, yayasan.id)).where(
    and(
      eq(sessions.id, sessionId),
      gt(sessions.expiresAt, nowInSeconds)
    )
  ).get();
  if (!result) {
    return c.json({ error: "Unauthorized: Invalid or expired session" }, 401);
  }
  c.set("user", {
    id: result.user.id,
    yayasanId: result.user.yayasanId,
    nama: result.user.nama,
    role: result.user.role,
    yayasanNama: result.yayasan.nama
  });
  await next();
}
__name(authMiddleware, "authMiddleware");

// src/routes/auth.ts
var authRouter = new Hono2();
async function hashPassword(password) {
  const salt = "al-munawwaroh-secure-salt-2026";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword, "hashPassword");
authRouter.post("/register-yayasan", async (c) => {
  const body = await c.req.json();
  const { namaYayasan, alamatYayasan, namaUser } = body;
  if (!namaYayasan || !alamatYayasan || !namaUser) {
    return c.json({ error: "Data registrasi tidak lengkap" }, 400);
  }
  const db = getDb(c.env.DB);
  const baseName = namaYayasan.toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseName + ".ketua";
  let existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    username = baseName + Math.floor(Math.random() * 1e3) + ".ketua";
  }
  const yayasanId = crypto.randomUUID();
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword("123456");
  const now = /* @__PURE__ */ new Date();
  try {
    await db.insert(yayasan).values({
      id: yayasanId,
      nama: namaYayasan,
      alamat: alamatYayasan,
      nominalSyahriahDefault: 0,
      createdAt: now,
      updatedAt: now
    });
    await db.insert(users).values({
      id: userId,
      yayasanId,
      username,
      passwordHash,
      nama: namaUser,
      role: "ketua",
      createdAt: now,
      updatedAt: now
    });
    await db.insert(jenjang).values({
      id: crypto.randomUUID(),
      yayasanId,
      nama: "TPQ",
      nominalSyahriah: 0,
      createdAt: now,
      updatedAt: now
    });
    await db.insert(jenjang).values({
      id: crypto.randomUUID(),
      yayasanId,
      nama: "RTQ",
      nominalSyahriah: 0,
      createdAt: now,
      updatedAt: now
    });
    return c.json({ success: true, username, message: "Yayasan dan akun Ketua berhasil didaftarkan" });
  } catch (err) {
    return c.json({ error: "Gagal melakukan pendaftaran: " + err.message }, 500);
  }
});
authRouter.post("/login", async (c) => {
  const body = await c.req.json();
  const { username, password } = body;
  if (!username || !password) {
    return c.json({ error: "Username dan password wajib diisi" }, 400);
  }
  const db = getDb(c.env.DB);
  const passwordHash = await hashPassword(password);
  const userResult = await db.select({
    user: users,
    yayasan
  }).from(users).innerJoin(yayasan, eq(users.yayasanId, yayasan.id)).where(and(eq(users.username, username), eq(users.passwordHash, passwordHash))).get();
  if (!userResult) {
    return c.json({ error: "Username atau password salah" }, 401);
  }
  const { user, yayasan: userYayasan } = userResult;
  const sessionId = crypto.randomUUID();
  const maxAgeDays = 7;
  const expiresAt = Math.floor(Date.now() / 1e3) + maxAgeDays * 24 * 60 * 60;
  const now = /* @__PURE__ */ new Date();
  await db.insert(sessions).values({
    id: sessionId,
    userId: user.id,
    expiresAt,
    createdAt: now,
    updatedAt: now
  });
  setCookie(c, "session_token", sessionId, {
    httpOnly: true,
    secure: true,
    // Requires HTTPS (localhost is fine in modern dev tools)
    sameSite: "None",
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60
  });
  return c.json({
    token: sessionId,
    user: {
      id: user.id,
      yayasanId: user.yayasanId,
      nama: user.nama,
      username: user.username,
      role: user.role,
      yayasanNama: userYayasan.nama
    }
  });
});
authRouter.post("/logout", authMiddleware, async (c) => {
  const sessionId = getCookie(c, "session_token");
  if (sessionId) {
    const db = getDb(c.env.DB);
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }
  deleteCookie(c, "session_token", {
    path: "/"
  });
  return c.json({ success: true, message: "Berhasil logout" });
});
authRouter.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  return c.json({ user });
});

// src/routes/dashboard.ts
var dashboardRouter = new Hono2();
dashboardRouter.use("*", authMiddleware);
dashboardRouter.get("/stats", async (c) => {
  const user = c.get("user");
  const yayasanId = user.yayasanId;
  const db = getDb(c.env.DB);
  const totalSantriPromise = db.select({ count: sql`count(*)` }).from(santri).where(eq(santri.yayasanId, yayasanId));
  const gratisSantriPromise = db.select({ count: sql`count(*)` }).from(santri).where(and(eq(santri.yayasanId, yayasanId), eq(santri.syahriahStatus, "GRATIS")));
  const totalPengajarPromise = db.select({ count: sql`count(*)` }).from(ustadz).where(eq(ustadz.yayasanId, yayasanId));
  const totalKKPromise = db.select({ count: sql`count(*)` }).from(kartuKeluarga).where(eq(kartuKeluarga.yayasanId, yayasanId));
  const totalPemasukanPromise = db.select({ total: sql`coalesce(sum(jumlah), 0)` }).from(pemasukan).where(eq(pemasukan.yayasanId, yayasanId));
  const totalPengeluaranPromise = db.select({ total: sql`coalesce(sum(jumlah), 0)` }).from(pengeluaran).where(eq(pengeluaran.yayasanId, yayasanId));
  const santriNoFotoPromise = db.select({ count: sql`count(*)` }).from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.fotoSecureUrl)));
  const santriNoKKPromise = db.select({ count: sql`count(*)` }).from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.kkId)));
  const santriNoNIKPromise = db.select({ count: sql`count(*)` }).from(santri).where(and(eq(santri.yayasanId, yayasanId), isNull(santri.nik)));
  const pengajarNoFotoPromise = db.select({ count: sql`count(*)` }).from(ustadz).where(and(eq(ustadz.yayasanId, yayasanId), isNull(ustadz.foto)));
  const [
    [totalSantri],
    [gratisSantri],
    [totalPengajar],
    [totalKK],
    [totalPemasukan],
    [totalPengeluaran],
    [santriNoFoto],
    [santriNoKK],
    [santriNoNIK],
    [pengajarNoFoto]
  ] = await Promise.all([
    totalSantriPromise,
    gratisSantriPromise,
    totalPengajarPromise,
    totalKKPromise,
    totalPemasukanPromise,
    totalPengeluaranPromise,
    santriNoFotoPromise,
    santriNoKKPromise,
    santriNoNIKPromise,
    pengajarNoFotoPromise
  ]);
  const pemasukanNum = totalPemasukan.total;
  const pengeluaranNum = totalPengeluaran.total;
  const saldo = pemasukanNum - pengeluaranNum;
  const totalSantriNum = totalSantri.count;
  const totalPengajarNum = totalPengajar.count;
  const dataLengkapPoints = totalSantriNum - santriNoFoto.count + (totalSantriNum - santriNoKK.count) + (totalSantriNum - santriNoNIK.count) + (totalPengajarNum - pengajarNoFoto.count);
  const totalPointsPossibles = totalSantriNum * 3 + totalPengajarNum;
  const progressKelengkapan = totalPointsPossibles > 0 ? Math.round(dataLengkapPoints / totalPointsPossibles * 100) : 100;
  return c.json({
    stats: {
      totalSantri: totalSantriNum,
      totalUstadz: totalPengajarNum,
      totalKK: totalKK.count,
      totalPemasukan: pemasukanNum,
      totalPengeluaran: pengeluaranNum,
      saldo,
      gratisSantri: gratisSantri.count,
      progressKelengkapan
    },
    incompleteData: {
      santriMissingFoto: santriNoFoto.count,
      santriMissingKK: santriNoKK.count,
      santriMissingNIK: santriNoNIK.count,
      ustadzMissingFoto: pengajarNoFoto.count
    }
  });
});

// src/middleware/role.ts
function requireRole(allowedRoles) {
  return async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized: Hubungkan session Anda" }, 401);
    }
    if (user.role !== "ketua" && !allowedRoles.includes(user.role)) {
      return c.json({ error: "Forbidden: Hak akses tidak memadai untuk aksi ini" }, 403);
    }
    await next();
  };
}
__name(requireRole, "requireRole");

// src/routes/jenjang.ts
var jenjangRouter = new Hono2();
jenjangRouter.use("*", authMiddleware);
jenjangRouter.get("/", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select().from(jenjang).where(eq(jenjang.yayasanId, user.yayasanId)).all();
  return c.json(result);
});
jenjangRouter.post("/", requireRole(["ketua", "bendahara"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { nama, nominalSyahriah } = body;
  if (!nama || nominalSyahriah === void 0) {
    return c.json({ error: "Nama dan nominal Syahriah wajib diisi" }, 400);
  }
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const id = crypto.randomUUID();
  await db.insert(jenjang).values({
    id,
    yayasanId: user.yayasanId,
    nama,
    nominalSyahriah: Number(nominalSyahriah),
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
jenjangRouter.put("/:id", requireRole(["ketua", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const { nama, nominalSyahriah } = body;
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const existing = await db.select().from(jenjang).where(and(eq(jenjang.id, id), eq(jenjang.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Program tidak ditemukan" }, 404);
  }
  await db.update(jenjang).set({
    nama: nama || existing.nama,
    nominalSyahriah: nominalSyahriah !== void 0 ? Number(nominalSyahriah) : existing.nominalSyahriah,
    updatedAt: now
  }).where(eq(jenjang.id, id));
  return c.json({ success: true });
});
jenjangRouter.delete("/:id", requireRole(["ketua", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const existing = await db.select().from(jenjang).where(and(eq(jenjang.id, id), eq(jenjang.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Program tidak ditemukan" }, 404);
  }
  await db.delete(jenjang).where(eq(jenjang.id, id));
  return c.json({ success: true });
});

// src/routes/kk.ts
var kkRouter = new Hono2();
kkRouter.use("*", authMiddleware);
kkRouter.get("/", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select({
    id: kartuKeluarga.id,
    nomorKk: kartuKeluarga.nomorKk,
    alamat: kartuKeluarga.alamat,
    rt: kartuKeluarga.rt,
    rw: kartuKeluarga.rw,
    desa: kartuKeluarga.desa,
    kecamatan: kartuKeluarga.kecamatan,
    kabupaten: kartuKeluarga.kabupaten,
    provinsi: kartuKeluarga.provinsi,
    namaAyah: kartuKeluarga.namaAyah,
    namaIbu: kartuKeluarga.namaIbu,
    namaWali: kartuKeluarga.namaWali,
    createdAt: kartuKeluarga.createdAt,
    memberCount: sql`(SELECT count(*) FROM ${santri} WHERE ${santri.kkId} = ${kartuKeluarga.id})`
  }).from(kartuKeluarga).where(eq(kartuKeluarga.yayasanId, user.yayasanId)).all();
  return c.json(result);
});
kkRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const kkDetail = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
  if (!kkDetail) {
    return c.json({ error: "Kartu Keluarga tidak ditemukan" }, 404);
  }
  const members = await db.select().from(santri).where(and(eq(santri.kkId, id), eq(santri.yayasanId, user.yayasanId))).all();
  return c.json({
    ...kkDetail,
    members
  });
});
kkRouter.post("/", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { nomorKk, alamat, rt, rw, desa, kecamatan, kabupaten, provinsi, namaAyah, namaIbu, namaWali } = body;
  if (!nomorKk || !alamat || !rt || !rw || !desa || !kecamatan || !kabupaten || !provinsi || !namaAyah || !namaIbu) {
    return c.json({ error: "Mohon isi data wajib KK dengan lengkap" }, 400);
  }
  const db = getDb(c.env.DB);
  const existing = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.nomorKk, nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
  if (existing) {
    return c.json({ error: "Nomor KK sudah terdaftar di yayasan ini" }, 400);
  }
  const id = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  await db.insert(kartuKeluarga).values({
    id,
    yayasanId: user.yayasanId,
    nomorKk,
    alamat,
    rt,
    rw,
    desa,
    kecamatan,
    kabupaten,
    provinsi,
    namaAyah,
    namaIbu,
    namaWali,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
kkRouter.put("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const existing = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Kartu Keluarga tidak ditemukan" }, 404);
  }
  if (body.nomorKk && body.nomorKk !== existing.nomorKk) {
    const duplicate = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.nomorKk, body.nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
    if (duplicate) {
      return c.json({ error: "Nomor KK baru sudah digunakan oleh keluarga lain" }, 400);
    }
  }
  await db.update(kartuKeluarga).set({
    nomorKk: body.nomorKk ?? existing.nomorKk,
    alamat: body.alamat ?? existing.alamat,
    rt: body.rt ?? existing.rt,
    rw: body.rw ?? existing.rw,
    desa: body.desa ?? existing.desa,
    kecamatan: body.kecamatan ?? existing.kecamatan,
    kabupaten: body.kabupaten ?? existing.kabupaten,
    provinsi: body.provinsi ?? existing.provinsi,
    namaAyah: body.namaAyah ?? existing.namaAyah,
    namaIbu: body.namaIbu ?? existing.namaIbu,
    namaWali: body.namaWali !== void 0 ? body.namaWali : existing.namaWali,
    updatedAt: now
  }).where(eq(kartuKeluarga.id, id));
  return c.json({ success: true });
});
kkRouter.delete("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const existing = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.id, id), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Kartu Keluarga tidak ditemukan" }, 404);
  }
  await db.delete(kartuKeluarga).where(eq(kartuKeluarga.id, id));
  return c.json({ success: true });
});

// src/utils/cloudinary.ts
function getConfig(c) {
  const cloudName = c.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = c.env.CLOUDINARY_API_KEY;
  const apiSecret = c.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary credentials are not configured in environment variables.");
    return null;
  }
  return { cloudName, apiKey, apiSecret };
}
__name(getConfig, "getConfig");
async function generateSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys.map((key) => `${key}=${params[key]}`).join("&") + apiSecret;
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(generateSignature, "generateSignature");
function getResourceType(publicId, secureUrl) {
  const target = secureUrl || publicId;
  const parts = target.split(".");
  const ext = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
  const rawExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip", "rar", "csv"];
  if (ext && rawExtensions.includes(ext)) {
    return "raw";
  }
  return "image";
}
__name(getResourceType, "getResourceType");
async function uploadToCloudinary(c, fileBuffer, folder, fileName) {
  const config2 = getConfig(c);
  if (!config2)
    return null;
  const timestamp = Math.floor(Date.now() / 1e3).toString();
  const params = {
    folder,
    timestamp
  };
  if (fileName) {
    const cleanName = fileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    params.public_id = `${cleanName}_${timestamp}`;
  }
  const signature = await generateSignature(params, config2.apiSecret);
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]));
  formData.append("api_key", config2.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);
  if (params.public_id) {
    formData.append("public_id", params.public_id);
  }
  const url = `https://api.cloudinary.com/v1_1/${config2.cloudName}/auto/upload`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloudinary upload failed: ${response.status} - ${errText}`);
    }
    const data = await response.json();
    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
      bytes: data.bytes,
      width: data.width,
      height: data.height
    };
  } catch (error3) {
    console.error("Error uploading to Cloudinary:", error3);
    throw error3;
  }
}
__name(uploadToCloudinary, "uploadToCloudinary");
async function deleteFromCloudinary(c, publicId, resourceType = "image") {
  const config2 = getConfig(c);
  if (!config2)
    return false;
  const timestamp = Math.floor(Date.now() / 1e3).toString();
  const params = {
    public_id: publicId,
    timestamp
  };
  const signature = await generateSignature(params, config2.apiSecret);
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", config2.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  const url = `https://api.cloudinary.com/v1_1/${config2.cloudName}/${resourceType}/destroy`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Cloudinary destroy failed for ${publicId} (${resourceType}): ${response.status} - ${errText}`);
      if (resourceType === "image") {
        return deleteFromCloudinary(c, publicId, "raw");
      }
      return false;
    }
    const data = await response.json();
    return data.result === "ok";
  } catch (error3) {
    console.error(`Error deleting from Cloudinary (${publicId}):`, error3);
    return false;
  }
}
__name(deleteFromCloudinary, "deleteFromCloudinary");

// src/routes/santri.ts
var santriRouter = new Hono2();
santriRouter.use("*", authMiddleware);
santriRouter.get("/", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select({
    id: santri.id,
    nama: santri.nama,
    nik: santri.nik,
    jenisKelamin: santri.jenisKelamin,
    statusAktif: santri.statusAktif,
    syahriahStatus: santri.syahriahStatus,
    tanggalMasuk: santri.tanggalMasuk,
    jenjangNama: jenjang.nama,
    kkNomor: kartuKeluarga.nomorKk,
    fotoSecureUrl: santri.fotoSecureUrl
  }).from(santri).leftJoin(jenjang, eq(santri.jenjangId, jenjang.id)).leftJoin(kartuKeluarga, eq(santri.kkId, kartuKeluarga.id)).where(eq(santri.yayasanId, user.yayasanId)).all();
  return c.json(result);
});
santriRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const detail = await db.select({
    santri,
    jenjang,
    kartuKeluarga
  }).from(santri).leftJoin(jenjang, eq(santri.jenjangId, jenjang.id)).leftJoin(kartuKeluarga, eq(santri.kkId, kartuKeluarga.id)).where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId))).get();
  if (!detail) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  const docs = await db.select().from(santriDokumen).where(and(eq(santriDokumen.santriId, id), eq(santriDokumen.yayasanId, user.yayasanId))).all();
  return c.json({
    ...detail.santri,
    jenjangNama: detail.jenjang?.nama || null,
    kkDetails: detail.kartuKeluarga || null,
    dokumen: docs
  });
});
santriRouter.post("/", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const {
    nama,
    nik,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    alamat,
    sekolah,
    tanggalMasuk,
    statusAktif,
    syahriahStatus,
    syahriahNominalKustom,
    kkId,
    jenjangId,
    fotoCloudinaryId,
    fotoSecureUrl,
    fotoWidth,
    fotoHeight,
    fotoBytes
  } = body;
  if (!nama || !jenisKelamin || !tempatLahir || !tanggalLahir || !alamat || !sekolah || !tanggalMasuk || !syahriahStatus) {
    return c.json({ error: "Mohon lengkapi kolom data wajib santri" }, 400);
  }
  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  let finalKkId = kkId || null;
  if (body.nomorKk) {
    const existingKk = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.nomorKk, body.nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
    if (existingKk) {
      finalKkId = existingKk.id;
      await db.update(kartuKeluarga).set({
        namaAyah: body.namaAyah || existingKk.namaAyah,
        namaIbu: body.namaIbu || existingKk.namaIbu,
        namaWali: body.namaWali !== void 0 ? body.namaWali : existingKk.namaWali,
        alamat: body.alamatKk || body.alamat || existingKk.alamat,
        rt: body.rt || existingKk.rt,
        rw: body.rw || existingKk.rw,
        desa: body.desa || existingKk.desa,
        kecamatan: body.kecamatan || existingKk.kecamatan,
        kabupaten: body.kabupaten || existingKk.kabupaten,
        provinsi: body.provinsi || existingKk.provinsi,
        updatedAt: now
      }).where(eq(kartuKeluarga.id, finalKkId));
    } else {
      finalKkId = crypto.randomUUID();
      await db.insert(kartuKeluarga).values({
        id: finalKkId,
        yayasanId: user.yayasanId,
        nomorKk: body.nomorKk,
        namaAyah: body.namaAyah || "-",
        namaIbu: body.namaIbu || "-",
        namaWali: body.namaWali || null,
        alamat: body.alamatKk || body.alamat || "-",
        rt: body.rt || "-",
        rw: body.rw || "-",
        desa: body.desa || "-",
        kecamatan: body.kecamatan || "-",
        kabupaten: body.kabupaten || "-",
        provinsi: body.provinsi || "-",
        createdAt: now,
        updatedAt: now
      });
    }
  }
  await db.insert(santri).values({
    id,
    yayasanId: user.yayasanId,
    kkId: finalKkId,
    jenjangId: jenjangId || null,
    nama,
    nik: nik || null,
    jenisKelamin,
    tempatLahir,
    tanggalLahir,
    alamat,
    sekolah,
    tanggalMasuk,
    statusAktif: statusAktif !== void 0 ? Boolean(statusAktif) : true,
    syahriahStatus,
    syahriahNominalKustom: syahriahNominalKustom ? Number(syahriahNominalKustom) : null,
    fotoCloudinaryId: fotoCloudinaryId || null,
    fotoSecureUrl: fotoSecureUrl || null,
    fotoWidth: fotoWidth ? Number(fotoWidth) : null,
    fotoHeight: fotoHeight ? Number(fotoHeight) : null,
    fotoBytes: fotoBytes ? Number(fotoBytes) : null,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
santriRouter.put("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const existing = await db.select().from(santri).where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  let finalKkId = body.kkId !== void 0 ? body.kkId || null : existing.kkId;
  if (body.nomorKk) {
    const existingKk = await db.select().from(kartuKeluarga).where(and(eq(kartuKeluarga.nomorKk, body.nomorKk), eq(kartuKeluarga.yayasanId, user.yayasanId))).get();
    if (existingKk) {
      finalKkId = existingKk.id;
      await db.update(kartuKeluarga).set({
        namaAyah: body.namaAyah || existingKk.namaAyah,
        namaIbu: body.namaIbu || existingKk.namaIbu,
        namaWali: body.namaWali !== void 0 ? body.namaWali : existingKk.namaWali,
        alamat: body.alamatKk || existingKk.alamat,
        rt: body.rt || existingKk.rt,
        rw: body.rw || existingKk.rw,
        desa: body.desa || existingKk.desa,
        kecamatan: body.kecamatan || existingKk.kecamatan,
        kabupaten: body.kabupaten || existingKk.kabupaten,
        provinsi: body.provinsi || existingKk.provinsi,
        updatedAt: now
      }).where(eq(kartuKeluarga.id, finalKkId));
    } else {
      finalKkId = crypto.randomUUID();
      await db.insert(kartuKeluarga).values({
        id: finalKkId,
        yayasanId: user.yayasanId,
        nomorKk: body.nomorKk,
        namaAyah: body.namaAyah || "-",
        namaIbu: body.namaIbu || "-",
        namaWali: body.namaWali || null,
        alamat: body.alamatKk || body.alamat || "-",
        rt: body.rt || "-",
        rw: body.rw || "-",
        desa: body.desa || "-",
        kecamatan: body.kecamatan || "-",
        kabupaten: body.kabupaten || "-",
        provinsi: body.provinsi || "-",
        createdAt: now,
        updatedAt: now
      });
    }
  }
  await db.update(santri).set({
    kkId: finalKkId,
    jenjangId: body.jenjangId !== void 0 ? body.jenjangId || null : existing.jenjangId,
    nama: body.nama ?? existing.nama,
    nik: body.nik !== void 0 ? body.nik || null : existing.nik,
    jenisKelamin: body.jenisKelamin ?? existing.jenisKelamin,
    tempatLahir: body.tempatLahir ?? existing.tempatLahir,
    tanggalLahir: body.tanggalLahir ?? existing.tanggalLahir,
    alamat: body.alamat ?? existing.alamat,
    sekolah: body.sekolah ?? existing.sekolah,
    tanggalMasuk: body.tanggalMasuk ?? existing.tanggalMasuk,
    statusAktif: body.statusAktif !== void 0 ? Boolean(body.statusAktif) : existing.statusAktif,
    syahriahStatus: body.syahriahStatus ?? existing.syahriahStatus,
    syahriahNominalKustom: body.syahriahNominalKustom !== void 0 ? body.syahriahNominalKustom ? Number(body.syahriahNominalKustom) : null : existing.syahriahNominalKustom,
    fotoCloudinaryId: body.fotoCloudinaryId !== void 0 ? body.fotoCloudinaryId || null : existing.fotoCloudinaryId,
    fotoSecureUrl: body.fotoSecureUrl !== void 0 ? body.fotoSecureUrl || null : existing.fotoSecureUrl,
    fotoWidth: body.fotoWidth !== void 0 ? body.fotoWidth ? Number(body.fotoWidth) : null : existing.fotoWidth,
    fotoHeight: body.fotoHeight !== void 0 ? body.fotoHeight ? Number(body.fotoHeight) : null : existing.fotoHeight,
    fotoBytes: body.fotoBytes !== void 0 ? body.fotoBytes ? Number(body.fotoBytes) : null : existing.fotoBytes,
    updatedAt: now
  }).where(eq(santri.id, id));
  return c.json({ success: true });
});
santriRouter.delete("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const existing = await db.select().from(santri).where(and(eq(santri.id, id), eq(santri.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  if (existing.fotoCloudinaryId) {
    await deleteFromCloudinary(c, existing.fotoCloudinaryId, "image");
  }
  const docs = await db.select().from(santriDokumen).where(and(eq(santriDokumen.santriId, id), eq(santriDokumen.yayasanId, user.yayasanId))).all();
  for (const doc of docs) {
    if (doc.cloudinaryId) {
      const resType = getResourceType(doc.cloudinaryId, doc.secureUrl);
      await deleteFromCloudinary(c, doc.cloudinaryId, resType);
    }
  }
  await db.delete(santri).where(eq(santri.id, id));
  return c.json({ success: true });
});
santriRouter.post("/:id/documents", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const santriId = c.req.param("id");
  const body = await c.req.json();
  const { namaDokumen, cloudinaryId, secureUrl, bytes } = body;
  if (!namaDokumen || !cloudinaryId || !secureUrl || !bytes) {
    return c.json({ error: "Metadata dokumen tidak lengkap" }, 400);
  }
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const docId = crypto.randomUUID();
  const existingSantri = await db.select().from(santri).where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId))).get();
  if (!existingSantri) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  await db.insert(santriDokumen).values({
    id: docId,
    yayasanId: user.yayasanId,
    santriId,
    namaDokumen,
    cloudinaryId,
    secureUrl,
    bytes: Number(bytes),
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id: docId });
});
santriRouter.delete("/documents/:docId", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const docId = c.req.param("docId");
  const db = getDb(c.env.DB);
  const existing = await db.select().from(santriDokumen).where(and(eq(santriDokumen.id, docId), eq(santriDokumen.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Dokumen tidak ditemukan" }, 404);
  }
  if (existing.cloudinaryId) {
    const resType = getResourceType(existing.cloudinaryId, existing.secureUrl);
    await deleteFromCloudinary(c, existing.cloudinaryId, resType);
  }
  await db.delete(santriDokumen).where(eq(santriDokumen.id, docId));
  return c.json({ success: true });
});

// src/routes/ustadz.ts
var ustadzRouter = new Hono2();
ustadzRouter.use("*", authMiddleware);
ustadzRouter.get("/", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const isSekretariat = user.role === "sekretariat";
  const result = await db.select().from(ustadz).where(eq(ustadz.yayasanId, user.yayasanId)).all();
  const formatted = result.map((t) => {
    if (isSekretariat) {
      const { nominalBisyarah, ...rest } = t;
      return rest;
    }
    return t;
  });
  return c.json(formatted);
});
ustadzRouter.get("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const isSekretariat = user.role === "sekretariat";
  const ustadzData = await db.select().from(ustadz).where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId))).get();
  if (!ustadzData) {
    return c.json({ error: "Ustadz tidak ditemukan" }, 404);
  }
  const docs = await db.select().from(ustadzDokumen).where(and(eq(ustadzDokumen.ustadzId, id), eq(ustadzDokumen.yayasanId, user.yayasanId))).all();
  const jabatan = await db.select().from(ustadzJabatan).where(eq(ustadzJabatan.ustadzId, id)).all();
  if (isSekretariat) {
    const { nominalBisyarah, ...maskedUstadz } = ustadzData;
    return c.json({
      ...maskedUstadz,
      dokumen: docs,
      jabatan
    });
  }
  return c.json({
    ...ustadzData,
    dokumen: docs,
    jabatan
  });
});
ustadzRouter.post("/", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  const finalBisyarah = user.role === "sekretariat" ? 0 : Number(body.nominalBisyarah || 0);
  await db.insert(ustadz).values({
    id,
    yayasanId: user.yayasanId,
    nomorInduk: body.nomorInduk || null,
    namaLengkap: body.namaLengkap,
    namaPanggilan: body.namaPanggilan || null,
    jenisKelamin: body.jenisKelamin || null,
    tempatLahir: body.tempatLahir || null,
    tanggalLahir: body.tanggalLahir || null,
    noHp: body.noHp || null,
    alamat: body.alamat || null,
    foto: body.foto || null,
    tmtMengajar: body.tmtMengajar || null,
    statusKeaktifan: body.statusKeaktifan || null,
    unitMengajar: body.unitMengajar || null,
    hafalanJuz: body.hafalanJuz ? Number(body.hafalanJuz) : null,
    jenisBisyarah: body.jenisBisyarah || null,
    nominalBisyarah: finalBisyarah,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
ustadzRouter.put("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const existing = await db.select().from(ustadz).where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Ustadz tidak ditemukan" }, 404);
  }
  const isSekretariat = user.role === "sekretariat";
  const newBisyarah = isSekretariat ? existing.nominalBisyarah : body.nominalBisyarah !== void 0 ? Number(body.nominalBisyarah) : existing.nominalBisyarah;
  await db.update(ustadz).set({
    nomorInduk: body.nomorInduk !== void 0 ? body.nomorInduk : existing.nomorInduk,
    namaLengkap: body.namaLengkap ?? existing.namaLengkap,
    namaPanggilan: body.namaPanggilan !== void 0 ? body.namaPanggilan : existing.namaPanggilan,
    jenisKelamin: body.jenisKelamin !== void 0 ? body.jenisKelamin : existing.jenisKelamin,
    tempatLahir: body.tempatLahir !== void 0 ? body.tempatLahir : existing.tempatLahir,
    tanggalLahir: body.tanggalLahir !== void 0 ? body.tanggalLahir : existing.tanggalLahir,
    noHp: body.noHp !== void 0 ? body.noHp : existing.noHp,
    alamat: body.alamat !== void 0 ? body.alamat : existing.alamat,
    foto: body.foto !== void 0 ? body.foto : existing.foto,
    tmtMengajar: body.tmtMengajar !== void 0 ? body.tmtMengajar : existing.tmtMengajar,
    statusKeaktifan: body.statusKeaktifan !== void 0 ? body.statusKeaktifan : existing.statusKeaktifan,
    unitMengajar: body.unitMengajar !== void 0 ? body.unitMengajar : existing.unitMengajar,
    hafalanJuz: body.hafalanJuz !== void 0 ? Number(body.hafalanJuz) : existing.hafalanJuz,
    jenisBisyarah: body.jenisBisyarah !== void 0 ? body.jenisBisyarah : existing.jenisBisyarah,
    nominalBisyarah: newBisyarah,
    updatedAt: now
  }).where(eq(ustadz.id, id));
  return c.json({ success: true });
});
ustadzRouter.delete("/:id", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const db = getDb(c.env.DB);
  const existing = await db.select().from(ustadz).where(and(eq(ustadz.id, id), eq(ustadz.yayasanId, user.yayasanId))).get();
  if (!existing) {
    return c.json({ error: "Ustadz tidak ditemukan" }, 404);
  }
  if (existing.foto) {
    let publicId = existing.foto;
    if (existing.foto.startsWith("http")) {
      const parts = existing.foto.split("/upload/");
      if (parts.length > 1) {
        const pathParts = parts[1].split("/");
        if (pathParts[0].startsWith("v")) {
          pathParts.shift();
        }
        const fullPath = pathParts.join("/");
        const lastDot = fullPath.lastIndexOf(".");
        publicId = lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;
      }
    }
    await deleteFromCloudinary(c, publicId, "image");
  }
  const docs = await db.select().from(ustadzDokumen).where(and(eq(ustadzDokumen.ustadzId, id), eq(ustadzDokumen.yayasanId, user.yayasanId))).all();
  for (const doc of docs) {
    if (doc.cloudinaryId) {
      const resType = getResourceType(doc.cloudinaryId, doc.secureUrl);
      await deleteFromCloudinary(c, doc.cloudinaryId, resType);
    }
  }
  await db.delete(ustadz).where(eq(ustadz.id, id));
  return c.json({ success: true });
});
ustadzRouter.post("/:id/jabatan", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const user = c.get("user");
  const ustadzId = c.req.param("id");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  await db.insert(ustadzJabatan).values({
    id: crypto.randomUUID(),
    ustadzId,
    jabatan: body.jabatan,
    tmtJabatan: body.tmtJabatan || null,
    tstJabatan: body.tstJabatan || null,
    status: body.status || "Aktif",
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true });
});
ustadzRouter.delete("/:id/jabatan/:jabatanId", requireRole(["sekretariat", "bendahara"]), async (c) => {
  const jabatanId = c.req.param("jabatanId");
  const db = getDb(c.env.DB);
  await db.delete(ustadzJabatan).where(eq(ustadzJabatan.id, jabatanId));
  return c.json({ success: true });
});

// src/routes/keuangan.ts
var keuanganRouter = new Hono2();
keuanganRouter.use("*", authMiddleware);
keuanganRouter.use("*", requireRole(["bendahara", "ketua"]));
keuanganRouter.get("/syahriah/status", async (c) => {
  const user = c.get("user");
  const query = c.req.query();
  const bulan = query.bulan ? Number(query.bulan) : (/* @__PURE__ */ new Date()).getMonth() + 1;
  const tahun = query.tahun ? Number(query.tahun) : (/* @__PURE__ */ new Date()).getFullYear();
  const db = getDb(c.env.DB);
  const yConfig = await db.select().from(yayasan).where(eq(yayasan.id, user.yayasanId)).get();
  const nominalDefaultYayasan = yConfig?.nominalSyahriahDefault || 0;
  const result = await db.select({
    id: santri.id,
    nama: santri.nama,
    statusAktif: santri.statusAktif,
    syahriahStatus: santri.syahriahStatus,
    syahriahNominalKustom: santri.syahriahNominalKustom,
    jenjangNominal: jenjang.nominalSyahriah,
    jenjangNama: jenjang.nama,
    paymentId: syahriahPayment.id,
    tanggalBayar: syahriahPayment.tanggalBayar,
    jumlahBayar: syahriahPayment.jumlahBayar,
    catatan: syahriahPayment.catatan
  }).from(santri).leftJoin(jenjang, eq(santri.jenjangId, jenjang.id)).leftJoin(syahriahPayment, and(
    eq(syahriahPayment.santriId, santri.id),
    eq(syahriahPayment.bulan, bulan),
    eq(syahriahPayment.tahun, tahun)
  )).where(and(eq(santri.yayasanId, user.yayasanId), eq(santri.statusAktif, true))).all();
  const formatted = result.map((r) => {
    let nominalTagihan = 0;
    if (r.syahriahStatus === "WAJIB") {
      if (r.syahriahNominalKustom !== null) {
        nominalTagihan = r.syahriahNominalKustom;
      } else if (r.jenjangNominal !== null) {
        nominalTagihan = r.jenjangNominal;
      } else {
        nominalTagihan = nominalDefaultYayasan;
      }
    }
    const sudahBayar = r.syahriahStatus === "GRATIS" || r.paymentId !== null;
    let statusPembayaran = "BELUM_BAYAR";
    if (r.syahriahStatus === "GRATIS") {
      statusPembayaran = "GRATIS";
    } else if (r.paymentId !== null) {
      statusPembayaran = "LUNAS";
    }
    return {
      santriId: r.id,
      nama: r.nama,
      jenjangNama: r.jenjangNama || "Umum",
      syahriahStatus: r.syahriahStatus,
      nominalTagihan,
      sudahBayar,
      statusPembayaran,
      detailPembayaran: r.paymentId ? {
        id: r.paymentId,
        tanggalBayar: r.tanggalBayar,
        jumlahBayar: r.jumlahBayar,
        catatan: r.catatan
      } : null
    };
  });
  return c.json({
    bulan,
    tahun,
    data: formatted
  });
});
keuanganRouter.post("/syahriah/bayar", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { santriId, bulan, tahun, jumlahBayar, tanggalBayar, catatan } = body;
  if (!santriId || !bulan || !tahun || !jumlahBayar || !tanggalBayar) {
    return c.json({ error: "Data pembayaran syahriah tidak lengkap" }, 400);
  }
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const paymentId = crypto.randomUUID();
  const pemasukanId = crypto.randomUUID();
  const targetSantri = await db.select().from(santri).where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId))).get();
  if (!targetSantri) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  if (targetSantri.syahriahStatus === "GRATIS") {
    return c.json({ error: "Santri dengan status GRATIS tidak memerlukan pencatatan syahriah" }, 400);
  }
  const existing = await db.select().from(syahriahPayment).where(and(
    eq(syahriahPayment.santriId, santriId),
    eq(syahriahPayment.bulan, Number(bulan)),
    eq(syahriahPayment.tahun, Number(tahun)),
    eq(syahriahPayment.yayasanId, user.yayasanId)
  )).get();
  if (existing) {
    return c.json({ error: "Syahriah santri ini untuk periode bersangkutan sudah lunas" }, 400);
  }
  try {
    await db.insert(syahriahPayment).values({
      id: paymentId,
      yayasanId: user.yayasanId,
      santriId,
      bulan: Number(bulan),
      tahun: Number(tahun),
      jumlahBayar: Number(jumlahBayar),
      tanggalBayar,
      catatan: catatan || `Syahriah bulan ${bulan}/${tahun}`,
      createdAt: now,
      updatedAt: now
    });
    await db.insert(pemasukan).values({
      id: pemasukanId,
      yayasanId: user.yayasanId,
      tanggal: tanggalBayar,
      jumlah: Number(jumlahBayar),
      sumber: "SYAHRIAH",
      keterangan: catatan || `SPP Syahriah Santri: ${targetSantri.nama} (Bulan ${bulan}/${tahun})`,
      createdAt: now,
      updatedAt: now
    });
    return c.json({ success: true, paymentId });
  } catch (err) {
    return c.json({ error: "Gagal mencatat pembayaran: " + err.message }, 500);
  }
});
keuanganRouter.get("/tabungan", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const summaries = await db.select({
    id: santri.id,
    nama: santri.nama,
    statusAktif: santri.statusAktif,
    totalSetor: sql`sum(case when ${tabunganSantri.jenisTransaksi} = 'SETOR' then ${tabunganSantri.jumlah} else 0 end)`,
    totalTarik: sql`sum(case when ${tabunganSantri.jenisTransaksi} = 'TARIK' then ${tabunganSantri.jumlah} else 0 end)`
  }).from(santri).leftJoin(tabunganSantri, eq(santri.id, tabunganSantri.santriId)).where(eq(santri.yayasanId, user.yayasanId)).groupBy(santri.id).all();
  const formatted = summaries.map((s) => ({
    santriId: s.id,
    nama: s.nama,
    statusAktif: s.statusAktif,
    saldo: (s.totalSetor || 0) - (s.totalTarik || 0)
  }));
  return c.json(formatted);
});
keuanganRouter.get("/tabungan/:santriId", async (c) => {
  const user = c.get("user");
  const santriId = c.req.param("santriId");
  const db = getDb(c.env.DB);
  const targetSantri = await db.select().from(santri).where(and(eq(santri.id, santriId), eq(santri.yayasanId, user.yayasanId))).get();
  if (!targetSantri) {
    return c.json({ error: "Santri tidak ditemukan" }, 404);
  }
  const txs = await db.select().from(tabunganSantri).where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.yayasanId, user.yayasanId))).orderBy(asc(tabunganSantri.tanggalTransaksi)).all();
  let runningBalance = 0;
  const mutasi = txs.map((t) => {
    if (t.jenisTransaksi === "SETOR") {
      runningBalance += t.jumlah;
    } else {
      runningBalance -= t.jumlah;
    }
    return {
      id: t.id,
      tanggal: t.tanggalTransaksi,
      jenis: t.jenisTransaksi,
      jumlah: t.jumlah,
      keterangan: t.keterangan,
      saldo: runningBalance
    };
  });
  return c.json({
    santri: {
      id: targetSantri.id,
      nama: targetSantri.nama,
      alamat: targetSantri.alamat
    },
    totalSaldo: runningBalance,
    mutasi: mutasi.reverse()
    // Balik agar mutasi terbaru di atas untuk visual
  });
});
keuanganRouter.post("/tabungan/transaksi", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { santriId, jenisTransaksi, jumlah, tanggalTransaksi, keterangan } = body;
  if (!santriId || !jenisTransaksi || !jumlah || !tanggalTransaksi) {
    return c.json({ error: "Data transaksi tabungan tidak lengkap" }, 400);
  }
  if (jenisTransaksi !== "SETOR" && jenisTransaksi !== "TARIK") {
    return c.json({ error: "Jenis transaksi harus SETOR atau TARIK" }, 400);
  }
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const id = crypto.randomUUID();
  if (jenisTransaksi === "TARIK") {
    const totalSetor = await db.select({ total: sql`sum(jumlah)` }).from(tabunganSantri).where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.jenisTransaksi, "SETOR"))).get();
    const totalTarik = await db.select({ total: sql`sum(jumlah)` }).from(tabunganSantri).where(and(eq(tabunganSantri.santriId, santriId), eq(tabunganSantri.jenisTransaksi, "TARIK"))).get();
    const saldoSaatIni = (totalSetor?.total || 0) - (totalTarik?.total || 0);
    if (Number(jumlah) > saldoSaatIni) {
      return c.json({ error: `Saldo tabungan tidak mencukupi. Saldo saat ini: Rp${saldoSaatIni.toLocaleString("id-ID")}` }, 400);
    }
  }
  await db.insert(tabunganSantri).values({
    id,
    yayasanId: user.yayasanId,
    santriId,
    jenisTransaksi,
    jumlah: Number(jumlah),
    tanggalTransaksi,
    keterangan: keterangan || `${jenisTransaksi} Tabungan`,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
keuanganRouter.get("/pemasukan", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select().from(pemasukan).where(eq(pemasukan.yayasanId, user.yayasanId)).orderBy(desc(pemasukan.tanggal)).all();
  return c.json(result);
});
keuanganRouter.post("/pemasukan", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { tanggal, jumlah, sumber, keterangan } = body;
  if (!tanggal || !jumlah || !sumber) {
    return c.json({ error: "Tanggal, jumlah, dan sumber wajib diisi" }, 400);
  }
  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  await db.insert(pemasukan).values({
    id,
    yayasanId: user.yayasanId,
    tanggal,
    jumlah: Number(jumlah),
    sumber,
    keterangan: keterangan || null,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
keuanganRouter.get("/pengeluaran", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select().from(pengeluaran).where(eq(pengeluaran.yayasanId, user.yayasanId)).orderBy(desc(pengeluaran.tanggal)).all();
  return c.json(result);
});
keuanganRouter.post("/pengeluaran", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { tanggal, jumlah, kategori, keterangan } = body;
  if (!tanggal || !jumlah || !kategori) {
    return c.json({ error: "Tanggal, jumlah, dan kategori wajib diisi" }, 400);
  }
  const db = getDb(c.env.DB);
  const id = crypto.randomUUID();
  const now = /* @__PURE__ */ new Date();
  await db.insert(pengeluaran).values({
    id,
    yayasanId: user.yayasanId,
    tanggal,
    jumlah: Number(jumlah),
    kategori,
    keterangan: keterangan || null,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, id });
});
keuanganRouter.get("/penggajian", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select({
    id: penggajian.id,
    bulan: penggajian.bulan,
    tahun: penggajian.tahun,
    gajiPokok: penggajian.gajiPokok,
    tunjangan: penggajian.tunjangan,
    potongan: penggajian.potongan,
    totalDiterima: penggajian.totalDiterima,
    tanggalDibayar: penggajian.tanggalDibayar,
    status: penggajian.status,
    ustadzNama: ustadz.namaLengkap
  }).from(penggajian).innerJoin(ustadz, eq(penggajian.ustadzId, ustadz.id)).where(eq(penggajian.yayasanId, user.yayasanId)).orderBy(desc(penggajian.tahun), desc(penggajian.bulan)).all();
  return c.json(result);
});
keuanganRouter.post("/penggajian/bayar", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { ustadzId, bulan, tahun, gajiPokok, tunjangan, potongan, tanggalDibayar, keterangan } = body;
  if (!ustadzId || !bulan || !tahun || gajiPokok === void 0 || !tanggalDibayar) {
    return c.json({ error: "Data pembayaran gaji tidak lengkap" }, 400);
  }
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  const payrollId = crypto.randomUUID();
  const pengeluaranId = crypto.randomUUID();
  const targetUstadz = await db.select().from(ustadz).where(and(eq(ustadz.id, ustadzId), eq(ustadz.yayasanId, user.yayasanId))).get();
  if (!targetUstadz) {
    return c.json({ error: "Ustadz tidak ditemukan" }, 404);
  }
  const existing = await db.select().from(penggajian).where(and(
    eq(penggajian.ustadzId, ustadzId),
    eq(penggajian.bulan, Number(bulan)),
    eq(penggajian.tahun, Number(tahun)),
    eq(penggajian.yayasanId, user.yayasanId)
  )).get();
  if (existing) {
    return c.json({ error: "Gaji ustadz ini sudah dibayarkan untuk bulan berjalan" }, 400);
  }
  const gajiPokokVal = targetUstadz.nominalBisyarah || 0;
  const tunjanganVal = tunjangan ? Number(tunjangan) : 0;
  const potonganVal = potongan ? Number(potongan) : 0;
  const totalDiterima = gajiPokokVal + tunjanganVal - potonganVal;
  try {
    await db.insert(pengeluaran).values({
      id: pengeluaranId,
      yayasanId: user.yayasanId,
      tanggal: tanggalDibayar,
      jumlah: totalDiterima,
      kategori: "GAJI",
      keterangan: keterangan || `Pembayaran Honor Ustadz ${targetUstadz.namaLengkap} - Bulan ${bulan} Tahun ${tahun}`,
      createdAt: now,
      updatedAt: now
    });
    await db.insert(penggajian).values({
      id: payrollId,
      yayasanId: user.yayasanId,
      ustadzId,
      bulan: Number(bulan),
      tahun: Number(tahun),
      gajiPokok: gajiPokokVal,
      tunjangan: tunjanganVal,
      potongan: potonganVal,
      totalDiterima,
      tanggalDibayar,
      status: "DIBAYAR",
      pengeluaranId,
      createdAt: now,
      updatedAt: now
    });
    return c.json({ success: true, payrollId });
  } catch (err) {
    return c.json({ error: "Gagal memproses transaksi gaji: " + err.message }, 500);
  }
});

// src/routes/settings.ts
var settingsRouter = new Hono2();
settingsRouter.use("*", authMiddleware);
settingsRouter.get("/", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select().from(yayasan).where(eq(yayasan.id, user.yayasanId)).get();
  if (!result) {
    return c.json({ error: "Data yayasan tidak ditemukan" }, 404);
  }
  return c.json(result);
});
settingsRouter.put("/", requireRole(["ketua"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { nama, alamat, nominalSyahriahDefault } = body;
  const db = getDb(c.env.DB);
  const now = /* @__PURE__ */ new Date();
  await db.update(yayasan).set({
    nama: nama || void 0,
    alamat: alamat || void 0,
    nominalSyahriahDefault: nominalSyahriahDefault !== void 0 ? Number(nominalSyahriahDefault) : void 0,
    updatedAt: now
  }).where(eq(yayasan.id, user.yayasanId));
  return c.json({ success: true });
});
async function hashPassword2(password) {
  const salt = "al-munawwaroh-secure-salt-2026";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashPassword2, "hashPassword");
settingsRouter.get("/users", async (c) => {
  const user = c.get("user");
  const db = getDb(c.env.DB);
  const result = await db.select({
    id: users.id,
    nama: users.nama,
    username: users.username,
    role: users.role,
    createdAt: users.createdAt
  }).from(users).where(eq(users.yayasanId, user.yayasanId));
  return c.json(result);
});
settingsRouter.post("/users", requireRole(["ketua"]), async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const { nama, username, password, role } = body;
  if (!nama || !username || !password || !role) {
    return c.json({ error: "Semua kolom harus diisi" }, 400);
  }
  if (role !== "bendahara" && role !== "sekretariat" && role !== "ketua") {
    return c.json({ error: "Role tidak valid" }, 400);
  }
  const db = getDb(c.env.DB);
  const existingUser = await db.select().from(users).where(eq(users.username, username)).get();
  if (existingUser) {
    return c.json({ error: "Username sudah terdaftar" }, 400);
  }
  const userId = crypto.randomUUID();
  const passwordHash = await hashPassword2(password);
  const now = /* @__PURE__ */ new Date();
  await db.insert(users).values({
    id: userId,
    yayasanId: user.yayasanId,
    username,
    passwordHash,
    nama,
    role,
    createdAt: now,
    updatedAt: now
  });
  return c.json({ success: true, message: "Akun berhasil ditambahkan" });
});
settingsRouter.delete("/users/:id", requireRole(["ketua"]), async (c) => {
  const user = c.get("user");
  const targetId = c.req.param("id");
  if (targetId === user.id) {
    return c.json({ error: "Tidak dapat menghapus akun Anda sendiri" }, 400);
  }
  const db = getDb(c.env.DB);
  await db.delete(users).where(and(eq(users.id, targetId), eq(users.yayasanId, user.yayasanId)));
  return c.json({ success: true, message: "Akun berhasil dihapus" });
});

// src/routes/upload.ts
var uploadRouter = new Hono2();
uploadRouter.use("*", authMiddleware);
uploadRouter.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();
  const file = body.file;
  const targetFolder = body.folder || "dokumen";
  if (!file || !(file instanceof File)) {
    return c.json({ error: "Tidak ada file yang diunggah" }, 400);
  }
  const tenantName = user.yayasanNama ? user.yayasanNama.toLowerCase().replace(/[^a-z0-9]/g, "-") : user.yayasanId;
  const cloudinaryFolderPath = `al-munawwaroh/${tenantName}/${targetFolder}`;
  try {
    const fileBuffer = await file.arrayBuffer();
    const dotIndex = file.name.lastIndexOf(".");
    const fileNamePrefix = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
    const result = await uploadToCloudinary(c, fileBuffer, cloudinaryFolderPath, fileNamePrefix);
    if (!result) {
      return c.json({ error: "Gagal mengunggah ke Cloudinary. Silakan periksa kredensial server." }, 500);
    }
    return c.json({
      success: true,
      cloudinaryId: result.public_id,
      secureUrl: result.secure_url,
      bytes: result.bytes,
      width: result.width,
      height: result.height
    });
  } catch (error3) {
    return c.json({ error: "Gagal memproses unggahan file: " + error3.message }, 500);
  }
});

// src/index.ts
var app = new Hono2();
app.use("*", cors({
  origin: (origin) => {
    return origin;
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Set-Cookie"]
}));
app.get("/health", (c) => c.text("Al-Munawwaroh API is running on Cloudflare Workers!"));
app.route("/api/auth", authRouter);
app.route("/api/dashboard", dashboardRouter);
app.route("/api/jenjang", jenjangRouter);
app.route("/api/kk", kkRouter);
app.route("/api/santri", santriRouter);
app.route("/api/ustadz", ustadzRouter);
app.route("/api/keuangan", keuanganRouter);
app.route("/api/settings", settingsRouter);
app.route("/api/upload", uploadRouter);
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error: " + err.message }, 500);
});
var src_default = app;

// ../../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-JtmmPv/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-JtmmPv/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
