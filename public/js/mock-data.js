const MOCK_RESULTS = {
    stage1: {
        success: true,
        data: {
            location: "Govandi, Mumbai, Maharashtra",
            affected_count: 80,
            demographics: "children under 5, lactating mothers, families",
            need_type: "Food Security",
            urgency_keywords: ["Immediate", "Critical", "Deterioration expected within 72 hours"],
            specific_requirements: [
                "80 household dry ration kits (10 kg rice, 3 kg dal, 1 L oil)",
                "RUTF for 35 malnourished children",
                "Baby food packets for 12 infants"
            ],
            timeline: "immediate",
            contact_info: "Ms. Rekha Patil, Seva Sanstha Govandi"
        },
        stage: 1
    },
    stage2: {
        success: true,
        data: {
            urgency_score: 10,
            scale_score: 6,
            vulnerability_score: 9,
            severity_score: 10,
            total_score: 46.1,
            priority_level: "High",
            reasoning: "This situation represents a critical food emergency affecting 80 families with 35 malnourished children under 5 and 22 lactating mothers who have been skipping meals. The 72-hour deterioration timeline and exhausted ration supplies create an immediate life-threatening scenario requiring urgent intervention.",
            estimated_response_time: "24-48 hours"
        },
        stage: 2
    },
    stage3: {
        success: true,
        data: {
            volunteer_roles: [
                {
                    role: "Food Distribution Coordinator",
                    count: 2,
                    skills_required: ["Logistics coordination", "Inventory management", "Local language fluency"],
                    time_commitment: "6-8 hours"
                },
                {
                    role: "Food Distribution Worker",
                    count: 8,
                    skills_required: ["Physical fitness", "Basic communication skills"],
                    time_commitment: "4-6 hours"
                },
                {
                    role: "Nutritionist (MUAC trained)",
                    count: 2,
                    skills_required: ["MUAC screening certification", "Nutrition counseling", "RUTF distribution knowledge"],
                    time_commitment: "8-10 hours"
                }
            ],
            total_volunteers_needed: 12,
            safety_requirements: [
                "Wear masks and maintain hygiene protocols",
                "Follow food safety handling procedures",
                "Be aware of overcrowding during distribution"
            ],
            action_summary: "Volunteers will coordinate and execute emergency food distribution to 80 families in Govandi slum, ensuring proper ration kit assembly, orderly distribution, and nutritional screening of 35 malnourished children using MUAC measurements.",
            preparation_needed: [
                "Vehicle access for transporting supplies",
                "MUAC measurement tapes",
                "Beneficiary lists and ID verification materials",
                "Personal water bottles and snacks"
            ]
        },
        stage: 3
    },
    complete: true,
    error: null
};
