import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function formatNameWithSpaces(nameStr?: string | null): { fullName: string; firstName: string } {
  if (!nameStr || typeof nameStr !== "string") {
    return { fullName: "Candidate Profile", firstName: "Candidate" };
  }
  const cleaned = nameStr
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b(cv|resume|doc|pdf)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || cleaned.length < 2) {
    return { fullName: "Candidate Profile", firstName: "Candidate" };
  }

  const words = cleaned.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const fullName = words.join(" ");
  const firstName = words[0] || "Candidate";
  return { fullName, firstName };
}

const ALLOWED_CV_EXTENSIONS = ["pdf", "doc", "docx"];
const MAX_CV_BYTES = 5 * 1024 * 1024;

const DEFAULT_REQUIREMENTS = [
  "Relevant experience in ayurveda, wellness, or spa interior solutions",
  "Understanding of technical client requirements and project execution",
  "Strong communication, negotiation, and coordination skills",
  "Problem solving mindset with industry experience",
  "Open to work in team environment with commitment to excellence",
];

function normalizeRequirements(list: unknown): string[] {
  const cleaned = Array.isArray(list)
    ? list.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
  const result = [...cleaned];
  for (const fallback of DEFAULT_REQUIREMENTS) {
    if (result.length >= 5) break;
    if (!result.includes(fallback)) result.push(fallback);
  }
  return result.slice(0, 5);
}

function rejectCvFile(file: File): string | null {
  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toLowerCase() : "";
  if (!ALLOWED_CV_EXTENSIONS.includes(extension)) {
    return "Invalid file type. Only PDF, DOC and DOCX files are allowed.";
  }
  if (file.size === 0) return "The uploaded file is empty.";
  if (file.size > MAX_CV_BYTES) return "File is too large. Maximum allowed size is 5 MB.";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = (formData.get("jobTitle") as string) || "Wellness Solutions Consultant";
    const jobExperience = (formData.get("jobExperience") as string) || "2 - 5 Years";

    if (file) {
      const problem = rejectCvFile(file);
      if (problem) {
        return NextResponse.json({ success: false, message: problem }, { status: 400 });
      }
    }

    const fileName = file?.name || "Uploaded_CV.pdf";

    const { fullName: fallbackName, firstName: fallbackFirstName } = formatNameWithSpaces(
      file?.name ? file.name.replace(/\.[^/.]+$/, "") : "Candidate Profile"
    );

    const jobEducation = (formData.get("jobEducation") as string) || "Degree in relevant field";
    const jobResponsibilities = (formData.get("responsibilities") as string) || "";
    const jobRequirements = (formData.get("requirements") as string) || "";
    const jobAiCheckPoints = (formData.get("aiCheckPoints") as string) || "";
    const eligibilityThreshold = Number(formData.get("eligibilityThreshold")) || 70;
    const partialMatchMin = Number(formData.get("partialMatchMin")) || 50;

    let base64Data = "";
    let mimeType = "application/pdf";
    let textSnippet = "";
    let extractedEmailFromBuffer: string | null = null;
    let extractedPhoneFromBuffer: string | null = null;
    const extractedPhonesFromBuffer: string[] = [];
    let extractedLinkedinFromBuffer: string | null = null;
    // NOTE: For candidate privacy, CVs are never saved to public/uploads
    const savedCvUrl: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      base64Data = buffer.toString("base64");

      let extractedDocText = "";
      const lowerName = fileName.toLowerCase();

      if (lowerName.endsWith(".pdf")) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const pdfParseModule = require("pdf-parse");
          const parseFn = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default || pdfParseModule.PdfParse;
          if (typeof parseFn === "function") {
            const pdfData = await parseFn(buffer);
            extractedDocText = pdfData.text || "";
          }
        } catch (pdfErr) {
          console.warn("pdf-parse error:", pdfErr);
        }
      } else if (lowerName.endsWith(".docx") || lowerName.endsWith(".doc")) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const mammoth = require("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          extractedDocText = result.value || "";
        } catch (docErr) {
          console.warn("mammoth error:", docErr);
        }
      }

      const rawText = (extractedDocText + "\n" + buffer.toString("utf-8")).trim();

      // Extract details via regex
      const emailMatches = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi);
      if (emailMatches && emailMatches.length > 0) {
        const valid = emailMatches.find(
          (e) => !e.toLowerCase().includes("example") && !e.toLowerCase().includes("schema") && !e.toLowerCase().includes("domain")
        );
        if (valid) extractedEmailFromBuffer = valid;
      }

      const phoneMatches = rawText.match(/(?<!\d)(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}(?!\d)/g);
      if (phoneMatches && phoneMatches.length > 0) {
        const seen = new Set<string>();
        for (const match of phoneMatches) {
          const raw = match.trim();
          const digits = raw.replace(/\D/g, "");
          if (digits.length < 10 || digits.length > 13) continue;
          const key = digits.slice(-10);
          if (seen.has(key)) continue;
          seen.add(key);
          extractedPhonesFromBuffer.push(raw);
          if (extractedPhonesFromBuffer.length >= 4) break;
        }
        extractedPhoneFromBuffer = extractedPhonesFromBuffer[0] || null;
      }

      const linkedinMatches = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi);
      if (linkedinMatches && linkedinMatches.length > 0) {
        extractedLinkedinFromBuffer = linkedinMatches[0].trim();
      }

      textSnippet = rawText.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim().slice(0, 4000);

      if (lowerName.endsWith(".pdf")) mimeType = "application/pdf";
      else if (lowerName.endsWith(".png")) mimeType = "image/png";
      else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) mimeType = "image/jpeg";
      else if (lowerName.endsWith(".webp")) mimeType = "image/webp";
      else mimeType = "text/plain";
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_AI_API_KEY;

    const userParts: Array<any> = [
      {
        text: `You are an expert AI Talent Evaluator for "ENSIS - Premium Wellness & Healthcare Spaces".
Analyze the attached CV/Resume file named "${fileName}" for the position: "${jobTitle}".
Experience requirement: "${jobExperience}".
Education requirement: "${jobEducation}".
${jobResponsibilities ? `Key Responsibilities: ${jobResponsibilities}` : ""}
${jobRequirements ? `Job Requirements: ${jobRequirements}` : ""}
${jobAiCheckPoints ? `AI Check Points: ${jobAiCheckPoints}` : ""}

RAW DOCUMENT TEXT EXTRACTED FROM CV:
"""
${textSnippet || "No raw text snippet available. Evaluate attached document."}
"""

CRITICAL EVALUATION RULES:
1. Extract candidate's full name, email, phone, and LinkedIn.
2. Evaluate against the job role and assign an objective match score (0 to 100).
3. 7 breakdown dimensions (each score 0 to 100):
   - education: Educational Qualification
   - experience: Relevant Work Experience
   - technical_skills: Design & Technical Skills
   - creative_thinking: Creative & Design Thinking
   - communication: Communication Skills
   - portfolio: Portfolio & Practical Execution
   - location: Location Alignment
4. Strengths (3-5 bullet points).
5. Gaps (2-4 bullet points if any).
6. Suggestions (2-4 actionable suggestions).
7. Candidate Profile:
   - education: array of { qualification, institute, year, score, specialization }
   - experience: array of { organization, designation, from, to, responsibilities }
   - skills: array of { name, level (0-100) }
   - certifications: array of string names

Return ONLY valid JSON matching this exact structure:
{
  "candidateName": "Full Name",
  "firstName": "First Name",
  "email": "email_or_null",
  "phone": "phone_or_null",
  "linkedin": "linkedin_or_null",
  "dateOfBirth": "",
  "gender": "Male",
  "currentLocation": "Delhi NCR",
  "permanentAddress": "",
  "score": 82,
  "summary": "Strong profile with relevant industry experience.",
  "requirementsMet": [
    "Relevant degree in the required field",
    "Strong technical skills and tool proficiency",
    "Experience in project execution and delivery",
    "Good team collaboration and communication",
    "Location and availability fit"
  ],
  "breakdown": {
    "education": 85,
    "experience": 80,
    "technical_skills": 88,
    "creative_thinking": 82,
    "communication": 78,
    "portfolio": 80,
    "location": 90,
    "relevantExperience": 80,
    "educationalQualification": 85,
    "keySkills": 88,
    "roleFit": 82,
    "industryExperience": 80,
    "locationPreference": 90
  },
  "strengths": [
    "Relevant educational background matching the job requirements",
    "Strong experience with required tools and methodologies",
    "Clear track record of successful projects",
    "Good alignment with ENSIS wellness design philosophy"
  ],
  "gaps": [
    "Limited prior exposure to commercial wellness interiors"
  ],
  "suggestions": [
    "Highlight specific wellness or healthcare projects in your portfolio",
    "Detail your experience with luxury materials and sustainable finishes"
  ],
  "education": [
    { "qualification": "B.Des", "institute": "National Institute of Design", "year": "2020", "score": "8.2 CGPA", "specialization": "Product Design" }
  ],
  "experience": [
    { "organization": "Design Studio", "designation": "Product Designer", "from": "2021", "to": "Present", "responsibilities": "Lead concept development and 3D prototyping" }
  ],
  "skills": [
    { "name": "3D Modeling", "level": 90 },
    { "name": "Product Design", "level": 88 },
    { "name": "Material Selection", "level": 75 }
  ],
  "certifications": ["Certified SolidWorks Professional"]
}`,
      },
    ];

    if (base64Data && (mimeType === "application/pdf" || mimeType.startsWith("image/"))) {
      userParts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data,
        },
      });
    }

    const candidateModels = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash"];
    let responseText = "";

    if (apiKey) {
      for (const model of candidateModels) {
        try {
          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
          const res = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: userParts }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 3000 },
            }),
            signal: AbortSignal.timeout(35000),
          });

          if (res.ok) {
            const data = await res.json();
            responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (responseText) break;
          }
        } catch (err) {
          console.warn(`Error trying model ${model}:`, err);
        }
      }
    }

    if (responseText) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const finalEmail =
          parsed.email && parsed.email !== "null" && !parsed.email.includes("email_or_null")
            ? parsed.email
            : extractedEmailFromBuffer;

        const finalPhone =
          parsed.phone && parsed.phone !== "null" && !parsed.phone.includes("phone_or_null")
            ? parsed.phone
            : extractedPhoneFromBuffer;

        const finalLinkedin =
          parsed.linkedin && parsed.linkedin !== "null" && !parsed.linkedin.includes("linkedin_or_null")
            ? parsed.linkedin
            : extractedLinkedinFromBuffer;

        const rawCandidateName =
          parsed.candidateName && !parsed.candidateName.includes("Candidate Full Name")
            ? parsed.candidateName
            : fallbackName;
        const formatted = formatNameWithSpaces(rawCandidateName);

        const scoreRaw = typeof parsed.score === "number" ? parsed.score : 76;
        const score = Math.max(0, Math.min(100, Math.round(scoreRaw)));

        const level: "eligible" | "partial" | "not_eligible" =
          score >= eligibilityThreshold ? "eligible" : score >= partialMatchMin ? "partial" : "not_eligible";

        const rawBd = parsed.breakdown || {};
        const clamp = (v: unknown, fallback: number) => {
          const n = typeof v === "number" ? v : fallback;
          return Math.max(0, Math.min(100, Math.round(n)));
        };

        const breakdownItems = [
          {
            key: "education" as const,
            label: "Educational Qualification",
            sublabel: "Degrees, certifications, and academic specialization alignment",
            score: clamp(rawBd.education ?? rawBd.educationalQualification, 80),
          },
          {
            key: "experience" as const,
            label: "Relevant Experience",
            sublabel: "Years in role, industry track record, and project scale",
            score: clamp(rawBd.experience ?? rawBd.relevantExperience, 75),
          },
          {
            key: "technical_skills" as const,
            label: "Design & Technical Skills",
            sublabel: "Domain software, core methods, and practical craftsmanship",
            score: clamp(rawBd.technical_skills ?? rawBd.keySkills, 80),
          },
          {
            key: "creative_thinking" as const,
            label: "Creative & Design Thinking",
            sublabel: "Problem solving, concept innovation, and wellness aesthetic fit",
            score: clamp(rawBd.creative_thinking ?? rawBd.roleFit, 75),
          },
          {
            key: "communication" as const,
            label: "Communication Skills",
            sublabel: "Documentation, client presentation, and cross-team coordination",
            score: clamp(rawBd.communication, 80),
          },
          {
            key: "portfolio" as const,
            label: "Portfolio Quality",
            sublabel: "Visual evidence of work, execution polish, and ergonomics",
            score: clamp(rawBd.portfolio, 78),
          },
          {
            key: "location" as const,
            label: "Location Fit",
            sublabel: "Current location and willingness to work at the target workplace",
            score: clamp(rawBd.location ?? rawBd.locationPreference, 90),
          },
        ];

        const profileData = {
          fullName: formatted.fullName,
          email: finalEmail || "",
          phone: finalPhone || "",
          dateOfBirth: parsed.dateOfBirth || "",
          gender: parsed.gender || "Male",
          currentLocation: parsed.currentLocation || "Delhi NCR",
          permanentAddress: parsed.permanentAddress || "",
          linkedin: finalLinkedin || "",
          education: Array.isArray(parsed.education) ? parsed.education : [],
          experience: Array.isArray(parsed.experience) ? parsed.experience : [],
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
        };

        const screeningObject = {
          score,
          level,
          thresholds: { eligible: eligibilityThreshold, partial: partialMatchMin },
          breakdown: breakdownItems,
          strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
            ? parsed.strengths
            : ["Strong background aligned with role requirements"],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
          suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
          profile: profileData,
        };

        return NextResponse.json({
          success: true,
          candidateName: formatted.fullName,
          firstName: formatted.firstName,
          email: finalEmail || null,
          phone: finalPhone || null,
          phones: extractedPhonesFromBuffer.length > 0 ? extractedPhonesFromBuffer : finalPhone ? [finalPhone] : [],
          linkedin: finalLinkedin || null,
          cvUrl: savedCvUrl,
          score,
          summary: parsed.summary || "Evaluation completed successfully.",
          requirementsMet: normalizeRequirements(parsed.requirementsMet),
          breakdown: {
            relevantExperience: breakdownItems[1].score,
            educationalQualification: breakdownItems[0].score,
            keySkills: breakdownItems[2].score,
            roleFit: breakdownItems[3].score,
            industryExperience: breakdownItems[1].score,
            locationPreference: breakdownItems[6].score,
          },
          screening: screeningObject,
        });
      }
    }

    // No AI result: never invent a score for the candidate
    console.error("Analyze CV: no AI result", apiKey ? "(all models failed)" : "(GEMINI_API_KEY not set)");
    return NextResponse.json(
      { success: false, message: "We couldn't analyse your CV right now. Please try again in a moment." },
      { status: 503 }
    );
  } catch (err: any) {
    console.error("Analyze CV API Error:", err);
    return NextResponse.json(
      { success: false, message: "We couldn't read this CV. Please upload a PDF or Word file and try again." },
      { status: 500 }
    );
  }
}
