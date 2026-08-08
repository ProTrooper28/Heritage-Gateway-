import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { askHistorian, type ChatMessage } from "@/lib/gemini";
import { IS_DEMO_MODE } from "@/lib/mockHistorian";

// ─── Design tokens (matching existing app palette) ────────────────────────────

const GOLD = "oklch(0.79 0.11 82)";
const GOLD_DIM = "oklch(0.79 0.11 82 / 0.6)";
const PARCHMENT = "oklch(0.96 0.012 85)";
const INK = "oklch(0.13 0.008 60)";
const GLASS_BG =
  "linear-gradient(150deg, oklch(0.96 0.012 85 / 0.07), oklch(0.13 0.008 60 / 0.85))";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Suggested Prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "Tell me about this monument",
  "What are the hidden facts?",
  "Architectural secrets",
  "Give me a timeline",
  "Who built this and why?",
  "What if...? (speculative history)",
  "Tell me about the dynasty",
  "UNESCO Heritage Sites in India",
  "Ancient science & engineering",
  "Art & sculpture styles",
];

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return (
    text
      // Did You Know box
      .replace(
        /🏛️\s*\*\*Did You Know\?\*\*(.*?)(?=\n\n|\n(?=[A-Z*#🏛️⚔️🌀🌍])|\s*$)/gs,
        (_, content) =>
          `<div class="ai-did-you-know"><span class="ai-dyk-icon">🏛️</span><strong>Did You Know?</strong>${content.trim()}</div>`,
      )
      // Section headers with emoji
      .replace(
        /\*\*([⚔️🌀🌍][^*]+)\*\*/g,
        '<h3 class="ai-section-header">$1</h3>',
      )
      // Bold
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Unordered list items
      .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
      // Headers (##)
      .replace(/^##\s+(.+)$/gm, '<h4 class="ai-h4">$1</h4>')
      // Line breaks
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>")
  );
}

function MarkdownContent({ text }: { text: string }) {
  const html = renderMarkdown(text);
  return (
    <div
      className="ai-markdown"
      dangerouslySetInnerHTML={{
        __html: `<p>${html}</p>`,
      }}
    />
  );
}

// ─── Typing Animation ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <span className="ai-typing-dots">
      <span />
      <span />
      <span />
    </span>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy response"
      className="ai-copy-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.75rem",
        height: "1.75rem",
        borderRadius: "0.5rem",
        border: `1px solid oklch(0.79 0.11 82 / 0.2)`,
        background: copied
          ? "oklch(0.79 0.11 82 / 0.15)"
          : "oklch(0.96 0.012 85 / 0.04)",
        color: copied ? GOLD : "oklch(0.96 0.012 85 / 0.4)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage & { id: string; isError?: boolean };
  isStreaming?: boolean;
}) {
  const isBot = message.role === "model";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: isBot ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: "0.75rem",
        marginBottom: "1.5rem",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isBot
            ? `linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.08))`
            : "oklch(0.96 0.012 85 / 0.1)",
          border: isBot
            ? "1px solid oklch(0.79 0.11 82 / 0.4)"
            : "1px solid oklch(0.96 0.012 85 / 0.15)",
          color: isBot ? GOLD : "oklch(0.96 0.012 85 / 0.6)",
        }}
      >
        {isBot ? (
          <Bot size={13} strokeWidth={1.5} />
        ) : (
          <span
            style={{
              fontSize: "0.65rem",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontWeight: 500,
              letterSpacing: "0.05em",
            }}
          >
            YOU
          </span>
        )}
      </div>

      {/* Bubble + copy button */}
      <div
        style={{
          flex: 1,
          maxWidth: isBot ? "80%" : "70%",
        }}
      >
        {/* Bubble */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: isBot ? "0.25rem 1.25rem 1.25rem 1.25rem" : "1.25rem 0.25rem 1.25rem 1.25rem",
            background: isBot
              ? message.isError
                ? "linear-gradient(145deg, oklch(0.4 0.15 27 / 0.15), oklch(0.13 0.008 60 / 0.7))"
                : "linear-gradient(145deg, oklch(0.79 0.11 82 / 0.07), oklch(0.13 0.008 60 / 0.75))"
              : "linear-gradient(145deg, oklch(0.96 0.012 85 / 0.09), oklch(0.13 0.008 60 / 0.8))",
            border: isBot
              ? message.isError
                ? "1px solid oklch(0.4 0.15 27 / 0.4)"
                : "1px solid oklch(0.79 0.11 82 / 0.18)"
              : "1px solid oklch(0.96 0.012 85 / 0.1)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 20px oklch(0 0 0 / 0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Gold shimmer top on bot messages */}
          {isBot && !message.isError && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.4), transparent)",
              }}
            />
          )}

          {/* Content */}
          {isBot ? (
            message.isError ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "oklch(0.7 0.15 27)",
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{message.text}</span>
              </div>
            ) : isStreaming ? (
              <div>
                {message.text ? (
                  <MarkdownContent text={message.text} />
                ) : (
                  <TypingDots />
                )}
              </div>
            ) : (
              <MarkdownContent text={message.text} />
            )
          ) : (
            <p
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.85rem",
                lineHeight: 1.65,
                color: "oklch(0.96 0.012 85 / 0.85)",
                margin: 0,
              }}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Copy button for bot messages */}
        {isBot && !isStreaming && !message.isError && message.text && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: "0.4rem",
              paddingLeft: "0.25rem",
            }}
          >
            <CopyButton text={message.text} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "300px",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "4rem",
          height: "4rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.2), oklch(0.79 0.11 82 / 0.05))",
          border: "1px solid oklch(0.79 0.11 82 / 0.35)",
          marginBottom: "1.5rem",
          boxShadow: "0 0 32px oklch(0.79 0.11 82 / 0.15)",
        }}
      >
        <Bot size={22} style={{ color: GOLD }} strokeWidth={1.5} />
      </div>

      <h3
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: "1.6rem",
          fontWeight: 300,
          color: PARCHMENT,
          letterSpacing: "-0.02em",
          marginBottom: "0.5rem",
        }}
      >
        Heritage AI Historian
      </h3>
      <p
        style={{
          fontFamily: "'Jost', system-ui, sans-serif",
          fontSize: "0.78rem",
          lineHeight: 1.7,
          color: "oklch(0.96 0.012 85 / 0.45)",
          maxWidth: "28rem",
          marginBottom: "2rem",
        }}
      >
        Ask me anything about India's monuments, dynasties, architecture, and
        cultural legacy. I can also explore fascinating "What if?" scenarios
        from history.
      </p>

      {/* Quick-start prompts */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          maxWidth: "32rem",
        }}
      >
        {SUGGESTED_PROMPTS.slice(0, 6).map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPrompt(prompt)}
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "2rem",
              border: "1px solid oklch(0.79 0.11 82 / 0.22)",
              background: "oklch(0.79 0.11 82 / 0.06)",
              color: "oklch(0.96 0.012 85 / 0.7)",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.72rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.79 0.11 82 / 0.14)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.79 0.11 82 / 0.45)";
              (e.currentTarget as HTMLButtonElement).style.color = PARCHMENT;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.79 0.11 82 / 0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.79 0.11 82 / 0.22)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.96 0.012 85 / 0.7)";
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type AIHistorianProps = {
  monumentContext?: string | undefined;
  onClearMonumentContext?: (() => void) | undefined;
};

// ─── Internal message type ────────────────────────────────────────────────────

type InternalMessage = ChatMessage & { id: string; isError?: boolean };

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIHistorian({
  monumentContext,
  onClearMonumentContext,
}: AIHistorianProps) {
  const [messages, setMessages] = useState<InternalMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [retryPayload, setRetryPayload] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or streaming text updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingId]);

  // ── Send message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || isLoading) return;

      setInput("");
      setRetryPayload(null);

      const userMsg: InternalMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Placeholder bot message for streaming
      const botId = `b-${Date.now()}`;
      const botMsg: InternalMessage = { id: botId, role: "model", text: "" };
      setMessages((prev) => [...prev, botMsg]);
      setStreamingId(botId);

      try {
        // Build conversation history (exclude the empty placeholder bot msg)
        const historyForApi: ChatMessage[] = [
          ...messages.map(({ role, text }) => ({ role, text })),
          { role: "user", text: trimmed },
        ];

        const result = await askHistorian({
          data: {
            messages: historyForApi,
            monumentContext: monumentContext || undefined,
          },
        });

        // Simulate streaming by progressively revealing text
        const fullText = result.text;
        const CHUNK_SIZE = 6;
        const DELAY_MS = 18;

        for (let i = 0; i <= fullText.length; i += CHUNK_SIZE) {
          const chunk = fullText.slice(0, i);
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, text: chunk } : m)),
          );
          await new Promise((r) => setTimeout(r, DELAY_MS));
        }

        // Ensure full text is set
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: fullText } : m)),
        );
      } catch (err) {
        let errorText = "An unexpected error occurred. Please try again.";
        if (err instanceof Error) {
          if (IS_DEMO_MODE) {
            errorText = `Demo Mode Error: ${err.message}`;
          } else {
            errorText = err.message.includes("VITE_GEMINI_API_KEY")
              ? "⚠️ API key not configured. Please add VITE_GEMINI_API_KEY to your .env file and restart the dev server."
              : err.message.includes("quota") || err.message.includes("429")
                ? "The historian is catching their breath — rate limit reached. Please try again in a moment."
                : err.message.includes("network") || err.message.includes("fetch")
                  ? "Couldn't reach the archives right now. Check your connection and try again."
                  : `Something went wrong: ${err.message}`;
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, text: errorText, isError: true } : m,
          ),
        );
        setRetryPayload(trimmed);
      } finally {
        setIsLoading(false);
        setStreamingId(null);
        inputRef.current?.focus();
      }
    },
    [isLoading, messages, monumentContext],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleClearChat() {
    setMessages([]);
    setInput("");
    setRetryPayload(null);
    setIsLoading(false);
    setStreamingId(null);
  }

  function handleSuggestedPrompt(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  const hasMessages = messages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 6rem)",
        maxHeight: "900px",
        minHeight: "500px",
        position: "relative",
        zIndex: 10,
        paddingTop: "5rem",
      }}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, oklch(0.79 0.11 82 / 0.25), oklch(0.79 0.11 82 / 0.08))",
              border: "1px solid oklch(0.79 0.11 82 / 0.4)",
              boxShadow: "0 0 20px oklch(0.79 0.11 82 / 0.15)",
            }}
          >
            <Bot size={16} style={{ color: GOLD }} strokeWidth={1.5} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Jost', system-ui, sans-serif",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.35em",
                color: GOLD_DIM,
                marginBottom: "0.15rem",
              }}
            >
              Heritage AI
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "1.35rem",
                fontWeight: 300,
                color: PARCHMENT,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              AI Historian
            </h2>
            {IS_DEMO_MODE && (
              <span
                style={{
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.55rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: GOLD,
                  background: "oklch(0.79 0.11 82 / 0.1)",
                  border: "1px solid oklch(0.79 0.11 82 / 0.3)",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "0.5rem",
                  marginLeft: "0.5rem",
                  verticalAlign: "middle",
                }}
              >
                Demo Mode
              </span>
            )}
          </div>

          {/* Monument context badge */}
          <AnimatePresence>
            {monumentContext && (
              <motion.div
                key="monument-badge"
                initial={{ opacity: 0, scale: 0.85, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -8 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "2rem",
                  background: "oklch(0.79 0.11 82 / 0.12)",
                  border: "1px solid oklch(0.79 0.11 82 / 0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Sparkles
                  size={11}
                  style={{ color: GOLD, flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "'Jost', system-ui, sans-serif",
                    fontSize: "0.65rem",
                    color: GOLD,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {monumentContext}
                </span>
                {onClearMonumentContext && (
                  <button
                    onClick={onClearMonumentContext}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      color: "oklch(0.79 0.11 82 / 0.6)",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <X size={11} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear chat button */}
        {hasMessages && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClearChat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "2rem",
              border: "1px solid oklch(0.96 0.012 85 / 0.12)",
              background: "oklch(0.96 0.012 85 / 0.04)",
              color: "oklch(0.96 0.012 85 / 0.45)",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.4 0.15 27 / 0.4)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.7 0.15 27)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.4 0.15 27 / 0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "oklch(0.96 0.012 85 / 0.12)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.96 0.012 85 / 0.45)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "oklch(0.96 0.012 85 / 0.04)";
            }}
          >
            <Trash2 size={12} />
            Clear Chat
          </motion.button>
        )}
      </motion.div>

      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "1.5rem",
          border: "1px solid oklch(0.79 0.11 82 / 0.14)",
          background: GLASS_BG,
          backdropFilter: "blur(28px) saturate(140%)",
          boxShadow:
            "0 32px 80px -24px oklch(0 0 0 / 0.55), inset 0 1px 0 oklch(0.96 0.012 85 / 0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Gold shimmer line — top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.45), transparent)",
            zIndex: 1,
          }}
        />

        {/* ── Messages area ─────────────────────────────────────────────── */}
        <div
          ref={listRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem 1.75rem",
            scrollbarWidth: "thin",
            scrollbarColor: "oklch(0.79 0.11 82 / 0.15) transparent",
          }}
        >
          {hasMessages ? (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={streamingId === msg.id}
                />
              ))}
              {/* Retry button after error */}
              <AnimatePresence>
                {retryPayload && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <button
                      onClick={() => sendMessage(retryPayload)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.5rem 1rem",
                        borderRadius: "2rem",
                        border: "1px solid oklch(0.79 0.11 82 / 0.25)",
                        background: "oklch(0.79 0.11 82 / 0.08)",
                        color: GOLD,
                        fontFamily: "'Jost', system-ui, sans-serif",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <RefreshCw size={12} />
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </>
          ) : (
            <EmptyState onPrompt={handleSuggestedPrompt} />
          )}
        </div>

        {/* ── Suggested prompts strip ───────────────────────────────────── */}
        <div
          style={{
            padding: "0 1.75rem 0.75rem",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              flexWrap: "nowrap",
              minWidth: "max-content",
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSuggestedPrompt(prompt)}
                disabled={isLoading}
                style={{
                  padding: "0.35rem 0.8rem",
                  borderRadius: "2rem",
                  border: "1px solid oklch(0.79 0.11 82 / 0.18)",
                  background: "oklch(0.79 0.11 82 / 0.04)",
                  color: "oklch(0.96 0.012 85 / 0.55)",
                  fontFamily: "'Jost', system-ui, sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.02em",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  opacity: isLoading ? 0.4 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "oklch(0.79 0.11 82 / 0.1)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "oklch(0.79 0.11 82 / 0.35)";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      PARCHMENT;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.79 0.11 82 / 0.04)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "oklch(0.79 0.11 82 / 0.18)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.96 0.012 85 / 0.55)";
                }}
              >
                <ChevronRight size={10} style={{ opacity: 0.6 }} />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            margin: "0 1.5rem",
            background:
              "linear-gradient(90deg, transparent, oklch(0.79 0.11 82 / 0.12), transparent)",
          }}
        />

        {/* ── Input area ────────────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.25rem",
          }}
        >
          <textarea
            ref={inputRef}
            id="ai-historian-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about monuments, dynasties, architecture… or try a 'What if?'"
            rows={1}
            disabled={isLoading}
            style={{
              flex: 1,
              resize: "none",
              background: "oklch(0.96 0.012 85 / 0.04)",
              border: "1px solid oklch(0.79 0.11 82 / 0.2)",
              borderRadius: "0.9rem",
              padding: "0.75rem 1rem",
              fontFamily: "'Jost', system-ui, sans-serif",
              fontSize: "0.83rem",
              lineHeight: 1.5,
              color: PARCHMENT,
              outline: "none",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              maxHeight: "120px",
              overflowY: "auto",
              scrollbarWidth: "none",
              opacity: isLoading ? 0.6 : 1,
            }}
            onFocus={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor =
                "oklch(0.79 0.11 82 / 0.45)";
              (e.target as HTMLTextAreaElement).style.boxShadow =
                "0 0 0 1px oklch(0.79 0.11 82 / 0.15), 0 0 20px oklch(0.79 0.11 82 / 0.08)";
            }}
            onBlur={(e) => {
              (e.target as HTMLTextAreaElement).style.borderColor =
                "oklch(0.79 0.11 82 / 0.2)";
              (e.target as HTMLTextAreaElement).style.boxShadow = "none";
            }}
            onInput={(e) => {
              // Auto-expand textarea
              const el = e.currentTarget as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />

          {/* Send button */}
          <motion.button
            type="submit"
            id="ai-historian-send"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2.75rem",
              height: "2.75rem",
              borderRadius: "0.9rem",
              border: "none",
              background:
                input.trim() && !isLoading
                  ? "linear-gradient(135deg, oklch(0.79 0.11 82), oklch(0.75 0.13 70))"
                  : "oklch(0.79 0.11 82 / 0.12)",
              color:
                input.trim() && !isLoading
                  ? INK
                  : "oklch(0.79 0.11 82 / 0.35)",
              cursor:
                !input.trim() || isLoading ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              flexShrink: 0,
              boxShadow:
                input.trim() && !isLoading
                  ? "0 4px 16px oklch(0.79 0.11 82 / 0.35)"
                  : "none",
            }}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={16} strokeWidth={2} />
              </motion.div>
            ) : (
              <Send size={15} strokeWidth={2} />
            )}
          </motion.button>
        </form>

        {/* Hint */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "'Jost', system-ui, sans-serif",
            fontSize: "0.58rem",
            color: "oklch(0.96 0.012 85 / 0.2)",
            letterSpacing: "0.04em",
            padding: "0 1.25rem 0.85rem",
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </motion.div>
  );
}
