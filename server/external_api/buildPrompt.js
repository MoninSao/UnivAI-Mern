// Builds the messages array for the OpenAI chat completions API
// Pure function — no API calls, no side effects, easy to test independently

// Formats a university object into a concise single-line string for the prompt
function formatUniversity(uni) {
    const acceptance = uni.acceptanceRate != null
        ? `${(uni.acceptanceRate * 100).toFixed(1)}% acceptance`
        : "acceptance rate unknown";
    const sat = uni.satAvg != null
        ? `SAT avg ${uni.satAvg}`
        : "SAT avg unknown";
    const tuition = uni.tuitionOutState != null
        ? `$${uni.tuitionOutState.toLocaleString()} out-of-state tuition`
        : "tuition unknown";
    const earnings = uni.medianEarnings != null
        ? `$${uni.medianEarnings.toLocaleString()} median earnings`
        : "median earnings unknown";

    return `[id:${uni.id}] ${uni.name} (${uni.state}) — ${acceptance}, ${sat}, ${tuition}, ${earnings}`;
}

// Builds the messages array to pass directly to client.chat.completions.create()
// studentProfile: { name, gpa, major, satScore }
// universities: array of university objects from college_scorecard.js
export function buildPrompt(studentProfile, universities) {
    const studentSummary = [
        `Name: ${studentProfile.name}`,
        `GPA: ${studentProfile.gpa}`,
        `Intended Major: ${studentProfile.major}`,
        `SAT Score: ${studentProfile.satScore || "not provided"}`,
    ].join("\n");

    const universitiesList = universities
        .map(formatUniversity)
        .join("\n");

    return [
        {
            role: "system",
            content: `You are a university admissions advisor. Given a student profile and a list of universities, 
select the top 5 best-matched universities for that student based on their GPA, intended major, and sat
acceptance rate, SAT average, tuition, and career earnings potential.

Respond ONLY with a valid JSON object in this exact shape:
{
  "recommendations": [
    { "id": <university id number>, "name": "<university name>", "reason": "<1-2 sentence reason>" },
    ...exactly 5 items...
  ]
}`,
        },
        {
            role: "user",
            content: `Student Profile:\n${studentSummary}\n\nUniversities:\n${universitiesList}`,
        },
    ];
}
