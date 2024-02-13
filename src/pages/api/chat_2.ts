import { chat } from "@/libs/openai";
import { OpenAI } from 'openai';

const openai = new OpenAI();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}
export const runtime = 'edge';


const handler = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json()
    console.log(body.threadId);
    console.log(body.prompt);
    await openai.beta.threads.messages.create(
      body.threadId,
      {
        role: "user",
        content: body.prompt
      }
    );

    let run = await openai.beta.threads.runs.create(
      body.threadId,
      {
        assistant_id: "asst_flwBRJO6EclYXSm0mklVt2b3"
      }
    );

    while (run.status === "queued" || run.status === "in_progress") {
      run = await openai.beta.threads.runs.retrieve(
        body.threadId,
        run.id
      );
    }

    const messages = await openai.beta.threads.messages.list(
      body.threadId
    );
    // const completion = await openai.chat({
    //     model: process.env.OPENAI_API_CHAT_MODEL,
    //     messages: [
    //         ...messages,
    //         {
    //             role: "user",
    //             content: prompt
    //         },
    //     ],
    // });

    //console.log(response);
    console.log(messages.data);
    if (messages.data.length > 0) {
      if ('text' in messages.data[0].content[0]) {
        console.log(messages.data[0].content[0].text.value);
        return new Response(JSON.stringify(messages.data[0].content[0].text.value))
      }
    }

  } catch (error: any) {
    console.log("error");
    console.log(error);
    if (error.response) {
      return new Response(JSON.stringify(error.response.data))
    } else {
      return new Response(JSON.stringify(error.message))
    }
  }
}


export default handler
