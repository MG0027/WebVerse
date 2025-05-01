import { GenAiCode } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const result = await GenAiCode(prompt);

    const resp = await result.response.text(); // ← Keep if response isn't always JSON
   
    try {
      const parsed = JSON.parse(resp);
      return NextResponse.json(parsed);
     

    } catch (parseErr) {
      console.error("JSON parsing failed:", parseErr.message);
      console.error("Raw response:", resp.slice(0, 300)); // Trim to avoid overload
      return NextResponse.json({ error: "AI returned invalid JSON." }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong" }, { status: 500 });
  }
}
