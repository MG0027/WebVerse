import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await GenAiCode(prompt);

    const resp = await result.response.text(); 
    return NextResponse.json(JSON.parse(resp)); 
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });
  }
}