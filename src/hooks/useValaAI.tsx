import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// VALA AI Configuration Types
export interface ValaAIIdentity {
  role_code: string;
  priority_level: string;
  reports_to: string[];
  ui_badge: string;
  color_tag: string;
}

export interface ValaAIPermissions {
  can_read_all: boolean;
  can_monitor_roles: boolean;
  can_suggest_actions: boolean;
  can_execute_auto_actions: boolean;
  can_trigger_auto_fix: boolean;
  can_trigger_auto_recovery: boolean;
  can_pause_risky_ops: boolean;
  can_route_leads: boolean;
  can_score_leads: boolean;
  can_optimize_costs: boolean;
  can_generate_reports: boolean;
  can_request_approvals: boolean;
}

export interface ValaAIRestrictions {
  can_delete_data: boolean;
  can_remove_black_box: boolean;
  can_override_boss_lock: boolean;
  can_change_core_security: boolean;
  can_expose_internal_logic: boolean;
}

export interface ValaAIScope {
  modules: string[];
}

export interface ValaAIOperationMode {
  silent_mode: boolean;
  high_risk_requires_approval: boolean;
  immutable_logging: boolean;
  monitored_by_black_box: boolean;
  impersonation_blocked: boolean;
  session_sharing_blocked: boolean;
}

export interface ValaAIConfig {
  identity: ValaAIIdentity;
  permissions: ValaAIPermissions;
  restrictions: ValaAIRestrictions;
  scope: ValaAIScope;
  operation_mode: ValaAIOperationMode;
}

export interface ValaAIActionLog {
  id: string;
  action_type: string;
  action_scope: string;
  target_entity_type: string | null;
  target_entity_id: string | null;
  action_details: Record<string, unknown>;
  risk_level: string;
  approval_required: boolean;
  approval_status: string;
  approved_by: string | null;
  executed_at: string | null;
  result: Record<string, unknown> | null;
  created_at: string;
}

// Fetch VALA AI configuration
export function useValaAIConfig() {
  return useQuery({
    queryKey: ['vala_ai_config'],
    queryFn: async (): Promise<ValaAIConfig> => {
      const { data, error } = await supabase
        .from('vala_ai_config')
        .select('config_key, config_value');

      if (error) throw error;

      const config: Partial<ValaAIConfig> = {};
      data?.forEach((row: { config_key: string; config_value: unknown }) => {
        switch (row.config_key) {
          case 'identity':
            config.identity = row.config_value as ValaAIIdentity;
            break;
          case 'permissions':
            config.permissions = row.config_value as ValaAIPermissions;
            break;
          case 'restrictions':
            config.restrictions = row.config_value as ValaAIRestrictions;
            break;
          case 'scope':
            config.scope = row.config_value as ValaAIScope;
            break;
          case 'operation_mode':
            config.operation_mode = row.config_value as ValaAIOperationMode;
            break;
        }
      });

      return config as ValaAIConfig;
    },
  });
}

// Fetch VALA AI action logs
export function useValaAIActionLogs(limit = 50) {
  return useQuery({
    queryKey: ['vala_ai_action_logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vala_ai_action_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ValaAIActionLog[];
    },
  });
}

// Fetch VALA AI role info from roles table
export function useValaAIRole() {
  return useQuery({
    queryKey: ['vala_ai_role'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('role_key', 'vala_ai')
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// VALA AI status constants
export const VALA_AI_STATUS = {
  ACTIVE: 'active',
  LOCKED: 'locked',
  SYSTEM: 'system',
} as const;

// VALA AI identity constants
export const VALA_AI_IDENTITY = {
  ROLE_CODE: 'AI-000',
  PRIORITY: 'HIGHEST',
  BADGE: '👑 AI',
  COLOR: 'royal_blue',
  NAME: 'VALA AI',
} as const;
