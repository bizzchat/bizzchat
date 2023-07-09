"use client";

import { ChatMessage } from "@/app/chat/_components/chat-message";
import { Message, useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  let message: Message = {
    id: "1",
    content:
      "Hi! I'm a language model running on Modal. Talk to me using your microphone, and remember to turn your speaker volume up!",
    role: "assistant",
  };
  messages.push(message);

  message = {
    id: "2",
    content:
      "Speak into your microphone to talk to the bot. ElisOCK. Do you want a little bit of it? Hello. Okay. We're done.",
    role: "user",
  };
  messages.push(message);

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
            <input
              className="w-full p-2 mb-8 text-white border border-gray-300 rounded shadow-xl focus:ring-0 focus-visible:ring-0 bg-zinc-700 border-gray-900/50"
              value={input}
              placeholder="Send a message..."
              onChange={handleInputChange}
            />
            <button className="absolute p-1 text-white transition-colors rounded-md md:bottom-9 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple bottom-8 disabled:opacity-40">
              <span className="" data-state="closed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4 m-1 md:m-0"
                  stroke-width="2"
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
