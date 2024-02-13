import type { NextApiRequest, NextApiResponse } from 'next'
import { chat } from "@/libs/openai";
import { threadId } from 'worker_threads';

interface ChatRequest extends NextApiRequest {
  body: {
    prompt: string
    messages: ChatMessage[]
    threadId: string
  }
}

type Data = {
  status: boolean;
  message?: string;
  data?: {
    message: ChatMessage[]
  };
}


if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY')
}

export const config = {
  runtime: 'edge',
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json()
    const response = await chat(body.prompt, body.threadId);
    //console.log(response);
    console.log(response);
    if (response.length > 0) {
      if ('text' in response[0].content[0]) {
        return new Response(JSON.stringify(response[0].content[0].text.value))
      }
    }

  } catch (error: any) {
    console.log(error);
    if (error.response) {
      return new Response(JSON.stringify(error.response.data))
    } else {
      return new Response(JSON.stringify(error.message))
    }
  }
}


export default handler
