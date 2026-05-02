// Thin API layer for OpenAI — only responsible for making the API call
// Prompt construction lives in buildPrompt.js

import OpenAI from "openai";
import { buildPrompt } from "./buildPrompt.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Returns top 5 matched universities as [{ id, name, reason }, ...]
export async function getRecommendations(studentProfile, universities) {
    console.log(`🤖 [OpenAI] Sending request for student: ${studentProfile.name} | GPA: ${studentProfile.gpa} | Major: ${studentProfile.major}`);
    console.log(`📋 [OpenAI] Comparing against ${universities.length} universities`);

    const messages = buildPrompt(studentProfile, universities);

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
    });

    const usage = response.usage;
    console.log(`✅ [OpenAI] Response received — tokens used: ${usage.prompt_tokens} prompt / ${usage.completion_tokens} completion`);

    const parsed = JSON.parse(response.choices[0].message.content);
    console.log(`🏆 [OpenAI] Top ${parsed.recommendations.length} recommendations ready`);
    return parsed.recommendations;
}
