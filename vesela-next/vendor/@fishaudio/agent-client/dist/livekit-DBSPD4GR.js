import {
  FishAgentError
} from "./chunk-PEVOZB5Y.js";

// src/transport/livekit.ts
import {
  ConnectionState,
  createLocalAudioTrack,
  DisconnectReason,
  Room,
  RoomEvent,
  Track,
  TrackEvent
} from "livekit-client";
import {
  AGENT_EVENT_TOPIC,
  CLIENT_EVENT_TOPIC
} from "@fishaudio/agent-protocol";
function hasMessageType(value) {
  return typeof value === "object" && value !== null && typeof value.type === "string";
}
function captureMicrophone(inputDeviceId) {
  return createLocalAudioTrack({
    deviceId: inputDeviceId,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  });
}
var LiveKitTransport = class {
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
    const room = new Room({
      audioCaptureDefaults: {
        deviceId: options.inputDeviceId,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    this.room = room;
    room.on(RoomEvent.DataReceived, (payload, _participant, _kind, topic) => {
      if (topic !== AGENT_EVENT_TOPIC) {
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
    room.on(RoomEvent.ParticipantAttributesChanged, (changed, participant) => {
      const state = changed[AGENT_STATE_ATTRIBUTE];
      if (!participant.isLocal && state) {
        this.callbacks?.onAgentState(state);
      }
    });
    room.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio && track.mediaStreamTrack) {
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
    room.on(RoomEvent.Reconnecting, () => {
      this.callbacks?.onConnectionState("reconnecting");
    });
    room.on(RoomEvent.Reconnected, () => {
      if (room.remoteParticipants.size === 0) {
        this.handleAgentLeft(room);
        return;
      }
      this.callbacks?.onConnectionState("connected");
    });
    room.on(RoomEvent.Disconnected, (reason) => {
      this.callbacks?.onConnectionState(
        "disconnected",
        reason === void 0 ? void 0 : DisconnectReason[reason]
      );
      if (this.room === room) {
        this.room = void 0;
        this.callbacks = void 0;
      }
    });
    room.on(RoomEvent.ParticipantDisconnected, () => {
      if (room.remoteParticipants.size === 0) {
        queueMicrotask(() => {
          if (room.state === ConnectionState.Connected && room.remoteParticipants.size === 0) {
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
        track.on(TrackEvent.Restarted, () => this.publishInputStream());
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
      topic: CLIENT_EVENT_TOPIC
    });
  }
};
export {
  LiveKitTransport
};
//# sourceMappingURL=livekit-DBSPD4GR.js.map