import { chatSession } from "@/configs/AiModel";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await chatSession.sendMessage(prompt);
    const AIres = await result.response.text();

    return new Response(JSON.stringify({ result: AIres }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
