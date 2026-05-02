const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

// Fetches universities from the College Scorecard API and returns them as a simplified array
export async function fetchUniversities() {
    // Build the query specify which fields to return and authenticate with the API key
    const params = new URLSearchParams({
        api_key: process.env.COLLEGE_SCORECARD_API_KEY,
        fields: [
            "school.name",
            "school.city",
            "school.state",
            "school.school_url",
            "latest.admissions.admission_rate.overall",
            "latest.admissions.sat_scores.average.overall",
            "latest.cost.tuition.in_state",
            "latest.cost.tuition.out_of_state",
            "latest.student.size",
            "latest.earnings.10_yrs_after_entry.median",
        ].join(","),
        per_page: "10", // increase this to get more results
    });

    console.log("🎓 [CollegeScorecard] Fetching universities...");
    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
        console.error(`❌ [CollegeScorecard] Request failed — status ${response.status}`);
        throw new Error(`College Scorecard API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ [CollegeScorecard] Received ${data.results.length} universities`);

    // Map the raw API response fields to our University object shape
    return data.results.map((school, index) => ({
        id: index,
        name: school["school.name"],
        city: school["school.city"],
        state: school["school.state"],
        url: school["school.school_url"],
        acceptanceRate: school["latest.admissions.admission_rate.overall"],
        satAvg: school["latest.admissions.sat_scores.average.overall"],
        tuitionInState: school["latest.cost.tuition.in_state"],
        tuitionOutState: school["latest.cost.tuition.out_of_state"],
        enrollment: school["latest.student.size"],
        medianEarnings: school["latest.earnings.10_yrs_after_entry.median"],
    }));
}