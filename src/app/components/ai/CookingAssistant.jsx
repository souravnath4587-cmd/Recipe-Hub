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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // v7 useChat does NOT manage the input - that is the `input` state above.
  const { messages, sendMessage, status, error, regenerate } = useChat({
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

  // Signed-in users only, matching the access decision for AI features.
  // Logged-out visitors never see the launcher at all.
  //
  // `mounted` guards hydration: the server renders nothing (it cannot see the
  // client-side session), so the first client render must render nothing too.
  if (!hydrated || !session?.user) return null;

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
        className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-linear-to-r from-orange-500 to-red-500 text-white shadow-xl"
      >
        <FiMessageCircle size={22} />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <FiMessageCircle className="text-orange-500" />
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
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
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
                  ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-orange-500 px-3 py-2 text-sm text-white"
                  : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-zinc-100 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
              }
            >
              <MessageText message={message} />
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <p className="text-xs text-zinc-400">Thinking...</p>
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
        className="flex items-center gap-2 border-t border-zinc-200 px-3 py-3 dark:border-zinc-800"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a cooking question..."
          maxLength={500}
          className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 dark:border-zinc-700"
        />
        <Button
          type="submit"
          isIconOnly
          radius="lg"
          aria-label="Send message"
          isDisabled={isBusy || !input.trim()}
          className="bg-orange-500 text-white disabled:opacity-50"
        >
          <FiSend className={isBusy ? "animate-pulse" : undefined} />
        </Button>
      </form>
    </div>
  );
}
