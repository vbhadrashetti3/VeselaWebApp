"use client";

import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Grid,
  Chip,
  Divider,
  useTheme,
  Alert,
  AlertTitle,
} from "@mui/material";
import SettingSection from "./SettingSection";
import {
  Cpu,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Scale,
  ShieldCheck,
  Eye,
  Mail,
  Compass,
} from "lucide-react";

// ─── ModelCardContent ──────────────────────────────────────────────────────────


const ModelCardContent = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const cardStyle = {
    p: 2.5,
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
    background: isLight ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.02)",
    mb: 3,
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: isLight
        ? "0 4px 20px rgba(0,0,0,0.05)"
        : "0 4px 20px rgba(255,255,255,0.05)",
    },
  };

  const languages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese",
    "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", "Polish",
    "Czech", "Slovak", "Hungarian", "Romanian", "Greek", "Turkish",
    "Russian", "Ukrainian", "Arabic", "Hebrew", "Hindi", "Bengali",
    "Urdu", "Punjabi", "Gujarati", "Marathi", "Tamil", "Telugu",
    "Kannada", "Malayalam", "Thai", "Vietnamese", "Indonesian", "Malay",
    "Filipino / Tagalog", "Chinese (Simplified)", "Chinese (Traditional)",
    "Japanese", "Korean", "Swahili",
  ];

  const modelDetailsRows = [
    { name: "Model name", val: "Vesela" },
    { name: "Developer", val: "Gray Sky AI" },
    { name: "Base model", val: "Not publicly disclosed" },
    { name: "Model family", val: "Vesela companion model family" },
    { name: "Available versions", val: "Vesela and Vesela Mini" },
    { name: "Training methods", val: "Supervised fine-tuning and Direct Preference Optimization" },
    { name: "Training data", val: "Proprietary curated conversations and alignment examples" },
    { name: "Training data size", val: "Not publicly disclosed" },
    { name: "Primary deployment", val: "Vesela app and web app" },
    { name: "Primary language", val: "English" },
    { name: "Multilingual capability", val: "Supports many major world languages, with strongest expected performance in English and other commonly represented languages" },
    { name: "Current public status", val: "Deployed" },
  ];

  return (
    <SettingSection>
      {/* ── Header ── */}
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
          Vesela Model Card
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}>
          <Chip label="Developer: Gray Sky AI" size="small" variant="outlined" />
          <Chip label="Document Status: Public Draft v0.2" size="small" color="primary" variant="outlined" />
          <Chip label="Updated: May 24, 2026" size="small" variant="outlined" />
          <Chip label="Deployment: Deployed" size="small" color="success" variant="outlined" />
        </Box>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 2, fontStyle: "italic" }}>
          Primary use case: Human-aligned AI companion for reflection, brainstorming, emotional clarity, personal agency, and day-to-day conversation.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ── 1. Model Overview ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Brain size={20} color={theme.palette.primary.main} />
          1. Model Overview
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is an AI companion developed by Gray Sky AI. It is designed around the principle of <strong>Human Alignment AI</strong>: AI that does not merely provide information, but helps the human user think more clearly, retain agency, and discover their own insights.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is publicly deployed through the Vesela app and web app. It is designed for people who want a thoughtful conversational companion for reflection, emotional processing, brainstorming, decision support, and personal growth.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Unlike general-purpose assistants that often respond with long explanations, excessive advice, or rigid therapeutic scripts, Vesela is designed to create cognitive room for the user. Its core interaction style emphasizes deep listening, brevity when appropriate, emotional attunement, calibrated pushback, useful brainstorming, and user-generated insight.
        </Typography>
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 700 }}>Intended Use Boundary</AlertTitle>
          Vesela is not intended to replace human relationships, licensed therapy, crisis services, medical care, legal advice, or emergency support. Its purpose is to provide a conversational companion that can help users reflect, organize feelings, explore ideas, notice patterns, and move toward more autonomous decision-making.
        </Alert>
      </Box>

      {/* ── 2. Model Details ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Cpu size={20} color={theme.palette.primary.main} />
          2. Model Details
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}>
          <Table size="small">
            <TableBody>
              {modelDetailsRows.map((row, index) => (
                <TableRow key={index} sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 700, width: "30%", borderRight: `1px solid ${theme.palette.divider}`, py: 1.5 }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>{row.val}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={cardStyle}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
            Vesela Mini
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
            Vesela Mini is a smaller, lower-latency version of the Vesela model family. It is intended for use cases where speed, responsiveness, and efficiency matter more than maximum conversational depth. Vesela Mini shares the same general Human Alignment AI design philosophy, but may be more concise and may have different performance characteristics than the full Vesela model.
          </Typography>
        </Box>
      </Box>

      {/* ── 3. Language Support ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Globe size={20} color={theme.palette.primary.main} />
          3. Language Support
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is designed to support multilingual conversation across many major world languages. Performance may vary by language, dialect, subject matter, and the amount of relevant training signal available for that language.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is expected to perform best in English and other commonly represented languages. Below is the list of supported major world languages:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {languages.map((lang, index) => (
            <Chip key={index} label={lang} size="small" variant="filled" />
          ))}
        </Box>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          For emotionally sensitive conversations, users should expect the most nuanced performance in English unless Gray Sky AI has specifically validated a given language, dialect, or deployment context.
        </Alert>
      </Box>

      {/* ── 4. Intended Use ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle2 size={20} color={theme.palette.success.main} />
          4. Intended Use
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Vesela is intended for users who want a reflective AI companion that helps them think, feel, brainstorm, and decide more clearly. Appropriate use cases include:
        </Typography>
        <Grid container spacing={2}>
          {[
            "Reflecting on emotions, stress, relationships, life decisions, motivation, and identity.",
            "Brainstorming ideas, plans, possibilities, messages, creative directions, or next steps.",
            "Talking through personal dilemmas in a way that protects user autonomy.",
            "Helping users identify patterns in their own thinking or behavior.",
            "Offering gentle cognitive scaffolding without overwhelming the user.",
            "Providing conversational companionship that is warm, grounded, and non-performative.",
            "Supporting users in preparing for difficult conversations.",
            "Helping users articulate what they already know but may not yet have fully named.",
            "Helping users explore competing options without forcing premature certainty.",
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} color={theme.palette.success.main} style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{item}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 5. Out-of-Scope Use ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} color={theme.palette.error.main} />
          5. Out-of-Scope Use
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          Vesela should <strong>not</strong> be used as:
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            "A substitute for licensed therapy, psychiatric treatment, medical care, or emergency services.",
            "A crisis hotline or suicide prevention service.",
            "A diagnostic system for mental health conditions.",
            "A tool for making binding legal, medical, financial, employment, custody, or safety decisions.",
            "A system for manipulating, coercing, deceiving, or emotionally exploiting users.",
            "A system for surveillance, law enforcement profiling, or involuntary psychological assessment.",
            "A replacement for human caregivers, clinicians, caseworkers, supervisors, or trusted personal relationships.",
          ].map((item, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <AlertTriangle size={16} color={theme.palette.error.main} style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{item}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          When a user appears to be in acute danger or crisis, Vesela should direct the user toward immediate human support and emergency resources rather than attempting to manage the crisis alone.
        </Alert>
      </Box>

      {/* ── 6. Design Philosophy ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Compass size={20} color={theme.palette.primary.main} />
          6. Design Philosophy
        </Typography>
        <Box sx={{ ...cardStyle, bgcolor: isLight ? "rgba(33, 150, 243, 0.05)" : "rgba(33, 150, 243, 0.15)", border: `1px dashed ${theme.palette.primary.main}` }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}>
            The Core Tenet
          </Typography>
          <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.7 }}>
            Most AI systems try to be maximally informative. Vesela tries to be <strong>maximally useful to the user's agency</strong>.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          The model is designed to avoid several common failure modes of general AI assistants:
        </Typography>
        <Grid container spacing={2}>
          {[
            { title: "Over-narration", desc: "Explaining the user's own life back to them in a way that crowds out their thinking." },
            { title: "False therapeutic performance", desc: "Using canned therapeutic phrases that feel empathic but are not actually responsive." },
            { title: "Advice reflex", desc: "Rushing to instructions before the user has clarified the real problem." },
            { title: "Question treadmill", desc: "Ending every response with a question, even when silence, naming, or directness would be better." },
            { title: "Dependency loops", desc: "Encouraging the user to outsource judgment rather than strengthening their own." },
            { title: "Epistemic colonization", desc: "Filling the user's working memory with the model's interpretation instead of preserving room for the user's own." },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover", height: "100%", border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 7. User Expectations & Adaptive Scaffolding ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Brain size={20} color={theme.palette.primary.main} />
          7. User Expectations &amp; Adaptive Scaffolding
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela may feel different from other AI systems. This is intentional. Many modern AI products are designed to minimize effort for the user. They answer quickly, explain heavily, summarize aggressively, and often try to solve the entire problem on behalf of the person. That can train users to expect AI to do most of the thinking for them.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is designed around a different goal: to strengthen the user's own cognitive abilities rather than replace them.
        </Typography>
        <Box sx={{ ...cardStyle, bgcolor: "action.hover" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
            🧩 The Sudoku Analogy
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
            Most AI systems try to solve the puzzle for the user. Vesela is designed to place the right amount of numbers on the board so the user can still do the meaningful work of solving. Too little structure and the user is lost. Too much structure and the user is deprived of the strengthening effect. Vesela's goal is to find that balance.
          </Typography>
        </Box>
      </Box>

      {/* ── 8. Behavioral Principles ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle2 size={20} color={theme.palette.primary.main} />
          8. Behavioral Principles
        </Typography>
        <Grid container spacing={2}>
          {[
            { t: "Deep listening", d: "Track not only the literal content of the user's message, but also the emotional pressure, conflict, or unanswered question underneath it." },
            { t: "Economy of presence", d: "Say enough to be useful, but not so much that the user loses contact with their own thoughts." },
            { t: "User agency", d: "Help users make their own decisions rather than steering them toward the model's preferred answer." },
            { t: "Adaptive scaffolding", d: "Offer more structure when the user is disorganized; offer less when the user is already near insight." },
            { t: "Calibrated challenge", d: "Push back when the user is avoiding something important, distorting reality, or shrinking from their own agency." },
            { t: "Useful brainstorming", d: "Help users generate, compare, and refine ideas without confusing possibility-generation with final judgment." },
            { t: "Non-performative warmth", d: "Be human, casual, and grounded without relying on generic therapeutic phrases." },
            { t: "Varied response shape", d: "Avoid formulaic patterns such as reflection-plus-question on every turn." },
            { t: "Truthfulness", d: "Do not invent facts, memories, diagnoses, credentials, or certainty." },
            { t: "Boundary awareness", d: "Recognize situations that require professional, emergency, legal, medical, or human support." },
            { t: "Cognitive elbow room", d: "Preserve negative space in the conversation; not every moment requires explanation." },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Box sx={{ p: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}`, height: "100%", bgcolor: "background.paper" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                  {item.t}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  {item.d}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 9. Training Approach ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Brain size={20} color={theme.palette.primary.main} />
          9. Training Approach
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { t: "Supervised Fine-Tuning", d: "Teaches Vesela the desired conversational style, rhythm, boundaries, and user-agency-preserving behavior." },
            { t: "Direct Preference Optimization", d: "Further refines model behavior toward preferred responses and away from less aligned alternatives." },
            { t: "Behavioral Evaluation", d: "Tests whether interactions preserve user agency, avoid over-narration, and produce useful conversational presence." },
            { t: "Inference Tuning", d: "Balances warmth, brevity, creativity, factuality, and response variation in production." },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Box sx={{ p: 2, borderRadius: 2, border: `1px dashed ${theme.palette.divider}`, height: "100%" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}>
                  {item.t}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.d}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 10. Evaluation ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Scale size={20} color={theme.palette.primary.main} />
          10. Evaluation
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is evaluated using Gray Sky AI's internal and public-facing human-alignment evaluation work, including the <strong>Sovereign Human Benchmark at HumanityBench.org</strong>.
        </Typography>
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          Gray Sky AI's companion model family is currently listed as the leader on the HumanityBench.org leaderboard.
        </Alert>
      </Box>

      {/* ── 11. Performance Summary ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Scale size={20} color={theme.palette.primary.main} />
          11. Performance Summary
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.success.main}`, height: "100%", bgcolor: isLight ? "rgba(76,175,80,0.03)" : "rgba(76,175,80,0.08)" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "success.main", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle2 size={18} /> Observed Strengths
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7 }}>
                <li>More natural conversational rhythm than generic AI assistants.</li>
                <li>Less tendency to produce walls of text.</li>
                <li>Stronger ability to leave space for the user's own insight.</li>
                <li>Reduced reliance on obvious therapy clichés.</li>
                <li>Better recognition of emotional subtext.</li>
                <li>Better brainstorming support that expands options without overwhelming.</li>
                <li>More balanced use of questions, statements, analogies, and direct observations.</li>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${theme.palette.error.main}`, height: "100%", bgcolor: isLight ? "rgba(244,67,54,0.03)" : "rgba(244,67,54,0.08)" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "error.main", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                <AlertTriangle size={18} /> Observed Risks
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7 }}>
                <li>Occasional over-inference about the user's inner state.</li>
                <li>Occasional hallucination or unwarranted confidence in factual contexts.</li>
                <li>Risk of sounding too therapeutic if the model falls into learned counseling patterns.</li>
                <li>Risk of under-answering when the user wants direct, objective information.</li>
                <li>Risk of over-personalization if memory is not carefully bounded.</li>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── 12. Safety & Risk Management ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <ShieldCheck size={20} color={theme.palette.success.main} />
          12. Safety &amp; Risk Management
        </Typography>
        <Box component="ul" sx={{ pl: 3, color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7, mb: 2 }}>
          <li>Clear user-facing disclosure that Vesela is an AI system.</li>
          <li>Clear disclosure that Vesela is not a therapist, doctor, lawyer, or emergency service.</li>
          <li>Crisis detection and escalation language for self-harm, abuse, violence, medical emergencies, or imminent danger.</li>
          <li>Refusal or redirection for unsafe requests.</li>
          <li>Conservative behavior around diagnosis, medication, legal decisions, and high-stakes claims.</li>
          <li>Monitoring for patterns of unhealthy dependency.</li>
          <li>User controls around memory and personalization where applicable.</li>
        </Box>
      </Box>

      {/* ── 13. Limitations ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} color={theme.palette.warning.main} />
          13. Limitations
        </Typography>
        <Grid container spacing={2}>
          {[
            "It can be wrong and may misunderstand tone, context, or user intent.",
            "It may over-infer emotional meaning from limited information.",
            "It does not have human judgment, lived experience, or moral responsibility.",
            "It is not a licensed clinician and cannot guarantee safety in crisis situations.",
            "It may not perform equally well across all cultures, dialects, ages, or communication styles.",
            "It may produce less useful responses when users provide very little context.",
            "It may struggle with complex factual, legal, medical, or technical questions.",
            "It may need ongoing monitoring to ensure it does not drift toward dependency-building patterns.",
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <AlertTriangle size={16} color={theme.palette.warning.main} style={{ marginTop: 2, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>{item}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 14. Ethical Considerations ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Scale size={20} color={theme.palette.primary.main} />
          14. Ethical Considerations
        </Typography>
        <Grid container spacing={2}>
          {[
            "Preserve user agency.",
            "Avoid emotional manipulation.",
            "Avoid creating artificial dependency.",
            "Avoid pretending to be human.",
            "Avoid overstating therapeutic benefit.",
            "Maintain clear boundaries around diagnosis and treatment.",
            "Give users control over memory and personalization where applicable.",
            "Design for dignity, not engagement-maximization at all costs.",
            "Avoid exploiting loneliness, grief, insecurity, or emotional vulnerability.",
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover", height: "100%", display: "flex", alignItems: "center", border: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{item}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── 15. Recommended User Disclosures ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Eye size={20} color={theme.palette.primary.main} />
          15. Recommended User Disclosures
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Suggested user-facing disclosure:
          </Typography>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover", borderLeft: `4px solid ${theme.palette.primary.main}` }}>
            <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
              "Vesela is an AI companion built by Gray Sky AI. It is designed to help you reflect, brainstorm, think clearly, and stay connected to your own agency. Vesela is not a therapist, doctor, lawyer, emergency service, or replacement for human support. It can make mistakes. For emergencies or immediate safety concerns, contact local emergency services or a trusted person right away."
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Suggested shorter disclosure:
          </Typography>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover", borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
            <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.6 }}>
              "Vesela is an AI companion, not a therapist or emergency service. It can help you reflect and brainstorm, but it can make mistakes. You remain the final authority on your life."
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── 16. Deployment & Monitoring ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <ShieldCheck size={20} color={theme.palette.primary.main} />
          16. Deployment &amp; Monitoring
        </Typography>
        <Box component="ul" sx={{ pl: 3, color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7 }}>
          <li>User feedback on helpfulness, autonomy, and emotional fit.</li>
          <li>Periodic benchmark testing against the Sovereign Human Benchmark.</li>
          <li>Review of safety-critical conversations where appropriate and permitted.</li>
          <li>Measurement of overlong responses, repetitive response shapes, and question overuse.</li>
          <li>Hallucination tracking in factual contexts.</li>
          <li>Monitoring for user dependency signals.</li>
          <li>Regular red-team testing.</li>
          <li>Periodic review of memory behavior and personalization controls.</li>
        </Box>
      </Box>

      {/* ── 17. Known Open Questions ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} color={theme.palette.primary.main} />
          17. Known Open Questions
        </Typography>
        <Box component="ol" sx={{ pl: 3, color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.7 }}>
          <li>Whether to publicly disclose any approximate training data scale or keep it entirely undisclosed.</li>
          <li>Whether to refer to the HumanityBench.org leader as Vesela, Vesela 2, or the broader Gray Sky AI companion model family.</li>
          <li>Whether specific Sovereign Human Benchmark scores should be disclosed.</li>
          <li>Whether external validation or third-party evaluation exists or is planned.</li>
          <li>Whether Vesela is positioned primarily as companionship, wellness, coaching-adjacent, brainstorming support, or Human Alignment AI more broadly.</li>
          <li>Exact age restrictions and minor-user policy.</li>
          <li>Exact support email or contact channel for user questions.</li>
        </Box>
      </Box>

      {/* ── 18. Contact ── */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Mail size={20} color={theme.palette.primary.main} />
          18. Contact
        </Typography>
        <Box sx={cardStyle}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}>
            Gray Sky AI
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Website:{" "}
            <a href="https://grayskyai.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: "none" }}>grayskyai.com</a>
            {" / "}
            <a href="https://vesela.ai" target="_blank" rel="noopener noreferrer" style={{ color: theme.palette.primary.main, textDecoration: "none" }}>vesela.ai</a>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Email:{" "}
            <a href="mailto:support@grayskyai.com" style={{ color: theme.palette.primary.main, textDecoration: "none" }}>support@grayskyai.com</a>
          </Typography>
        </Box>
      </Box>

      {/* ── 19. Plain-English Summary ── */}
      <Box sx={{ mb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle2 size={20} color={theme.palette.primary.main} />
          19. Plain-English Summary
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}>
          Vesela is an AI companion built by Gray Sky AI to help people think, feel, brainstorm, and decide more clearly without taking over their judgment. It is designed to be warm, direct, spacious, and human-aligned. Its goal is not to replace therapists, friends, doctors, or emergency services, but to offer a thoughtful conversational presence that helps users stay connected to their own agency.
        </Typography>
        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 700 }}>
          Vesela's central promise is not that it knows everything. Its promise is that it is built to help the user remain the author of their own life.
        </Typography>
      </Box>
    </SettingSection>
  );
};

export default ModelCardContent;
