import { useState } from "react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import {
  PlusCircle,
  History,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
} from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useDashboard } from "../dashboard/DashboardProvider";

export default function Sidebar() {
  const { chats, selectedChatId, createNewChat, selectChat, deleteChat } =
    useDashboard();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <Tooltip.Provider>
      <aside
        className={`
          relative flex flex-col bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out h-screen
          ${isOpen ? "w-72" : "w-[80px] items-center"}
        `}
      >
        {/* Header / Logo */}
        <div
          className={`
            h-16 flex items-center border-b border-sidebar-border w-full 
            ${isOpen ? "justify-start px-6" : "justify-center"}
          `}
        >
          <Link to="/" className="flex items-center group hover:cursor-pointer">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          {/* New Button */}
          <button
            onClick={createNewChat}
            className={`
              flex items-center justify-center gap-2 rounded-lg font-medium
              bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:cursor-pointer
              ${
                isOpen
                  ? "w-full py-2.5 shadow-sm"
                  : "w-10 h-10 p-0 rounded-full"
              }
            `}
            title="New Detection"
          >
            <PlusCircle className="w-5 h-5" />
            {isOpen && <span>New Analysis</span>}
          </button>

          {/* Recent List */}
          <div className="flex-1 overflow-y-auto mt-4">
            {isOpen ? (
              <>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                  History
                </h3>
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <SidebarItem
                      key={chat.id}
                      chat={chat}
                      isSelected={selectedChatId === chat.id}
                      onClick={() => selectChat(chat.id)}
                      onDelete={() => deleteChat(chat.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <History className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <UserButton
              appearance={{
                elements: {
                  rootBox: "w-8 h-8",
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            {isOpen && (
              <div className="text-xs text-muted-foreground truncate">
                Account
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors hover:cursor-pointer"
          >
            {isOpen ? (
              <ChevronsLeft className="w-4 h-4" />
            ) : (
              <ChevronsRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
