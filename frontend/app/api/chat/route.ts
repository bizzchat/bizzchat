import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

// export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { stream, handlers } = LangChainStream();

  const llm = new ChatOpenAI({
    streaming: true,
  });

  llm
    .call(
      (messages as Message[]).map((m) =>
        m.role == "user"
          ? new HumanChatMessage(m.content)
          : new AIChatMessage(m.content)
      ),
      {},
      [handlers]
    )
    .catch(console.error);

  return new StreamingTextResponse(stream);
}
