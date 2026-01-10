import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Campaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type CampaignInsert = Database['public']['Tables']['marketing_campaigns']['Insert'];
type CampaignUpdate = Database['public']['Tables']['marketing_campaigns']['Update'];

type SeoKeyword = Database['public']['Tables']['seo_keywords']['Row'];
type SeoKeywordInsert = Database['public']['Tables']['seo_keywords']['Insert'];
type SeoKeywordUpdate = Database['public']['Tables']['seo_keywords']['Update'];

type SeoPage = Database['public']['Tables']['seo_pages']['Row'];
type SeoPageInsert = Database['public']['Tables']['seo_pages']['Insert'];
type SeoPageUpdate = Database['public']['Tables']['seo_pages']['Update'];

type SeoIssue = Database['public']['Tables']['seo_issues']['Row'];
type SeoIssueInsert = Database['public']['Tables']['seo_issues']['Insert'];
type SeoIssueUpdate = Database['public']['Tables']['seo_issues']['Update'];

type ContentItem = Database['public']['Tables']['content_items']['Row'];
type ContentItemInsert = Database['public']['Tables']['content_items']['Insert'];
type ContentItemUpdate = Database['public']['Tables']['content_items']['Update'];

type LeadSource = Database['public']['Tables']['lead_sources']['Row'];
type LeadSourceInsert = Database['public']['Tables']['lead_sources']['Insert'];
type LeadSourceUpdate = Database['public']['Tables']['lead_sources']['Update'];

type AiSuggestion = Database['public']['Tables']['ai_marketing_suggestions']['Row'];
type AiSuggestionUpdate = Database['public']['Tables']['ai_marketing_suggestions']['Update'];

// Campaigns
export function useCampaigns() {
  return useQuery({
    queryKey: ['marketing-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['marketing-campaign', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Campaign;
    },
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (campaign: Omit<CampaignInsert, 'created_by'>) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert({ ...campaign, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({ title: 'Campaign created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create campaign', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: CampaignUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({ title: 'Campaign updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update campaign', description: error.message, variant: 'destructive' });
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update({ 
          status: 'paused', 
          paused_at: new Date().toISOString(), 
          paused_by: user?.id,
          paused_reason: reason 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({ title: 'Campaign paused successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to pause campaign', description: error.message, variant: 'destructive' });
    },
  });
}

export function useResumeCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .update({ 
          status: 'active', 
          paused_at: null, 
          paused_by: null,
          paused_reason: null 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({ title: 'Campaign resumed successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to resume campaign', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marketing_campaigns')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-campaigns'] });
      toast({ title: 'Campaign deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete campaign', description: error.message, variant: 'destructive' });
    },
  });
}

// Budget History
export function useBudgetHistory(campaignId: string) {
  return useQuery({
    queryKey: ['campaign-budget-history', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_budget_history')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
  });
}

// SEO Keywords
export function useSeoKeywords() {
  return useQuery({
    queryKey: ['seo-keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SeoKeyword[];
    },
  });
}

export function useCreateSeoKeyword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (keyword: Omit<SeoKeywordInsert, 'created_by'>) => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .insert({ ...keyword, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast({ title: 'Keyword added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add keyword', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSeoKeyword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SeoKeywordUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('seo_keywords')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast({ title: 'Keyword updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update keyword', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteSeoKeyword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('seo_keywords')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-keywords'] });
      toast({ title: 'Keyword deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete keyword', description: error.message, variant: 'destructive' });
    },
  });
}

// SEO Pages
export function useSeoPages() {
  return useQuery({
    queryKey: ['seo-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_pages')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as SeoPage[];
    },
  });
}

export function useCreateSeoPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (page: Omit<SeoPageInsert, 'created_by'>) => {
      const { data, error } = await supabase
        .from('seo_pages')
        .insert({ ...page, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      toast({ title: 'Page added successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to add page', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateSeoPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: SeoPageUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('seo_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      toast({ title: 'Page updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update page', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteSeoPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('seo_pages')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-pages'] });
      toast({ title: 'Page deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete page', description: error.message, variant: 'destructive' });
    },
  });
}

// SEO Issues
export function useSeoIssues() {
  return useQuery({
    queryKey: ['seo-issues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_issues')
        .select('*, seo_pages(*)')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useResolveSeoIssue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('seo_issues')
        .update({ 
          status: 'resolved', 
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-issues'] });
      toast({ title: 'Issue resolved successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to resolve issue', description: error.message, variant: 'destructive' });
    },
  });
}

// Content Items
export function useContentItems() {
  return useQuery({
    queryKey: ['content-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContentItem[];
    },
  });
}

export function useContentItem(id: string) {
  return useQuery({
    queryKey: ['content-item', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as ContentItem;
    },
    enabled: !!id,
  });
}

export function useCreateContentItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (content: Omit<ContentItemInsert, 'author_id'>) => {
      const { data, error } = await supabase
        .from('content_items')
        .insert({ ...content, author_id: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast({ title: 'Content created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create content', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateContentItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ContentItemUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('content_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast({ title: 'Content updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update content', description: error.message, variant: 'destructive' });
    },
  });
}

export function useApproveContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content_items')
        .update({ 
          status: 'approved', 
          approved_at: new Date().toISOString(),
          approved_by: user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast({ title: 'Content approved successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to approve content', description: error.message, variant: 'destructive' });
    },
  });
}

export function usePublishContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('content_items')
        .update({ 
          status: 'published', 
          published_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast({ title: 'Content published successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to publish content', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteContentItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('content_items')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-items'] });
      toast({ title: 'Content deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete content', description: error.message, variant: 'destructive' });
    },
  });
}

// Lead Sources
export function useLeadSources() {
  return useQuery({
    queryKey: ['lead-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sources')
        .select('*')
        .eq('is_deleted', false)
        .order('priority', { ascending: true });
      if (error) throw error;
      return data as LeadSource[];
    },
  });
}

export function useCreateLeadSource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (source: Omit<LeadSourceInsert, 'created_by'>) => {
      const { data, error } = await supabase
        .from('lead_sources')
        .insert({ ...source, created_by: user?.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast({ title: 'Lead source created successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to create lead source', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateLeadSource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: LeadSourceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('lead_sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast({ title: 'Lead source updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to update lead source', description: error.message, variant: 'destructive' });
    },
  });
}

export function useToggleLeadSource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      const { data, error } = await supabase
        .from('lead_sources')
        .update({ is_enabled: enabled })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { enabled }) => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast({ title: enabled ? 'Lead source enabled' : 'Lead source disabled' });
    },
    onError: (error) => {
      toast({ title: 'Failed to toggle lead source', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteLeadSource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('lead_sources')
        .update({ is_deleted: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-sources'] });
      toast({ title: 'Lead source deleted successfully' });
    },
    onError: (error) => {
      toast({ title: 'Failed to delete lead source', description: error.message, variant: 'destructive' });
    },
  });
}

// AI Suggestions
export function useAiSuggestions() {
  return useQuery({
    queryKey: ['ai-marketing-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_marketing_suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as AiSuggestion[];
    },
  });
}

export function useAcceptAiSuggestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('ai_marketing_suggestions')
        .update({ 
          status: 'accepted', 
          accepted_at: new Date().toISOString(),
          accepted_by: user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-marketing-suggestions'] });
      toast({ title: 'Suggestion accepted' });
    },
    onError: (error) => {
      toast({ title: 'Failed to accept suggestion', description: error.message, variant: 'destructive' });
    },
  });
}

export function useRejectAiSuggestion() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('ai_marketing_suggestions')
        .update({ 
          status: 'rejected', 
          rejected_at: new Date().toISOString(),
          rejected_by: user?.id,
          rejection_reason: reason 
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-marketing-suggestions'] });
      toast({ title: 'Suggestion rejected' });
    },
    onError: (error) => {
      toast({ title: 'Failed to reject suggestion', description: error.message, variant: 'destructive' });
    },
  });
}

// Dashboard Stats
export function useMarketingStats() {
  return useQuery({
    queryKey: ['marketing-stats'],
    queryFn: async () => {
      const [campaigns, keywords, content, sources, suggestions] = await Promise.all([
        supabase.from('marketing_campaigns').select('*', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('seo_keywords').select('*', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('content_items').select('*', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('lead_sources').select('*', { count: 'exact' }).eq('is_deleted', false),
        supabase.from('ai_marketing_suggestions').select('*', { count: 'exact' }).eq('status', 'pending'),
      ]);

      const activeCampaigns = campaigns.data?.filter(c => c.status === 'active').length || 0;
      const totalBudget = campaigns.data?.reduce((sum, c) => sum + (Number(c.budget) || 0), 0) || 0;
      const totalSpent = campaigns.data?.reduce((sum, c) => sum + (Number(c.spent) || 0), 0) || 0;
      const totalLeads = campaigns.data?.reduce((sum, c) => sum + (c.leads_generated || 0), 0) || 0;

      return {
        totalCampaigns: campaigns.count || 0,
        activeCampaigns,
        totalBudget,
        totalSpent,
        totalLeads,
        totalKeywords: keywords.count || 0,
        totalContent: content.count || 0,
        totalSources: sources.count || 0,
        pendingSuggestions: suggestions.count || 0,
      };
    },
  });
}
