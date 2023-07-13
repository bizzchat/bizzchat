"use client";

import { Separator } from "@radix-ui/react-select";
import { useChat } from "ai/react";
import { ChatMessage } from "./_components/chat-message";
import { ChatPanel } from "./_components/chat-panel";

export default function Chat() {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages: [
        {
          role: "assistant",
          content: "Hi there! How can I help you?",
          id: "1",
        },
      ],
    });

  return (
    <div>
      <div className="flex flex-col items-center w-full mx-auto grow">
        <div className="w-full max-w-3xl stretch pb-[200px] pt-10">
          {messages.map((message, index) => (
            <div key={index}>
              <ChatMessage message={message} />
              {index < messages.length - 1 && (
                <Separator className="my-8 shrink-0 bg-border h-[1px] w-full" />
              )}
            </div>
          ))}
        </div>
      </div>
      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </div>
  );
}
