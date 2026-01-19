import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardContext = createContext(undefined);

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export function DashboardProvider({ children }) {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  useEffect(() => {
    if (user?.emailAddresses[0].emailAddress) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const email = user?.emailAddresses[0].emailAddress;
      const response = await axios.get(
        `${SERVER_URL}/api/chat/history?email=${email}`
      );

      // Map backend response to frontend Chat object
      const mappedChats = response.data.map((chat) => ({
        id: chat._id,
        name: chat.title,
        messages: chat.messages.map((message) => ({
          ...message,
          result: message.label?.toLowerCase().includes("ai") ? "AI" : "Real",
        })),
      }));

      setChats(mappedChats);
    } catch (error) {
      console.log("Failed to fetch history: ", error);
    }
  };

  const createNewChat = () => {
    setSelectedChatId(null);
  };

  const selectChat = (id) => setSelectedChatId(id);

  const addMessageToChat = (chatId, message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );
  };

  const deleteChat = async (chatId) => {
    try {
      const email = user?.emailAddresses[0].emailAddress;
      await axios.delete(
        `${SERVER_URL}/api/chat/delete?email=${email}&chatId=${chatId}`
      );

      if (selectedChatId === chatId) {
        createNewChat();
      }

      fetchHistory();
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.log("Failed to delete chat: ", error);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        chats,
        selectedChatId,
        createNewChat,
        selectChat,
        addMessageToChat,
        refreshChats: fetchHistory,
        deleteChat,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
};
