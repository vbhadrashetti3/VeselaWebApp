"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// src/errors.ts
var FishAgentError;
var init_errors = __esm({
  "src/errors.ts"() {
    "use strict";
    FishAgentError = class extends Error {
      constructor(code, message, options) {
        super(message, options?.cause !== void 0 ? { cause: options.cause } : void 0);
        this.name = "FishAgentError";
        this.code = code;
        this.statusCode = options?.statusCode;
      }
    };
  }
});

// src/transport/livekit.ts
var livekit_exports = {};
__export(livekit_exports, {
  LiveKitTransport: () => LiveKitTransport
});
function hasMessageType(value) {
  return typeof value === "object" && value !== null && typeof value.type === "string";
}
function captureMicrophone(inputDeviceId) {
  return (0, import_livekit_client.createLocalAudioTrack)({
    deviceId: inputDeviceId,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  });
}
var import_livekit_client, import_agent_protocol2, LiveKitTransport;
var init_livekit = __esm({
  "src/transport/livekit.ts"() {
    "use strict";
    import_livekit_client = require("livekit-client");
    import_agent_protocol2 = require("@fishaudio/agent-protocol");
    init_errors();
    LiveKitTransport = class {
      constructor() {
        /** Local tracks already wired to re-emit their stream when livekit restarts them. */
        this.restartWiredTracks = /* @__PURE__ */ new WeakSet();
      }
      prepareMicrophone(options) {
        const pending = captureMicrophone(options.inputDeviceId);
        pending.catch(() => void 0);
        this.pendingMicTrack = pending;
      }
      async connect(sessionToken, options) {
        this.callbacks = options.callbacks;
        const room = new import_livekit_client.Room({
          audioCaptureDefaults: {
            deviceId: options.inputDeviceId,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        this.room = room;
        room.on(import_livekit_client.RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
          if (topic !== import_agent_protocol2.AGENT_EVENT_TOPIC) {
            return;
          }
          let message;
          try {
            message = JSON.parse(new TextDecoder().decode(payload));
          } catch {
            return;
          }
          if (hasMessageType(message)) {
            this.callbacks?.onAgentEvent(message);
          }
        });
        const AGENT_STATE_ATTRIBUTE = "lk.agent.state";
        room.on(import_livekit_client.RoomEvent.ParticipantAttributesChanged, (changed, participant) => {
          const state = changed[AGENT_STATE_ATTRIBUTE];
          if (!participant.isLocal && state) {
            this.callbacks?.onAgentState(state);
          }
        });
        room.on(import_livekit_client.RoomEvent.TrackSubscribed, (track) => {
          if (track.kind === import_livekit_client.Track.Kind.Audio && track.mediaStreamTrack) {
            this.callbacks?.onOutputStream(new MediaStream([track.mediaStreamTrack]));
          }
        });
        room.registerTextStreamHandler("lk.transcription", async (reader, participantInfo) => {
          const attributes = reader.info.attributes ?? {};
          const segmentId = attributes["lk.segment_id"];
          if (!segmentId) {
            return;
          }
          const role = participantInfo.identity === room.localParticipant.identity ? "user" : "agent";
          const finalAttribute = attributes["lk.transcription_final"] === "true";
          let text = "";
          let aborted = false;
          try {
            for await (const delta of reader) {
              text += delta;
              this.callbacks?.onTranscription({ segmentId, role, text, final: false });
            }
          } catch {
            aborted = true;
          }
          if (text) {
            const final = role === "agent" ? true : finalAttribute && !aborted;
            this.callbacks?.onTranscription({ segmentId, role, text, final });
          }
        });
        room.on(import_livekit_client.RoomEvent.Reconnecting, () => {
          this.callbacks?.onConnectionState("reconnecting");
        });
        room.on(import_livekit_client.RoomEvent.Reconnected, () => {
          if (room.remoteParticipants.size === 0) {
            this.handleAgentLeft(room);
            return;
          }
          this.callbacks?.onConnectionState("connected");
        });
        room.on(import_livekit_client.RoomEvent.Disconnected, (reason) => {
          this.callbacks?.onConnectionState(
            "disconnected",
            reason === void 0 ? void 0 : import_livekit_client.DisconnectReason[reason]
          );
          if (this.room === room) {
            this.room = void 0;
            this.callbacks = void 0;
          }
        });
        room.on(import_livekit_client.RoomEvent.ParticipantDisconnected, () => {
          if (room.remoteParticipants.size === 0) {
            queueMicrotask(() => {
              if (room.state === import_livekit_client.ConnectionState.Connected && room.remoteParticipants.size === 0) {
                this.handleAgentLeft(room);
              }
            });
          }
        });
        let micTrack;
        if (options.microphone !== false) {
          const pending = this.pendingMicTrack ?? captureMicrophone(options.inputDeviceId);
          this.pendingMicTrack = pending;
          micTrack = await pending;
        }
        try {
          await room.connect(sessionToken.livekit_url, sessionToken.token);
        } catch (cause) {
          throw new FishAgentError("connection_failed", "Could not establish the realtime session", {
            cause
          });
        }
        for (const participant of room.remoteParticipants.values()) {
          const state = participant.attributes?.[AGENT_STATE_ATTRIBUTE];
          if (state) {
            this.callbacks?.onAgentState(state);
          }
        }
        if (micTrack) {
          await room.localParticipant.publishTrack(micTrack);
          this.pendingMicTrack = void 0;
          this.publishInputStream();
        }
      }
      handleAgentLeft(room) {
        this.callbacks?.onConnectionState("disconnected", "AGENT_LEFT");
        void room.disconnect();
      }
      async disconnect() {
        const pendingMic = this.pendingMicTrack;
        this.pendingMicTrack = void 0;
        void pendingMic?.then((track) => track.stop()).catch(() => void 0);
        const room = this.room;
        this.room = void 0;
        this.callbacks = void 0;
        await room?.disconnect();
      }
      getRoom() {
        return this.room;
      }
      async setMicEnabled(enabled) {
        await this.room?.localParticipant.setMicrophoneEnabled(enabled);
        if (enabled) {
          this.publishInputStream();
        }
      }
      async setInputDevice(deviceId) {
        const room = this.room;
        if (!room) {
          return;
        }
        const previous = room.getActiveDevice("audioinput");
        let switched;
        try {
          switched = await room.switchActiveDevice("audioinput", deviceId, true);
        } catch (error) {
          if (previous !== void 0) {
            await room.switchActiveDevice("audioinput", previous, previous !== "default").catch(() => void 0);
            this.publishInputStream();
          }
          throw error;
        }
        if (!switched) {
          throw new FishAgentError(
            "device_change_failed",
            "Could not activate the requested microphone"
          );
        }
        this.publishInputStream();
      }
      publishInputStream() {
        const room = this.room;
        if (!room) {
          return;
        }
        for (const publication of room.localParticipant.audioTrackPublications.values()) {
          const track = publication.track;
          if (track && !this.restartWiredTracks.has(track)) {
            this.restartWiredTracks.add(track);
            track.on(import_livekit_client.TrackEvent.Restarted, () => this.publishInputStream());
          }
          const mediaStreamTrack = track?.mediaStreamTrack;
          if (mediaStreamTrack) {
            this.callbacks?.onInputStream(new MediaStream([mediaStreamTrack]));
          }
        }
      }
      async sendClientEvent(message) {
        if (!this.room) {
          throw new FishAgentError("connection_failed", "Session is not connected");
        }
        const payload = new TextEncoder().encode(JSON.stringify(message));
        await this.room.localParticipant.publishData(payload, {
          reliable: true,
          topic: import_agent_protocol2.CLIENT_EVENT_TOPIC
        });
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AgentSession: () => AgentSession,
  DEFAULT_SERVER_URL: () => DEFAULT_SERVER_URL,
  FishAgentError: () => FishAgentError
});
module.exports = __toCommonJS(src_exports);

// src/audio/output.ts
init_errors();
function assertOutputSelectionSupported() {
  if (typeof HTMLMediaElement === "undefined" || !("setSinkId" in HTMLMediaElement.prototype)) {
    throw new FishAgentError(
      "device_change_failed",
      "This browser does not support selecting an audio output device"
    );
  }
}
var AudioOutput = class {
  constructor() {
    this.volume = 1;
  }
  ensureElement() {
    if (typeof document === "undefined") {
      return void 0;
    }
    if (!this.element) {
      this.element = document.createElement("audio");
      this.element.autoplay = true;
      this.element.setAttribute("playsinline", "");
      this.element.volume = this.volume;
    }
    return this.element;
  }
  setStream(stream) {
    const element = this.ensureElement();
    if (!element) {
      return;
    }
    element.srcObject = stream;
    void element.play().catch(() => {
    });
  }
  /** Call from a user gesture to satisfy browser autoplay policies. */
  async startAudio() {
    await this.element?.play();
  }
  /**
   * Route playback to an output device. The element is created on demand so
   * the browser validates the device id right here, even before the agent's
   * audio arrives. Rejects with `device_change_failed` where output selection
   * is unsupported or the device cannot be used.
   */
  async setSinkId(sinkId) {
    assertOutputSelectionSupported();
    const element = this.ensureElement();
    try {
      await element?.setSinkId(sinkId);
    } catch (error) {
      throw new FishAgentError(
        "device_change_failed",
        "Could not switch to the requested audio output device",
        { cause: error }
      );
    }
  }
  setVolume(volume) {
    this.volume = Math.min(1, Math.max(0, volume));
    if (this.element) {
      this.element.volume = this.volume;
    }
  }
  getVolume() {
    return this.volume;
  }
  dispose() {
    if (this.element) {
      this.element.srcObject = null;
      this.element.remove();
      this.element = void 0;
    }
  }
};

// src/audio/analysis.ts
var AudioStreamAnalyser = class {
  setStream(stream) {
    if (typeof AudioContext === "undefined") {
      return;
    }
    this.context ?? (this.context = new AudioContext());
    this.analyser ?? (this.analyser = this.context.createAnalyser());
    this.source?.disconnect();
    this.source = this.context.createMediaStreamSource(stream);
    this.source.connect(this.analyser);
    this.resume();
  }
  /** AudioContexts start suspended under autoplay policies; safe to call any time. */
  resume() {
    if (this.context?.state === "suspended") {
      void this.context.resume().catch(() => {
      });
    }
  }
  /** RMS level in [0, 1]. */
  getVolume() {
    if (!this.analyser) {
      return 0;
    }
    const samples = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(samples);
    let sumOfSquares = 0;
    for (const sample of samples) {
      const centered = (sample - 128) / 128;
      sumOfSquares += centered * centered;
    }
    return Math.sqrt(sumOfSquares / samples.length);
  }
  getFrequencyData() {
    if (!this.analyser) {
      return new Uint8Array(0);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
  dispose() {
    this.source?.disconnect();
    this.analyser?.disconnect();
    void this.context?.close().catch(() => {
    });
    this.source = void 0;
    this.analyser = void 0;
    this.context = void 0;
  }
};

// src/session/agentSession.ts
init_errors();

// src/sessionToken.ts
var import_agent_protocol = require("@fishaudio/agent-protocol");
init_errors();
var SDK_VERSION = "0.0.1";
var DEFAULT_SERVER_URL = "https://api.fish.audio";
var SUPPORTED_TRANSPORTS = [import_agent_protocol.SESSION_TRANSPORT_LIVEKIT];
function validateSessionToken(sessionToken) {
  const transport = sessionToken.transport;
  if (!SUPPORTED_TRANSPORTS.includes(transport)) {
    throw new FishAgentError(
      "unsupported_transport",
      `Session token uses transport "${transport}" which this SDK version does not support; please upgrade @fishaudio/agent-client`
    );
  }
  const expiresAt = Date.parse(sessionToken.expires_at);
  if (!Number.isNaN(expiresAt) && expiresAt <= Date.now()) {
    throw new FishAgentError(
      "session_expired",
      "The session token's join deadline has passed; request a new session"
    );
  }
  return sessionToken;
}
async function resolveSessionToken(options) {
  const provided = [options.agentId, options.sessionToken].filter((value) => value !== void 0);
  if (provided.length !== 1) {
    throw new TypeError(
      "Exactly one of `agentId` or `sessionToken` must be provided to start a session"
    );
  }
  if (options.sessionToken) {
    return validateSessionToken(options.sessionToken);
  }
  return validateSessionToken(await createPublicSession(options));
}
function detectClientTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || void 0;
  } catch {
    return void 0;
  }
}
async function createPublicSession(options) {
  const serverUrl = (options.serverUrl ?? DEFAULT_SERVER_URL).replace(/\/$/, "");
  const clientTimezone = detectClientTimezone();
  const overrides = options.language || options.overrides ? { ...options.language ? { language: options.language } : {}, ...options.overrides } : void 0;
  const request = {
    agent_id: options.agentId,
    ...options.timezone ? { timezone: options.timezone } : {},
    ...clientTimezone ? { client_timezone: clientTimezone } : {},
    ...options.worldContext !== void 0 ? { world_context: options.worldContext } : {},
    ...overrides ? { overrides } : {},
    ...options.dynamicVariables ? { dynamic_variables: options.dynamicVariables } : {},
    ...options.endUserId ? { end_user_id: options.endUserId } : {},
    ...options.metadata ? { metadata: options.metadata } : {},
    ...options.toolEvents !== void 0 ? { tool_events: options.toolEvents } : {}
  };
  let response;
  try {
    response = await fetch(`${serverUrl}/v1/agent/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Fish-SDK": `agent-client/${SDK_VERSION}`
      },
      body: JSON.stringify(request)
    });
  } catch (cause) {
    throw new FishAgentError("session_request_failed", "Could not reach the session endpoint", {
      cause
    });
  }
  if (!response.ok) {
    throw await createSessionError(response);
  }
  return await response.json();
}
async function createSessionError(response) {
  let message = `Session request failed with HTTP ${response.status}`;
  let code;
  try {
    const body = await response.json();
    message = body.message ?? body.error ?? message;
    code = body.code;
  } catch {
  }
  const options = { statusCode: response.status };
  if (response.status === 409 && code === "unsupported_transport") {
    return new FishAgentError(
      "unsupported_transport",
      `${message}; please upgrade @fishaudio/agent-client`,
      options
    );
  }
  if (response.status === 403) {
    return /origin/i.test(message) ? new FishAgentError("origin_forbidden", message, options) : new FishAgentError("agent_not_public", message, options);
  }
  return new FishAgentError("session_request_failed", message, options);
}

// src/session/emitter.ts
var TypedEmitter = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  on(event, listener) {
    let set = this.listeners.get(event);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);
    return this;
  }
  off(event, listener) {
    this.listeners.get(event)?.delete(listener);
    return this;
  }
  once(event, listener) {
    const wrapper = ((...args) => {
      this.off(event, wrapper);
      listener(...args);
    });
    return this.on(event, wrapper);
  }
  emit(event, ...args) {
    const set = this.listeners.get(event);
    if (!set) {
      return;
    }
    for (const listener of [...set]) {
      try {
        listener(...args);
      } catch (error) {
        console.error("[fish-agent] listener error", error);
      }
    }
  }
};

// src/session/toolDispatcher.ts
init_errors();
var DEFAULT_CLIENT_TOOL_TIMEOUT_MS = 15e3;
var ClientToolDispatcher = class {
  constructor(tools, timeoutMs, send, onError) {
    this.timeoutMs = timeoutMs;
    this.send = send;
    this.onError = onError;
    this.tools = /* @__PURE__ */ new Map();
    for (const [name, handler] of Object.entries(tools ?? {})) {
      this.tools.set(name, handler);
    }
  }
  register(name, handler) {
    this.tools.set(name, handler);
  }
  async dispatch(call) {
    const handler = this.tools.get(call.toolName);
    if (!handler) {
      this.onError(
        new FishAgentError("tool_failed", `Client tool "${call.toolName}" is not registered`)
      );
      if (call.expectsResponse) {
        await this.reply(call.callId, { isError: true, result: "Tool is not registered" });
      }
      return;
    }
    try {
      const result = await this.withTimeout(
        Promise.resolve(handler(call.params, { callId: call.callId, toolName: call.toolName })),
        call.toolName
      );
      if (call.expectsResponse) {
        await this.reply(call.callId, result === void 0 ? {} : { result });
      }
    } catch (error) {
      this.onError(
        error instanceof FishAgentError ? error : new FishAgentError("tool_failed", `Client tool "${call.toolName}" threw`, {
          cause: error
        })
      );
      if (call.expectsResponse) {
        await this.reply(call.callId, { isError: true, result: String(error) });
      }
    }
  }
  async reply(callId, body) {
    try {
      await this.send({ type: "client_tool.result", callId, ...body });
    } catch (error) {
      this.onError(
        new FishAgentError("tool_failed", "Failed to deliver a client tool result", {
          cause: error
        })
      );
    }
  }
  withTimeout(promise, toolName) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(
          new FishAgentError(
            "tool_timeout",
            `Client tool "${toolName}" timed out after ${this.timeoutMs}ms`
          )
        );
      }, this.timeoutMs);
      promise.then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (error) => {
          clearTimeout(timer);
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      );
    });
  }
};

// src/session/wakeLock.ts
var _sentinel, _active, _onVisibilityChange, _WakeLockHolder_instances, request_fn;
var WakeLockHolder = class {
  constructor() {
    __privateAdd(this, _WakeLockHolder_instances);
    __privateAdd(this, _sentinel);
    __privateAdd(this, _active, false);
    __privateAdd(this, _onVisibilityChange, () => {
      if (document.visibilityState === "visible") {
        void __privateMethod(this, _WakeLockHolder_instances, request_fn).call(this);
      }
    });
  }
  acquire() {
    if (__privateGet(this, _active) || typeof document === "undefined" || typeof navigator === "undefined" || !navigator.wakeLock) {
      return;
    }
    __privateSet(this, _active, true);
    document.addEventListener("visibilitychange", __privateGet(this, _onVisibilityChange));
    void __privateMethod(this, _WakeLockHolder_instances, request_fn).call(this);
  }
  release() {
    if (!__privateGet(this, _active)) {
      return;
    }
    __privateSet(this, _active, false);
    document.removeEventListener("visibilitychange", __privateGet(this, _onVisibilityChange));
    void __privateGet(this, _sentinel)?.release().catch(() => void 0);
    __privateSet(this, _sentinel, void 0);
  }
};
_sentinel = new WeakMap();
_active = new WeakMap();
_onVisibilityChange = new WeakMap();
_WakeLockHolder_instances = new WeakSet();
request_fn = async function() {
  if (!__privateGet(this, _active)) {
    return;
  }
  try {
    const sentinel = await navigator.wakeLock.request("screen");
    if (!__privateGet(this, _active)) {
      void sentinel.release().catch(() => void 0);
      return;
    }
    const previous = __privateGet(this, _sentinel);
    __privateSet(this, _sentinel, sentinel);
    if (previous && previous !== sentinel) {
      void previous.release().catch(() => void 0);
    }
  } catch {
  }
};

// src/session/agentSession.ts
var AGENT_JOIN_TIMEOUT_MS = 15e3;
var startWith;
var _status, _mode, _endReason, _sessionId, _micMuted, _endedByClient, _ending, _transport, _tools, _output, _outputAnalyser, _inputAnalyser, _wakeLock, _agentSegments, _transcript, _transcriptIndex, _typedMessageCount, _agentPresent, _pendingMessages, _joinTimer, _AgentSession_instances, endOnce_fn, _AgentSession_static, startWith_fn, asStartError_fn, asMicError_fn, asDeviceError_fn, sendClientEvent_fn, setStatus_fn, setMode_fn, handleAgentPresent_fn, abandonAgentWait_fn, handleConnectionState_fn, finalize_fn, handleAgentEvent_fn, recordSegment_fn, handleTranscription_fn, recordTypedUserMessage_fn;
var _AgentSession = class _AgentSession extends TypedEmitter {
  constructor(sessionToken) {
    super();
    __privateAdd(this, _AgentSession_instances);
    __privateAdd(this, _status, "connecting");
    __privateAdd(this, _mode, "listening");
    __privateAdd(this, _endReason);
    __privateAdd(this, _sessionId);
    __privateAdd(this, _micMuted, false);
    __privateAdd(this, _endedByClient, false);
    __privateAdd(this, _ending);
    __privateAdd(this, _transport);
    __privateAdd(this, _tools);
    __privateAdd(this, _output, new AudioOutput());
    __privateAdd(this, _outputAnalyser, new AudioStreamAnalyser());
    __privateAdd(this, _inputAnalyser, new AudioStreamAnalyser());
    __privateAdd(this, _wakeLock, new WakeLockHolder());
    /** Text already delivered per agent segment, to derive deltas from full-text updates. */
    __privateAdd(this, _agentSegments, /* @__PURE__ */ new Map());
    /** Transcript so far, for late subscribers (getTranscript); upserted per segment. */
    __privateAdd(this, _transcript, []);
    __privateAdd(this, _transcriptIndex, /* @__PURE__ */ new Map());
    __privateAdd(this, _typedMessageCount, 0);
    // Data frames reach only participants already in the room — and the worker
    // registers its handlers while starting up — so typed messages wait here
    // until the agent publishes its first pipeline state.
    __privateAdd(this, _agentPresent, false);
    __privateAdd(this, _pendingMessages, []);
    __privateAdd(this, _joinTimer);
    __privateSet(this, _sessionId, sessionToken.session_id);
  }
  /**
   * Obtain a session token (if needed), connect, publish the microphone and
   * hand back a live session. Rejects with FishAgentError on session-request,
   * permission or connect failures.
   */
  static async start(options) {
    var _a;
    const { LiveKitTransport: LiveKitTransport2 } = await Promise.resolve().then(() => (init_livekit(), livekit_exports));
    return __privateMethod(_a = _AgentSession, _AgentSession_static, startWith_fn).call(_a, options, () => new LiveKitTransport2());
  }
  // ---- getters ----
  get sessionId() {
    return __privateGet(this, _sessionId);
  }
  get status() {
    return __privateGet(this, _status);
  }
  get mode() {
    return __privateGet(this, _mode);
  }
  get isSpeaking() {
    return __privateGet(this, _mode) === "speaking";
  }
  get micMuted() {
    return __privateGet(this, _micMuted);
  }
  get endReason() {
    return __privateGet(this, _endReason);
  }
  /**
   * Snapshot of every transcript segment so far, in conversation order. Seed a
   * consumer that subscribes after events already fired (e.g. a component
   * mounted right after start), then apply live events by segmentId.
   */
  getTranscript() {
    return __privateGet(this, _transcript).map((segment) => ({ ...segment }));
  }
  // ---- text & control channel ----
  /** Typed turns get a text-only reply by default (no TTS); pass `audio: true` to have the agent speak this turn. */
  sendUserMessage(text, options) {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const message = options?.audio === true ? { type: "user.message", text: trimmed } : { type: "user.message", text: trimmed, audio: false };
    if (__privateGet(this, _agentPresent)) {
      __privateMethod(this, _AgentSession_instances, sendClientEvent_fn).call(this, message);
    } else {
      __privateGet(this, _pendingMessages).push(message);
    }
    __privateMethod(this, _AgentSession_instances, recordTypedUserMessage_fn).call(this, trimmed);
  }
  sendUserActivity() {
    __privateMethod(this, _AgentSession_instances, sendClientEvent_fn).call(this, { type: "user.activity" });
  }
  interrupt() {
    __privateMethod(this, _AgentSession_instances, sendClientEvent_fn).call(this, { type: "user.interrupt" });
  }
  registerClientTool(name, handler) {
    __privateGet(this, _tools).register(name, handler);
  }
  // ---- audio ----
  /**
   * After a `microphone: false` start, the first unmute captures and publishes
   * the microphone — the permission prompt happens here. A denial rejects with
   * `mic_permission_denied` and the session stays muted.
   */
  async setMicMuted(muted) {
    var _a;
    const previous = __privateGet(this, _micMuted);
    __privateSet(this, _micMuted, muted);
    try {
      await __privateGet(this, _transport).setMicEnabled(!muted);
    } catch (error) {
      __privateSet(this, _micMuted, previous);
      throw __privateMethod(_a = _AgentSession, _AgentSession_static, asMicError_fn).call(_a, error);
    }
  }
  /** Call from a user gesture to satisfy browser autoplay policies. */
  async startAudio() {
    __privateGet(this, _outputAnalyser).resume();
    __privateGet(this, _inputAnalyser).resume();
    await __privateGet(this, _output).startAudio();
  }
  /**
   * Switch the microphone mid-call. While the mic is not captured yet
   * (`microphone: false` start, still muted) this records the preference for
   * the first unmute. Rejects with `device_change_failed` when the device
   * cannot be activated, switching back to the previous microphone (best
   * effort — the transport stops the old capture before acquiring the new).
   */
  async setInputDevice(deviceId) {
    var _a;
    try {
      await __privateGet(this, _transport).setInputDevice(deviceId);
    } catch (error) {
      throw __privateMethod(_a = _AgentSession, _AgentSession_static, asDeviceError_fn).call(_a, error, "Could not switch the microphone");
    }
  }
  /**
   * Route the agent's audio to an output device (`setSinkId`); pass `""` to
   * return to the default device. Rejects with `device_change_failed` where
   * the browser does not support output selection (common on mobile browsers)
   * or the device cannot be used; playback stays on the previous device.
   */
  async setOutputDevice(deviceId) {
    await __privateGet(this, _output).setSinkId(deviceId);
  }
  setOutputVolume(volume) {
    __privateGet(this, _output).setVolume(volume);
  }
  getOutputVolume() {
    return __privateGet(this, _outputAnalyser).getVolume();
  }
  getInputVolume() {
    return __privateGet(this, _inputAnalyser).getVolume();
  }
  getOutputFrequencyData() {
    return __privateGet(this, _outputAnalyser).getFrequencyData();
  }
  getInputFrequencyData() {
    return __privateGet(this, _inputAnalyser).getFrequencyData();
  }
  /**
   * Escape hatch: the underlying LiveKit `Room`, for needs the session API
   * doesn't cover (connection-quality telemetry, publishing extra tracks).
   * Code using it couples to this SDK's transport choice and livekit-client
   * version — prefer the session API where one exists. `undefined` after the
   * session ends, or when a custom transport doesn't expose a room.
   */
  getRoom() {
    return __privateGet(this, _transport).getRoom?.();
  }
  // ---- lifecycle ----
  end() {
    if (__privateGet(this, _ending)) {
      return __privateGet(this, _ending);
    }
    if (__privateGet(this, _status) === "ended") {
      return Promise.resolve();
    }
    const ending = __privateMethod(this, _AgentSession_instances, endOnce_fn).call(this);
    __privateSet(this, _ending, ending);
    void ending.catch(() => {
      if (__privateGet(this, _ending) === ending) {
        __privateSet(this, _ending, void 0);
      }
    });
    return ending;
  }
};
_status = new WeakMap();
_mode = new WeakMap();
_endReason = new WeakMap();
_sessionId = new WeakMap();
_micMuted = new WeakMap();
_endedByClient = new WeakMap();
_ending = new WeakMap();
_transport = new WeakMap();
_tools = new WeakMap();
_output = new WeakMap();
_outputAnalyser = new WeakMap();
_inputAnalyser = new WeakMap();
_wakeLock = new WeakMap();
_agentSegments = new WeakMap();
_transcript = new WeakMap();
_transcriptIndex = new WeakMap();
_typedMessageCount = new WeakMap();
_agentPresent = new WeakMap();
_pendingMessages = new WeakMap();
_joinTimer = new WeakMap();
_AgentSession_instances = new WeakSet();
endOnce_fn = async function() {
  __privateSet(this, _endedByClient, true);
  try {
    await __privateGet(this, _transport).sendClientEvent({ type: "user.hangup" });
  } catch {
  }
  await __privateGet(this, _transport).disconnect();
  __privateMethod(this, _AgentSession_instances, finalize_fn).call(this, "user_hangup");
};
_AgentSession_static = new WeakSet();
startWith_fn = async function(options, createTransport) {
  var _a, _b, _c;
  if (options.audio?.outputDeviceId !== void 0) {
    assertOutputSelectionSupported();
  }
  const transport = createTransport();
  if (options.microphone !== false) {
    transport.prepareMicrophone?.({ inputDeviceId: options.audio?.inputDeviceId });
  }
  let sessionToken;
  let session;
  try {
    sessionToken = await resolveSessionToken(options);
    session = new _AgentSession(sessionToken);
    if (options.audio?.outputDeviceId !== void 0) {
      await __privateGet(session, _output).setSinkId(options.audio.outputDeviceId);
    }
  } catch (error) {
    await transport.disconnect().catch(() => void 0);
    throw error;
  }
  for (const [key, callback] of Object.entries(options.callbacks ?? {})) {
    const event = key.charAt(2).toLowerCase() + key.slice(3);
    session.on(event, callback);
  }
  __privateSet(session, _transport, transport);
  if (options.microphone === false) {
    __privateSet(session, _micMuted, true);
  }
  __privateSet(session, _tools, new ClientToolDispatcher(
    options.clientTools,
    options.clientToolTimeoutMs ?? DEFAULT_CLIENT_TOOL_TIMEOUT_MS,
    (message) => transport.sendClientEvent(message),
    (error) => session.emit("error", error)
  ));
  try {
    await transport.connect(sessionToken, {
      inputDeviceId: options.audio?.inputDeviceId,
      microphone: options.microphone,
      callbacks: {
        onAgentEvent: (message) => {
          var _a2;
          return __privateMethod(_a2 = session, _AgentSession_instances, handleAgentEvent_fn).call(_a2, message);
        },
        // Mode model: "listening" is the default state; the framework's agent
        // state supplies the thinking edge; speaking follows the playout-synced
        // transcription segments (open = audible, closed = back to listening).
        onAgentState: (state) => {
          var _a2, _b2;
          __privateMethod(_a2 = session, _AgentSession_instances, handleAgentPresent_fn).call(_a2);
          if (state === "thinking") {
            __privateMethod(_b2 = session, _AgentSession_instances, setMode_fn).call(_b2, "thinking");
          }
        },
        onTranscription: (update) => {
          var _a2;
          return __privateMethod(_a2 = session, _AgentSession_instances, handleTranscription_fn).call(_a2, update);
        },
        onOutputStream: (stream) => {
          __privateGet(session, _output).setStream(stream);
          __privateGet(session, _outputAnalyser).setStream(stream);
        },
        onInputStream: (stream) => __privateGet(session, _inputAnalyser).setStream(stream),
        onConnectionState: (state, reason) => {
          var _a2;
          return __privateMethod(_a2 = session, _AgentSession_instances, handleConnectionState_fn).call(_a2, state, reason);
        }
      }
    });
  } catch (error) {
    await __privateGet(session, _transport).disconnect().catch(() => void 0);
    __privateMethod(_a = session, _AgentSession_instances, finalize_fn).call(_a, "connection_lost");
    throw __privateMethod(_b = _AgentSession, _AgentSession_static, asStartError_fn).call(_b, error);
  }
  if (__privateGet(session, _status) === "connecting") {
    __privateMethod(_c = session, _AgentSession_instances, setStatus_fn).call(_c, "connected");
    session.emit("connect", { sessionId: __privateGet(session, _sessionId) });
  }
  if (__privateGet(session, _status) !== "ended" && options.wakeLock !== false) {
    __privateGet(session, _wakeLock).acquire();
  }
  if (!__privateGet(session, _agentPresent) && __privateGet(session, _status) === "connected") {
    __privateSet(session, _joinTimer, setTimeout(() => {
      var _a2;
      return __privateMethod(_a2 = session, _AgentSession_instances, abandonAgentWait_fn).call(_a2);
    }, AGENT_JOIN_TIMEOUT_MS));
  }
  return session;
};
asStartError_fn = function(error) {
  if (error instanceof FishAgentError) {
    return error;
  }
  if (error instanceof Error && error.name === "NotAllowedError") {
    return new FishAgentError("mic_permission_denied", "Microphone permission was denied", {
      cause: error
    });
  }
  return new FishAgentError("connection_failed", "Could not establish the realtime session", {
    cause: error
  });
};
asMicError_fn = function(error) {
  if (error instanceof FishAgentError) {
    return error;
  }
  if (error instanceof Error && error.name === "NotAllowedError") {
    return new FishAgentError("mic_permission_denied", "Microphone permission was denied", {
      cause: error
    });
  }
  if (error instanceof Error && (error.name === "OverconstrainedError" || error.name === "NotFoundError")) {
    return new FishAgentError(
      "device_change_failed",
      "No usable microphone could be activated",
      { cause: error }
    );
  }
  return new FishAgentError("connection_failed", "Could not toggle the microphone", {
    cause: error
  });
};
asDeviceError_fn = function(error, message) {
  if (error instanceof FishAgentError) {
    return error;
  }
  return new FishAgentError("device_change_failed", message, { cause: error });
};
sendClientEvent_fn = function(message) {
  void __privateGet(this, _transport).sendClientEvent(message).catch((error) => {
    this.emit(
      "error",
      new FishAgentError("connection_failed", "Failed to send to the agent", { cause: error })
    );
  });
};
setStatus_fn = function(status) {
  if (__privateGet(this, _status) !== status) {
    __privateSet(this, _status, status);
    this.emit("statusChange", status);
  }
};
setMode_fn = function(mode) {
  if (__privateGet(this, _mode) !== mode) {
    __privateSet(this, _mode, mode);
    this.emit("modeChange", mode);
  }
};
handleAgentPresent_fn = function() {
  if (__privateGet(this, _agentPresent)) {
    return;
  }
  __privateSet(this, _agentPresent, true);
  if (__privateGet(this, _joinTimer)) {
    clearTimeout(__privateGet(this, _joinTimer));
    __privateSet(this, _joinTimer, void 0);
  }
  const pending = __privateGet(this, _pendingMessages);
  __privateSet(this, _pendingMessages, []);
  for (const message of pending) {
    __privateMethod(this, _AgentSession_instances, sendClientEvent_fn).call(this, message);
  }
};
abandonAgentWait_fn = function() {
  if (__privateGet(this, _status) === "ended" || __privateGet(this, _agentPresent)) {
    return;
  }
  this.emit(
    "error",
    new FishAgentError("connection_failed", "The agent did not join the session")
  );
  void __privateGet(this, _transport).disconnect().catch(() => {
  });
  __privateMethod(this, _AgentSession_instances, finalize_fn).call(this, "connection_lost");
};
handleConnectionState_fn = function(state, reason) {
  if (__privateGet(this, _status) === "ended") {
    return;
  }
  if (state === "reconnecting") {
    __privateMethod(this, _AgentSession_instances, setStatus_fn).call(this, "reconnecting");
    return;
  }
  if (state === "connected") {
    if (__privateGet(this, _status) === "reconnecting") {
      __privateMethod(this, _AgentSession_instances, setStatus_fn).call(this, "connected");
    }
    return;
  }
  const ended = __privateGet(this, _endedByClient) ? "user_hangup" : reason === "AGENT_LEFT" || reason === "ROOM_DELETED" || reason === "ROOM_CLOSED" ? "agent_hangup" : "connection_lost";
  __privateMethod(this, _AgentSession_instances, finalize_fn).call(this, ended);
};
finalize_fn = function(reason) {
  if (__privateGet(this, _status) === "ended") {
    return;
  }
  if (__privateGet(this, _joinTimer)) {
    clearTimeout(__privateGet(this, _joinTimer));
    __privateSet(this, _joinTimer, void 0);
  }
  __privateSet(this, _endReason, reason);
  __privateMethod(this, _AgentSession_instances, setStatus_fn).call(this, "ended");
  __privateGet(this, _wakeLock).release();
  __privateGet(this, _output).dispose();
  __privateGet(this, _outputAnalyser).dispose();
  __privateGet(this, _inputAnalyser).dispose();
  this.emit("disconnect", { reason });
};
handleAgentEvent_fn = function(message) {
  switch (message.type) {
    case "client_tool.call":
      void __privateGet(this, _tools).dispatch(message);
      return;
    case "tool.started":
      this.emit("toolCallStarted", {
        callId: message.callId,
        toolName: message.toolName,
        source: message.toolSource,
        input: message.input,
        inputTruncated: message.inputTruncated === true
      });
      return;
    case "tool.completed":
      this.emit("toolCallCompleted", {
        callId: message.callId,
        toolName: message.toolName,
        source: message.toolSource,
        output: message.output,
        outputTruncated: message.outputTruncated === true
      });
      return;
    case "tool.failed":
      this.emit("toolCallFailed", {
        callId: message.callId,
        toolName: message.toolName,
        source: message.toolSource,
        error: message.error
      });
      return;
    case "error":
      this.emit(
        "error",
        message.code === "provider_error" ? new FishAgentError("provider_error", "An upstream provider failed during the session") : new FishAgentError("internal_error", "The agent runtime hit an internal error")
      );
      return;
    default:
      return;
  }
};
recordSegment_fn = function(role, segmentId, text, final) {
  const key = `${role}:${segmentId}`;
  const index = __privateGet(this, _transcriptIndex).get(key);
  if (index === void 0) {
    __privateGet(this, _transcriptIndex).set(key, __privateGet(this, _transcript).length);
    __privateGet(this, _transcript).push({ segmentId, role, text, final });
  } else {
    __privateGet(this, _transcript)[index] = { segmentId, role, text, final };
  }
};
handleTranscription_fn = function(update) {
  if (update.role === "user") {
    __privateMethod(this, _AgentSession_instances, recordSegment_fn).call(this, "user", update.segmentId, update.text, update.final);
    this.emit("userTranscript", {
      segmentId: update.segmentId,
      text: update.text,
      final: update.final
    });
    if (update.final) {
      this.emit("message", { role: "user", text: update.text });
    }
    return;
  }
  __privateMethod(this, _AgentSession_instances, setMode_fn).call(this, update.final ? "listening" : "speaking");
  __privateMethod(this, _AgentSession_instances, recordSegment_fn).call(this, "agent", update.segmentId, update.text, update.final);
  const previous = __privateGet(this, _agentSegments).get(update.segmentId) ?? "";
  const delta = update.text.startsWith(previous) ? update.text.slice(previous.length) : update.text;
  __privateGet(this, _agentSegments).set(update.segmentId, update.text);
  if (delta) {
    this.emit("agentResponseDelta", { segmentId: update.segmentId, delta, text: update.text });
  }
  if (update.final) {
    __privateGet(this, _agentSegments).delete(update.segmentId);
    this.emit("agentResponse", { segmentId: update.segmentId, text: update.text });
    this.emit("message", { role: "agent", text: update.text });
  }
};
// Typed messages are not echoed by the server; the sender finalizes its own bubble.
recordTypedUserMessage_fn = function(text) {
  const segmentId = `typed_${++__privateWrapper(this, _typedMessageCount)._}`;
  __privateMethod(this, _AgentSession_instances, recordSegment_fn).call(this, "user", segmentId, text, true);
  this.emit("userTranscript", { segmentId, text, final: true });
  this.emit("message", { role: "user", text });
};
__privateAdd(_AgentSession, _AgentSession_static);
startWith = (options, createTransport) => {
  var _a;
  return __privateMethod(_a = _AgentSession, _AgentSession_static, startWith_fn).call(_a, options, createTransport);
};
var AgentSession = _AgentSession;

// src/index.ts
init_errors();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AgentSession,
  DEFAULT_SERVER_URL,
  FishAgentError
});
//# sourceMappingURL=index.cjs.map