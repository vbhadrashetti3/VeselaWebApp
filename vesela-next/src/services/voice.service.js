import { post } from "@/lib/apiService";

function unwrap(result) {
  const payload = result.data;

  if (result.error) {
    return {
      ok: false,
      message: payload?.message || result.message || "Something went wrong",
      expired: Boolean(payload?.expired),
    };
  }

  if (payload?.status === "error") {
    return {
      ok: false,
      message: payload.message || "Something went wrong",
      expired: Boolean(payload.expired),
    };
  }

  return { ok: true, data: payload };
}

export async function startVoiceSession({ timeZone, conversationId } = {}) {
  const body = {
    time_zone: timeZone || "America/Chicago",
  };
  if (conversationId) {
    body.conversation_id = conversationId;
  }
  return unwrap(await post("/api/voice/session/", body));
}

export async function saveVoiceTurn({
  conversationId,
  userText,
  assistantText,
  fishSessionId,
} = {}) {
  return unwrap(
    await post("/api/voice/turn/", {
      conversation_id: conversationId,
      user_text: userText,
      assistant_text: assistantText || "",
      fish_session_id: fishSessionId,
    }),
  );
}

export async function endVoiceSession({ fishSessionId, conversationId } = {}) {
  return unwrap(
    await post("/api/voice/end/", {
      fish_session_id: fishSessionId,
      conversation_id: conversationId,
    }),
  );
}
