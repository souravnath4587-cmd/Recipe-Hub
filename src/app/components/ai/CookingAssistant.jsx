"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@heroui/react";
import { FiMessageCircle, FiX, FiSend, FiRefreshCw } from "react-icons/fi";
import { authClient } from "@/app/lib/auth-client";
import { useHydrated } from "@/app/lib/useHydrated";

// Renders a UI message. In AI SDK v7 a message carries `parts`, not `content`.
function MessageText({ message }) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part, i) => <span key={i}>{part.text}</span>);
}

export default function CookingAssistant() {
  const { data: session } = authClient.useSession();
  const hydrated = useHydrated();

  // Signed-in users only, matching the access decision for AI features.
  // Logged-out visitors never see the launcher at all.
  //
  // `hydrated` guards hydration: the server renders nothing (it cannot see the
  // client-side session), so the first client render must render nothing too.
  if (!hydrated || !session?.user) return null;

  // This component lives in the root layout and sign-out/sign-in happen without
  // a page reload, so without the key one user's conversation (and the history
  // sent to the model as context) would carry over to the next user in the same
  // tab. Keying by user id remounts the panel with a fresh chat per user.
  return <AssistantPanel key={session.user.id} userId={session.user.id} />;
}

function AssistantPanel({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // v7 useChat does NOT manage the input - that is the `input` state above.
  // `id` scopes the Chat instance to this user; a new id creates a new Chat.
  const { messages, sendMessage, status, error, regenerate } = useChat({
    id: `cooking-assistant-${userId}`,
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  // Length of the streaming reply, so the effect re-runs on every chunk rather
  // than only when a whole message is appended.
  const lastLength =
    messages[messages.length - 1]?.parts?.reduce(
      (n, part) => n + (part.text?.length ?? 0),
      0
    ) ?? 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Instant, not smooth: smooth scrolling cannot keep up with token streaming
    // and leaves the newest text below the fold.
    el.scrollTop = el.scrollHeight;
  }, [messages.length, lastLength, status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  if (!isOpen) {
    return (
      <Button
        isIconOnly
        radius="full"
        aria-label="Open cooking assistant"
        onPress={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-linear-to-r from-brand to-brand-strong text-accent-foreground shadow-xl"
      >
        <FiMessageCircle size={22} />
      </Button>
    );
  }

  return (
    // max-h keeps the panel inside short viewports (landscape phones, small
    // laptops) where a fixed 32rem would run off the top of the screen.
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-128 max-h-[calc(100dvh-2rem)] w-88 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-overlay text-overlay-foreground shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <FiMessageCircle className="text-brand" />
          <span className="text-sm font-semibold">Cooking Assistant</span>
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          aria-label="Close cooking assistant"
          onPress={() => setIsOpen(false)}
        >
          <FiX />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-xs text-default-500">
            Ask about substitutions, scaling a recipe, technique or storage. I only
            help with cooking.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-accent px-3 py-2 text-sm text-accent-foreground"
                  : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-default px-3 py-2 text-sm text-default-foreground"
              }
            >
              <MessageText message={message} />
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <p className="text-xs text-default-500">Thinking...</p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-xs text-danger">
            <span>Something went wrong.</span>
            {/* Gemini capacity errors are transient, so always offer a retry. */}
            <Button size="sm" variant="light" onPress={() => regenerate()}>
              <span className="flex items-center gap-1">
                <FiRefreshCw /> Retry
              </span>
            </Button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a cooking question..."
          maxLength={500}
          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-default-400"
        />
        <Button
          type="submit"
          isIconOnly
          radius="lg"
          aria-label="Send message"
          isDisabled={isBusy || !input.trim()}
          className="bg-accent text-accent-foreground disabled:opacity-50"
        >
          <FiSend className={isBusy ? "animate-pulse" : undefined} />
        </Button>
      </form>
    </div>
  );
}
