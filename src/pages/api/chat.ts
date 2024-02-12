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

export default async function handler(
  req: ChatRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { prompt, messages, threadId } = req.body;
    const response = await chat(prompt, threadId);
    //console.log(response);
    if (response.length > 0) {
      if ('text' in response[0].content[0]) {
        console.log()
        res.status(200).json({
          status: true,
          message: response[0].content[0].text.value
        })
      }
    }
    
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      res.status(500).json({
        status: false,
        message: error.response.data
      })
    } else {
      console.log(error.message);
      res.status(500).json({
        status: false,
        message: error.message
      })
    }
  }
}
