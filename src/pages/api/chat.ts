import { chat } from "@/libs/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from 'openai';

const openai = new OpenAI();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}
interface ChatRequest extends NextApiRequest {
  body: {
    prompt: string
    messages: ChatMessage[]
  }
}

export const config = {
  maxDuration: 300,
};
 
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  try {
    
    const {threadId, prompt} = request.body;
    await openai.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: prompt
      }
    );

    let run = await openai.beta.threads.runs.create(
      threadId,
      {
        assistant_id: "asst_flwBRJO6EclYXSm0mklVt2b3"
      }
    );

    while (run.status === "queued" || run.status === "in_progress") {
      run = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
    }

    const messages = await openai.beta.threads.messages.list(
      threadId
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
        res.status(200).json({
          status: true,
          message: messages.data[0].content[0].text.value
        })
      }
    }

  } catch (error: any) {
    console.log("error");
    console.log(error);
    
    res.status(500).json({
      status: false,
      message: "Error"
    })
  }
}
