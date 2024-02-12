const { Configuration, OpenAIApi } = require("openai");
import { languages } from "@/data/languages";
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function chat(prompt: string,  threadId: string) {
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

    return messages.data;
}

export async function createThread() {
    const thread = await openai.beta.threads.create();
    return thread;
}

export async function translate(
    text: string,
    sourceLang: string,
    targetLang: string,
) {

    return "completion.data";
}