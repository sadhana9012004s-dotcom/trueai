import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  Paperclip,
  Send,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  FileAudio,
  FileVideo,
  FileImage,
} from "lucide-react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function DetectionArea() {
  const { user } = useUser();
  const { selectedChatId, chats, refreshChats, selectChat, addMessageToChat } =
    useDashboard();

  const [attachedFile, setAttachedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollRef = useRef(null);

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const messages = selectedChat?.messages || [];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getMediaSource = (msg) => {
    if (msg.content) return msg.content;
    if (msg.file) return URL.createObjectURL(msg.file);
    return "";
  };

  // ... (Keep existing onDrop and acceptedTypes logic)
  const acceptedTypes = {
    "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"],
    "video/*": [".mp4", ".webm", ".ogg", ".mov", ".avi"],
    "audio/mpeg": [".mp3"],
    "audio/wav": [".wav"],
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error("Unsupported file. Only images, videos, MP3 & WAV allowed.");
      return;
    }
    if (acceptedFiles[0]) {
      setAttachedFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: acceptedTypes,
    multiple: false,
    noClick: true,
  });

  // ... (Keep existing handleSubmit logic exactly as is)
  const handleSubmit = async () => {
    if (!attachedFile) {
      return;
    }

    const mimeType = attachedFile.type;
    const type = mimeType.startsWith("video/")
      ? "video"
      : mimeType.startsWith("audio/")
      ? "audio"
      : "image";

    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", attachedFile);
    formData.append("mime_type", mimeType);
    formData.append("email", user.emailAddresses[0].emailAddress);
    formData.append("clerk_user_id", user.id);

    if (selectedChatId) {
      formData.append("chat_id", selectedChatId);
    }

    const endpoint =
      type === "image"
        ? `${SERVER_URL}/api/image/analyze`
        : type === "video"
        ? `${SERVER_URL}/api/video/analyze`
        : `${SERVER_URL}/api/audio/analyze`;

    try {
      if (selectedChatId) {
        const userMsg = {
          id: Date.now().toString(),
          role: "user",
          file: attachedFile,
          type,
        };
        addMessageToChat(selectedChatId, userMsg);
      }

      const response = await axios.post(endpoint, formData, {
        timeout: 300000,
      });

      const data = response.data;

      if (!selectedChatId) {
        refreshChats();
        selectChat(data.chat_id);
      } else {
        const isAI = data.ai_message.label?.toLowerCase().includes("ai");

        const aiMsg = {
          id: data.ai_message.id,
          role: "aidentify",
          type: data.ai_message.type,
          content: data.ai_message.content,
          label: data.ai_message.label,
          confidence: data.ai_message.confidence,
          reason: data.ai_message.reason,
          result: isAI ? "AI" : "Real",
        };

        addMessageToChat(selectedChatId, aiMsg);
      }

      setAttachedFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper for file icon
  const getFileIcon = (type) => {
    if (type === "audio") return <FileAudio className="w-8 h-8 text-primary" />;
    if (type === "video") return <FileVideo className="w-8 h-8 text-primary" />;
    return <FileImage className="w-8 h-8 text-primary" />;
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="p-6 bg-secondary rounded-full">
                <BrainCircuit className="w-12 h-12 text-primary/50" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Start Analysis
                </h2>
                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                  Upload an image, audio clip, or video to detect if it was
                  generated by AI.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  relative max-w-[85%] md:max-w-xl rounded-2xl p-5 shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border rounded-bl-none"
                  }
                `}
              >
                {msg.role === "user" ? (
                  <div className="flex flex-col gap-2">
                    {/* Media Preview */}
                    <div className="rounded-lg overflow-hidden bg-background/10">
                      {msg.type === "image" && (
                        <img
                          src={getMediaSource(msg)}
                          alt="Uploaded"
                          className="max-h-[300px] w-auto object-cover"
                        />
                      )}
                      {msg.type === "video" && (
                        <video
                          controls
                          src={getMediaSource(msg)}
                          className="max-h-[300px] w-auto"
                        />
                      )}
                      {msg.type === "audio" && (
                        <div className="p-4 flex items-center gap-3 min-w-[250px]">
                          <FileAudio className="w-8 h-8 opacity-80" />
                          <audio
                            controls
                            src={getMediaSource(msg)}
                            className="h-8 w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-border pb-3">
                      {msg.result === "AI" ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                      <div>
                        <h4 className="font-bold text-lg leading-none">
                          {msg.result === "AI"
                            ? "AI Generated"
                            : "Human"}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          Confidence: {(msg.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {msg.reason && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {msg.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex justify-start w-full">
              <div className="bg-card border border-border px-6 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm font-medium animate-pulse">
                  Analyzing media content...
                </span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-border">
        <div className="max-w-3xl mx-auto">
          {attachedFile && (
            <div className="mb-3 flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-background rounded-md border border-border">
                  {getFileIcon(attachedFile.type.split("/")[0])}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(attachedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAttachedFile(null)}
                className="p-1 hover:bg-background rounded-full transition-colors hover:cursor-pointer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-secondary/30 border border-input rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring/20 transition-all">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <button
                  onClick={open}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors group hover:cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>

              <input
                type="text"
                readOnly
                placeholder="Upload image, video or audio..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm cursor-pointer"
                onClick={open}
                value={attachedFile ? "" : ""}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!attachedFile || isAnalyzing}
              className={`
                h-12 w-12 flex items-center justify-center rounded-xl transition-all shadow-sm
                ${
                  attachedFile && !isAnalyzing
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:cursor-pointer"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }
              `}
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/60 mt-2">
            AI can make mistakes. Please verify important results.
          </p>
        </div>
      </div>
    </div>
  );
}
