"use client";

import ChatbotLauncher from "@/components/ui/ChatbotLauncher";

/**
 * EnsisChatbot: Mounts the multimodal AI voice & text assistant launcher.
 * Automatically loads the interactive CSS robot and lazily connects the voice call engine.
 */
export default function EnsisChatbot({ initialLogo }: { initialLogo?: string }) {
  return <ChatbotLauncher loadChat={true} initialLogo={initialLogo} />;
}
