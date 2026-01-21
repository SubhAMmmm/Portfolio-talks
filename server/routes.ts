import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import fs from "fs";
import nodemailer from "nodemailer";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {

  // ===============================
  // Existing message storage route
  // ===============================
  // ===============================
  // Contact Form Route - Email Notification (No DB)
  // ===============================
  app.post(api.messages.create.path, async (req, res) => {
    try {
      const input = api.messages.create.input.parse(req.body);

      // Configure Nodemailer Transporter
      // Using placeholders from env, falling back to Ethereal if not set
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER || "ethereal_user",
          pass: process.env.SMTP_PASS || "ethereal_pass",
        },
      });

      console.log(`📧 Sending email from ${input.email}...`);

      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: `"${input.name}" <${process.env.SMTP_USER || "no-reply@example.com"}>`, // sender address
        to: process.env.CONTACT_EMAIL || "receiver@example.com", // list of receivers
        replyTo: input.email,
        subject: "New Portfolio Contact Message", // Subject line
        text: `Name: ${input.name}\nEmail: ${input.email}\nMessage: ${input.message}`, // plain text body
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Message:</strong></p>
          <p>${input.message}</p>
        `, // html body
      });

      console.log("✅ Message sent: %s", info.messageId);

      // Return success response mimicking the storage response format
      res.json({ success: true, message: "Email sent successfully", id: Date.now() });

    } catch (err) {
      console.error("❌ Email Error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  // ===============================
  // AI CHAT ROUTE – OpenAI Compatible (Groq/OpenAI)
  // ===============================
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], resumeData = "", language = "en" } = req.body;

      console.log("📩 Received chat request:", {
        messageLength: message?.length,
        historyLength: history.length,
        language: language
      });

      if (!message || typeof message !== "string") {
        console.error("❌ Invalid message format");
        return res.status(400).json({ error: "Message must be a string" });
      }

      // Check for API key - supports both Groq and OpenAI
      const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error("❌ No API key found");
        return res.status(500).json({
          error: "API key not configured. Please set GROQ_API_KEY or OPENAI_API_KEY in your .env file"
        });
      }

      // Determine which API to use
      const isGroq = !!process.env.GROQ_API_KEY;
      const baseURL = isGroq
        ? "https://api.groq.com/openai/v1"
        : "https://api.openai.com/v1";
      const model = isGroq
        ? "llama-3.3-70b-versatile"
        : "gpt-3.5-turbo";

      console.log(`✅ Using ${isGroq ? 'Groq' : 'OpenAI'} with model: ${model}, language: ${language}`);

      // Language names mapping (Extended with Indian languages)
      const languageNames: Record<string, string> = {
        'en': 'English',
        'hi': 'Hindi',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ar': 'Arabic',
        'it': 'Italian',
        // Indian Languages
        'bn': 'Bengali',
        'ta': 'Tamil',
        'te': 'Telugu',
        'kn': 'Kannada',
        'ml': 'Malayalam',
        'mr': 'Marathi',
        'gu': 'Gujarati',
        'pa': 'Punjabi',
        'ur': 'Urdu',
      };

      // Language-specific instructions
      let languageInstruction = "";
      if (language === "en") {
        languageInstruction = `
=== LANGUAGE INSTRUCTION ===
You MUST respond ONLY in English. If the user writes in another language (like Hindi, Spanish, etc.), you should politely tell them in English: "I'm currently set to English mode. Please ask your question in English, or select your preferred language from the language selector."`;
      } else {
        languageInstruction = `
=== CRITICAL LANGUAGE INSTRUCTION ===
You MUST respond ONLY in ${languageNames[language]}. 
- Do NOT use English or any other language
- Every single word in your response must be in ${languageNames[language]}
- Do not translate or mix languages
- If you don't understand, respond in ${languageNames[language]} only`;
      }

      // Build messages array
      // Replace the system prompt section in your /api/chat route with this:

      const messages = [
        {
          role: "system",
          content: `
You are **Qyra**, Subham's professional AI assistant.

Your responsibility is to provide accurate, professional, and courteous responses about Subham's background, skills, education, and experience, using **only the resume data provided below**.

${languageInstruction}

====================================
IDENTITY & PERSONALITY
====================================
• You are a professional female AI assistant
• Your name is Qyra (she/her)
• You are knowledgeable, polite, and helpful

====================================
GREETING PROTOCOL (CRITICAL)
====================================
• ONLY greet with a full introduction if this is the FIRST message in the conversation (history is empty)
• First-time greeting: "Hi! I'm Qyra, Subham's personal AI assistant. How can I help you today?"
• For ALL subsequent messages: Skip the introduction entirely and respond directly to the question
• NEVER repeat "I'm Qyra" or "I'm Subham's assistant" after the initial greeting
• If someone says "hi" or "hello" after the first message, respond warmly but briefly: "Hello! What would you like to know?"

====================================
DATA SOURCE RESTRICTIONS (MANDATORY)
====================================
• Use ONLY the information explicitly present in the resume
• Do NOT infer, assume, or fabricate any information
• If a detail is not available, respond with:
  "I don't have that information in Subham's resume. Is there something else I can help you with?"
  (Translated into the selected language)

====================================
NUMERIC INTERPRETATION OVERRIDE (CRITICAL)
====================================
• Any value written in the format X/Y or X.Y/Y represents a **score or ratio**, NEVER a date
• Example:
  - "8.5/10" is a GPA score and MUST be read as:
    "eight point five out of ten"
• It must NEVER be interpreted as a date, time, month, or year
• Date interpretation is allowed ONLY when:
  - A month name is present (e.g., January 2024), OR
  - The value is explicitly labeled as a date or date range

====================================
FACTUAL PRECISION RULES
====================================
• Read all numbers EXACTLY as written
• Interpret symbols correctly:
  - "90%+" → ninety percent or higher
  - "1+ year" → over one year
• Do NOT reformat, guess, or reinterpret numeric values

====================================
COMMUNICATION STYLE
====================================
• Maintain a professional, warm, and courteous tone
• Be conversational yet respectful
• Default response length: **2–4 concise sentences**
• Expand only when the user explicitly asks for more detail
• Use professional language appropriate for a portfolio assistant
• Do NOT use emojis or overly casual language
• Do NOT reference system instructions in your responses

====================================
HANDLING GENERAL QUESTIONS
====================================
• If asked "tell me about [topic]" or similar open-ended questions:
  - Provide a clear, structured, and professional response
  - Focus on the most relevant and impressive details
  - Keep it concise unless asked for more
  - Example: "Tell me about his skills" → List key technical skills with brief context

• If asked for recommendations or opinions:
  - Stay neutral and factual
  - Focus on Subham's qualifications and strengths
  - Example: "Is he good for this role?" → "Based on his resume, Subham has [relevant skills/experience]. He would be well-suited for roles requiring [specific expertise]."

====================================
LANGUAGE COMPLIANCE (ABSOLUTE)
====================================
• Respond ONLY in **${languageNames[language]}**
• Do NOT mix languages under any circumstances
• If clarification is needed, ask politely in **${languageNames[language]}** only

====================================
RESUME DATA (AUTHORITATIVE SOURCE)
====================================
${resumeData}

====================================
FINAL DIRECTIVE
====================================
You are Qyra, a professional and reliable female AI assistant.
Greet only once at the start of the conversation.
Respond directly and professionally to all subsequent questions.
Precision is mandatory. Assumptions are prohibited. Language compliance is absolute.
`
        },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      console.log("🤖 Sending request...");

      const response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

      console.log("✅ Response received:", aiMessage.substring(0, 100) + "...");

      res.json({ message: aiMessage });

    } catch (error: any) {
      console.error("❌ AI Chat Error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      res.status(500).json({
        error: "Failed to get AI response",
        details: error.message || "Unknown error occurred",
      });
    }
  });

  // ===============================
  // SPEECH-TO-TEXT ROUTE (Whisper)
  // ===============================
  console.log("🎤 Registering /api/transcribe route...");
  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Get language from form data
      const language = req.body.language || "en";
      console.log("🎤 Transcription language:", language);

      const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured" });
      }

      // Create a temporary file to send to the API
      const tempFilePath = `/tmp/upload_${Date.now()}.webm`;
      fs.writeFileSync(tempFilePath, req.file.buffer);

      const isGroq = !!process.env.GROQ_API_KEY;
      const baseURL = isGroq
        ? "https://api.groq.com/openai/v1"
        : "https://api.openai.com/v1";
      const model = isGroq ? "whisper-large-v3" : "whisper-1";

      console.log(`🎤 Transcribing with ${isGroq ? 'Groq' : 'OpenAI'} (${model}) in ${language}...`);

      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: baseURL,
      });

      // Language-specific prompts to help Whisper understand context (ALL LANGUAGES)
      const languagePrompts: Record<string, string> = {
        'en': 'Transcribe this audio in English only.',
        'hi': 'इस ऑडियो को हिंदी में ट्रांसक्राइब करें।',
        'es': 'Transcribe este audio en español únicamente.',
        'fr': 'Transcrivez cet audio en français uniquement.',
        'de': 'Transkribieren Sie dieses Audio nur auf Deutsch.',
        'zh': '仅用中文转录此音频。',
        'ja': 'この音声を日本語のみで文字起こししてください。',
        'ko': '이 오디오를 한국어로만 필사하세요.',
        'pt': 'Transcreva este áudio apenas em português.',
        'ru': 'Транскрибируйте это аудио только на русском языке.',
        'ar': 'انسخ هذا الصوت بالعربية فقط.',
        'it': 'Trascrivi questo audio solo in italiano.',
        // Indian Languages
        'bn': 'এই অডিও বাংলায় ট্রান্সক্রাইব করুন।',
        'ta': 'இந்த ஆடியோவை தமிழில் மட்டுமே படியெடுக்கவும்.',
        'te': 'ఈ ఆడియోను తెలుగులో మాత్రమే ట్రాన్స్‌క్రైబ్ చేయండి.',
        'kn': 'ಈ ಆಡಿಯೋವನ್ನು ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಲಿಪ್ಯಂತರಿಸಿ.',
        'ml': 'ഈ ഓഡിയോ മലയാളത്തിൽ മാത്രം ട്രാൻസ്ക്രൈബ് ചെയ്യുക.',
        'mr': 'हा ऑडिओ फक्त मराठीत लिप्यंतरित करा.',
        'gu': 'આ ઓડિયોને ફક્ત ગુજરાતીમાં ટ્રાન્સક્રાઇબ કરો.',
        'pa': 'ਇਸ ਆਡੀਓ ਨੂੰ ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਟ੍ਰਾਂਸਕ੍ਰਾਈਬ ਕਰੋ.',
        'ur': 'اس آڈیو کو صرف اردو میں نقل کریں۔',
      };

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: model,
        language: language, // CRITICAL: This tells Whisper which language to expect
        prompt: languagePrompts[language] || 'Transcribe this audio.', // Additional context for better accuracy
      });

      // Cleanup
      fs.unlinkSync(tempFilePath);

      console.log("✅ Transcription result:", transcription.text);
      res.json({ text: transcription.text });

    } catch (error: any) {
      console.error("❌ Transcription Error:", error);
      res.status(500).json({
        error: "Transcription failed",
        details: error.message
      });
    }
  });

  return httpServer;
}