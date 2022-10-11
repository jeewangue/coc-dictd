"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);

// node_modules/coc-helper/lib/esm/index.js
var import_coc14 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/events.js
var import_coc7 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/VimModule.js
var import_coc5 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/notifier.js
var import_coc4 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/collection.js
var compactI = (arr) => arr.filter((it) => it !== void 0 && it !== null);

// node_modules/coc-helper/lib/esm/util/config.js
var import_coc2 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/text.js
var import_coc = require("coc.nvim");

// node_modules/coc-helper/lib/esm/util/env.js
var isWindows = process.platform === "win32";
var isMacintosh = process.platform === "darwin";
var isLinux = process.platform === "linux";
var isTest = process.env.NODE_ENV === "test";

// node_modules/coc-helper/lib/esm/util/text.js
async function displayWidth(content) {
  return await import_coc.workspace.nvim.call("strdisplaywidth", [content]);
}

// node_modules/coc-helper/lib/esm/util/log.js
var import_coc3 = require("coc.nvim");
var import_util = __toESM(require("util"));
var levelList = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "off"
];
var levelErrorNum = levelList.indexOf("error");
function formatDate(date) {
  return `${date.toLocaleString()} ${date.getMilliseconds().toString().padStart(3, "0")}`;
}
var HelperLogger = class {
  constructor(channelName2) {
    this.channelName = channelName2;
    this.timeMarkers = /* @__PURE__ */ new Map();
    this.levelStatus = "trace";
    this.levelNumber = levelList.indexOf(this.levelStatus);
    this.appendLine = (line) => {
      this.outputChannel.appendLine(line);
    };
    this.log = (levelName, data) => {
      var _a, _b;
      const levelNum = levelList[levelName];
      if (levelNum < this.levelNumber) {
        return;
      }
      const prefix = `[${formatDate(new Date())}] [${levelName}]: `;
      if (data instanceof Error) {
        this.appendLine(`${prefix}${(_a = data.stack) !== null && _a !== void 0 ? _a : data.toString()}`);
        void import_coc3.window.showErrorMessage(data.message);
        if (isTest) {
          console.error((_b = data.stack) !== null && _b !== void 0 ? _b : data.toString());
        }
        return;
      }
      this.appendLine(`${prefix}${data}`);
      if (levelNum > levelErrorNum) {
        void import_coc3.window.showErrorMessage(data);
        if (isTest) {
          console.error(data);
        }
      }
    };
    this.trace = (line) => {
      this.log("trace", line);
    };
    this.debug = (line) => {
      this.log("debug", line);
    };
    this.info = (line) => {
      this.log("info", line);
    };
    this.warn = (line) => {
      this.log("warn", line);
    };
    this.error = (data) => {
      if (!(data instanceof Error)) {
        data = new Error(data);
      }
      this.log("error", data);
    };
    this.fatal = (data) => {
      this.log("fatal", data);
    };
  }
  set level(level) {
    this.levelStatus = level;
    this.levelNumber = levelList[level];
  }
  get level() {
    return this.levelStatus;
  }
  dispose() {
    var _a;
    (_a = this.outputChannel_) === null || _a === void 0 ? void 0 : _a.dispose();
  }
  get outputChannel() {
    if (!this.outputChannel_) {
      this.outputChannel_ = import_coc3.window.createOutputChannel(this.channelName);
    }
    return this.outputChannel_;
  }
  time(label = "default") {
    this.timeMarkers.set(label, new Date().valueOf());
  }
  timeElapsed(label = "default") {
    const time = this.timeMarkers.get(label);
    if (time !== void 0) {
      return new Date().valueOf() - time;
    }
  }
  timeLog(label = "default") {
    const time = this.timeElapsed(label);
    if (time !== void 0) {
      this.appendLine(`${label}: ${time} ms`);
    }
  }
  measureTime(task) {
    const time = new Date().valueOf();
    const result = task();
    if (!("then" in result)) {
      return [result, new Date().valueOf() - time];
    }
    return result.then((r) => {
      return [r, new Date().valueOf() - time];
    });
  }
  measureTask(task, label = "default", level = "info") {
    const response = this.measureTime(task);
    if (!("then" in response)) {
      const [result, time] = response;
      this.log(level, `[measureTask] ${label}: ${time} ms`);
      return result;
    }
    return response.then(([result, time]) => {
      this.log(level, `${label}: ${time} ms`);
      return result;
    });
  }
  asyncCatch(fn) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (e) {
        this.error(e);
      }
    };
  }
  prettyPrint(...data) {
    this.info(prettyObject(...data));
    void import_coc3.window.showErrorMessage(`[${formatDate(new Date())}] ${prettyObject(...data)}`);
  }
};
var helperLogger = new HelperLogger("coc-helper");
function prettyObject(...data) {
  return data.map((d) => import_util.default.inspect(d)).join(" ");
}

// node_modules/coc-helper/lib/esm/_package.json
var package_default = {
  name: "coc-helper",
  version: "0.15.2",
  description: "Helpers for coc.nvim",
  module: "lib/esm/index.js",
  main: "lib/cjs/index.js",
  homepage: "https://github.com/weirongxu/coc-helper",
  repository: "git@github.com:weirongxu/coc-helper.git",
  author: "Weirong Xu <weirongxu.raidou@gmail.com>",
  license: "MIT",
  files: [
    "lib",
    "tests",
    "jest.config.js",
    "JestHelper.js",
    "JestHelper.d.ts"
  ],
  scripts: {
    clean: "rimraf lib",
    "copy:pkg": "cpy --rename=_package.json package.json src/",
    "build:esm": "tsc -p ./tsconfig.prod.json --module es2020 --outDir lib/esm",
    "build:cjs": "tsc -p ./tsconfig.prod.json --module commonjs --outDir lib/cjs",
    build: "npm-run-all clean copy:pkg build:esm build:cjs",
    lint: "eslint src --ext ts",
    "setup:test-env": "node ./tests/setup.js",
    prepare: "run-s clean setup:test-env build",
    unittest: "jest --runInBand --detectOpenHandles --forceExit",
    test: "npm-run-all copy:pkg lint unittest"
  },
  engines: {
    coc: "^0.0.77"
  },
  activationEvents: [
    "*"
  ],
  prettier: {
    singleQuote: true,
    printWidth: 80,
    semi: true,
    trailingComma: "all"
  },
  peerDependencies: {
    "coc.nvim": "*"
  },
  devDependencies: {
    "@chemzqm/neovim": "^5.7.10",
    "@raidou/eslint-config-base": "^1.5.0",
    "@types/eslint": "^8.4.6",
    "@types/jest": "^29.0.2",
    "@types/node": "^18.7.18",
    "@types/rimraf": "^3.0.2",
    "@types/uuid": "^8.3.4",
    "coc.nvim": "0.0.82",
    "cpy-cli": "^4.2.0",
    eslint: "^8.23.1",
    jest: "^29.0.3",
    log4js: "^6.6.1",
    "npm-run-all": "^4.1.5",
    prettier: "^2.7.1",
    "ts-jest": "^29.0.1",
    "type-fest": "^2.19.0",
    typescript: "^4.8.3"
  },
  dependencies: {
    rimraf: "^3.0.2",
    uuid: "^9.0.0"
  }
};

// node_modules/coc-helper/lib/esm/util/version.js
var version = package_default.version;
var versionName = version.replace(/[.-]/g, "_");

// node_modules/coc-helper/lib/esm/notifier.js
var Notifier = class {
  constructor(notify) {
    this.notifyFns = [];
    this.notifyFns.push(notify);
  }
  static async run(notifier) {
    if (!notifier) {
      return;
    }
    if ("then" in notifier) {
      const awaitedNotifier = await notifier;
      if (awaitedNotifier) {
        return awaitedNotifier.run();
      }
    } else {
      return notifier.run();
    }
  }
  static notifyAll(lazyNotifies) {
    for (const n of lazyNotifies) {
      if (n) {
        n.notify();
      }
    }
  }
  static async runAll(notifierPromises) {
    const notifiers = await Promise.all(notifierPromises);
    import_coc4.workspace.nvim.pauseNotification();
    this.notifyAll(notifiers);
    return import_coc4.workspace.nvim.resumeNotification();
  }
  static combine(notifiers) {
    const compactedNotifiers = compactI(notifiers);
    if (compactedNotifiers.length < 1) {
      return Notifier.noop();
    }
    if (compactedNotifiers.length === 1) {
      return compactedNotifiers[0];
    }
    return compactedNotifiers.reduce((ret, cur) => ret.concat(cur), Notifier.noop());
  }
  static noop() {
    return this.create(() => {
    });
  }
  static create(notify) {
    return new Notifier(notify);
  }
  async run() {
    return Notifier.runAll([this]);
  }
  notify() {
    for (const fn of this.notifyFns) {
      fn();
    }
  }
  concat(notifier) {
    this.notifyFns.push(...notifier.notifyFns);
    return this;
  }
};

// node_modules/coc-helper/lib/esm/util/module.js
var globalModuleIdKey = "__coc_helper_module_max_id";
function getModuleId(key) {
  const globalKey2 = `${globalModuleIdKey}_${key}`;
  if (!(globalKey2 in global)) {
    global[globalKey2] = 0;
  }
  global[globalKey2] += 1;
  return global[globalKey2];
}

// node_modules/coc-helper/lib/esm/VimModule.js
var mid = getModuleId("VimModule");
var globalKey = `coc_helper_module_m${mid}_v${versionName}`;
var globalVariable = `g:${globalKey}`;
var callFunc = `CocHelperCallFn_m${mid}_v${versionName}`;
var declareVar = `CocHelperCallVar_m${mid}_v${versionName}`;
function filterLineCont(content) {
  return content.replace(/\n\s*\\/g, "");
}
var VimModule = class {
  constructor(moduleKey) {
    this.moduleKey = moduleKey;
  }
  static async init(context) {
    this.inited = true;
    await import_coc5.workspace.nvim.call("execute", `
        if !exists('${globalVariable}')
          let ${globalVariable} = {}
        endif

        function! ${callFunc}(module_key, method_name, args)
          try
            return call(${globalVariable}[a:module_key][a:method_name], a:args)
          catch
            let ex = v:exception
            let msg = printf('error when call %s.%s.%s, args: [%s]', '${globalVariable}', a:module_key, a:method_name, join(a:args, ','))
            echom msg
            echom ex
            throw msg . ' ' . ex
          endtry
        endfunction

        function! ${declareVar}(module_key, var_name, expression)
          try
            let ${globalVariable}[a:module_key][a:var_name] = eval(a:expression)
          catch
            let ex = v:exception
            let msg = printf('error when declare %s.%s.%s, expression: %s', '${globalVariable}', a:module_key, a:var_name, a:expression)
            echom msg
            echom ex
            throw msg . ' ' . ex
          endtry
        endfunction
      `);
    const queue = [...this.initQueue];
    while (queue.length) {
      const it = queue.shift();
      try {
        await it.fn(context);
      } catch (error) {
        helperLogger.error(error);
      }
      if (this.initAfterQueue.length) {
        queue.push(...this.initAfterQueue);
        this.initAfterQueue = [];
      }
    }
  }
  static registerInit(description, fn) {
    if (!this.inited) {
      this.initQueue.push({ description, fn });
    } else {
      this.initAfterQueue.push({ description, fn });
    }
  }
  static create(moduleName, cb) {
    const id = getModuleId("VimModule.module");
    const moduleKey = `${id}_${moduleName}`;
    const vMod = new VimModule(moduleKey);
    let mod = void 0;
    function initedMod() {
      if (!mod) {
        mod = cb(vMod);
      }
      return mod;
    }
    VimModule.registerInit(`module ${moduleKey}`, async () => {
      await import_coc5.workspace.nvim.call("execute", `
          if !exists('${globalVariable}.${moduleKey}')
            let ${globalVariable}.${moduleKey} = {}
          endif
        `);
      initedMod();
    });
    return new Proxy({}, {
      get(_o, key) {
        return Reflect.get(initedMod(), key);
      },
      has(_o, key) {
        return key in initedMod();
      },
      ownKeys() {
        return Object.keys(initedMod());
      }
    });
  }
  registerInit(description, fn) {
    if (typeof description === "string") {
      return VimModule.registerInit(description, fn);
    } else {
      return this.registerInit("", description);
    }
  }
  fn(fnName, getContent) {
    const { nvim } = import_coc5.workspace;
    const name = `${globalVariable}.${this.moduleKey}.${fnName}`;
    const content = getContent({ name });
    this.registerInit(`fn ${name}`, async () => {
      helperLogger.debug(`declare fn ${name}`);
      await nvim.call("execute", [filterLineCont(content)]);
    });
    return {
      name,
      inlineCall: (argsExpression = "") => `${callFunc}('${this.moduleKey}', '${fnName}', [${argsExpression}])`,
      call: (...args) => {
        helperLogger.debug(`call ${name}`);
        return nvim.call(callFunc, [
          this.moduleKey,
          fnName,
          args
        ]);
      },
      callNotify: (...args) => {
        helperLogger.debug(`callNotify ${name}`);
        return nvim.call(callFunc, [this.moduleKey, fnName, args], true);
      },
      callNotifier: (...args) => {
        helperLogger.debug(`callNotifier ${name}`);
        return Notifier.create(() => {
          nvim.call(callFunc, [this.moduleKey, fnName, args], true);
        });
      }
    };
  }
  var(varName, expression) {
    const { nvim } = import_coc5.workspace;
    const name = `${globalVariable}.${this.moduleKey}.${varName}`;
    this.registerInit(`var ${name}`, async () => {
      helperLogger.debug(`declare var ${name}`);
      await nvim.call(declareVar, [
        this.moduleKey,
        varName,
        filterLineCont(expression)
      ]);
    });
    return {
      name,
      inline: name,
      get: () => {
        return nvim.eval(name);
      },
      set: async (expression2) => {
        await nvim.call(declareVar, [
          this.moduleKey,
          varName,
          filterLineCont(expression2)
        ]);
      },
      setNotify: (expression2) => {
        nvim.call(declareVar, [this.moduleKey, varName, filterLineCont(expression2)], true);
      },
      setNotifier: (expression2) => {
        return Notifier.create(() => {
          nvim.call(declareVar, [this.moduleKey, varName, filterLineCont(expression2)], true);
        });
      }
    };
  }
};
VimModule.inited = false;
VimModule.initQueue = [];
VimModule.initAfterQueue = [];

// node_modules/coc-helper/lib/esm/modules/util.js
var import_coc6 = require("coc.nvim");
var utilModule = VimModule.create("util", (m) => {
  const isNvim = import_coc6.workspace.isNvim;
  return {
    globalCursorPosition: m.fn("global_cursor_position", ({ name }) => `
        function! ${name}()
          let nr = winnr()
          let [row, col] = win_screenpos(nr)
          return [row + winline() - 2, col + wincol() - 2]
        endfunction
      `),
    isFloat: m.fn("is_float", ({ name }) => isNvim ? `
          function! ${name}(winnr) abort
            if !exists('*nvim_win_get_config')
              return v:false
            endif
            let winid = win_getid(a:winnr)
            return nvim_win_get_config(winid)['relative'] != ''
          endfunction
        ` : `
          function! ${name}(winnr) abort
            return v:false
          endfunction
        `),
    closeWinByBufnr: m.fn("close_win_by_bufnr", ({ name }) => `
        if exists('*nvim_win_close')
          function! ${name}(bufnrs) abort
            for bufnr in a:bufnrs
              try
                let winid = bufwinid(bufnr)
                if winid >= 0
                  call nvim_win_close(winid, v:true)
                endif
              catch
              endtry
            endfor
          endfunction
        else
          function! ${name}(bufnrs) abort
            for bufnr in a:bufnrs
              try
                let winnr = bufwinnr(bufnr)
                if winnr >= 0
                  execute winnr . 'wincmd c'
                endif
              catch
              endtry
            endfor
          endfunction
        endif
      `),
    runCocCmd: m.fn("run_coc_cmd", ({ name }) => `
      function! ${name}(name, ...) abort
        return call('CocAction', extend(['runCommand', a:name], a:000))
      endfunction
    `),
    runCocCmdAsync: m.fn("run_coc_cmd_async", ({ name }) => `
      function! ${name}(name, ...) abort
        return call('CocActionAsync', extend(['runCommand', a:name], a:000))
      endfunction
    `)
  };
});

// node_modules/coc-helper/lib/esm/events.js
var mid2 = getModuleId("events");
var uname = `m${mid2}_v${versionName}`;
var HelperEventEmitter = class {
  constructor(helperLogger2, concurrent = false) {
    this.helperLogger = helperLogger2;
    this.concurrent = concurrent;
    this.listenersMap = /* @__PURE__ */ new Map();
  }
  listeners(event) {
    if (!this.listenersMap.has(event)) {
      const listeners = [];
      this.listenersMap.set(event, listeners);
      return listeners;
    }
    return this.listenersMap.get(event);
  }
  once(event, listener, disposables) {
    this.listeners(event).push(async (...args) => {
      const result = await listener(...args);
      disposable.dispose();
      return result;
    });
    const disposable = import_coc7.Disposable.create(() => this.off(event, listener));
    if (disposables) {
      disposables.push(disposable);
    }
    return disposable;
  }
  on(event, listener, disposables) {
    this.listeners(event).push(listener);
    const disposable = import_coc7.Disposable.create(() => this.off(event, listener));
    if (disposables) {
      disposables.push(disposable);
    }
    return disposable;
  }
  off(event, listener) {
    if (typeof listener.cancel === "function") {
      listener.cancel();
    }
    const listeners = this.listeners(event);
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
  async fire(event, ...args) {
    if (this.concurrent) {
      await Promise.all(this.listeners(event).map(async (listener) => {
        try {
          await listener(...args);
        } catch (e) {
          this.helperLogger.error(e);
        }
      }));
    } else {
      for (const listener of this.listeners(event)) {
        try {
          await listener(...args);
        } catch (e) {
          this.helperLogger.error(e);
        }
      }
    }
  }
};
var HelperVimEvents = class {
  constructor(vimEvents, helperLogger2, options = {}) {
    var _a;
    this.vimEvents = vimEvents;
    this.helperLogger = helperLogger2;
    this.options = options;
    this.id = getModuleId("events.id");
    this.augroupName = `CocHelperInternal_${uname}_${options.name ? `${options.name}_` : ""}${this.id}`;
    this.commandName = `coc-helper.internal.didVimEvent_${uname}_${options.name ? `${options.name}_` : ""}${this.id}`;
    this.events = new HelperEventEmitter(this.helperLogger, (_a = options.concurrent) !== null && _a !== void 0 ? _a : false);
  }
  async register(context) {
    await eventsModule.activate.call(this.augroupName, this.commandName, Object.entries(this.vimEvents).map(([key, e]) => Object.assign({ event: key }, e)));
    context.subscriptions.push(import_coc7.Disposable.create(() => {
      eventsModule.deactivate.call(this.augroupName).catch(this.helperLogger.error);
    }));
    context.subscriptions.push(import_coc7.commands.registerCommand(this.commandName, helperLogger.asyncCatch((event, ...args) => this.events.fire(event, ...args)), void 0, true));
  }
};
var helperVimEvents = new HelperVimEvents({
  BufDelete: {
    eventExpr: "BufDelete *",
    argExprs: ["+expand('<abuf>')"]
  },
  BufWipeout: {
    eventExpr: "BufWipeout *",
    argExprs: ["+expand('<abuf>')"]
  }
}, helperLogger, {
  name: "coc_helper"
});
var helperEvents = helperVimEvents.events;
var eventsModule = VimModule.create("events", (m) => {
  const activate2 = m.fn("activate", ({ name }) => `
      function! ${name}(augroup_name, autocmd_events) abort
        execute 'augroup ' . a:augroup_name
          autocmd!
          for autocmd_event in a:autocmd_events
            execute autocmd_event
          endfor
        augroup END
      endfunction
    `);
  function getActivateEvents(commandName, activateEvents) {
    return activateEvents.map((e) => {
      var _a;
      const args = `${[
        `'${commandName}'`,
        `'${e.event}'`,
        ...(_a = e.argExprs) !== null && _a !== void 0 ? _a : []
      ].join(", ")}`;
      return `autocmd ${e.eventExpr} call ${e.async === false ? utilModule.runCocCmd.inlineCall(args) : utilModule.runCocCmdAsync.inlineCall(args)}`;
    });
  }
  return {
    activate: {
      call: (augroupName, commandName, activateEvents) => activate2.call(augroupName, getActivateEvents(commandName, activateEvents)),
      callNotify: (augroupName, commandName, activateEvents) => activate2.callNotify(augroupName, getActivateEvents(commandName, activateEvents)),
      callNotifier: (augroupName, commandName, activateEvents) => activate2.callNotifier(augroupName, getActivateEvents(commandName, activateEvents))
    },
    deactivate: m.fn("deactivate", ({ name }) => `
        function! ${name}(augroup_name) abort
          execute 'augroup ' . a:augroup_name
            autocmd!
          augroup END
        endfunction
      `),
    doAutocmd: m.fn("do_autocmd", ({ name }) => `
        function! ${name}(name) abort
          if exists('#User#'.a:name)
            exe 'doautocmd <nomodeline> User '.a:name
          endif
        endfunction
      `)
  };
});

// node_modules/coc-helper/lib/esm/FloatingWindow.js
var import_coc11 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/modules/floating.js
var import_coc9 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/modules/buf.js
var import_coc8 = require("coc.nvim");
var bufModule = VimModule.create("buf", (m) => {
  const isNvim = import_coc8.workspace.isNvim;
  const createByName = m.fn("create_by_name", ({ name }) => `
      function! ${name}(name) abort
        return bufadd(a:name)
      endfunction
    `);
  return {
    createByName,
    create: m.fn("create", ({ name }) => isNvim ? `
          function! ${name}(...) abort
            let name = get(a:000, 0, '')
            if name is ''
              return nvim_create_buf(v:false, v:true)
            else
              return ${createByName.inlineCall("name")}
            endif
          endfunction
        ` : `
          function! ${name}(...) abort
            let name = get(a:000, 0, '')
            return ${createByName.inlineCall("name")}
          endfunction
        `)
  };
});

// node_modules/coc-helper/lib/esm/modules/floating.js
var floatingModule = VimModule.create("float", (m) => {
  const isNvim = import_coc9.workspace.isNvim;
  const initExecute = m.fn("init_execute", ({ name }) => `
      function! ${name}(ctx, inited_execute) abort
        execute a:inited_execute
      endfunction
    `);
  const openWin = m.fn("open_win", ({ name }) => isNvim ? `
        function! ${name}(bufnr, focus, win_config, win_hl, inited_execute) abort
          noau let winid = nvim_open_win(a:bufnr, a:focus, a:win_config)
          if !empty(a:win_hl)
            call nvim_win_set_option(winid, 'winhl', a:win_hl)
          endif
          if !empty(a:inited_execute)
            call ${initExecute.inlineCall("{'bufnr': a:bufnr, 'winid': winid}, a:inited_execute")}
          endif
          return winid
        endfunction
      ` : `
        function! ${name}(bufnr, focus, win_config, win_hl, inited_execute) abort
          let winid = popup_create(a:bufnr, a:win_config)
          call ${initExecute.inlineCall("{'bufnr': a:bufnr, 'winid': winid}, a:inited_execute")}

          return winid
        endfunction
      `);
  return {
    create: m.fn("create", ({ name }) => isNvim ? `
            function! ${name}(name, inited_execute, has_border_buf, border_inited_execute) abort
              let bufnr = ${bufModule.create.inlineCall("a:name")}
              call ${initExecute.inlineCall("{'bufnr': bufnr}, a:inited_execute")}

              let border_bufnr = v:null
              if a:has_border_buf
                let border_bufnr = nvim_create_buf(v:false, v:true)
                call ${initExecute.inlineCall("{'bufnr': border_bufnr}, a:border_inited_execute")}
              endif
              return [bufnr, border_bufnr]
            endfunction
          ` : `
            function! ${name}(name, inited_execute, has_border_buf, border_inited_execute) abort
              let bufnr = ${bufModule.create.inlineCall("a:name")}
              call ${initExecute.inlineCall("{'bufnr': bufnr}, a:inited_execute")}
              return [bufnr, v:null]
            endfunction
          `),
    open: m.fn("open", ({ name }) => `
        function! ${name}(bufnr, win_config, inited_execute, border_bufnr, border_win_config, border_inited_execute, focus, win_hl) abort
          let winid = ${openWin.inlineCall("a:bufnr, a:focus, a:win_config, a:win_hl, a:inited_execute")}
          call setbufvar(a:bufnr, 'coc_helper_winid', winid)

          if a:border_bufnr
            let border_winid = ${openWin.inlineCall("a:border_bufnr, v:false, a:border_win_config, a:win_hl, a:border_inited_execute")}
            call setbufvar(a:bufnr, 'coc_helper_border_winid', border_winid)
          endif
        endfunction
      `),
    resume: m.fn("resume", ({ name }) => `
        function! ${name}(bufnr, win_config, border_bufnr, border_win_config, focus, win_hl) abort
          let winid = ${openWin.inlineCall("a:bufnr, a:focus, a:win_config, a:win_hl, ''")}
          call setbufvar(a:bufnr, 'coc_helper_winid', winid)

          if a:border_bufnr
            let border_winid = ${openWin.inlineCall("border_bufnr, v:false, a:border_win_config, a:win_hl, ''")}
            call setbufvar(a:bufnr, 'coc_helper_border_winid', border_winid)
          endif
        endfunction
      `),
    update: m.fn("update", ({ name }) => isNvim ? `
          function! ${name}(bufnr, win_config, border_bufnr, border_win_config, win_hl) abort
            let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
            if !winid
              return
            endif
            call nvim_win_set_config(winid, a:win_config)
            if !empty(a:win_hl)
              call nvim_win_set_option(winid, 'winhl', a:win_hl)
            endif
            if has('nvim')
              redraw!
            endif

            if a:border_bufnr
              let border_winid = getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
              if border_winid
                call nvim_win_set_config(border_winid, a:border_win_config)
                if !empty(a:win_hl)
                  call nvim_win_set_option(border_winid, 'winhl', a:win_hl)
                endif
                if has('nvim')
                  redraw!
                endif
              endif
            endif
          endfunction
        ` : `
          function! ${name}(bufnr, win_config, border_bufnr, border_win_config, win_hl) abort
            let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
            if !winid
              return
            endif
            call popup_setoptions(winid, a:win_config)
          endfunction
        `),
    winid: m.fn("winid", ({ name }) => `
        function! ${name}(bufnr) abort
          let id = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
          let nr = win_id2win(id)
          return nr is 0 ? v:null : id
        endfunction
      `),
    borderWinid: m.fn("border_winid", ({ name }) => `
        function! ${name}(bufnr) abort
          return getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
        endfunction
      `),
    close: m.fn("close", ({ name }) => isNvim ? `
            function! ${name}(bufnr) abort
              let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
              let border_winid = getbufvar(a:bufnr, 'coc_helper_border_winid', v:null)
              try
                if winid
                  call nvim_win_close(winid, v:true)
                endif
                if border_winid
                  call nvim_win_close(border_winid, v:true)
                endif
              catch
              endtry
            endfunction
          ` : `
            function! ${name}(bufnr) abort
              let winid = getbufvar(a:bufnr, 'coc_helper_winid', v:null)
              try
                if winid
                  call popup_close(winid)
                endif
              catch
              endtry
            endfunction
          `)
  };
});

// node_modules/coc-helper/lib/esm/FloatingUtil.js
var import_coc10 = require("coc.nvim");
var defaultBorderChars = ["\u2500", "\u2502", "\u2500", "\u2502", "\u250C", "\u2510", "\u2518", "\u2514"];
var defaultWinHl = "CocHelperNormalFloat";
var defaultWinHlNC = "CocHelperNormalFloatNC";
var defaultBorderWinHl = "CocHelperNormalFloatBorder";
var FloatingUtil = class {
  constructor(srcId) {
    this.srcId = srcId;
  }
  async createContext(options) {
    var _a, _b;
    return (_a = options.context) !== null && _a !== void 0 ? _a : {
      lines: import_coc10.workspace.env.lines,
      columns: import_coc10.workspace.env.columns - import_coc10.workspace.env.cmdheight - 1,
      globalCursorPosition: await utilModule.globalCursorPosition.call(),
      title: options.title ? {
        text: options.title,
        width: await displayWidth(options.title)
      } : { text: "", width: 0 },
      borderEnabled: !!options.border,
      border: this.extendEdges((_b = options.border) === null || _b === void 0 ? void 0 : _b.map((b) => typeof b === "boolean" ? 1 : b)),
      paddingEnabled: !!options.padding,
      padding: this.extendEdges(options.padding)
    };
  }
  getCenterPos(ctx, box) {
    const [, , width, height] = box;
    const top = Math.floor((ctx.lines - height) / 2);
    const left = Math.floor((ctx.columns - width) / 2);
    return [top, left];
  }
  getPosForAround(ctx, size, cursorPosition, preferAbove = false) {
    const columns = ctx.columns;
    const lines = ctx.lines - 1;
    const [width, height] = size;
    let [top, left] = cursorPosition;
    if (preferAbove) {
      if (top - height < 0) {
        top += 1;
      } else {
        top -= height;
      }
    } else {
      if (top + height >= lines) {
        top -= height;
      } else {
        top += 1;
      }
    }
    if (left + width >= columns) {
      left -= width - 1;
    }
    return [top, left];
  }
  extendEdges(edges) {
    var _a, _b, _c, _d;
    if (!edges) {
      return [0, 0, 0, 0];
    }
    const top = (_a = edges[0]) !== null && _a !== void 0 ? _a : 1;
    const right = (_b = edges[1]) !== null && _b !== void 0 ? _b : top;
    const bottom = (_c = edges[2]) !== null && _c !== void 0 ? _c : top;
    const left = (_d = edges[3]) !== null && _d !== void 0 ? _d : right;
    return [top, right, bottom, left];
  }
  changeBoxByEdgesList(box, edgesList) {
    let retBox = [...box];
    for (const edges of edgesList) {
      retBox = this.changeBoxByEdges(retBox, edges);
    }
    return retBox;
  }
  changeBoxByEdges(box, edges) {
    if (!edges) {
      return box;
    }
    const [wTop, wRight, wBottom, wLeft] = edges;
    let [top, left, width, height] = box;
    top -= wTop;
    left -= wLeft;
    width += wLeft + wRight;
    height += wTop + wBottom;
    return [top, left, width, height];
  }
  getBoxSizes(ctx, options, updateCursorPosition) {
    var _a, _b;
    const [top, left] = [(_a = options.top) !== null && _a !== void 0 ? _a : 0, (_b = options.left) !== null && _b !== void 0 ? _b : 0];
    const width = Math.max(options.width, ctx.title.width);
    const contentBox = [0, 0, width, options.height];
    const paddingBox = this.changeBoxByEdges(contentBox, ctx.padding);
    const borderBox = this.changeBoxByEdges(paddingBox, ctx.border);
    let fullPos;
    if (options.relative === "center") {
      fullPos = this.getCenterPos(ctx, borderBox);
    } else {
      const cursorPosition = !updateCursorPosition && this.storeCursorPosition ? this.storeCursorPosition : ctx.globalCursorPosition;
      if (options.relative === "cursor") {
        fullPos = cursorPosition;
      } else if (options.relative === "cursor-around") {
        fullPos = this.getPosForAround(ctx, [borderBox[2], borderBox[3]], cursorPosition);
      } else {
        fullPos = [top, left];
      }
      this.storeCursorPosition = cursorPosition;
    }
    [borderBox[0], borderBox[1]] = [fullPos[0], fullPos[1]];
    [paddingBox[0], paddingBox[1]] = [
      borderBox[0] + ctx.border[0],
      borderBox[1] + ctx.border[3]
    ];
    [contentBox[0], contentBox[1]] = [
      paddingBox[0] + ctx.padding[0],
      paddingBox[1] + ctx.padding[3]
    ];
    return {
      contentBox,
      paddingBox,
      borderBox
    };
  }
  vimWinConfig(ctx, options, updateCursorPosition) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [top, left, width, height] = [
      (_a = options.top) !== null && _a !== void 0 ? _a : 0,
      (_b = options.left) !== null && _b !== void 0 ? _b : 0,
      options.width,
      options.height
    ];
    const config = {
      line: 0,
      col: 0,
      zindex: ((_c = options.borderOnly) !== null && _c !== void 0 ? _c : false) ? 1 : 100,
      minwidth: width,
      minheight: height,
      maxwidth: width,
      maxheight: height
    };
    if (options.relative === "center") {
      config.pos = "center";
    } else {
      const cursorPosition = !updateCursorPosition && this.storeCursorPosition ? this.storeCursorPosition : ctx.globalCursorPosition;
      if (options.relative === "cursor") {
        [config.line, config.col] = cursorPosition;
      } else if (options.relative === "cursor-around") {
        const box = this.changeBoxByEdgesList([top, left, width, height], [ctx.padding, ctx.border]);
        [config.line, config.col] = this.getPosForAround(ctx, [box[2], box[3]], cursorPosition);
      } else {
        [config.line, config.col] = [top, left];
      }
      this.storeCursorPosition = cursorPosition;
      config.line += 1;
      config.col += 1;
    }
    const topOffset = (_d = options.topOffset) !== null && _d !== void 0 ? _d : 0;
    const leftOffset = (_e = options.leftOffset) !== null && _e !== void 0 ? _e : 0;
    config.line += topOffset;
    config.col += leftOffset;
    if (options.maxWidth) {
      config.maxwidth = options.maxWidth;
    }
    if (options.maxHeight) {
      config.maxheight = options.maxHeight;
    }
    config.highlight = (_f = options.winHl) !== null && _f !== void 0 ? _f : defaultWinHl;
    if (options.padding) {
      config.padding = options.padding;
    }
    if (ctx.borderEnabled) {
      config.border = ctx.border;
      if (config.border[0]) {
        if (ctx.title.width) {
          config.title = ctx.title.text;
        }
        config.close = "button";
      }
      config.borderchars = (_g = options.borderChars) !== null && _g !== void 0 ? _g : defaultBorderChars;
      config.borderhighlight = [(_h = options.borderWinHl) !== null && _h !== void 0 ? _h : defaultBorderWinHl];
    }
    return config;
  }
  nvimWinConfig(ctx, options, updateCursorPosition) {
    var _a, _b, _c;
    const { contentBox, borderBox } = this.getBoxSizes(ctx, options, updateCursorPosition);
    const topOffset = (_a = options.topOffset) !== null && _a !== void 0 ? _a : 0;
    const leftOffset = (_b = options.leftOffset) !== null && _b !== void 0 ? _b : 0;
    const winConfig = {
      relative: "editor",
      row: contentBox[0] + topOffset,
      col: contentBox[1] + leftOffset,
      width: contentBox[2],
      height: contentBox[3],
      focusable: (_c = options.focusable) !== null && _c !== void 0 ? _c : true
    };
    let winConfigBorder;
    if (borderBox) {
      winConfigBorder = {
        relative: "editor",
        row: borderBox[0] + topOffset,
        col: borderBox[1] + leftOffset,
        width: borderBox[2],
        height: borderBox[3],
        focusable: false
      };
    }
    return [winConfig, winConfigBorder];
  }
  winConfig(ctx, options, updateCursorPosition = true) {
    return import_coc10.workspace.isVim ? [this.vimWinConfig(ctx, options, updateCursorPosition), void 0] : this.nvimWinConfig(ctx, options, updateCursorPosition);
  }
  getRenderBorderData(ctx, options, winOptions) {
    var _a, _b, _c, _d, _e, _f;
    const title = (_b = (_a = ctx.title) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "";
    const titleWidth = (_d = (_c = ctx.title) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0;
    if (!ctx.borderEnabled) {
      return;
    }
    const [bTop, bRight, bBottom, bLeft] = ctx.border;
    let [cTop, cRight, cBottom, cLeft, cTopleft, cTopright, cBotright, cBotleft] = (_e = options.borderChars) !== null && _e !== void 0 ? _e : defaultBorderChars;
    if (!bTop) {
      cTop = "";
    }
    if (!bRight) {
      cRight = "";
    }
    if (!bBottom) {
      cBottom = "";
    }
    if (!bLeft) {
      cLeft = "";
    }
    if (!bTop || !bLeft) {
      cTopleft = "";
    }
    if (!bTop || !bRight) {
      cTopright = "";
    }
    if (!bBottom || !bLeft) {
      cBotleft = "";
    }
    if (!bBottom || !bRight) {
      cBotright = "";
    }
    const width = winOptions[0];
    const height = winOptions[1];
    const spaceWidth = width - bLeft - bRight;
    const spaceHeight = height - bTop - bBottom;
    const lines = [];
    if (bTop) {
      lines.push(cTopleft + title + cTop.repeat(spaceWidth - titleWidth) + cTopright);
    }
    lines.push(...Array.from({ length: spaceHeight }, () => cLeft + " ".repeat(spaceWidth) + cRight));
    if (bBottom) {
      lines.push(cBotleft + cBottom.repeat(spaceWidth) + cBotright);
    }
    const highlights = [];
    const borderWinHl = (_f = options.borderWinHl) !== null && _f !== void 0 ? _f : defaultBorderWinHl;
    if (borderWinHl) {
      highlights.push({
        hlGroup: borderWinHl,
        line: 0,
        colStart: 0,
        colEnd: width
      });
      for (let l = 0, len = spaceHeight; l < len; l++) {
        if (bLeft) {
          highlights.push({
            hlGroup: borderWinHl,
            line: l + 1,
            colStart: 0,
            colEnd: bLeft
          });
        }
        if (bRight) {
          highlights.push({
            hlGroup: borderWinHl,
            line: l + 1,
            colStart: bLeft + spaceWidth,
            colEnd: width
          });
        }
      }
      if (bBottom) {
        highlights.push({
          hlGroup: borderWinHl,
          line: height - 1,
          colStart: 0,
          colEnd: width
        });
      }
    }
    return {
      lines,
      highlights
    };
  }
  renderBorderNotifier(buf, ctx, options, winOptions) {
    const renderData = this.getRenderBorderData(ctx, options, "width" in winOptions ? [winOptions.width, winOptions.height] : [winOptions.minwidth, winOptions.minheight]);
    if (!renderData) {
      return Notifier.noop();
    }
    const { lines, highlights } = renderData;
    return Notifier.create(() => {
      buf.setOption("modifiable", true, true);
      buf.setOption("readonly", false, true);
      void buf.setLines(lines, { start: 0, end: -1 }, true);
      buf.setOption("modifiable", false, true);
      buf.setOption("readonly", true, true);
      this.addHighlightsNotify(buf, highlights);
    });
  }
  nvimWinHl(options) {
    var _a, _b;
    if (import_coc10.workspace.isVim) {
      return "";
    }
    const arr = [];
    arr.push(`Normal:${(_a = options.winHl) !== null && _a !== void 0 ? _a : defaultWinHl}`);
    arr.push(`NormalNC:${(_b = options.winHlNC) !== null && _b !== void 0 ? _b : defaultWinHlNC}`);
    return arr.join(",");
  }
  addHighlightsNotify(buf, highlights) {
    for (const hl of highlights) {
      if (!hl.hlGroup || hl.line === void 0 || hl.colStart === void 0 || hl.colEnd === void 0) {
        continue;
      }
      buf.highlightRanges(this.srcId, hl.hlGroup, [
        import_coc10.Range.create(hl.line, hl.colStart, hl.line, hl.colEnd)
      ]);
    }
  }
};

// node_modules/coc-helper/lib/esm/FloatingWindow.js
var FloatingWindow = class {
  constructor(bufnr, borderBufnr, createOptions, mode, util3) {
    this.bufnr = bufnr;
    this.borderBufnr = borderBufnr;
    this.createOptions = createOptions;
    this.mode = mode;
    this.util = util3;
    this.nvim = import_coc11.workspace.nvim;
    this.disposables = [];
    this.nvim = import_coc11.workspace.nvim;
    this.buffer = this.nvim.createBuffer(bufnr);
    if (borderBufnr) {
      this.borderBuffer = import_coc11.workspace.nvim.createBuffer(borderBufnr);
      this.disposables.push(import_coc11.events.on("BufWinLeave", helperLogger.asyncCatch(async (curBufnr) => {
        if (this.borderBufnr && curBufnr === this.bufnr) {
          await utilModule.closeWinByBufnr.call([this.borderBufnr]);
        }
      })));
    }
  }
  static getInitedExecute(mode, options) {
    var _a, _b, _c, _d;
    let initedExecute = (_b = (_a = options.initedExecute) === null || _a === void 0 ? void 0 : _a.call(options, FloatingWindow.initedContextVars.create)) !== null && _b !== void 0 ? _b : "";
    initedExecute = `${FloatingWindow.modePresets[mode].createInitedExecute(FloatingWindow.initedContextVars.create)}
${initedExecute}`;
    const borderInitedExecute = (_d = (_c = options.borderInitedExecute) === null || _c === void 0 ? void 0 : _c.call(options, FloatingWindow.initedContextVars.create)) !== null && _d !== void 0 ? _d : FloatingWindow.modePresets.show.createInitedExecute(FloatingWindow.initedContextVars.create);
    return [initedExecute, borderInitedExecute];
  }
  static async create(options = {}) {
    var _a, _b, _c;
    const mode = (_a = options.mode) !== null && _a !== void 0 ? _a : "default";
    const [initedExecute, borderInitedExecute] = this.getInitedExecute(mode, options);
    const [bufnr, borderBufnr] = await floatingModule.create.call((_b = options.name) !== null && _b !== void 0 ? _b : "", initedExecute, (_c = options.hasBorderBuf) !== null && _c !== void 0 ? _c : true, borderInitedExecute);
    const floatingUtil = new FloatingUtil(this.srcId);
    return new FloatingWindow(bufnr, borderBufnr !== null && borderBufnr !== void 0 ? borderBufnr : void 0, options, mode, floatingUtil);
  }
  getInitedExecute(options) {
    var _a, _b, _c, _d;
    let initedExecute = (_b = (_a = options.initedExecute) === null || _a === void 0 ? void 0 : _a.call(options, FloatingWindow.initedContextVars.open)) !== null && _b !== void 0 ? _b : "";
    initedExecute = `${FloatingWindow.modePresets[this.mode].openInitedExecute(FloatingWindow.initedContextVars.open)}
${initedExecute}`;
    const borderInitedExecute = (_d = (_c = options.borderInitedExecute) === null || _c === void 0 ? void 0 : _c.call(options, FloatingWindow.initedContextVars.open)) !== null && _d !== void 0 ? _d : FloatingWindow.modePresets.show.openInitedExecute(FloatingWindow.initedContextVars.open);
    return [initedExecute, borderInitedExecute];
  }
  getFocus(options) {
    var _a, _b;
    return (_b = (_a = options.focus) !== null && _a !== void 0 ? _a : this.mode ? FloatingWindow.modePresets[this.mode].focus : void 0) !== null && _b !== void 0 ? _b : false;
  }
  getModifiable(options) {
    var _a, _b;
    return (_b = (_a = options.modifiable) !== null && _a !== void 0 ? _a : this.mode ? FloatingWindow.modePresets[this.mode].modifiable : void 0) !== null && _b !== void 0 ? _b : false;
  }
  setLinesNotifier(options) {
    return Notifier.create(() => {
      if (!options.lines && !options.modifiable) {
        return;
      }
      const modifiable = this.getModifiable(options);
      this.buffer.setOption("modifiable", true, true);
      this.buffer.setOption("readonly", false, true);
      if (options.lines) {
        void this.buffer.setLines(options.lines, { start: 0, end: -1 }, true);
      }
      if (!modifiable) {
        this.buffer.setOption("modifiable", false, true);
        this.buffer.setOption("readonly", true, true);
      }
      if (options.highlights) {
        for (const hl of options.highlights) {
          this.util.addHighlightsNotify(this.buffer, [hl]);
        }
      }
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    });
  }
  async setLines(options) {
    await this.setLinesNotifier(options).run();
  }
  async opened() {
    const win = await this.win();
    return !!win;
  }
  async openNotifier(options) {
    var _a;
    if (options.width <= 0 || options.height <= 0) {
      return Notifier.noop();
    }
    const notifiers = [];
    notifiers.push(this.closeNotifier());
    const ctx = await this.util.createContext(options);
    const [initedExecute, borderInitedExecute] = this.getInitedExecute(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options);
    if (options.borderOnly && borderWinConfig) {
      notifiers.push(floatingModule.open.callNotifier(this.bufnr, borderWinConfig, borderInitedExecute, null, null, "", false, this.util.nvimWinHl(options)));
      notifiers.push(this.util.renderBorderNotifier(this.buffer, ctx, options, borderWinConfig));
    } else {
      notifiers.push(floatingModule.open.callNotifier(this.bufnr, winConfig, initedExecute, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, borderInitedExecute, this.getFocus(options), this.util.nvimWinHl(options)));
    }
    if (import_coc11.workspace.isNvim && this.borderBuffer && borderWinConfig) {
      notifiers.push(this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig));
    }
    notifiers.push(this.setLinesNotifier(options), Notifier.create(() => {
      if (options.filetype) {
        this.buffer.setOption("filetype", options.filetype, true);
      }
    }));
    return Notifier.combine(notifiers);
  }
  async open(options) {
    await (await this.openNotifier(options)).run();
  }
  async resumeNotifier(options) {
    const ctx = await this.util.createContext(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options);
    return Notifier.create(() => {
      var _a;
      floatingModule.resume.callNotify(this.bufnr, winConfig, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, this.getFocus(options), this.util.nvimWinHl(options));
      if (this.borderBuffer && borderWinConfig) {
        this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig).notify();
      }
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    });
  }
  async resume(options) {
    await (await this.resumeNotifier(options)).run();
  }
  async resizeNotifier(options) {
    var _a;
    const ctx = await this.util.createContext(options);
    const [winConfig, borderWinConfig] = this.util.winConfig(ctx, options, false);
    const notifiers = [];
    if (options.borderOnly && borderWinConfig) {
      notifiers.push(floatingModule.update.callNotifier(this.bufnr, borderWinConfig, null, null, this.util.nvimWinHl(options)));
      notifiers.push(this.util.renderBorderNotifier(this.buffer, ctx, options, borderWinConfig));
    } else {
      notifiers.push(floatingModule.update.callNotifier(this.bufnr, winConfig, (_a = this.borderBufnr) !== null && _a !== void 0 ? _a : null, borderWinConfig !== null && borderWinConfig !== void 0 ? borderWinConfig : null, this.util.nvimWinHl(options)));
    }
    if (import_coc11.workspace.isNvim && this.borderBuffer && borderWinConfig) {
      notifiers.push(this.util.renderBorderNotifier(this.borderBuffer, ctx, options, borderWinConfig));
    }
    notifiers.push(Notifier.create(() => {
      if (import_coc11.workspace.isVim) {
        this.nvim.command("redraw!", true);
      }
    }));
    return Notifier.combine(notifiers);
  }
  async resize(options) {
    await (await this.resizeNotifier(options)).run();
  }
  async win() {
    const winid = await floatingModule.winid.call(this.bufnr);
    return winid ? this.nvim.createWindow(winid) : void 0;
  }
  async borderWin() {
    const borderWinid = await floatingModule.winid.call(this.bufnr);
    return borderWinid ? this.nvim.createWindow(borderWinid) : void 0;
  }
  closeNotifier() {
    return floatingModule.close.callNotifier(this.bufnr);
  }
  async close() {
    await this.closeNotifier().run();
  }
  dispose() {
    (0, import_coc11.disposeAll)(this.disposables);
    this.disposables.forEach((s) => s.dispose());
  }
};
FloatingWindow.modePresets = {
  default: {
    modifiable: false,
    focus: false,
    createInitedExecute: () => "",
    openInitedExecute: () => ""
  },
  base: {
    createInitedExecute: (ctx) => `
        call setbufvar(${ctx.bufnr}, '&buftype', 'nofile')
        call setbufvar(${ctx.bufnr}, '&bufhidden', 'hide')
        call setbufvar(${ctx.bufnr}, '&buflisted', 0)

        call setbufvar(${ctx.bufnr}, '&wrap', 1)

        call setbufvar(${ctx.bufnr}, '&swapfile', 0)

        call setbufvar(${ctx.bufnr}, '&modeline', 0)
      `,
    openInitedExecute: (ctx) => `
        call setbufvar(${ctx.bufnr}, '&list', 0)

        call setbufvar(${ctx.bufnr}, '&listchars', '')
        if has('nvim')
          call setbufvar(${ctx.bufnr}, '&fillchars', 'eob: ')
        endif

        call setbufvar(${ctx.bufnr}, '&signcolumn', 'no')
        call setbufvar(${ctx.bufnr}, '&number', 0)
        call setbufvar(${ctx.bufnr}, '&relativenumber', 0)
        call setbufvar(${ctx.bufnr}, '&foldenable', 0)
        call setbufvar(${ctx.bufnr}, '&foldcolumn', 0)

        call setbufvar(${ctx.bufnr}, '&spell', 0)

        call setbufvar(${ctx.bufnr}, '&cursorcolumn', 0)
        call setbufvar(${ctx.bufnr}, '&cursorline', 0)
        call setbufvar(${ctx.bufnr}, '&colorcolumn', '')
      `
  },
  show: {
    modifiable: false,
    createInitedExecute: (ctx) => `
        ${FloatingWindow.modePresets.base.createInitedExecute(ctx)}
        " call setbufvar(${ctx.bufnr}, '&undofile', 0)
        " call setbufvar(${ctx.bufnr}, '&undolevels', -1)

        call setbufvar(${ctx.bufnr}, '&modifiable', 0)
        call setbufvar(${ctx.bufnr}, '&modified', 0)
        call setbufvar(${ctx.bufnr}, '&readonly', 1)
      `,
    openInitedExecute: (ctx) => `
        ${FloatingWindow.modePresets.base.openInitedExecute(ctx)}
      `
  }
};
FloatingWindow.initedContextVars = {
  create: { bufnr: "a:ctx.bufnr" },
  open: { bufnr: "a:ctx.bufnr", winid: "a:ctx.winid" }
};
FloatingWindow.srcId = "coc-helper-floatwin";

// node_modules/coc-helper/lib/esm/MultiFloatingWindow.js
var import_coc12 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/WinLayoutFinder.js
var import_coc13 = require("coc.nvim");

// node_modules/coc-helper/lib/esm/index.js
async function activateHelper(context, options = {}) {
  var _a, _b, _c;
  if ((_b = (_a = options.vimModule) !== null && _a !== void 0 ? _a : options.events) !== null && _b !== void 0 ? _b : true) {
    await VimModule.init(context);
  }
  if ((_c = options.events) !== null && _c !== void 0 ? _c : true) {
    await helperVimEvents.register(context);
  }
  try {
    await import_coc14.workspace.nvim.command("hi default link CocHelperNormalFloatNC CocHelperNormalFloat");
  } catch (error) {
    void import_coc14.window.showErrorMessage(error.toString());
  }
}

// src/index.ts
var import_coc15 = require("coc.nvim");

// node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
  try {
    value[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value) {
  return nativeObjectToString2.call(value);
}
var objectToString_default = objectToString;

// node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value) ? getRawTag_default(value) : objectToString_default(value);
}
var baseGetTag_default = baseGetTag;

// node_modules/lodash-es/isObjectLike.js
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_default = isObjectLike;

// node_modules/lodash-es/isSymbol.js
var symbolTag = "[object Symbol]";
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike_default(value) && baseGetTag_default(value) == symbolTag;
}
var isSymbol_default = isSymbol;

// node_modules/lodash-es/_arrayMap.js
function arrayMap(array, iteratee) {
  var index = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}
var arrayMap_default = arrayMap;

// node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// node_modules/lodash-es/_baseToString.js
var INFINITY = 1 / 0;
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray_default(value)) {
    return arrayMap_default(value, baseToString) + "";
  }
  if (isSymbol_default(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var baseToString_default = baseToString;

// node_modules/lodash-es/isObject.js
function isObject(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

// node_modules/lodash-es/identity.js
function identity(value) {
  return value;
}
var identity_default = identity;

// node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject_default(value)) {
    return false;
  }
  var tag = baseGetTag_default(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

// node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var toSource_default = toSource;

// node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value) {
  if (!isObject_default(value) || isMasked_default(value)) {
    return false;
  }
  var pattern = isFunction_default(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value));
}
var baseIsNative_default = baseIsNative;

// node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value = getValue_default(object, key);
  return baseIsNative_default(value) ? value : void 0;
}
var getNative_default = getNative;

// node_modules/lodash-es/_WeakMap.js
var WeakMap = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap;

// node_modules/lodash-es/noop.js
function noop() {
}
var noop_default = noop;

// node_modules/lodash-es/_baseFindIndex.js
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
var baseFindIndex_default = baseFindIndex;

// node_modules/lodash-es/_baseIsNaN.js
function baseIsNaN(value) {
  return value !== value;
}
var baseIsNaN_default = baseIsNaN;

// node_modules/lodash-es/_strictIndexOf.js
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1, length = array.length;
  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}
var strictIndexOf_default = strictIndexOf;

// node_modules/lodash-es/_baseIndexOf.js
function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf_default(array, value, fromIndex) : baseFindIndex_default(array, baseIsNaN_default, fromIndex);
}
var baseIndexOf_default = baseIndexOf;

// node_modules/lodash-es/_arrayIncludes.js
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf_default(array, value, 0) > -1;
}
var arrayIncludes_default = arrayIncludes;

// node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var isIndex_default = isIndex;

// node_modules/lodash-es/eq.js
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
var eq_default = eq;

// node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// node_modules/lodash-es/isArrayLike.js
function isArrayLike(value) {
  return value != null && isLength_default(value.length) && !isFunction_default(value);
}
var isArrayLike_default = isArrayLike;

// node_modules/lodash-es/_isPrototype.js
var objectProto4 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto4;
  return value === proto;
}
var isPrototype_default = isPrototype;

// node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default = baseTimes;

// node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike_default(value) && baseGetTag_default(value) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// node_modules/lodash-es/isArguments.js
var objectProto5 = Object.prototype;
var hasOwnProperty3 = objectProto5.hasOwnProperty;
var propertyIsEnumerable = objectProto5.propertyIsEnumerable;
var isArguments = baseIsArguments_default(function() {
  return arguments;
}()) ? baseIsArguments_default : function(value) {
  return isObjectLike_default(value) && hasOwnProperty3.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments_default = isArguments;

// node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike_default(value) && isLength_default(value.length) && !!typedArrayTags[baseGetTag_default(value)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var baseUnary_default = baseUnary;

// node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;

// node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// node_modules/lodash-es/_arrayLikeKeys.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_default(value), isArg = !isArr && isArguments_default(value), isBuff = !isArr && !isArg && isBuffer_default(value), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty4.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex_default(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// node_modules/lodash-es/_baseKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty5.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;

// node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default = keys;

// node_modules/lodash-es/_isKey.js
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray_default(value)) {
    return false;
  }
  var type = typeof value;
  if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol_default(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
var isKey_default = isKey;

// node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty6.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// node_modules/lodash-es/_hashHas.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty7.call(data, key);
}
var hashHas_default = hashHas;

// node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value === void 0 ? HASH_UNDEFINED2 : value;
  return this;
}
var hashSet_default = hashSet;

// node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_default(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default = listCacheGet;

// node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// node_modules/lodash-es/_isKeyable.js
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
var isKeyable_default = isKeyable;

// node_modules/lodash-es/_getMapData.js
function getMapData(map2, key) {
  var data = map2.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// node_modules/lodash-es/memoize.js
var FUNC_ERROR_TEXT = "Expected a function";
function memoize(func, resolver) {
  if (typeof func != "function" || resolver != null && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache_default)();
  return memoized;
}
memoize.Cache = MapCache_default;
var memoize_default = memoize;

// node_modules/lodash-es/_memoizeCapped.js
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(func) {
  var result = memoize_default(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });
  var cache = result.cache;
  return result;
}
var memoizeCapped_default = memoizeCapped;

// node_modules/lodash-es/_stringToPath.js
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = memoizeCapped_default(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46) {
    result.push("");
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
  });
  return result;
});
var stringToPath_default = stringToPath;

// node_modules/lodash-es/toString.js
function toString(value) {
  return value == null ? "" : baseToString_default(value);
}
var toString_default = toString;

// node_modules/lodash-es/_castPath.js
function castPath(value, object) {
  if (isArray_default(value)) {
    return value;
  }
  return isKey_default(value, object) ? [value] : stringToPath_default(toString_default(value));
}
var castPath_default = castPath;

// node_modules/lodash-es/_toKey.js
var INFINITY2 = 1 / 0;
function toKey(value) {
  if (typeof value == "string" || isSymbol_default(value)) {
    return value;
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY2 ? "-0" : result;
}
var toKey_default = toKey;

// node_modules/lodash-es/_baseGet.js
function baseGet(object, path) {
  path = castPath_default(path, object);
  var index = 0, length = path.length;
  while (object != null && index < length) {
    object = object[toKey_default(path[index++])];
  }
  return index && index == length ? object : void 0;
}
var baseGet_default = baseGet;

// node_modules/lodash-es/get.js
function get(object, path, defaultValue) {
  var result = object == null ? void 0 : baseGet_default(object, path);
  return result === void 0 ? defaultValue : result;
}
var get_default = get;

// node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values) {
  var index = -1, length = values.length, offset = array.length;
  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
var arrayPush_default = arrayPush;

// node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}
var arrayFilter_default = arrayFilter;

// node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default = stubArray;

// node_modules/lodash-es/_getSymbols.js
var objectProto10 = Object.prototype;
var propertyIsEnumerable2 = objectProto10.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default = baseGetAllKeys;

// node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default = getAllKeys;

// node_modules/lodash-es/_DataView.js
var DataView = getNative_default(root_default, "DataView");
var DataView_default = DataView;

// node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// node_modules/lodash-es/_Set.js
var Set2 = getNative_default(root_default, "Set");
var Set_default = Set2;

// node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value) {
    var result = baseGetTag_default(value), Ctor = result == objectTag2 ? value.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;

// node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED3);
  return this;
}
var setCacheAdd_default = setCacheAdd;

// node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value) {
  return this.__data__.has(value);
}
var setCacheHas_default = setCacheHas;

// node_modules/lodash-es/_SetCache.js
function SetCache(values) {
  var index = -1, length = values == null ? 0 : values.length;
  this.__data__ = new MapCache_default();
  while (++index < length) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var arraySome_default = arraySome;

// node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default = cacheHas;

// node_modules/lodash-es/_equalArrays.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var equalArrays_default = equalArrays;

// node_modules/lodash-es/_mapToArray.js
function mapToArray(map2) {
  var index = -1, result = Array(map2.size);
  map2.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}
var mapToArray_default = mapToArray;

// node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}
var setToArray_default = setToArray;

// node_modules/lodash-es/_equalByTag.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var errorTag2 = "[object Error]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag2 = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag3:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag2:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag2:
    case dateTag2:
    case numberTag2:
      return eq_default(+object, +other);
    case errorTag2:
      return object.name == other.name && object.message == other.message;
    case regexpTag2:
    case stringTag2:
      return object == other + "";
    case mapTag3:
      var convert = mapToArray_default;
    case setTag3:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag2:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}
var equalByTag_default = equalByTag;

// node_modules/lodash-es/_equalObjects.js
var COMPARE_PARTIAL_FLAG3 = 1;
var objectProto11 = Object.prototype;
var hasOwnProperty8 = objectProto11.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty8.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var equalObjects_default = equalObjects;

// node_modules/lodash-es/_baseIsEqualDeep.js
var COMPARE_PARTIAL_FLAG4 = 1;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var objectTag3 = "[object Object]";
var objectProto12 = Object.prototype;
var hasOwnProperty9 = objectProto12.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag2 : getTag_default(object), othTag = othIsArr ? arrayTag2 : getTag_default(other);
  objTag = objTag == argsTag3 ? objectTag3 : objTag;
  othTag = othTag == argsTag3 ? objectTag3 : othTag;
  var objIsObj = objTag == objectTag3, othIsObj = othTag == objectTag3, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty9.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty9.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var baseIsEqualDeep_default = baseIsEqualDeep;

// node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || !isObjectLike_default(value) && !isObjectLike_default(other)) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep_default(value, other, bitmask, customizer, baseIsEqual, stack);
}
var baseIsEqual_default = baseIsEqual;

// node_modules/lodash-es/_baseIsMatch.js
var COMPARE_PARTIAL_FLAG5 = 1;
var COMPARE_UNORDERED_FLAG3 = 2;
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length, length = index, noCustomizer = !customizer;
  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0], objValue = object[key], srcValue = data[1];
    if (noCustomizer && data[2]) {
      if (objValue === void 0 && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack_default();
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === void 0 ? baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG5 | COMPARE_UNORDERED_FLAG3, customizer, stack) : result)) {
        return false;
      }
    }
  }
  return true;
}
var baseIsMatch_default = baseIsMatch;

// node_modules/lodash-es/_isStrictComparable.js
function isStrictComparable(value) {
  return value === value && !isObject_default(value);
}
var isStrictComparable_default = isStrictComparable;

// node_modules/lodash-es/_getMatchData.js
function getMatchData(object) {
  var result = keys_default(object), length = result.length;
  while (length--) {
    var key = result[length], value = object[key];
    result[length] = [key, value, isStrictComparable_default(value)];
  }
  return result;
}
var getMatchData_default = getMatchData;

// node_modules/lodash-es/_matchesStrictComparable.js
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
  };
}
var matchesStrictComparable_default = matchesStrictComparable;

// node_modules/lodash-es/_baseMatches.js
function baseMatches(source) {
  var matchData = getMatchData_default(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable_default(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch_default(object, source, matchData);
  };
}
var baseMatches_default = baseMatches;

// node_modules/lodash-es/_baseHasIn.js
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
var baseHasIn_default = baseHasIn;

// node_modules/lodash-es/_hasPath.js
function hasPath(object, path, hasFunc) {
  path = castPath_default(path, object);
  var index = -1, length = path.length, result = false;
  while (++index < length) {
    var key = toKey_default(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength_default(length) && isIndex_default(key, length) && (isArray_default(object) || isArguments_default(object));
}
var hasPath_default = hasPath;

// node_modules/lodash-es/hasIn.js
function hasIn(object, path) {
  return object != null && hasPath_default(object, path, baseHasIn_default);
}
var hasIn_default = hasIn;

// node_modules/lodash-es/_baseMatchesProperty.js
var COMPARE_PARTIAL_FLAG6 = 1;
var COMPARE_UNORDERED_FLAG4 = 2;
function baseMatchesProperty(path, srcValue) {
  if (isKey_default(path) && isStrictComparable_default(srcValue)) {
    return matchesStrictComparable_default(toKey_default(path), srcValue);
  }
  return function(object) {
    var objValue = get_default(object, path);
    return objValue === void 0 && objValue === srcValue ? hasIn_default(object, path) : baseIsEqual_default(srcValue, objValue, COMPARE_PARTIAL_FLAG6 | COMPARE_UNORDERED_FLAG4);
  };
}
var baseMatchesProperty_default = baseMatchesProperty;

// node_modules/lodash-es/_baseProperty.js
function baseProperty(key) {
  return function(object) {
    return object == null ? void 0 : object[key];
  };
}
var baseProperty_default = baseProperty;

// node_modules/lodash-es/_basePropertyDeep.js
function basePropertyDeep(path) {
  return function(object) {
    return baseGet_default(object, path);
  };
}
var basePropertyDeep_default = basePropertyDeep;

// node_modules/lodash-es/property.js
function property(path) {
  return isKey_default(path) ? baseProperty_default(toKey_default(path)) : basePropertyDeep_default(path);
}
var property_default = property;

// node_modules/lodash-es/_baseIteratee.js
function baseIteratee(value) {
  if (typeof value == "function") {
    return value;
  }
  if (value == null) {
    return identity_default;
  }
  if (typeof value == "object") {
    return isArray_default(value) ? baseMatchesProperty_default(value[0], value[1]) : baseMatches_default(value);
  }
  return property_default(value);
}
var baseIteratee_default = baseIteratee;

// node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// node_modules/lodash-es/_baseForOwn.js
function baseForOwn(object, iteratee) {
  return object && baseFor_default(object, iteratee, keys_default);
}
var baseForOwn_default = baseForOwn;

// node_modules/lodash-es/_createBaseEach.js
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_default(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
    while (fromRight ? index-- : ++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}
var createBaseEach_default = createBaseEach;

// node_modules/lodash-es/_baseEach.js
var baseEach = createBaseEach_default(baseForOwn_default);
var baseEach_default = baseEach;

// node_modules/lodash-es/_arrayIncludesWith.js
function arrayIncludesWith(array, value, comparator) {
  var index = -1, length = array == null ? 0 : array.length;
  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}
var arrayIncludesWith_default = arrayIncludesWith;

// node_modules/lodash-es/_baseMap.js
function baseMap(collection, iteratee) {
  var index = -1, result = isArrayLike_default(collection) ? Array(collection.length) : [];
  baseEach_default(collection, function(value, key, collection2) {
    result[++index] = iteratee(value, key, collection2);
  });
  return result;
}
var baseMap_default = baseMap;

// node_modules/lodash-es/map.js
function map(collection, iteratee) {
  var func = isArray_default(collection) ? arrayMap_default : baseMap_default;
  return func(collection, baseIteratee_default(iteratee, 3));
}
var map_default = map;

// node_modules/lodash-es/_createSet.js
var INFINITY3 = 1 / 0;
var createSet = !(Set_default && 1 / setToArray_default(new Set_default([, -0]))[1] == INFINITY3) ? noop_default : function(values) {
  return new Set_default(values);
};
var createSet_default = createSet;

// node_modules/lodash-es/_baseUniq.js
var LARGE_ARRAY_SIZE2 = 200;
function baseUniq(array, iteratee, comparator) {
  var index = -1, includes = arrayIncludes_default, length = array.length, isCommon = true, result = [], seen = result;
  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith_default;
  } else if (length >= LARGE_ARRAY_SIZE2) {
    var set = iteratee ? null : createSet_default(array);
    if (set) {
      return setToArray_default(set);
    }
    isCommon = false;
    includes = cacheHas_default;
    seen = new SetCache_default();
  } else {
    seen = iteratee ? [] : result;
  }
  outer:
    while (++index < length) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      value = comparator || value !== 0 ? value : 0;
      if (isCommon && computed === computed) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      } else if (!includes(seen, computed, comparator)) {
        if (seen !== result) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
  return result;
}
var baseUniq_default = baseUniq;

// node_modules/lodash-es/uniq.js
function uniq(array) {
  return array && array.length ? baseUniq_default(array) : [];
}
var uniq_default = uniq;

// src/index.ts
var import_util11 = __toESM(require("util"));

// src/config.ts
var extConfig = {
  server: "dict.org",
  timeout: 5e3,
  databases: "*"
};
var setExtConfig = (c) => {
  extConfig.server = c.get("server", "dict.org");
  extConfig.timeout = c.get("timeout", 5e3);
  extConfig.databases = c.get("databases", "*");
};

// src/dict/parse.ts
var import_node_assert = __toESM(require("assert"));

// src/logger.ts
var channelName = "coc-dictd";
var logger = new HelperLogger(channelName);

// src/dict/parse.ts
var Definition = class {
  constructor(word = "", dbName = "", dbDesc = "", definition = "") {
    this.word = word;
    this.dbName = dbName;
    this.dbDesc = dbDesc;
    this.definition = definition;
  }
};
var Match = class {
  constructor(dbName = "", word = "") {
    this.word = word;
    this.dbName = dbName;
  }
};
var parseResponse = (line) => {
  var _a;
  const regex = /(?:\s*(?:"(?<v1>[^\"]*)"|(?<v2>[^ ]+))\s*)+?/g;
  const matches = line.matchAll(regex);
  const results = [];
  for (const match of matches) {
    if (match.groups) {
      results.push((_a = match.groups.v1) != null ? _a : match.groups.v2);
    }
  }
  return results;
};
var parse = (txt) => {
  const ctx = {
    mode: 0 /* Response */,
    code: 0,
    found: false,
    count: 0,
    def: null,
    defs: [],
    match: null,
    matches: []
  };
  const lines = txt.split(/\r?\n/);
  for (const line of lines) {
    if (ctx.mode === 0 /* Response */) {
      if (line.match(/^\d{3}/) === null) {
        continue;
      }
      ctx.code = parseInt(line.slice(0, 3));
      if (ctx.code === 150) {
        ctx.found = true;
        const res = parseResponse(line.slice(3));
        ctx.count = parseInt(res[0]);
        logger.debug(`${ctx.count} definitions retrieved`);
      } else if (ctx.code === 151) {
        const res = parseResponse(line.slice(3));
        ctx.def = new Definition(res[0], res[1], res[2]);
        ctx.mode = 1 /* TextFollows */;
      } else if (ctx.code === 152) {
        ctx.found = true;
        const res = parseResponse(line.slice(3));
        ctx.count = parseInt(res[0]);
        logger.debug(`${ctx.count} matches found`);
        ctx.mode = 1 /* TextFollows */;
      } else if (ctx.code === 552) {
        ctx.found = false;
      }
    } else if (ctx.mode === 1 /* TextFollows */) {
      if (ctx.code === 151) {
        (0, import_node_assert.default)(ctx.def instanceof Definition);
        if (line === ".") {
          ctx.defs.push(ctx.def);
          ctx.mode = 0 /* Response */;
          ctx.def = null;
        } else {
          ctx.def.definition += line + "\n";
        }
      } else if (ctx.code === 152) {
        if (line === ".") {
          ctx.mode = 0 /* Response */;
        } else {
          const res = parseResponse(line);
          ctx.matches.push(new Match(res[0], res[1]));
        }
      }
    }
  }
  return ctx;
};

// src/dict/commands.ts
var import_node_child_process = require("child_process");
var runCmdAsync = (cmd) => new Promise((resolve, reject) => {
  var _a, _b, _c, _d;
  let stdout = "";
  let stderr = "";
  if (cmd.stdout === null || cmd.stderr === null) {
    logger.warn("command's output stream is null");
  }
  (_a = cmd.stdout) == null ? void 0 : _a.setEncoding("utf8");
  (_b = cmd.stdout) == null ? void 0 : _b.on("data", (data) => {
    stdout += data;
  });
  (_c = cmd.stderr) == null ? void 0 : _c.setEncoding("utf8");
  (_d = cmd.stderr) == null ? void 0 : _d.on("data", (data) => {
    stderr += data;
  });
  cmd.on("close", (code) => {
    if (code !== 0) {
      reject(new Error(`child process exited with code ${code}`));
    } else {
      resolve({
        stdout,
        stderr
      });
    }
  });
  cmd.on("error", (err) => {
    stderr += "Failed to start subprocess.\n";
    stderr += err.message;
    reject(new Error(stderr));
  });
});
var getDefs = async (word) => {
  const cmd = (0, import_node_child_process.spawn)("curl", ["-s", `dict://${extConfig.server}/d:${word}:${extConfig.databases}`], {
    timeout: extConfig.timeout
  });
  const { stdout } = await runCmdAsync(cmd);
  return parse(stdout);
};
var getMatches = async (word, matchStrategy = "lev") => {
  const cmd = (0, import_node_child_process.spawn)("curl", ["-s", `dict://${extConfig.server}/m:${word}:${extConfig.databases}:${matchStrategy}`], {
    timeout: extConfig.timeout
  });
  const { stdout } = await runCmdAsync(cmd);
  return parse(stdout);
};

// src/index.ts
async function activate(context) {
  await activateHelper(context);
  logger.info("coc-dictd works!");
  {
    const c = import_coc15.workspace.getConfiguration("dictd");
    setExtConfig(c);
  }
  const ff = new import_coc15.FloatFactory(import_coc15.workspace.nvim);
  const floatConfig = {
    border: [1, 1, 1, 1]
  };
  context.subscriptions.push(
    ff,
    import_coc15.workspace.onDidChangeConfiguration((ev) => {
      logger.debug("config changed");
      if (ev.affectsConfiguration("dictd")) {
        logger.debug("config change affected coc-dictd");
        const c = import_coc15.workspace.getConfiguration("dictd", import_coc15.workspace.root);
        setExtConfig(c);
      }
    }),
    import_coc15.workspace.registerKeymap(
      ["n"],
      "dictd-search",
      async () => {
        logger.info("coc-dictd-search");
        let word = await import_coc15.workspace.nvim.eval('expand("<cword>")');
        {
          const res = await getDefs(word);
          logger.debug("definitions");
          logger.debug(import_util11.default.inspect(res));
          if (res.found) {
            const docs = [
              { filetype: "log", content: `${res.count} definition(s) found.` },
              ...res.defs.map(
                (def) => ({
                  filetype: "log",
                  content: `From "${def.dbName}":

${def.definition}`
                })
              )
            ];
            return ff.show(docs, floatConfig);
          }
        }
        {
          const res = await getMatches(word, "lev");
          logger.debug("matches");
          logger.debug(import_util11.default.inspect(res));
          if (res.found) {
            const wordsCandidate = uniq_default(map_default(res.matches, (v) => v.word.toLowerCase())).sort();
            const idx = await import_coc15.window.showMenuPicker(wordsCandidate, `${wordsCandidate.length} match(es) found.`);
            if (idx === -1) {
              return;
            }
            word = wordsCandidate[idx];
          } else {
            return ff.show([{ filetype: "markdown", content: `No matches found for \`${word}\`.` }], floatConfig);
          }
        }
        {
          const res = await getDefs(word);
          logger.debug("definitions");
          logger.debug(import_util11.default.inspect(res));
          if (res.found) {
            const docs = [
              { filetype: "log", content: `${res.count} definition(s) found.` },
              ...res.defs.map(
                (def) => ({
                  filetype: "log",
                  content: `From "${def.dbName}":

${def.definition}`
                })
              )
            ];
            return ff.show(docs, floatConfig);
          } else {
            return ff.show([{ filetype: "markdown", content: `No definition found for \`${word}\`.` }], floatConfig);
          }
        }
      },
      { sync: false }
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
