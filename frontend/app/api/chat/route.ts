import { EmbedChain } from "@/app/import/embeddings";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

// export const runtime = "edge";

export async function POST(req: Request) {
  var { messages } = await req.json();

  const query = messages[messages.length - 1].content;

  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const prompt = await embedchain.query(query);

  messages = [{ role: "user", content: prompt }];

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
