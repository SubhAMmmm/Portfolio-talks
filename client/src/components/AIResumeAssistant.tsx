import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  MicOff,
  User,
  Bot,
  Loader2,
  X,
  MessageCircle,
  Sparkles,
  Minimize2,
  Globe,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Language {
  code: string;
  name: string;
  flag?: string;   // for international languages
  logo?: string;   // for Indian languages
  isIndian?: boolean;
}

const RESUME_DATA = `
# SUBHAM - GenAI Engineer & Full-Stack Developer

## CONTACT
- Email: subhamid007@gmail.com
- LinkedIn: linkedin.com/in/subhamsahu21/
- GitHub: github.com/SubhAMmmm
- Location: New Delhi, Delhi, IN

## PROFESSIONAL SUMMARY
GenAI Engineer with 1+ year of hands-on experience at Brandscapes Worldwide. Specialized in designing and deploying scalable AI solutions, from RAG-based chatbots to custom LLM applications, leveraging cloud infrastructure to deliver high-performance results.

## WORK EXPERIENCE

### GenAI Engineer - Brandscapes Worldwide (Jan 2024 - Present)
- Built production-grade RAG systems with 90%+ retrieval accuracy
- Reduced inference costs by 40% using optimized prompt & model routing
- Designed scalable AI APIs using FastAPI & Python
- Integrated GenAI into enterprise workflows
- Technologies: Python, LangChain, FastAPI, OpenAI, Pinecone, RAG, Vector DBs, Prompt Engineering

### Full Stack Developer - Tech Solutions Inc (Mar 2022 - Dec 2023)
- Developed responsive web applications using React & Next.js
- Built RESTful APIs and microservices with Node.js
- Improved application performance by 60%
- Collaborated with cross-functional teams on enterprise projects
- Technologies: React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Docker, AWS

## EDUCATION
- Bachelor of Technology in Computer Science Engineering (2020-2024)
- GPA: 8.5/10

## CERTIFICATIONS
- Oracle AI Vector Search Professional (OCI-2025)
- OCI 2025 Generative AI Professional (OCI-GENAI)
- NPTEL-IIT KGP Machine Learning (NPTEL-ML)
- upGrad AI & ML Specialization (UPGRAD-AI)

## PROJECTS

### CI/CD Pipeline Design
- Robust CI/CD pipeline design for AWS with Jenkins & ArgoCD
- Developed Dockerfile for containerization
- Managed GitHub repositories for code and Kubernetes manifests
- Technologies: AWS, Jenkins, ArgoCD, Kubernetes, GitOps

### ML Lead Conversion
- Developed logistic regression model for lead conversion prediction
- Conducted data preprocessing and feature selection
- Technologies: Python, Logistic Regression, ML, Data Science

### Shopping Cart App
- Fully functional shopping cart with React.js and Redux
- User authentication and cart management
- Technologies: React, Redux, Tailwind CSS, JavaScript

### Cloud AI Backend
- Scalable microservices architecture on Azure
- Optimized for heavy AI workloads
- Technologies: Azure, Docker, FastAPI, Celery

## SKILLS
- Languages: Python, JavaScript, TypeScript
- AI/ML: LangChain, RAG, Vector Databases, Prompt Engineering, OpenAI, Machine Learning
- Backend: FastAPI, Node.js, Express
- Frontend: React, Next.js, Redux, Tailwind CSS
- Cloud: AWS, Azure
- DevOps: Docker, Kubernetes, Jenkins, ArgoCD
- Databases: MongoDB, PostgreSQL, Pinecone
`;

// Updated LANGUAGES array - removed duplicate Hindi
const LANGUAGES: Language[] = [
  // International Languages
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },

  // Indian Languages (NO FLAGS, with native script logos)
  { code: "hi", name: "Hindi", logo: "हि", isIndian: true },
  { code: "bn", name: "Bengali", logo: "ব", isIndian: true },
  { code: "ta", name: "Tamil", logo: "த", isIndian: true },
  { code: "te", name: "Telugu", logo: "త", isIndian: true },
  { code: "kn", name: "Kannada", logo: "ಕ", isIndian: true },
  { code: "ml", name: "Malayalam", logo: "മ", isIndian: true },
  { code: "mr", name: "Marathi", logo: "म", isIndian: true },
  { code: "gu", name: "Gujarati", logo: "ગ", isIndian: true },
  { code: "pa", name: "Punjabi", logo: "ਪ", isIndian: true },
  { code: "ur", name: "Urdu", logo: "اُ", isIndian: true },
];

export default function AIResumeAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Qyra, Subham's personal AI assistant. Ask me anything about his experience, skills, projects, or background!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]); // Default to English
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speak = (text: string) => {
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);

    // Extended language-specific voice settings (ALL LANGUAGES)
    const langMap: { [key: string]: string } = {
      // International
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'pt': 'pt-PT',
      'ru': 'ru-RU',
      'ar': 'ar-SA',
      'it': 'it-IT',
      // Indian Languages
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'pa': 'pa-IN',
      'ur': 'ur-IN',
    };

    utterance.lang = langMap[selectedLanguage.code] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = async () => {
    if (isListening) {
      // Stop both speech recognition and recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      setMicError("");

      // Start audio recording first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        if (audioBlob.size === 0) return;

        // Only send to server if we don't have text from speech recognition
        if (!input.trim()) {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', selectedLanguage.code);

          try {
            setIsTranscribing(true);
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Transcription failed');
            }

            const data = await response.json();
            if (data.text) {
              setInput(data.text);
            }
          } catch (error) {
            console.error('Transcription error:', error);
            setMicError('Failed to transcribe audio. Please try again.');
            setTimeout(() => setMicError(""), 5000);
          } finally {
            setIsTranscribing(false);
          }
        }
      };

      mediaRecorder.start();
      setIsListening(true);

      // Try Web Speech API for real-time transcription (optional enhancement)
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;

          const speechLangMap: { [key: string]: string } = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'es': 'es-ES',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'zh': 'zh-CN',
            'ja': 'ja-JP',
            'ko': 'ko-KR',
            'pt': 'pt-PT',
            'ru': 'ru-RU',
            'ar': 'ar-SA',
            'it': 'it-IT',
            'bn': 'bn-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'kn': 'kn-IN',
            'ml': 'ml-IN',
            'mr': 'mr-IN',
            'gu': 'gu-IN',
            'pa': 'pa-IN',
            'ur': 'ur-IN',
          };

          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = speechLangMap[selectedLanguage.code] || 'en-US';
          recognition.maxAlternatives = 1;

          let finalTranscriptText = '';

          recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
              } else {
                interimTranscript += transcript;
              }
            }

            // Update final transcript accumulator
            if (finalTranscript) {
              finalTranscriptText += finalTranscript;
            }

            // Always update input box with final + interim text (real-time typing)
            setInput((finalTranscriptText + interimTranscript).trim());
          };

          recognition.onerror = (event: any) => {
            console.log('Speech recognition error (non-critical):', event.error);
            // Don't show error for network issues in speech recognition
            // The recording will still work as fallback
            if (event.error === 'aborted' || event.error === 'no-speech') {
              // These are normal, ignore them
              return;
            }
          };

          recognition.onend = () => {
            // Don't restart automatically
            console.log('Speech recognition ended');
          };

          recognition.start();
        } catch (err) {
          console.log('Speech recognition not available, using recording only');
          // Silently fail - recording will still work
        }
      }

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setMicError('Could not access microphone. Please allow permissions.');
      setTimeout(() => setMicError(""), 5000);
      setIsListening(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          history: messages.slice(1).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          resumeData: RESUME_DATA,
          language: selectedLanguage.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from AI");
      }

      const data = await response.json();

      if (!data.message) {
        throw new Error("Invalid response format from server");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (autoSpeak) {
        speak(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          error instanceof Error
            ? `Sorry, I encountered an error: ${error.message}`
            : "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 w-16 h-16 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full shadow-2xl flex items-center justify-center z-[9999] group overflow-hidden active:scale-95 transition-transform touch-manipulation"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.15
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MessageCircle className="w-8 h-8 text-white relative z-10" />

            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
                ease: "easeInOut"
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                onClick={() => setIsOpen(false)}
              />
            )}

            <motion.div
              initial={{ opacity: 0, scale: isMobile ? 0.95 : 0.5, y: isMobile ? 100 : 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: isMobile ? 0.95 : 0.5, y: isMobile ? 100 : 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed z-[9999] flex flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-black backdrop-blur-2xl border border-gray-700/50 shadow-2xl overflow-hidden ${isMobile
                ? 'top-16 left-0 right-0 bottom-0 rounded-none'
                : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[360px] h-[520px] rounded-2xl'
                }`}

            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-orange-600/10 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.1),transparent)] pointer-events-none" />

              {/* Header */}
              <motion.div
                className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4 sm:p-5 flex items-center justify-between overflow-hidden safe-top"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_50%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent_50%)]" />
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <motion.div
                    className="relative w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Bot className="w-7 h-7 text-white" />
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-white/20"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white tracking-tight">Qyra</h2>
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                    </div>
                    <p className="text-xs text-white/90 font-medium">Subham's AI Assistant</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  {/* Language Selector */}
                  <div className="relative z-[10000]">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowLanguageMenu(!showLanguageMenu);
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 flex items-center gap-1.5 touch-manipulation"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Select Language"
                    >
                      {selectedLanguage.isIndian ? (
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                          {selectedLanguage.logo}
                        </div>
                      ) : (
                        <span className="text-lg">{selectedLanguage.flag}</span>
                      )}

                      <Globe className="w-4 h-4 text-white" />
                    </motion.button>

                    <AnimatePresence>
                      {showLanguageMenu && (
                        <>
                          {/* Backdrop for closing menu */}
                          <div
                            className="fixed inset-0 z-[9999]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowLanguageMenu(false);
                            }}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-[80px] right-[24px] w-56 bg-gray-800 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[10000] max-h-[400px] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {LANGUAGES.map((lang) => (
                              <button
                                key={`${lang.code}-${lang.isIndian ? 'indian' : 'intl'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLanguage(lang);
                                  setShowLanguageMenu(false);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 transition-all text-left ${selectedLanguage.code === lang.code && selectedLanguage.isIndian === lang.isIndian
                                  ? 'bg-purple-600/30 text-white'
                                  : 'text-gray-300 hover:bg-gray-700/70'
                                  }`}
                              >
                                {lang.isIndian ? (
                                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center font-bold text-sm">
                                    {lang.logo}
                                  </div>
                                ) : (
                                  <span className="text-xl">{lang.flag}</span>
                                )}

                                <span className="flex-1 font-medium">{lang.name}</span>
                                {selectedLanguage.code === lang.code && selectedLanguage.isIndian === lang.isIndian && (
                                  <Check className="w-4 h-4 text-purple-400" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    onClick={() => {
                      setAutoSpeak(!autoSpeak);
                      if (!autoSpeak) stopSpeaking();
                    }}
                    className={`p-2.5 rounded-xl transition-all backdrop-blur-sm border touch-manipulation ${autoSpeak
                      ? "bg-white/20 text-white border-white/30 shadow-lg"
                      : "bg-white/10 text-white/60 border-white/20"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={autoSpeak ? "Voice On" : "Voice Off"}
                  >
                    {autoSpeak ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      stopSpeaking();
                    }}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20 touch-manipulation"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMobile ? <X className="w-5 h-5 text-white" /> : <Minimize2 className="w-5 h-5 text-white" />}
                  </motion.button>
                </div>
              </motion.div>

              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-4 relative ${isMobile ? 'pb-safe' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                      {msg.role === "assistant" && (
                        <motion.div
                          className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg border border-purple-400/30"
                          initial={{ rotate: -180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          <Bot className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                      <motion.div
                        className={`max-w-[75%] p-4 rounded-2xl text-base backdrop-blur-sm border shadow-lg ${msg.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-500/30"
                          : "bg-gray-800/90 text-gray-100 border-gray-700/50"
                          }`}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </motion.div>
                      {msg.role === "user" && (
                        <motion.div
                          className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg border border-blue-500/30"
                          initial={{ rotate: 180, scale: 0 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: "spring", damping: 15 }}
                        >
                          <User className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg border border-purple-400/30">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-800/90 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/50 shadow-lg flex gap-1.5">
                      <motion.div
                        className="w-2 h-2 bg-purple-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-pink-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-orange-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <motion.div
                className={`p-4 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-xl relative ${isMobile ? 'pb-safe' : ''}`}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                {/* Error Message */}
                <AnimatePresence>
                  {micError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-red-500/20"
                    >
                      <X className="w-4 h-4" />
                      <span className="font-medium">{micError}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Listening Indicator */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center gap-2 text-green-400 text-sm bg-green-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-green-500/20"
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="font-medium">Listening... Speak now</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Transcribing Indicator */}
                <AnimatePresence>
                  {isTranscribing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-blue-500/20"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-medium">Processing audio...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center gap-2 text-purple-400 text-sm bg-purple-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-purple-500/20"
                    >
                      <div className="flex gap-1">
                        <motion.div
                          className="w-1 h-4 bg-purple-500 rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-1 h-4 bg-pink-500 rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                        />
                        <motion.div
                          className="w-1 h-4 bg-orange-500 rounded-full"
                          animate={{ scaleY: [1, 1.5, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                        />
                      </div>
                      <span className="font-medium">Qyra is speaking...</span>
                      <motion.button
                        onClick={stopSpeaking}
                        className="ml-auto text-xs bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1 rounded-full transition-all font-medium border border-purple-500/20 touch-manipulation"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Stop
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-3 text-base text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner touch-manipulation"
                    disabled={isLoading}
                  />
                  <motion.button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`${isListening
                      ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500/30'
                      : 'bg-gray-800/90 border-gray-700/50 hover:bg-gray-700/90'
                      } disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white px-4 py-3 rounded-2xl transition-all flex items-center justify-center shadow-lg border disabled:border-gray-700 touch-manipulation min-w-[56px]`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isListening ? "Stop listening" : "Speak your question"}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      >
                        <Mic className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </motion.button>
                  <motion.button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white px-5 py-3 rounded-2xl transition-all flex items-center justify-center shadow-lg border border-purple-500/30 disabled:border-gray-700 touch-manipulation min-w-[56px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}