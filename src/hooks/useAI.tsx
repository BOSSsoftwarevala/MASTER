import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AIAgentType = 
  | 'auto_development'
  | 'seo_ai'
  | 'lead_ai'
  | 'support_ai'
  | 'internal_ai'
  | 'incident_ai'
  | 'recovery_ai'
  | 'cost_ai'
  | 'hr_ai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseAIOptions {
  agentType: AIAgentType;
  context?: string;
  onError?: (error: string) => void;
}

export function useAI({ agentType, context, onError }: UseAIOptions) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(async (userMessage: string): Promise<string | null> => {
    setLoading(true);
    
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const { data, error } = await supabase.functions.invoke('ai-router', {
        body: {
          agentType,
          messages: newMessages,
          context,
          stream: false,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.fallback) {
        toast.info(data.message || 'AI is optimizing. Please try again.');
        onError?.(data.error);
        return null;
      }

      const assistantMessage = data.choices?.[0]?.message?.content || '';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      
      return assistantMessage;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get AI response';
      toast.error('Unable to connect to AI. Please try again.');
      onError?.(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [agentType, context, messages, onError]);

  const streamMessage = useCallback(async (
    userMessage: string,
    onDelta: (chunk: string) => void,
    onDone: () => void
  ) => {
    setLoading(true);
    
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-router`;
    
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          agentType,
          messages: newMessages,
          context,
          stream: true,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.info('AI is busy. Please wait a moment.');
        } else if (resp.status === 402) {
          toast.warning('AI quota reached. Contact admin.');
        } else {
          toast.error('AI connection issue. Retrying...');
        }
        onDone();
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              onDelta(content);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      onDone();
    } catch (err) {
      console.error('Stream error:', err);
      toast.error('Connection interrupted. Please try again.');
      onDone();
    } finally {
      setLoading(false);
    }
  }, [agentType, context, messages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    loading,
    messages,
    sendMessage,
    streamMessage,
    clearHistory,
  };
}

// Specialized hooks for each AI agent
export function useAutoDevAI(context?: string) {
  return useAI({ agentType: 'auto_development', context });
}

export function useSEOAI(context?: string) {
  return useAI({ agentType: 'seo_ai', context });
}

export function useLeadAI(context?: string) {
  return useAI({ agentType: 'lead_ai', context });
}

export function useSupportAI(context?: string) {
  return useAI({ agentType: 'support_ai', context });
}

export function useInternalAI(context?: string) {
  return useAI({ agentType: 'internal_ai', context });
}

export function useIncidentAI(context?: string) {
  return useAI({ agentType: 'incident_ai', context });
}

export function useRecoveryAI(context?: string) {
  return useAI({ agentType: 'recovery_ai', context });
}

export function useCostAI(context?: string) {
  return useAI({ agentType: 'cost_ai', context });
}

export function useHRAI(context?: string) {
  return useAI({ agentType: 'hr_ai', context });
}
