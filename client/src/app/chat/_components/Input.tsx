import { Input as UIInput } from "@/components/ui/input";
import { ComponentProps } from "react";

interface ChatInputProps extends ComponentProps<typeof UIInput> {
  onSend?: () => void;
}

export const ChatInput = ({ onSend, onKeyDown, ...props }: ChatInputProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSend) {
      onSend();
    }
    onKeyDown?.(e);
  };

  return <UIInput {...props} onKeyDown={handleKeyDown} />;
};

export default ChatInput;
