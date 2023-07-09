"use client";

import { ChatMessage } from "@/app/chat/_components/chat-message";
import { Input } from "@/components/ui/input";
import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center w-full p-4 mx-auto grow">
        <div className="w-full max-w-2xl stretch">
          {messages.length > 0
            ? messages.map((msg, i) => (
                <ChatMessage
                  key={i}
                  text={msg.content}
                  isUser={i % 2 == 1}
                  indicator={"silent"}
                />
              ))
            : null}
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col items-center w-full p-4 mx-auto bg-zinc-900">
        <div className="w-full max-w-2xl stretch">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              className="mb-8"
              value={input}
              placeholder="Send a message..."
              onChange={handleInputChange}
            />
            <button className="absolute p-1 text-white transition-colors rounded-md right-2 disabled:text-gray-400 enabled:bg-brand-purple bottom-2 disabled:opacity-40">
              <span data-state="closed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4 m-1 md:m-0"
                  strokeWidth="2"
                >
                  <path
                    d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
