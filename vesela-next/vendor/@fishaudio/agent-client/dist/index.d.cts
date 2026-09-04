import { Room } from 'livekit-client';
import { ToolCallSource, SessionToken, SessionLanguage, SessionOverrides } from '@fishaudio/agent-protocol';
export { AgentSessionCreateRequest, SessionOverrides, SessionToken, ToolCallSource } from '@fishaudio/agent-protocol';

type FishAgentErrorCode = "session_request_failed" | "agent_not_public" | "origin_forbidden" | "unsupported_transport" | "mic_permission_denied"
/** A requested audio device could not be activated, or the browser does not support selecting it. */
 | "device_change_failed" | "connection_failed" | "session_expired" | "tool_failed" | "tool_timeout"
/** An upstream model/speech provider failed during the session. */
 | "provider_error"
/** The agent runtime hit an internal error. */
 | "internal_error";
declare class FishAgentError extends Error {
    readonly code: FishAgentErrorCode;
    /** HTTP status of the failing session request, when the error originated there. */
    readonly statusCode?: number;
    constructor(code: FishAgentErrorCode, message: string, options?: {
        statusCode?: number;
        cause?: unknown;
    });
}

type SessionStatus = "connecting" | "connected" | "reconnecting" | "ended";
type AgentMode = "listening" | "thinking" | "speaking";
type EndReason = "user_hangup" | "agent_hangup" | "connection_lost";
interface UserTranscriptEvent {
    /** Groups updates of one utterance; interim updates replace, they never append. */
    segmentId: string;
    /** Full text of the utterance so far. */
    text: string;
    final: boolean;
}
interface AgentResponseDeltaEvent {
    /** Groups streaming updates of one agent speech segment. */
    segmentId: string;
    delta: string;
    /** Accumulated segment text including this delta. */
    text: string;
}
interface AgentResponseEvent {
    segmentId: string;
    text: string;
}
/** One transcript segment; `text` is the whole segment so far, refined in place. */
interface TranscriptSegment {
    segmentId: string;
    role: "user" | "agent";
    text: string;
    final: boolean;
}
interface ConversationMessage {
    role: "user" | "agent";
    text: string;
}
/**
 * Tool-call lifecycle, forwarded for every tool the agent runs (including client
 * tools, which complete once this client returns their result). `callId` pairs one
 * started event with exactly one completed/failed event; terminal events repeat
 * name/source so a listener attached mid-call can still render a full item.
 * Emission is a session-creation option (`toolEvents`/`tool_events`, default true).
 */
interface ToolCallStartedEvent {
    callId: string;
    toolName: string;
    source: ToolCallSource;
    /** Tool arguments as a JSON string; parse only when `inputTruncated` is false. */
    input: string;
    inputTruncated: boolean;
}
interface ToolCallCompletedEvent {
    callId: string;
    toolName: string;
    source: ToolCallSource;
    /** Tool result as a JSON string; parse only when `outputTruncated` is false. */
    output: string;
    outputTruncated: boolean;
}
interface ToolCallFailedEvent {
    callId: string;
    toolName: string;
    source: ToolCallSource;
    error: string;
}
interface AgentSessionEvents {
    connect: (event: {
        sessionId: string;
    }) => void;
    disconnect: (event: {
        reason: EndReason;
    }) => void;
    statusChange: (status: SessionStatus) => void;
    modeChange: (mode: AgentMode) => void;
    userTranscript: (event: UserTranscriptEvent) => void;
    agentResponseDelta: (event: AgentResponseDeltaEvent) => void;
    agentResponse: (event: AgentResponseEvent) => void;
    /** Finalized messages only, in conversation order — the "just give me a chat log" event. */
    message: (message: ConversationMessage) => void;
    toolCallStarted: (event: ToolCallStartedEvent) => void;
    toolCallCompleted: (event: ToolCallCompletedEvent) => void;
    toolCallFailed: (event: ToolCallFailedEvent) => void;
    error: (error: FishAgentError) => void;
}
type AgentSessionCallbacks = {
    [K in keyof AgentSessionEvents as `on${Capitalize<K>}`]: AgentSessionEvents[K];
};

declare const DEFAULT_SERVER_URL = "https://api.fish.audio";
interface SessionRequestOptions {
    /** Public agent: the SDK creates the session directly against the Fish API. */
    agentId?: string;
    /** Session token created by the host backend, passed through verbatim. */
    sessionToken?: SessionToken;
    serverUrl?: string;
    /** Sugar for `overrides.language`; an explicit override wins. Pair with a voice in that language. */
    language?: SessionLanguage;
    /**
     * IANA timezone for the agent's sense of local time in this session. Omit to
     * use the browser's timezone (sent automatically as a hint). With
     * `sessionToken` auth the host backend chooses instead, via `timezone` on its
     * session-creation call.
     */
    timezone?: string;
    /**
     * The agent knows the current date and time by default. Set false to withhold
     * both from this session's prompt. With `sessionToken` auth the host backend
     * chooses instead, via `world_context` on its session-creation call.
     */
    worldContext?: boolean;
    /** Per-session config overrides; each field must be allow-listed on the agent. */
    overrides?: SessionOverrides;
    /** `{{name}}` template values for the agent's prompt and first message. */
    dynamicVariables?: Record<string, string | number | boolean>;
    endUserId?: string;
    /** Caller-owned tag, stored and returned verbatim; the platform never interprets it. */
    metadata?: Record<string, unknown>;
    /**
     * Stream the agent's tool-call lifecycle (toolCallStarted/Completed/Failed
     * events, with payloads) to this session. Default true; set false when tool
     * data must stay hidden from this client. With `sessionToken` auth the host
     * backend chooses instead, via `tool_events` on its session-creation call.
     */
    toolEvents?: boolean;
}

type Listener = (...args: any[]) => void;
/** Minimal typed emitter; listener errors are isolated so one bad consumer can't break the session. */
declare class TypedEmitter<Events extends Record<keyof Events, Listener>> {
    private readonly listeners;
    on<K extends keyof Events>(event: K, listener: Events[K]): this;
    off<K extends keyof Events>(event: K, listener: Events[K]): this;
    once<K extends keyof Events>(event: K, listener: Events[K]): this;
    protected emit<K extends keyof Events>(event: K, ...args: Parameters<Events[K]>): void;
}

type ClientToolHandler = (params: Record<string, unknown>, context: {
    callId: string;
    toolName: string;
}) => unknown | Promise<unknown>;

interface AgentSessionOptions extends SessionRequestOptions {
    clientTools?: Record<string, ClientToolHandler>;
    clientToolTimeoutMs?: number;
    /**
     * Capture the microphone on start. Default true. Set false to join without
     * requesting it (text-first UIs); the first `setMicMuted(false)` then
     * captures — the permission prompt happens there, so call it from a user
     * gesture.
     */
    microphone?: boolean;
    audio?: {
        inputDeviceId?: string;
        /** Playback device (`setSinkId`); start rejects with `device_change_failed`
         * where output selection is unsupported (before creating a server session)
         * or the device cannot be used (before connecting). */
        outputDeviceId?: string;
    };
    /**
     * Hold a screen wake lock while the session is live, so long calls survive
     * the phone trying to sleep. Default true; denial is silent. Set false to
     * leave screen policy to the page.
     */
    wakeLock?: boolean;
    callbacks?: Partial<AgentSessionCallbacks>;
}
declare class AgentSession extends TypedEmitter<AgentSessionEvents> {
    #private;
    private constructor();
    /**
     * Obtain a session token (if needed), connect, publish the microphone and
     * hand back a live session. Rejects with FishAgentError on session-request,
     * permission or connect failures.
     */
    static start(options: AgentSessionOptions): Promise<AgentSession>;
    get sessionId(): string;
    get status(): SessionStatus;
    get mode(): AgentMode;
    get isSpeaking(): boolean;
    get micMuted(): boolean;
    get endReason(): EndReason | undefined;
    /**
     * Snapshot of every transcript segment so far, in conversation order. Seed a
     * consumer that subscribes after events already fired (e.g. a component
     * mounted right after start), then apply live events by segmentId.
     */
    getTranscript(): TranscriptSegment[];
    /** Typed turns get a text-only reply by default (no TTS); pass `audio: true` to have the agent speak this turn. */
    sendUserMessage(text: string, options?: {
        audio?: boolean;
    }): void;
    sendUserActivity(): void;
    interrupt(): void;
    registerClientTool(name: string, handler: ClientToolHandler): void;
    /**
     * After a `microphone: false` start, the first unmute captures and publishes
     * the microphone — the permission prompt happens here. A denial rejects with
     * `mic_permission_denied` and the session stays muted.
     */
    setMicMuted(muted: boolean): Promise<void>;
    /** Call from a user gesture to satisfy browser autoplay policies. */
    startAudio(): Promise<void>;
    /**
     * Switch the microphone mid-call. While the mic is not captured yet
     * (`microphone: false` start, still muted) this records the preference for
     * the first unmute. Rejects with `device_change_failed` when the device
     * cannot be activated, switching back to the previous microphone (best
     * effort — the transport stops the old capture before acquiring the new).
     */
    setInputDevice(deviceId: string): Promise<void>;
    /**
     * Route the agent's audio to an output device (`setSinkId`); pass `""` to
     * return to the default device. Rejects with `device_change_failed` where
     * the browser does not support output selection (common on mobile browsers)
     * or the device cannot be used; playback stays on the previous device.
     */
    setOutputDevice(deviceId: string): Promise<void>;
    setOutputVolume(volume: number): void;
    getOutputVolume(): number;
    getInputVolume(): number;
    getOutputFrequencyData(): Uint8Array;
    getInputFrequencyData(): Uint8Array;
    /**
     * Escape hatch: the underlying LiveKit `Room`, for needs the session API
     * doesn't cover (connection-quality telemetry, publishing extra tracks).
     * Code using it couples to this SDK's transport choice and livekit-client
     * version — prefer the session API where one exists. `undefined` after the
     * session ends, or when a custom transport doesn't expose a room.
     */
    getRoom(): Room | undefined;
    end(): Promise<void>;
}

export { type AgentMode, type AgentResponseDeltaEvent, type AgentResponseEvent, AgentSession, type AgentSessionCallbacks, type AgentSessionEvents, type AgentSessionOptions, type ClientToolHandler, type ConversationMessage, DEFAULT_SERVER_URL, type EndReason, FishAgentError, type FishAgentErrorCode, type SessionStatus, type ToolCallCompletedEvent, type ToolCallFailedEvent, type ToolCallStartedEvent, type TranscriptSegment, type UserTranscriptEvent };
