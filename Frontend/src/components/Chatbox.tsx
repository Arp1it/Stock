import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";

const genAI = new GoogleGenerativeAI("VITE-API-KEY(USE .env)");

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // --------------------------------------
  // 🎤 Voice Input
  // --------------------------------------
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice input not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (e) => {
      const transcript = e.results[1][0].transcript;
      setTxt(transcript);
    };e

    recognition.start();
    recognitionRef.current = recognition;
  };

  // --------------------------------------
  // ✉️ Send Message
  // --------------------------------------
  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(userMsg.text);

      const aiMsg = {
        role: "assistant",
        text: result.response.text(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Something went wrong.",
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto  mt-6">
      <Card className="bg-neutral-900 border-neutral-700">
        <CardContent className="p-4">
          {/* CHAT WINDOW */}
          <div className="h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-neutral-800 text-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto bg-neutral-800 text-gray-300 p-3 rounded-xl">
                Typing...
              </div>
            )}
          </div>

          {/* INPUT AREA */}
          <div className="flex items-center gap-2 mt-4">
            {/* Mic Button */}
            <Button
              onClick={startVoiceInput}
              className={`rounded-full px-3 ${
                isRecording ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              🎤
            </Button>

            {/* Input */}
            <Input
              className="flex-1 bg-neutral-800 border-neutral-700 text-gray-200"
              placeholder={isRecording ? "Listening..." : "Type your message..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            {/* Send */}
            <Button onClick={sendMessage} className="bg-blue-600 text-white">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
