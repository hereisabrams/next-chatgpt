import type { NextApiRequest, NextApiResponse } from 'next'
import {chat, createThread} from "@/libs/openai";

interface ChatRequest extends NextApiRequest {
  body: {
    prompt: string
    messages: ChatMessage[]
  }
}


export default async function handler(
  req: ChatRequest,
  res: NextApiResponse
) {
  try {
    const response = await createThread();
    //console.log(response);
    res.status( 200).json({
      status: true,
      response: response.id
    })
  } catch (error: any) {
    console.log(error);
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
