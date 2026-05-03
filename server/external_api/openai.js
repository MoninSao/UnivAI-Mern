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

    // GPT often appends state abbreviations like "(OH)" or "(TX)" to names and
    // may corrupt large numeric IPEDS ids. Normalise before matching so we always
    // store the real id and clean name from the known university list.
    const normalise = (s) =>
        s.toLowerCase()
         .replace(/\s*\([a-z]{2}\)\s*$/i, "")   // strip trailing "(OH)", "(TX)" …
         .replace(/[^a-z0-9]/g, " ")             // collapse punctuation to spaces
         .replace(/\s+/g, " ")
         .trim();

    return parsed.recommendations.map((rec) => {
        // 1. Exact numeric id match
        let uni = universities.find((u) => String(u.id) === String(rec.id));
        // 2. Normalised name match
        if (!uni) {
            const normRec = normalise(rec.name);
            uni = universities.find((u) => normalise(u.name) === normRec);
        }
        if (uni) {
            return { id: uni.id, name: uni.name, reason: rec.reason };
        }
        console.warn(`⚠️ [OpenAI] Could not verify university: "${rec.name}" (id: ${rec.id})`);
        return rec;
    });
}
