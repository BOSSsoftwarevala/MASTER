import { useState, useRef, useEffect } from 'react';
import { MessageSquareLock, Send, Lock, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useInternalAI } from '@/hooks/useAI';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'system' | 'ai';
  timestamp: Date;
}

const chatPurposes = [
  { value: 'task', label: 'Task Discussion' },
  { value: 'incident', label: 'Incident Coordination' },
  { value: 'help', label: 'Internal Help' },
  { value: 'escalation', label: 'Escalation' },
];

export function InternalChatBot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState<string>('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { loading, streamMessage, clearHistory } = useInternalAI(
    `Internal staff chat for ${chatPurposes.find(p => p.value === purpose)?.label || 'general'} purposes. User is an employee.`
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Log chat session start
  const logChatStart = async () => {
    try {
      await supabase.from('audit_logs').insert({
        action: 'internal_chat_started',
        module: 'internal_chat',
        user_email: user?.email || 'unknown',
        user_role: 'employee',
        details: `Chat purpose: ${chatPurposes.find(p => p.value === purpose)?.label}`,
        severity: 'info',
      });
    } catch (e) {
      console.error('Failed to log chat start:', e);
    }
  };

  const handleStartChat = async () => {
    if (!purpose) return;
    setChatStarted(true);
    await logChatStart();
    setMessages([
      {
        id: '1',
        content: `Secure internal chat started for: ${chatPurposes.find(p => p.value === purpose)?.label}. All messages are encrypted and logged for audit purposes.`,
        sender: 'system',
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setStreamingContent('');

    let fullResponse = '';
    
    await streamMessage(
      currentInput,
      (chunk) => {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      },
      () => {
        if (fullResponse) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: fullResponse,
              sender: 'ai',
              timestamp: new Date(),
            },
          ]);
        }
        setStreamingContent('');
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setChatStarted(false);
      setPurpose('');
      setMessages([]);
      clearHistory();
    }, 300);
  };

  // Prevent copy/paste in the chat area
  const preventCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageSquareLock className="h-4 w-4 text-warning" />
          <span className="hidden md:inline text-sm">Internal</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border bg-warning/5">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
              <MessageSquareLock className="h-4 w-4 text-warning" />
            </div>
            <div>
              <span className="block">Secure Internal Chat</span>
              <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Encrypted & Logged
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        {!chatStarted ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center gap-6">
            <div className="text-center space-y-2">
              <Shield className="h-12 w-12 text-warning mx-auto mb-4" />
              <h3 className="font-semibold">Select Chat Purpose</h3>
              <p className="text-sm text-muted-foreground">
                Purpose selection is mandatory for audit compliance
              </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose..." />
                </SelectTrigger>
                <SelectContent>
                  {chatPurposes.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleStartChat}
                disabled={!purpose}
                className="w-full"
              >
                Start Secure Chat
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center mt-4 space-y-1">
              <p>• No copy / paste / screenshot allowed</p>
              <p>• All messages are encrypted</p>
              <p>• Full audit trail maintained</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 bg-muted/50 border-b border-border">
              <Badge variant="outline" className="bg-warning/10 border-warning/30 text-warning">
                {chatPurposes.find(p => p.value === purpose)?.label}
              </Badge>
            </div>

            <ScrollArea 
              className="flex-1 p-4 select-none" 
              ref={scrollRef}
              onCopy={preventCopy}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback
                        className={
                          message.sender === 'system'
                            ? 'bg-warning/20 text-warning'
                            : message.sender === 'ai'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {message.sender === 'system' ? (
                          <Shield className="h-4 w-4" />
                        ) : message.sender === 'ai' ? (
                          <MessageSquareLock className="h-4 w-4" />
                        ) : (
                          'Y'
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        message.sender === 'user'
                          ? 'bg-warning text-warning-foreground'
                          : message.sender === 'ai'
                          ? 'bg-primary/10'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className="text-[10px] opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Streaming response */}
                {streamingContent && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <MessageSquareLock className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 max-w-[80%] bg-primary/10">
                      <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                    </div>
                  </div>
                )}
                
                {/* Loading indicator */}
                {loading && !streamingContent && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted">
                      <p className="text-sm text-muted-foreground">Processing securely...</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type secure message..."
                  className="flex-1"
                  disabled={loading}
                  onPaste={preventCopy}
                />
                <Button type="submit" size="icon" variant="secondary" disabled={loading || !input.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
