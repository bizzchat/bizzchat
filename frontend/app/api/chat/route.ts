import { EmbedChain } from "@/app/api/import/embeddings";
import { LangChainStream, Message, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// Hardcoded - need to be pass from client side
const datastore_name = "private";

export async function POST(req: Request) {
  var { messages } = await req.json();

  const supabase = createServerComponentClient({ cookies });
  const { data: organization } = await supabase
    .from("profiles")
    .select("organization_id");

  const organization_id = organization![0].organization_id;

  const { data: datastore } = await supabase
    .from("datastores")
    .select("id")
    .eq("organization_id", organization_id)
    .eq("name", datastore_name);

  const datastore_id = datastore![0].id;

  const query = messages[messages.length - 1].content;

  const embedchain = new EmbedChain();
  await embedchain.init_app;
  const prompt = await embedchain.query(query, organization_id, datastore_id);

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
