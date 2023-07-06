const INDICATOR_TYPE = {
  TALKING: "talking",
  SILENT: "silent",
  GENERATING: "generating",
  IDLE: "idle",
};

export function ChatMessage({ text, isUser, indicator }: any) {
  return (
    <div className="w-full">
      <div className="flex gap-4 p-4 m-auto text-base">
        <div className="flex flex-col gap-2">
          <div
            className={
              "flex items-center justify-center w-8 h-8 min-w-8 mih-h-8 " +
              (isUser ? "fill-yellow-500" : "fill-primary")
            }
          >
            {isUser ? <UserIcon /> : <BotIcon />}
          </div>
          {indicator == INDICATOR_TYPE.TALKING && (
            <TalkingSpinner isUser={isUser} />
          )}
          {indicator == INDICATOR_TYPE.GENERATING && <LoadingSpinner />}
        </div>
        <div>
          <div
            className={
              "whitespace-pre-wrap rounded px-3 py-1.5 max-w-[600px] bg-zinc-800 border " +
              (!text
                ? " pulse text-sm text-zinc-300 border-gray-600"
                : isUser
                ? " text-zinc-100 border-yellow-500"
                : " text-zinc-100 border-primary")
            }
          >
            {text ||
              (isUser
                ? "Speak into your microphone to talk to the bot..."
                : "Bot is typing...")}
          </div>
        </div>
      </div>
    </div>
  );
}

function BotIcon() {
  return (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
    >
      {/*! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.*/}
      <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
    >
      {/*! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc.*/}
      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
    </svg>
  );
}

function TalkingSpinner({ isUser }: any) {
  return (
    <div className={"flex items-center justify-center"}>
      <div
        className={
          "talking [&>span]:" + (isUser ? "bg-yellow-500" : "bg-primary")
        }
      >
        {" "}
        <span /> <span /> <span />{" "}
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="scale-[0.2] w-6 h-6 flex items-center justify-center">
      <div className="lds-spinner [&>div:after]:bg-zinc-200">
        {[...Array(12)].map((_, i) => (
          <div key={i}></div>
        ))}
      </div>
    </div>
  );
}
