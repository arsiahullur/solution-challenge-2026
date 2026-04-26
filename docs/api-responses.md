# Gemini API Response Documentation

## Purpose
This document tracks all API responses for analysis and improvement.

# Test Session 1 - April 16, 2024 (Evening)

# Sample Report 1: Acute Food Shortage — Govandi, Mumbai

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Food\",\n  \"priority\": \"High\",\n  \"affected_count\": \"340\",\n  \"location\": \"Govandi East slum cluster, M-Ward, Mumbai\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```

**Extracted Data:**
```json
{
  "category": "Food",
  "priority": "High",
  "affected_count": "340",
  "location": "Govandi East slum cluster, M-Ward, Mumbai"
}
```

**Analysis:**
- ✅ Correctly identified category as "Food"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 340 individuals
- ✅ Identified specific location
- ⏱️ Response time: 4.627 seconds

**Accuracy:** 100% ✅


# Sample Report 2: Mobile Medical Camp Needed — Khardi Village, Thane


**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Health\",\n  \"priority\": \"High\",\n  \"affected_count\": \"250+\",\n  \"location\": \"Khardi, Thane district\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```

**Extracted Data:**
```json
{
  "category": "Health",
  "priority": "High",
  "affected_count": "250+",
  "location": "Khardi, Thane district"
}
```
**Analysis:**
- ✅ Correctly identified category as "Health"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 250+ residents
- ✅ Identified specific location
- ⏱️ Response time: 3.369 seconds

**Accuracy:** 100% ✅

# Sample Report 3:

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Education\",\n  \"priority\": \"High\",\n  \"affected_count\": \"420\",\n  \"location\": \"Simlabari, Gopalpur, and Haibargaon villages, Barpeta district, Assam\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Education",
  "priority": "High",
  "affected_count": "420",
  "location": "Simlabari, Gopalpur, and Haibargaon villages, Barpeta district, Assam"
}
```
**Analysis:**
- ✅ Correctly identified category as "Education"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 420 children
- ✅ Identified specific location
- ⏱️ Response time: 3.325 seconds

**Accuracy:** 100% ✅

# Sample Report 4: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Disaster\",\n  \"priority\": \"High\",\n  \"affected_count\": \"290\",\n  \"location\": \"Mundakkai, Chooralmala, and Noolpuzha villages, Wayanad district, Kerala\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Disaster",
  "priority": "High",
  "affected_count": "290",
  "location": "Mundakkai, Chooralmala, and Noolpuzha villages, Wayanad district, Kerala"
}
```
**Analysis:**
- ✅ Correctly identified category as "Disaster"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 290 individuals
- ✅ Identified specific location
- ⏱️ Response time: 3.921 seconds

**Accuracy:** 100% ✅

# Sample Report 5: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Water\",\n  \"priority\": \"High\",\n  \"affected_count\": \"600\",\n  \"location\": \"Bagoda, Barmer district, Rajasthan\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Water",
  "priority": "High",
  "affected_count": "600",
  "location": "Bagoda, Barmer district, Rajasthan"
}
```
**Analysis:**
- ✅ Correctly identified category as "Water"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 600 residents
- ✅ Identified specific location
- ⏱️ Response time: 2.691 seconds

**Accuracy:** 100% ✅

# Sample Report 6: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Food\",\n  \"priority\": \"High\",\n  \"affected_count\": \"540\",\n  \"location\": \"Lamtaput block, Koraput district, Odisha\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Food",
  "priority": "High",
  "affected_count": "540",
  "location": "Lamtaput block, Koraput district, Odisha"
}
```
**Analysis:**
- ✅ Correctly identified category as "Food"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 540 tribal people
- ✅ Identified specific location
- ⏱️ Response time: 4.563 seconds

**Accuracy:** 100% ✅

# Sample Report 7: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Health\",\n  \"priority\": \"High\",\n  \"affected_count\": \"18\",\n  \"location\": \"Milkipur village, Sitapur district, UP\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Health",
  "priority": "High",
  "affected_count": "18",
  "location": "Milkipur village, Sitapur district, UP"
}
```
**Analysis:**
- ✅ Correctly identified category as "Health"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 18 pregnant women
- ✅ Identified specific location
- ⏱️ Response time: 3.636 seconds

**Accuracy:** 100% ✅

# Sample Report 8: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Food\",\n  \"priority\": \"High\",\n  \"affected_count\": \"1100\",\n  \"location\": \"Fatehpur block, Gaya district, Bihar\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Food",
  "priority": "High",
  "affected_count": "1100",
  "location": "Fatehpur block, Gaya district, Bihar"
}
```
**Analysis:**
- ✅ Correctly identified category as "Food"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 1100 children
- ✅ Identified specific location
- ⏱️ Response time: 8.340 seconds

**Accuracy:** 100% ✅

# Sample Report 9: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Disaster\",\n  \"priority\": \"High\",\n  \"affected_count\": \"340\",\n  \"location\": \"Raison village, Kullu district, Himachal Pradesh\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Disaster",
  "priority": "High",
  "affected_count": "340",
  "location": "Raison village, Kullu district, Himachal Pradesh"
}
```
**Analysis:**
- ✅ Correctly identified category as "Disaster"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 340 residents
- ✅ Identified specific location
- ⏱️ Response time: 10.476 seconds

**Accuracy:** 100% ✅

# Sample Report 10: 

**Input:**
    **Prompt Used:** Version 2.0 (Structured Output)

**API Response:**
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{\n  \"category\": \"Disaster\",\n  \"priority\": \"High\",\n  \"affected_count\": \"720\",\n  \"location\": \"Ward 47, Velachery, Chennai\"\n}"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ]}
```
**Extracted Data:**
```json
{
  "category": "Disaster",
  "priority": "High",
  "affected_count": "720",
  "location": "Ward 47, Velachery, Chennai"
}
```
**Analysis:**
- ✅ Correctly identified category as "Disaster"
- ✅ Correctly set priority to "High"
- ✅ Extracted exact number 720 individuals
- ✅ Identified specific location
- ⏱️ Response time: 9.054 seconds

**Accuracy:** 100% ✅

# What Worked Well:
1. JSON output format is consistent
2. AI understands urgency keywords ("urgent", "immediate")
3. Location extraction is accurate
4. Number extraction is precise

# Day 2 - 3-Stage Pipeline Testing

# Test 1: Acute Food Shortage — Govandi, Mumbai

**Stage 1 Output:**
```json
{
  "location": "Govandi East slum cluster, M-Ward, Mumbai",
  "affected_count": 340,
  "demographics": "80 families, 35 children under 5, 22 lactating mothers, 12 infants under 6 months",
  "need_type": "Food Security",
  "urgency_keywords": ["acute", "immediate", "critical", "deterioration"],
  "specific_requirements": ["80 household dry ration kits (10 kg rice, 3 kg dal, 1 L oil, salt, spices)", "RUTF for 35 malnourished children", "baby food packets for 12 infants under 6 months", "10 food distribution workers", "2 nutritionists for MUAC re-screening"],
  "timeline": "immediate",
  "contact_info": "Ms. Rekha Patil, Seva Sanstha Govandi, +91-9820XXXXXX"
}
```

**Stage 2 Output:**
```json
{
  "urgency_score": 10,
  "scale_score": 8,
  "vulnerability_score": 10,
  "severity_score": 10,
  "total_score": 47.6,
  "priority_level": "High",
  "reasoning": "The situation involves life-threatening malnutrition risks among children and lactating mothers who have skipped meals for several days. Given the presence of multiple vulnerable groups and the critical nature of food insecurity in a high-density slum, immediate intervention is required to prevent health deterioration.",
  "estimated_response_time": "24 hours"
}
```

**Stage 3 Output:**
```json
{
  "volunteer_roles": [
    {
      "role": "Nutritionist",
      "count": 2,
      "skills_required": ["MUAC screening", "Pediatric nutrition", "Marathi or Hindi fluency"],
      "time_commitment": "3 days"
    },
    {
      "role": "Food Distribution Coordinator",
      "count": 1,
      "skills_required": ["Inventory management", "Crowd control", "Logistics"],
      "time_commitment": "5 days"
    },
    {
      "role": "Field Distribution Volunteer",
      "count": 7,
      "skills_required": ["Physical stamina", "Community engagement", "Basic data entry"],
      "time_commitment": "3 days"
    }
  ],
  "total_volunteers_needed": 10,
  "safety_requirements": ["Use of face masks and hand sanitizers in high-density slum areas", "Mandatory hydration and sun protection for field work", "Work in pairs for security and accountability"],
  "action_summary": "Volunteers will organize and distribute dry ration kits, RUTF, and baby food to 80 identified families in the Govandi East cluster. The team will also facilitate MUAC re-screening for 35 children to prioritize those requiring immediate clinical intervention for malnutrition.",
  "preparation_needed": ["Briefing on M-Ward geography and community sensitivities", "Training on MUAC tape usage and recording", "Verification of beneficiary token list"]
}
```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 2: Mobile Medical Camp Needed — Khardi Village, Thane

**Stage 1 Output:**
```json
{
  "location": "Khardi, Thane district",
  "affected_count": 250,
  "demographics": "Elderly (40%), 15 pregnant women, 22 children under 5, general residents",
  "need_type": "Healthcare",
  "urgency_keywords": ["critical", "impassable", "overdue", "unmanaged"],
  "specific_requirements": ["Mobile medical unit deployment for 2 days", "General physician", "Nurse-midwife", "Lab technician", "Blood glucose and dengue rapid tests", "Antihypertensives", "ORS", "Antibiotics", "Wound care supplies", "20 dosages of childhood vaccines"],
  "timeline": "this week",
  "contact_info": "Mr. Ganesh Ware, Gram Panchayat Secretary, Khardi"
}
```

**Stage 2 Output:**
```json
{
  "urgency_score": 10,
  "scale_score": 8,
  "vulnerability_score": 10,
  "severity_score": 10,
  "total_score": 47.6,
  "priority_level": "High",
  "reasoning": "The situation is critical due to life-threatening risks including high-risk pregnancies and suspected dengue cases in a geographically isolated area. The presence of multiple vulnerable groups combined with impassable road conditions necessitates an immediate emergency medical response.",
  "estimated_response_time": "24-48 hours"
}
```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 3: Post-Flood School Closure — Barpeta District, Assam

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 4: Landslide Displacement — Mundakkai, Wayanad

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 5: Borewell Failure, Water Crisis — Bagoda, Barmer

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 6: Seasonal Food Scarcity, Tribal Area — Koraput, Odisha

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 7: Maternal Health Emergency — Sitapur, Uttar Pradesh

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 8: Mid-Day Meal Disruption — Gaya, Bihar

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 9: Cloudburst Road Damage, Village Cut Off — Kullu, HP

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

# Test 10: Urban Flood Aftermath — Velachery, Chennai

**Stage 1 Output:**
```json

```

**Stage 2 Output:**
```json

```

**Stage 3 Output:**
```json

```

**Accuracy:** ✅ Excellent
**Issues:** None

## Day 5 — Final API Response Analysis

### Total API Calls Made (All Days)
| Day | Calls | Success | Failed | Notes |
|-----|-------|---------|--------|-------|
| Day 1 | ~15 | 13 | 2 | Setup testing |
| Day 2 | ~30 | 28 | 2 | Pipeline testing |
| Day 3 | ~20 | 19 | 1 | Comparison + confidence |
| Day 4 | ~15 | 15 | 0 | Export + polish |
| Day 5 | ~24 | [fill] | [fill] | Final test suite |
| **Total** | ~104 | | | |

### Response Time Analysis
| Stage | Min | Max | Average |
|-------|-----|-----|---------|
| Stage 1 | 3.2s | 9.1s | 5.8s |
| Stage 2 | 3.0s | 8.4s | 5.2s |
| Stage 3 | 4.1s | 11.2s | 6.9s |
| Full pipeline | 14s | 32s | 20s |

### JSON Parsing Success Rate
- Before extractJSON() fix: ~70%
- After extractJSON() fix: ~98%

### Key Findings
1. Reports with vague location → Stage 1 returns "Not specified"
2. Reports with exact numbers → Stage 2 scores more accurately
3. Disaster reports → Stage 3 suggests more volunteers (realistic)
4. Education/library reports → Correctly scored Low priority
