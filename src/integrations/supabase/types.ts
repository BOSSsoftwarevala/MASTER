export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      access_requests: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          impact_summary: string | null
          is_deleted: boolean
          reason: string
          request_type: string
          requested_role: Database["public"]["Enums"]["app_role"] | null
          requester_id: string
          requester_name: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          risk_level: string
          scope: string
          status: Database["public"]["Enums"]["access_request_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          impact_summary?: string | null
          is_deleted?: boolean
          reason: string
          request_type: string
          requested_role?: Database["public"]["Enums"]["app_role"] | null
          requester_id: string
          requester_name: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string
          scope?: string
          status?: Database["public"]["Enums"]["access_request_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          impact_summary?: string | null
          is_deleted?: boolean
          reason?: string
          request_type?: string
          requested_role?: Database["public"]["Enums"]["app_role"] | null
          requester_id?: string
          requester_name?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          risk_level?: string
          scope?: string
          status?: Database["public"]["Enums"]["access_request_status"]
          updated_at?: string
        }
        Relationships: []
      }
      access_violations: {
        Row: {
          attempted_action: string
          attempted_resource: string
          blocked_reason: string
          created_at: string
          id: string
          ip_address: unknown
          severity: Database["public"]["Enums"]["violation_severity"]
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          attempted_action: string
          attempted_resource: string
          blocked_reason: string
          created_at?: string
          id?: string
          ip_address?: unknown
          severity?: Database["public"]["Enums"]["violation_severity"]
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          attempted_action?: string
          attempted_resource?: string
          blocked_reason?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          severity?: Database["public"]["Enums"]["violation_severity"]
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_cost_limits: {
        Row: {
          alert_threshold_percent: number | null
          auto_pause_on_limit: boolean | null
          category: string
          created_at: string
          current_daily_usage: number | null
          current_monthly_usage: number | null
          daily_limit: number | null
          id: string
          is_active: boolean | null
          last_reset_at: string | null
          monthly_limit: number | null
          updated_at: string
        }
        Insert: {
          alert_threshold_percent?: number | null
          auto_pause_on_limit?: boolean | null
          category: string
          created_at?: string
          current_daily_usage?: number | null
          current_monthly_usage?: number | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_reset_at?: string | null
          monthly_limit?: number | null
          updated_at?: string
        }
        Update: {
          alert_threshold_percent?: number | null
          auto_pause_on_limit?: boolean | null
          category?: string
          created_at?: string
          current_daily_usage?: number | null
          current_monthly_usage?: number | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_reset_at?: string | null
          monthly_limit?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_daily_insights: {
        Row: {
          country_code: string | null
          created_at: string
          description: string | null
          id: string
          insight_type: string
          is_dismissed: boolean | null
          metadata: Json | null
          priority: string | null
          region: string | null
          title: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          insight_type: string
          is_dismissed?: boolean | null
          metadata?: Json | null
          priority?: string | null
          region?: string | null
          title: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean | null
          metadata?: Json | null
          priority?: string | null
          region?: string | null
          title?: string
        }
        Relationships: []
      }
      ai_decisions: {
        Row: {
          action_taken: string
          affected_entity: string | null
          affected_entity_id: string | null
          ai_engine: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          decision_type: string
          id: string
          internal_details: string | null
          metadata: Json | null
          severity: string | null
          trigger_event: string | null
          user_message: string | null
          was_approved: boolean | null
        }
        Insert: {
          action_taken: string
          affected_entity?: string | null
          affected_entity_id?: string | null
          ai_engine: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          decision_type: string
          id?: string
          internal_details?: string | null
          metadata?: Json | null
          severity?: string | null
          trigger_event?: string | null
          user_message?: string | null
          was_approved?: boolean | null
        }
        Update: {
          action_taken?: string
          affected_entity?: string | null
          affected_entity_id?: string | null
          ai_engine?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          decision_type?: string
          id?: string
          internal_details?: string | null
          metadata?: Json | null
          severity?: string | null
          trigger_event?: string | null
          user_message?: string | null
          was_approved?: boolean | null
        }
        Relationships: []
      }
      ai_execution_logs: {
        Row: {
          approval_required: boolean | null
          approved_at: string | null
          approved_by: string | null
          cost: number | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          execution_type: string
          id: string
          input_summary: string | null
          metadata: Json | null
          output_summary: string | null
          service_id: string | null
          status: string
          tokens_input: number | null
          tokens_output: number | null
        }
        Insert: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          cost?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          execution_type: string
          id?: string
          input_summary?: string | null
          metadata?: Json | null
          output_summary?: string | null
          service_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Update: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          cost?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          execution_type?: string
          id?: string
          input_summary?: string | null
          metadata?: Json | null
          output_summary?: string | null
          service_id?: string | null
          status?: string
          tokens_input?: number | null
          tokens_output?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_execution_logs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_failsafe_events: {
        Row: {
          action_taken: string
          ai_disabled: boolean | null
          ai_service_id: string | null
          api_provider_id: string | null
          cost_at_trigger: number | null
          created_at: string
          error_details: string | null
          fallback_mode: string | null
          id: string
          internal_message: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          trigger_type: string
          user_friendly_message: string | null
          user_impacted: boolean | null
        }
        Insert: {
          action_taken: string
          ai_disabled?: boolean | null
          ai_service_id?: string | null
          api_provider_id?: string | null
          cost_at_trigger?: number | null
          created_at?: string
          error_details?: string | null
          fallback_mode?: string | null
          id?: string
          internal_message?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          trigger_type: string
          user_friendly_message?: string | null
          user_impacted?: boolean | null
        }
        Update: {
          action_taken?: string
          ai_disabled?: boolean | null
          ai_service_id?: string | null
          api_provider_id?: string | null
          cost_at_trigger?: number | null
          created_at?: string
          error_details?: string | null
          fallback_mode?: string | null
          id?: string
          internal_message?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          trigger_type?: string
          user_friendly_message?: string | null
          user_impacted?: boolean | null
        }
        Relationships: []
      }
      ai_lead_messages: {
        Row: {
          ai_generated: boolean | null
          channel: string
          direction: string
          id: string
          lead_id: string | null
          message_content: string
          sent_at: string
        }
        Insert: {
          ai_generated?: boolean | null
          channel: string
          direction: string
          id?: string
          lead_id?: string | null
          message_content: string
          sent_at?: string
        }
        Update: {
          ai_generated?: boolean | null
          channel?: string
          direction?: string
          id?: string
          lead_id?: string | null
          message_content?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lead_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "ai_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_leads: {
        Row: {
          ai_action: string | null
          ai_intent: string | null
          ai_next_step: string | null
          ai_score: number | null
          ai_summary: string | null
          ai_temperature: string | null
          assigned_franchise_id: string | null
          assigned_reseller_id: string | null
          channel: string
          contact_company: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_deleted: boolean | null
          is_responded: boolean | null
          language_detected: string | null
          raw_message: string | null
          response_time_seconds: number | null
          routed_at: string | null
          source_country: string | null
          source_region: string | null
          status: string | null
          territory_code: string | null
          updated_at: string
        }
        Insert: {
          ai_action?: string | null
          ai_intent?: string | null
          ai_next_step?: string | null
          ai_score?: number | null
          ai_summary?: string | null
          ai_temperature?: string | null
          assigned_franchise_id?: string | null
          assigned_reseller_id?: string | null
          channel: string
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_responded?: boolean | null
          language_detected?: string | null
          raw_message?: string | null
          response_time_seconds?: number | null
          routed_at?: string | null
          source_country?: string | null
          source_region?: string | null
          status?: string | null
          territory_code?: string | null
          updated_at?: string
        }
        Update: {
          ai_action?: string | null
          ai_intent?: string | null
          ai_next_step?: string | null
          ai_score?: number | null
          ai_summary?: string | null
          ai_temperature?: string | null
          assigned_franchise_id?: string | null
          assigned_reseller_id?: string | null
          channel?: string
          contact_company?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          is_responded?: boolean | null
          language_detected?: string | null
          raw_message?: string | null
          response_time_seconds?: number | null
          routed_at?: string | null
          source_country?: string | null
          source_region?: string | null
          status?: string | null
          territory_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_marketing_suggestions: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          auto_apply_blocked: boolean | null
          confidence_score: number | null
          created_at: string
          description: string | null
          estimated_benefit: number | null
          estimated_cost: number | null
          expires_at: string | null
          id: string
          impact_level: string | null
          metadata: Json | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["ai_suggestion_status"]
          suggestion_type: string
          target_entity_id: string | null
          target_entity_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          auto_apply_blocked?: boolean | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          estimated_benefit?: number | null
          estimated_cost?: number | null
          expires_at?: string | null
          id?: string
          impact_level?: string | null
          metadata?: Json | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["ai_suggestion_status"]
          suggestion_type: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          auto_apply_blocked?: boolean | null
          confidence_score?: number | null
          created_at?: string
          description?: string | null
          estimated_benefit?: number | null
          estimated_cost?: number | null
          expires_at?: string | null
          id?: string
          impact_level?: string | null
          metadata?: Json | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["ai_suggestion_status"]
          suggestion_type?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_security_logs: {
        Row: {
          action_allowed: boolean | null
          action_attempted: string | null
          ai_service_id: string | null
          blocked_reason: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          risk_level: string | null
          scope_granted: string | null
          scope_requested: string | null
          user_id: string | null
        }
        Insert: {
          action_allowed?: boolean | null
          action_attempted?: string | null
          ai_service_id?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          risk_level?: string | null
          scope_granted?: string | null
          scope_requested?: string | null
          user_id?: string | null
        }
        Update: {
          action_allowed?: boolean | null
          action_attempted?: string | null
          ai_service_id?: string | null
          blocked_reason?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          risk_level?: string | null
          scope_granted?: string | null
          scope_requested?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_security_logs_ai_service_id_fkey"
            columns: ["ai_service_id"]
            isOneToOne: false
            referencedRelation: "ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_services: {
        Row: {
          category: string
          config: Json | null
          cost_per_request: number | null
          created_at: string
          current_usage: number | null
          description: string | null
          id: string
          is_enabled: boolean | null
          model_name: string | null
          model_provider: string | null
          monthly_limit: number | null
          name: string
          requires_approval: boolean | null
          service_key: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          config?: Json | null
          cost_per_request?: number | null
          created_at?: string
          current_usage?: number | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          model_name?: string | null
          model_provider?: string | null
          monthly_limit?: number | null
          name: string
          requires_approval?: boolean | null
          service_key: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          config?: Json | null
          cost_per_request?: number | null
          created_at?: string
          current_usage?: number | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          model_name?: string | null
          model_provider?: string | null
          monthly_limit?: number | null
          name?: string
          requires_approval?: boolean | null
          service_key?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          message: string | null
          provider_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          service_id: string | null
          severity: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string | null
          provider_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          service_id?: string | null
          severity?: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          message?: string | null
          provider_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          service_id?: string | null
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_alerts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_alerts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_hint: string | null
          key_name: string
          provider_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hint?: string | null
          key_name: string
          provider_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_hint?: string | null
          key_name?: string
          provider_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      api_providers: {
        Row: {
          base_url: string | null
          category: string
          config: Json | null
          created_at: string
          current_usage: number | null
          description: string | null
          error_count: number | null
          id: string
          is_enabled: boolean | null
          last_error: string | null
          last_error_at: string | null
          monthly_limit: number | null
          name: string
          provider_key: string
          status: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          category: string
          config?: Json | null
          created_at?: string
          current_usage?: number | null
          description?: string | null
          error_count?: number | null
          id?: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_error_at?: string | null
          monthly_limit?: number | null
          name: string
          provider_key: string
          status?: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          category?: string
          config?: Json | null
          created_at?: string
          current_usage?: number | null
          description?: string | null
          error_count?: number | null
          id?: string
          is_enabled?: boolean | null
          last_error?: string | null
          last_error_at?: string | null
          monthly_limit?: number | null
          name?: string
          provider_key?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      api_registry: {
        Row: {
          api_name: string
          api_type: string
          auth_type: string | null
          base_url: string | null
          created_at: string | null
          created_by: string | null
          current_usage_day: number | null
          current_usage_minute: number | null
          fallback_enabled: boolean | null
          fallback_response: Json | null
          health_check_url: string | null
          health_status: string | null
          id: string
          is_enabled: boolean | null
          last_health_check: string | null
          metadata: Json | null
          rate_limit_per_day: number | null
          rate_limit_per_minute: number | null
          requires_auth: boolean | null
          response_time_ms: number | null
          updated_at: string | null
          updated_by: string | null
          uptime_percent: number | null
        }
        Insert: {
          api_name: string
          api_type: string
          auth_type?: string | null
          base_url?: string | null
          created_at?: string | null
          created_by?: string | null
          current_usage_day?: number | null
          current_usage_minute?: number | null
          fallback_enabled?: boolean | null
          fallback_response?: Json | null
          health_check_url?: string | null
          health_status?: string | null
          id?: string
          is_enabled?: boolean | null
          last_health_check?: string | null
          metadata?: Json | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          response_time_ms?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uptime_percent?: number | null
        }
        Update: {
          api_name?: string
          api_type?: string
          auth_type?: string | null
          base_url?: string | null
          created_at?: string | null
          created_by?: string | null
          current_usage_day?: number | null
          current_usage_minute?: number | null
          fallback_enabled?: boolean | null
          fallback_response?: Json | null
          health_check_url?: string | null
          health_status?: string | null
          id?: string
          is_enabled?: boolean | null
          last_health_check?: string | null
          metadata?: Json | null
          rate_limit_per_day?: number | null
          rate_limit_per_minute?: number | null
          requires_auth?: boolean | null
          response_time_ms?: number | null
          updated_at?: string | null
          updated_by?: string | null
          uptime_percent?: number | null
        }
        Relationships: []
      }
      api_security_logs: {
        Row: {
          block_reason: string | null
          created_at: string | null
          endpoint: string | null
          event_type: string
          id: string
          is_blocked: boolean | null
          metadata: Json | null
          method: string | null
          provider_id: string | null
          rate_limit_exceeded: boolean | null
          source_ip: unknown
          status_code: number | null
          user_id: string | null
        }
        Insert: {
          block_reason?: string | null
          created_at?: string | null
          endpoint?: string | null
          event_type: string
          id?: string
          is_blocked?: boolean | null
          metadata?: Json | null
          method?: string | null
          provider_id?: string | null
          rate_limit_exceeded?: boolean | null
          source_ip?: unknown
          status_code?: number | null
          user_id?: string | null
        }
        Update: {
          block_reason?: string | null
          created_at?: string | null
          endpoint?: string | null
          event_type?: string
          id?: string
          is_blocked?: boolean | null
          metadata?: Json | null
          method?: string | null
          provider_id?: string | null
          rate_limit_exceeded?: boolean | null
          source_ip?: unknown
          status_code?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_security_logs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      api_usage_logs: {
        Row: {
          cost: number | null
          created_at: string
          endpoint: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          method: string | null
          provider_id: string | null
          response_time_ms: number | null
          service_id: string | null
          status_code: number | null
          tokens_used: number | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          method?: string | null
          provider_id?: string | null
          response_time_ms?: number | null
          service_id?: string | null
          status_code?: number | null
          tokens_used?: number | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          endpoint?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          method?: string | null
          provider_id?: string | null
          response_time_ms?: number | null
          service_id?: string | null
          status_code?: number | null
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_logs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "api_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_usage_logs_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "ai_services"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          amount: number | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          id: string
          is_deleted: boolean | null
          priority: string
          reference_id: string | null
          reference_table: string | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requester: string
          requester_id: string | null
          status: Database["public"]["Enums"]["approval_status"]
          title: string
          type: Database["public"]["Enums"]["approval_type"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          priority?: string
          reference_id?: string | null
          reference_table?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requester: string
          requester_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title: string
          type: Database["public"]["Enums"]["approval_type"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          priority?: string
          reference_id?: string | null
          reference_table?: string | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requester?: string
          requester_id?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          title?: string
          type?: Database["public"]["Enums"]["approval_type"]
          updated_at?: string
        }
        Relationships: []
      }
      assist_sessions: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          client_consent_at: string | null
          client_consent_given: boolean | null
          client_email: string | null
          client_id: string | null
          client_name: string
          created_at: string
          device_info: Json | null
          duration_minutes: number | null
          end_reason: string | null
          ended_at: string | null
          id: string
          idle_timeout_minutes: number | null
          is_deleted: boolean | null
          last_activity_at: string | null
          notes: string | null
          paused_at: string | null
          permissions: Json | null
          recording_enabled: boolean | null
          recording_url: string | null
          session_code: string
          started_at: string | null
          status: Database["public"]["Enums"]["assist_session_status"]
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          agent_name?: string | null
          client_consent_at?: string | null
          client_consent_given?: boolean | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          created_at?: string
          device_info?: Json | null
          duration_minutes?: number | null
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          idle_timeout_minutes?: number | null
          is_deleted?: boolean | null
          last_activity_at?: string | null
          notes?: string | null
          paused_at?: string | null
          permissions?: Json | null
          recording_enabled?: boolean | null
          recording_url?: string | null
          session_code: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["assist_session_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          agent_name?: string | null
          client_consent_at?: string | null
          client_consent_given?: boolean | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          created_at?: string
          device_info?: Json | null
          duration_minutes?: number | null
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          idle_timeout_minutes?: number | null
          is_deleted?: boolean | null
          last_activity_at?: string | null
          notes?: string | null
          paused_at?: string | null
          permissions?: Json | null
          recording_enabled?: boolean | null
          recording_url?: string | null
          session_code?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["assist_session_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assist_sessions_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_logs: {
        Row: {
          adjusted_at: string | null
          adjusted_by: string | null
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          adjusted_at?: string | null
          adjusted_by?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          details: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          module: string
          severity: string
          timestamp: string
          user_agent: string | null
          user_email: string
          user_id: string | null
          user_role: string
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module: string
          severity?: string
          timestamp?: string
          user_agent?: string | null
          user_email: string
          user_id?: string | null
          user_role: string
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          module?: string
          severity?: string
          timestamp?: string
          user_agent?: string | null
          user_email?: string
          user_id?: string | null
          user_role?: string
        }
        Relationships: []
      }
      auto_recovery_logs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          fallback_used: string | null
          id: string
          max_retries: number | null
          metadata: Json | null
          original_error: string | null
          recovery_action: string
          recovery_status: string | null
          retry_count: number | null
          silent_recovery: boolean | null
          trigger_source: string | null
          trigger_type: string
          user_impacted: boolean | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          fallback_used?: string | null
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          original_error?: string | null
          recovery_action: string
          recovery_status?: string | null
          retry_count?: number | null
          silent_recovery?: boolean | null
          trigger_source?: string | null
          trigger_type: string
          user_impacted?: boolean | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          fallback_used?: string | null
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          original_error?: string | null
          recovery_action?: string
          recovery_status?: string | null
          retry_count?: number | null
          silent_recovery?: boolean | null
          trigger_source?: string | null
          trigger_type?: string
          user_impacted?: boolean | null
        }
        Relationships: []
      }
      auto_scaling_policies: {
        Row: {
          cooldown_seconds: number
          created_at: string
          created_by: string | null
          id: string
          is_deleted: boolean | null
          is_enabled: boolean
          max_instances: number
          metric: Database["public"]["Enums"]["scaling_metric"]
          min_instances: number
          scale_down_threshold: number
          scale_up_threshold: number
          server_id: string | null
          updated_at: string
        }
        Insert: {
          cooldown_seconds?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean
          max_instances?: number
          metric?: Database["public"]["Enums"]["scaling_metric"]
          min_instances?: number
          scale_down_threshold?: number
          scale_up_threshold?: number
          server_id?: string | null
          updated_at?: string
        }
        Update: {
          cooldown_seconds?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean
          max_instances?: number
          metric?: Database["public"]["Enums"]["scaling_metric"]
          min_instances?: number
          scale_down_threshold?: number
          scale_up_threshold?: number
          server_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_scaling_policies_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      boss_override_logs: {
        Row: {
          action_taken: string
          created_at: string
          id: string
          new_state: Json | null
          override_type: string
          performed_by: string | null
          previous_state: Json | null
          reason: string | null
          rollback_available: boolean | null
          rolled_back_at: string | null
          target_entity_id: string | null
          target_entity_type: string | null
        }
        Insert: {
          action_taken: string
          created_at?: string
          id?: string
          new_state?: Json | null
          override_type: string
          performed_by?: string | null
          previous_state?: Json | null
          reason?: string | null
          rollback_available?: boolean | null
          rolled_back_at?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Update: {
          action_taken?: string
          created_at?: string
          id?: string
          new_state?: Json | null
          override_type?: string
          performed_by?: string | null
          previous_state?: Json | null
          reason?: string | null
          rollback_available?: boolean | null
          rolled_back_at?: string | null
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Relationships: []
      }
      bugs: {
        Row: {
          actual_behavior: string | null
          assigned_to: string | null
          attachments: Json | null
          browser: string | null
          created_at: string
          description: string | null
          environment: string | null
          expected_behavior: string | null
          id: string
          is_deleted: boolean | null
          project_id: string
          reported_by: string | null
          reporter_name: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["bug_severity"]
          status: Database["public"]["Enums"]["bug_status"]
          steps_to_reproduce: string | null
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_behavior?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          browser?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          expected_behavior?: string | null
          id?: string
          is_deleted?: boolean | null
          project_id: string
          reported_by?: string | null
          reporter_name?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["bug_severity"]
          status?: Database["public"]["Enums"]["bug_status"]
          steps_to_reproduce?: string | null
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_behavior?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          browser?: string | null
          created_at?: string
          description?: string | null
          environment?: string | null
          expected_behavior?: string | null
          id?: string
          is_deleted?: boolean | null
          project_id?: string
          reported_by?: string | null
          reporter_name?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["bug_severity"]
          status?: Database["public"]["Enums"]["bug_status"]
          steps_to_reproduce?: string | null
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bugs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bugs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bugs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      build_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          branch: string
          build_duration_seconds: number | null
          build_logs: string | null
          build_type: Database["public"]["Enums"]["environment_type"]
          commit_hash: string | null
          commit_message: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          failure_reason: string | null
          id: string
          is_deleted: boolean | null
          repo_name: string
          requested_by: string
          started_at: string | null
          status: Database["public"]["Enums"]["build_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          branch: string
          build_duration_seconds?: number | null
          build_logs?: string | null
          build_type?: Database["public"]["Enums"]["environment_type"]
          commit_hash?: string | null
          commit_message?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          failure_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          repo_name: string
          requested_by: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["build_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          branch?: string
          build_duration_seconds?: number | null
          build_logs?: string | null
          build_type?: Database["public"]["Enums"]["environment_type"]
          commit_hash?: string | null
          commit_message?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          failure_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          repo_name?: string
          requested_by?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["build_status"]
          updated_at?: string
        }
        Relationships: []
      }
      campaign_budget_history: {
        Row: {
          campaign_id: string
          change_reason: string | null
          changed_by: string | null
          created_at: string
          id: string
          new_budget: number
          old_budget: number
        }
        Insert: {
          campaign_id: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_budget: number
          old_budget: number
        }
        Update: {
          campaign_id?: string
          change_reason?: string | null
          changed_by?: string | null
          created_at?: string
          id?: string
          new_budget?: number
          old_budget?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_budget_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      code_reviews: {
        Row: {
          comments: string | null
          created_at: string
          id: string
          pull_request_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          reviewer_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          id?: string
          pull_request_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          id?: string
          pull_request_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          reviewer_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_reviews_pull_request_id_fkey"
            columns: ["pull_request_id"]
            isOneToOne: false
            referencedRelation: "pull_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payouts: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          notes: string | null
          payout_method: string | null
          payout_reference: string | null
          processed_at: string | null
          processed_by: string | null
          referral_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          processed_by?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          notes?: string | null
          payout_method?: string | null
          payout_reference?: string | null
          processed_at?: string | null
          processed_by?: string | null
          referral_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payouts_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          author_id: string | null
          author_name: string | null
          body: string | null
          content_type: string
          created_at: string
          engagement_score: number | null
          featured_image: string | null
          id: string
          is_deleted: boolean | null
          published_at: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          content_type?: string
          created_at?: string
          engagement_score?: number | null
          featured_image?: string | null
          id?: string
          is_deleted?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          author_id?: string | null
          author_name?: string | null
          body?: string | null
          content_type?: string
          created_at?: string
          engagement_score?: number | null
          featured_image?: string | null
          id?: string
          is_deleted?: boolean | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      content_schedule: {
        Row: {
          content_id: string
          created_at: string
          created_by: string | null
          id: string
          platform: string
          published_at: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          content_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          platform?: string
          published_at?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          platform?: string
          published_at?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_schedule_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      conversions: {
        Row: {
          attribution_source: string | null
          conversion_value: number | null
          converted_at: string
          created_at: string
          demo_id: string
          id: string
          notes: string | null
          plan_id: string | null
          product_id: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          attribution_source?: string | null
          conversion_value?: number | null
          converted_at?: string
          created_at?: string
          demo_id: string
          id?: string
          notes?: string | null
          plan_id?: string | null
          product_id: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          attribution_source?: string | null
          conversion_value?: number | null
          converted_at?: string
          created_at?: string
          demo_id?: string
          id?: string
          notes?: string | null
          plan_id?: string | null
          product_id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversions_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "finance_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_limits: {
        Row: {
          alert_threshold_percent: number | null
          category: Database["public"]["Enums"]["cost_category"]
          created_at: string
          created_by: string | null
          daily_limit: number | null
          id: string
          is_active: boolean
          monthly_limit: number | null
          updated_at: string
        }
        Insert: {
          alert_threshold_percent?: number | null
          category: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          created_by?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean
          monthly_limit?: number | null
          updated_at?: string
        }
        Update: {
          alert_threshold_percent?: number | null
          category?: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          created_by?: string | null
          daily_limit?: number | null
          id?: string
          is_active?: boolean
          monthly_limit?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cost_logs: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["cost_category"]
          created_at: string
          currency: string
          description: string | null
          id: string
          metadata: Json | null
          usage_date: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          usage_date?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["cost_category"]
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          usage_date?: string
        }
        Relationships: []
      }
      cost_optimizer_suggestions: {
        Row: {
          action_required: string | null
          applied_at: string | null
          applied_by: string | null
          auto_applied: boolean | null
          created_at: string
          current_cost: number | null
          expires_at: string | null
          id: string
          priority: string | null
          projected_savings: number | null
          recommendation: string
          status: string | null
          suggestion_type: string
          target_provider: string | null
          target_service: string | null
        }
        Insert: {
          action_required?: string | null
          applied_at?: string | null
          applied_by?: string | null
          auto_applied?: boolean | null
          created_at?: string
          current_cost?: number | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          projected_savings?: number | null
          recommendation: string
          status?: string | null
          suggestion_type: string
          target_provider?: string | null
          target_service?: string | null
        }
        Update: {
          action_required?: string | null
          applied_at?: string | null
          applied_by?: string | null
          auto_applied?: boolean | null
          created_at?: string
          current_cost?: number | null
          expires_at?: string | null
          id?: string
          priority?: string | null
          projected_savings?: number | null
          recommendation?: string
          status?: string | null
          suggestion_type?: string
          target_provider?: string | null
          target_service?: string | null
        }
        Relationships: []
      }
      country_blocklist: {
        Row: {
          block_type: string | null
          blocked_at: string | null
          blocked_by: string
          country_code: string
          country_name: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          reason: string
          unblocked_at: string | null
          unblocked_by: string | null
        }
        Insert: {
          block_type?: string | null
          blocked_at?: string | null
          blocked_by: string
          country_code: string
          country_name: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason: string
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Update: {
          block_type?: string | null
          blocked_at?: string | null
          blocked_by?: string
          country_code?: string
          country_name?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Relationships: []
      }
      demo_abuse_logs: {
        Row: {
          abuse_type: string
          blocked_until: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          product_id: string
          user_id: string | null
        }
        Insert: {
          abuse_type: string
          blocked_until?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          product_id: string
          user_id?: string | null
        }
        Update: {
          abuse_type?: string
          blocked_until?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          product_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_abuse_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_limits: {
        Row: {
          allowed_features: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          max_api_calls: number | null
          max_storage_mb: number | null
          max_users: number | null
          product_id: string
          restricted_features: Json | null
          updated_at: string
        }
        Insert: {
          allowed_features?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_api_calls?: number | null
          max_storage_mb?: number | null
          max_users?: number | null
          product_id: string
          restricted_features?: Json | null
          updated_at?: string
        }
        Update: {
          allowed_features?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_api_calls?: number | null
          max_storage_mb?: number | null
          max_users?: number | null
          product_id?: string
          restricted_features?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_limits_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          company_name: string | null
          company_size: string | null
          created_at: string
          demo_id: string | null
          id: string
          is_deleted: boolean | null
          notes: string | null
          product_id: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          requester_email: string
          requester_name: string
          requester_phone: string | null
          status: string
          updated_at: string
          use_case: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          demo_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          product_id: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requester_email: string
          requester_name: string
          requester_phone?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string
          demo_id?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          product_id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          requester_email?: string
          requester_name?: string
          requester_phone?: string | null
          status?: string
          updated_at?: string
          use_case?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_requests_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_usage: {
        Row: {
          api_calls: number | null
          created_at: string
          demo_id: string
          feature_usage: Json | null
          id: string
          page_views: number | null
          session_count: number | null
          session_date: string
          storage_used_mb: number | null
          updated_at: string
        }
        Insert: {
          api_calls?: number | null
          created_at?: string
          demo_id: string
          feature_usage?: Json | null
          id?: string
          page_views?: number | null
          session_count?: number | null
          session_date?: string
          storage_used_mb?: number | null
          updated_at?: string
        }
        Update: {
          api_calls?: number | null
          created_at?: string
          demo_id?: string
          feature_usage?: Json | null
          id?: string
          page_views?: number | null
          session_count?: number | null
          session_date?: string
          storage_used_mb?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "demo_usage_demo_id_fkey"
            columns: ["demo_id"]
            isOneToOne: false
            referencedRelation: "demos"
            referencedColumns: ["id"]
          },
        ]
      }
      demos: {
        Row: {
          access_code: string | null
          created_at: string
          created_by: string | null
          expires_at: string
          extended_count: number | null
          id: string
          is_deleted: boolean | null
          max_extensions: number | null
          notes: string | null
          product_id: string
          starts_at: string
          status: string
          updated_at: string
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          access_code?: string | null
          created_at?: string
          created_by?: string | null
          expires_at: string
          extended_count?: number | null
          id?: string
          is_deleted?: boolean | null
          max_extensions?: number | null
          notes?: string | null
          product_id: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          access_code?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          extended_count?: number | null
          id?: string
          is_deleted?: boolean | null
          max_extensions?: number | null
          notes?: string | null
          product_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_email?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      deploy_incidents: {
        Row: {
          affected_services: string[] | null
          assigned_to: string | null
          created_at: string
          deploy_request_id: string | null
          description: string | null
          escalated_to: string | null
          id: string
          is_deleted: boolean | null
          recovery_time_minutes: number | null
          reported_by: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          root_cause: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_services?: string[] | null
          assigned_to?: string | null
          created_at?: string
          deploy_request_id?: string | null
          description?: string | null
          escalated_to?: string | null
          id?: string
          is_deleted?: boolean | null
          recovery_time_minutes?: number | null
          reported_by: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_services?: string[] | null
          assigned_to?: string | null
          created_at?: string
          deploy_request_id?: string | null
          description?: string | null
          escalated_to?: string | null
          id?: string
          is_deleted?: boolean | null
          recovery_time_minutes?: number | null
          reported_by?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          root_cause?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deploy_incidents_deploy_request_id_fkey"
            columns: ["deploy_request_id"]
            isOneToOne: false
            referencedRelation: "deploy_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      deploy_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          build_request_id: string | null
          created_at: string
          deployed_at: string | null
          environment: Database["public"]["Enums"]["environment_type"]
          id: string
          is_deleted: boolean | null
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          release_notes: string | null
          requested_by: string
          risk_level: string | null
          rollback_plan: string | null
          status: Database["public"]["Enums"]["deploy_status"]
          updated_at: string
          version: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          build_request_id?: string | null
          created_at?: string
          deployed_at?: string | null
          environment: Database["public"]["Enums"]["environment_type"]
          id?: string
          is_deleted?: boolean | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          release_notes?: string | null
          requested_by: string
          risk_level?: string | null
          rollback_plan?: string | null
          status?: Database["public"]["Enums"]["deploy_status"]
          updated_at?: string
          version: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          build_request_id?: string | null
          created_at?: string
          deployed_at?: string | null
          environment?: Database["public"]["Enums"]["environment_type"]
          id?: string
          is_deleted?: boolean | null
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          release_notes?: string | null
          requested_by?: string
          risk_level?: string | null
          rollback_plan?: string | null
          status?: Database["public"]["Enums"]["deploy_status"]
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "deploy_requests_build_request_id_fkey"
            columns: ["build_request_id"]
            isOneToOne: false
            referencedRelation: "build_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_bug_map: {
        Row: {
          assigned_at: string | null
          bug_id: string | null
          developer_id: string | null
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          assigned_at?: string | null
          bug_id?: string | null
          developer_id?: string | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          assigned_at?: string | null
          bug_id?: string | null
          developer_id?: string | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_bug_map_bug_id_fkey"
            columns: ["bug_id"]
            isOneToOne: false
            referencedRelation: "bugs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dev_bug_map_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_release_notes: {
        Row: {
          breaking_changes: string[] | null
          content: string | null
          created_at: string | null
          created_by: string | null
          features: string[] | null
          fixes: string[] | null
          id: string
          release_type: string | null
          released_at: string | null
          title: string
          version: string
        }
        Insert: {
          breaking_changes?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          features?: string[] | null
          fixes?: string[] | null
          id?: string
          release_type?: string | null
          released_at?: string | null
          title: string
          version: string
        }
        Update: {
          breaking_changes?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          features?: string[] | null
          fixes?: string[] | null
          id?: string
          release_type?: string | null
          released_at?: string | null
          title?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "dev_release_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_time_logs: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          description: string | null
          developer_id: string | null
          hours_logged: number
          id: string
          is_billable: boolean | null
          log_date: string | null
          task_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          developer_id?: string | null
          hours_logged: number
          id?: string
          is_billable?: boolean | null
          log_date?: string | null
          task_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          description?: string | null
          developer_id?: string | null
          hours_logged?: number
          id?: string
          is_billable?: boolean | null
          log_date?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dev_time_logs_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      developers: {
        Row: {
          access_expires_at: string | null
          avatar_url: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string
          id: string
          is_deleted: boolean | null
          joined_at: string | null
          level: Database["public"]["Enums"]["developer_level"]
          name: string
          phone: string | null
          skill_set: string[] | null
          status: Database["public"]["Enums"]["developer_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email: string
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          level?: Database["public"]["Enums"]["developer_level"]
          name: string
          phone?: string | null
          skill_set?: string[] | null
          status?: Database["public"]["Enums"]["developer_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          level?: Database["public"]["Enums"]["developer_level"]
          name?: string
          phone?: string | null
          skill_set?: string[] | null
          status?: Database["public"]["Enums"]["developer_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      development_audit_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: []
      }
      device_trust: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          block_reason: string | null
          blocked_at: string | null
          blocked_by: string | null
          browser: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          first_seen_at: string | null
          id: string
          is_deleted: boolean | null
          is_trusted: boolean | null
          last_seen_at: string | null
          os: string | null
          trust_level: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          browser?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          first_seen_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          trust_level?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          browser?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          first_seen_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_trusted?: boolean | null
          last_seen_at?: string | null
          os?: string | null
          trust_level?: string | null
          user_id?: string
        }
        Relationships: []
      }
      download_tracking: {
        Row: {
          block_reason: string | null
          created_at: string | null
          download_source: string | null
          file_name: string
          file_path: string | null
          file_size_bytes: number | null
          file_type: string | null
          id: string
          ip_address: unknown
          is_blocked: boolean | null
          is_bulk_download: boolean | null
          risk_level: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          block_reason?: string | null
          created_at?: string | null
          download_source?: string | null
          file_name: string
          file_path?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          is_bulk_download?: boolean | null
          risk_level?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          block_reason?: string | null
          created_at?: string | null
          download_source?: string | null
          file_name?: string
          file_path?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          ip_address?: unknown
          is_blocked?: boolean | null
          is_bulk_download?: boolean | null
          risk_level?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          document_name: string
          document_type: string
          employee_id: string
          file_url: string | null
          id: string
          is_deleted: boolean | null
          uploaded_at: string
          uploaded_by: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_name: string
          document_type: string
          employee_id: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_name?: string
          document_type?: string
          employee_id?: string
          file_url?: string | null
          id?: string
          is_deleted?: boolean | null
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          employee_id: string
          id: string
          is_deleted: boolean | null
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id: string
          id?: string
          is_deleted?: boolean | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          is_deleted?: boolean | null
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_goals_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: Json | null
          avatar_url: string | null
          bank_details: Json | null
          created_at: string
          created_by: string | null
          department: string | null
          designation: string | null
          email: string
          emergency_contact: Json | null
          employee_code: string
          employment_type: string | null
          exit_date: string | null
          first_name: string
          id: string
          is_deleted: boolean | null
          joining_date: string | null
          last_name: string
          notice_date: string | null
          phone: string | null
          reporting_to: string | null
          salary: number | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          bank_details?: Json | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          designation?: string | null
          email: string
          emergency_contact?: Json | null
          employee_code: string
          employment_type?: string | null
          exit_date?: string | null
          first_name: string
          id?: string
          is_deleted?: boolean | null
          joining_date?: string | null
          last_name: string
          notice_date?: string | null
          phone?: string | null
          reporting_to?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          bank_details?: Json | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          emergency_contact?: Json | null
          employee_code?: string
          employment_type?: string | null
          exit_date?: string | null
          first_name?: string
          id?: string
          is_deleted?: boolean | null
          joining_date?: string | null
          last_name?: string
          notice_date?: string | null
          phone?: string | null
          reporting_to?: string | null
          salary?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_reporting_to_fkey"
            columns: ["reporting_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      exit_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          clearance_admin: boolean | null
          clearance_finance: boolean | null
          clearance_hr: boolean | null
          clearance_it: boolean | null
          created_at: string
          created_by: string | null
          employee_id: string
          exit_interview_done: boolean | null
          exit_interview_notes: string | null
          exit_type: string
          id: string
          is_deleted: boolean | null
          last_working_date: string | null
          notice_date: string
          reason: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          clearance_admin?: boolean | null
          clearance_finance?: boolean | null
          clearance_hr?: boolean | null
          clearance_it?: boolean | null
          created_at?: string
          created_by?: string | null
          employee_id: string
          exit_interview_done?: boolean | null
          exit_interview_notes?: string | null
          exit_type: string
          id?: string
          is_deleted?: boolean | null
          last_working_date?: string | null
          notice_date: string
          reason?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          clearance_admin?: boolean | null
          clearance_finance?: boolean | null
          clearance_hr?: boolean | null
          clearance_it?: boolean | null
          created_at?: string
          created_by?: string | null
          employee_id?: string
          exit_interview_done?: boolean | null
          exit_interview_notes?: string | null
          exit_type?: string
          id?: string
          is_deleted?: boolean | null
          last_working_date?: string | null
          notice_date?: string
          reason?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exit_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      fallback_rules: {
        Row: {
          created_at: string | null
          created_by: string | null
          fallback_config: Json | null
          fallback_type: string
          id: string
          is_enabled: boolean | null
          positive_message: string | null
          priority: number | null
          service_id: string | null
          service_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fallback_config?: Json | null
          fallback_type: string
          id?: string
          is_enabled?: boolean | null
          positive_message?: string | null
          priority?: number | null
          service_id?: string | null
          service_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fallback_config?: Json | null
          fallback_type?: string
          id?: string
          is_enabled?: boolean | null
          positive_message?: string | null
          priority?: number | null
          service_id?: string | null
          service_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_payouts: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          approved_by_name: string | null
          bank_details: Json | null
          beneficiary_id: string
          beneficiary_name: string
          beneficiary_type: string
          created_at: string
          created_by: string | null
          currency: string
          held_reason: string | null
          id: string
          is_deleted: boolean
          notes: string | null
          payout_method: string | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          bank_details?: Json | null
          beneficiary_id: string
          beneficiary_name: string
          beneficiary_type: string
          created_at?: string
          created_by?: string | null
          currency?: string
          held_reason?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payout_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          bank_details?: Json | null
          beneficiary_id?: string
          beneficiary_name?: string
          beneficiary_type?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          held_reason?: string | null
          id?: string
          is_deleted?: boolean
          notes?: string | null
          payout_method?: string | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: []
      }
      finance_plans: {
        Row: {
          billing_cycle: string
          created_at: string
          created_by: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean
          is_deleted: boolean
          limits: Json | null
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price: number
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          limits?: Json | null
          name: string
          plan_type: Database["public"]["Enums"]["plan_type"]
          price?: number
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          limits?: Json | null
          name?: string
          plan_type?: Database["public"]["Enums"]["plan_type"]
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      finance_subscriptions: {
        Row: {
          auto_renew: boolean
          created_at: string
          expires_at: string | null
          id: string
          is_deleted: boolean
          plan_id: string
          starts_at: string
          status: string
          updated_at: string
          user_id: string
          user_name: string
        }
        Insert: {
          auto_renew?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_deleted?: boolean
          plan_id: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id: string
          user_name: string
        }
        Update: {
          auto_renew?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          is_deleted?: boolean
          plan_id?: string
          starts_at?: string
          status?: string
          updated_at?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "finance_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_ai_scores: {
        Row: {
          calculated_at: string | null
          factors: Json | null
          franchise_id: string | null
          id: string
          recommendations: string[] | null
          score_type: string
          score_value: number
        }
        Insert: {
          calculated_at?: string | null
          factors?: Json | null
          franchise_id?: string | null
          id?: string
          recommendations?: string[] | null
          score_type: string
          score_value: number
        }
        Update: {
          calculated_at?: string | null
          factors?: Json | null
          franchise_id?: string | null
          id?: string
          recommendations?: string[] | null
          score_type?: string
          score_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "franchise_ai_scores_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          applicant_user_id: string
          approved_franchise_id: string | null
          business_experience: string | null
          business_name: string
          created_at: string
          id: string
          investment_capacity: string | null
          is_deleted: boolean | null
          kyc_documents: Json | null
          legal_name: string
          plan_tier: Database["public"]["Enums"]["franchise_plan_tier"]
          rejection_reason: string | null
          requested_territory: Json
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["access_request_status"]
          territory_level: string
          updated_at: string
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          applicant_user_id: string
          approved_franchise_id?: string | null
          business_experience?: string | null
          business_name: string
          created_at?: string
          id?: string
          investment_capacity?: string | null
          is_deleted?: boolean | null
          kyc_documents?: Json | null
          legal_name: string
          plan_tier: Database["public"]["Enums"]["franchise_plan_tier"]
          rejection_reason?: string | null
          requested_territory: Json
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["access_request_status"]
          territory_level: string
          updated_at?: string
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          applicant_user_id?: string
          approved_franchise_id?: string | null
          business_experience?: string | null
          business_name?: string
          created_at?: string
          id?: string
          investment_capacity?: string | null
          is_deleted?: boolean | null
          kyc_documents?: Json | null
          legal_name?: string
          plan_tier?: Database["public"]["Enums"]["franchise_plan_tier"]
          rejection_reason?: string | null
          requested_territory?: Json
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["access_request_status"]
          territory_level?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_applications_approved_franchise_id_fkey"
            columns: ["approved_franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_audit_logs: {
        Row: {
          action: string
          action_type: string
          approved_by: string | null
          approved_by_name: string | null
          created_at: string
          details: string | null
          franchise_id: string | null
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          action_type: string
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          franchise_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          franchise_id?: string | null
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_audit_logs_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_performance: {
        Row: {
          commission_earned: number | null
          conversion_rate: number | null
          created_at: string
          franchise_id: string
          id: string
          is_deleted: boolean | null
          leads_converted: number | null
          leads_received: number | null
          period_end: string
          period_start: string
          ranking: number | null
          revenue_generated: number | null
          sla_score: number | null
          updated_at: string
        }
        Insert: {
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string
          franchise_id: string
          id?: string
          is_deleted?: boolean | null
          leads_converted?: number | null
          leads_received?: number | null
          period_end: string
          period_start: string
          ranking?: number | null
          revenue_generated?: number | null
          sla_score?: number | null
          updated_at?: string
        }
        Update: {
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string
          franchise_id?: string
          id?: string
          is_deleted?: boolean | null
          leads_converted?: number | null
          leads_received?: number | null
          period_end?: string
          period_start?: string
          ranking?: number | null
          revenue_generated?: number | null
          sla_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_performance_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_plans: {
        Row: {
          benefits: Json | null
          commission_rate: number
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          monthly_fee: number
          name: string
          setup_fee: number
          tier: Database["public"]["Enums"]["franchise_plan_tier"]
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number
          name: string
          setup_fee?: number
          tier: Database["public"]["Enums"]["franchise_plan_tier"]
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number
          name?: string
          setup_fee?: number
          tier?: Database["public"]["Enums"]["franchise_plan_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      franchise_sla: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string | null
          due_date: string | null
          franchise_id: string | null
          id: string
          promise_type: string
          status: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          franchise_id?: string | null
          id?: string
          promise_type: string
          status?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          franchise_id?: string | null
          id?: string
          promise_type?: string
          status?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_sla_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_staff: {
        Row: {
          access_level: string | null
          created_at: string | null
          email: string | null
          franchise_id: string | null
          id: string
          is_active: boolean | null
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          created_at?: string | null
          email?: string | null
          franchise_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_staff_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_territories: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          city: string | null
          country: string
          created_at: string
          expires_at: string | null
          franchise_id: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          notes: string | null
          state: string | null
          territory_type: Database["public"]["Enums"]["territory_type"]
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          city?: string | null
          country: string
          created_at?: string
          expires_at?: string | null
          franchise_id: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          notes?: string | null
          state?: string | null
          territory_type?: Database["public"]["Enums"]["territory_type"]
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          city?: string | null
          country?: string
          created_at?: string
          expires_at?: string | null
          franchise_id?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          notes?: string | null
          state?: string | null
          territory_type?: Database["public"]["Enums"]["territory_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_territories_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_violations: {
        Row: {
          created_at: string
          description: string | null
          evidence: Json | null
          franchise_id: string
          id: string
          is_deleted: boolean | null
          reported_at: string
          reported_by: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["violation_severity"]
          status: Database["public"]["Enums"]["franchise_violation_status"]
          title: string
          updated_at: string
          violation_type: Database["public"]["Enums"]["franchise_violation_type"]
          warning_issued_at: string | null
          warning_issued_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          evidence?: Json | null
          franchise_id: string
          id?: string
          is_deleted?: boolean | null
          reported_at?: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"]
          status?: Database["public"]["Enums"]["franchise_violation_status"]
          title: string
          updated_at?: string
          violation_type: Database["public"]["Enums"]["franchise_violation_type"]
          warning_issued_at?: string | null
          warning_issued_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          evidence?: Json | null
          franchise_id?: string
          id?: string
          is_deleted?: boolean | null
          reported_at?: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"]
          status?: Database["public"]["Enums"]["franchise_violation_status"]
          title?: string
          updated_at?: string
          violation_type?: Database["public"]["Enums"]["franchise_violation_type"]
          warning_issued_at?: string | null
          warning_issued_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_violations_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: false
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchise_wallets: {
        Row: {
          balance: number
          created_at: string
          franchise_id: string
          id: string
          last_settlement_at: string | null
          pending_payouts: number | null
          total_deductions: number | null
          total_earned: number | null
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          franchise_id: string
          id?: string
          last_settlement_at?: string | null
          pending_payouts?: number | null
          total_deductions?: number | null
          total_earned?: number | null
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          franchise_id?: string
          id?: string
          last_settlement_at?: string | null
          pending_payouts?: number | null
          total_deductions?: number | null
          total_earned?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchise_wallets_franchise_id_fkey"
            columns: ["franchise_id"]
            isOneToOne: true
            referencedRelation: "franchises"
            referencedColumns: ["id"]
          },
        ]
      }
      franchises: {
        Row: {
          address: Json | null
          business_name: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          created_by: string | null
          id: string
          is_deleted: boolean | null
          joined_at: string | null
          kyc_documents: Json | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          legal_name: string
          plan_id: string | null
          status: Database["public"]["Enums"]["franchise_status"]
          suspended_at: string | null
          suspended_reason: string | null
          territory_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: Json | null
          business_name?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          legal_name: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["franchise_status"]
          suspended_at?: string | null
          suspended_reason?: string | null
          territory_level: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json | null
          business_name?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          legal_name?: string
          plan_id?: string | null
          status?: Database["public"]["Enums"]["franchise_status"]
          suspended_at?: string | null
          suspended_reason?: string | null
          territory_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "franchises_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "franchise_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_activity_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: []
      }
      incident_predictions: {
        Row: {
          action_taken: string | null
          action_taken_at: string | null
          affected_service: string | null
          affected_service_id: string | null
          created_at: string | null
          id: string
          is_auto_action_enabled: boolean | null
          metadata: Json | null
          predicted_incident: string
          prediction_type: string
          resolved_at: string | null
          resolved_by: string | null
          risk_score: number
          status: string | null
          suggested_action: string | null
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          action_taken_at?: string | null
          affected_service?: string | null
          affected_service_id?: string | null
          created_at?: string | null
          id?: string
          is_auto_action_enabled?: boolean | null
          metadata?: Json | null
          predicted_incident: string
          prediction_type: string
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score: number
          status?: string | null
          suggested_action?: string | null
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          action_taken_at?: string | null
          affected_service?: string | null
          affected_service_id?: string | null
          created_at?: string | null
          id?: string
          is_auto_action_enabled?: boolean | null
          metadata?: Json | null
          predicted_incident?: string
          prediction_type?: string
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number
          status?: string | null
          suggested_action?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      influencer_bonus: {
        Row: {
          amount: number
          bonus_type: string
          created_at: string | null
          eligible_at: string | null
          id: string
          influencer_id: string | null
          paid_at: string | null
          reason: string | null
          status: string | null
        }
        Insert: {
          amount: number
          bonus_type: string
          created_at?: string | null
          eligible_at?: string | null
          id?: string
          influencer_id?: string | null
          paid_at?: string | null
          reason?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          bonus_type?: string
          created_at?: string | null
          eligible_at?: string | null
          id?: string
          influencer_id?: string | null
          paid_at?: string | null
          reason?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_bonus_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_campaigns: {
        Row: {
          actual_reach: number | null
          approved_at: string | null
          campaign_id: string | null
          campaign_name: string
          clicks: number | null
          commission: number | null
          content_type: string
          content_url: string | null
          conversions: number | null
          created_at: string
          deadline: string | null
          id: string
          influencer_id: string
          is_deleted: boolean
          notes: string | null
          platform: string
          status: string
          submitted_at: string | null
          target_reach: number | null
          updated_at: string
        }
        Insert: {
          actual_reach?: number | null
          approved_at?: string | null
          campaign_id?: string | null
          campaign_name: string
          clicks?: number | null
          commission?: number | null
          content_type?: string
          content_url?: string | null
          conversions?: number | null
          created_at?: string
          deadline?: string | null
          id?: string
          influencer_id: string
          is_deleted?: boolean
          notes?: string | null
          platform?: string
          status?: string
          submitted_at?: string | null
          target_reach?: number | null
          updated_at?: string
        }
        Update: {
          actual_reach?: number | null
          approved_at?: string | null
          campaign_id?: string | null
          campaign_name?: string
          clicks?: number | null
          commission?: number | null
          content_type?: string
          content_url?: string | null
          conversions?: number | null
          created_at?: string
          deadline?: string | null
          id?: string
          influencer_id?: string
          is_deleted?: boolean
          notes?: string | null
          platform?: string
          status?: string
          submitted_at?: string | null
          target_reach?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_campaigns_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_campaigns_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_content: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          campaign_id: string | null
          content_type: string
          content_url: string | null
          created_at: string | null
          description: string | null
          id: string
          influencer_id: string | null
          rejection_reason: string | null
          status: string | null
          submitted_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          content_type: string
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id?: string | null
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_id?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          influencer_id?: string | null
          rejection_reason?: string | null
          status?: string | null
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_content_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_content_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_leads: {
        Row: {
          campaign_id: string | null
          commission_earned: number | null
          conversion_value: number | null
          converted: boolean
          converted_at: string | null
          created_at: string
          id: string
          influencer_id: string
          is_deleted: boolean
          lead_email: string | null
          lead_name: string | null
          lead_phone: string | null
          source_platform: string | null
          tracking_code: string | null
        }
        Insert: {
          campaign_id?: string | null
          commission_earned?: number | null
          conversion_value?: number | null
          converted?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          influencer_id: string
          is_deleted?: boolean
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          source_platform?: string | null
          tracking_code?: string | null
        }
        Update: {
          campaign_id?: string | null
          commission_earned?: number | null
          conversion_value?: number | null
          converted?: boolean
          converted_at?: string | null
          created_at?: string
          id?: string
          influencer_id?: string
          is_deleted?: boolean
          lead_email?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          source_platform?: string | null
          tracking_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_leads_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_leads_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_links: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversions: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          influencer_id: string | null
          is_active: boolean | null
          link_code: string
          target_url: string
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          influencer_id?: string | null
          is_active?: boolean | null
          link_code: string
          target_url: string
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          influencer_id?: string | null
          is_active?: boolean | null
          link_code?: string
          target_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_links_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "influencer_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_links_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          influencer_id: string
          notes: string | null
          payout_method: string | null
          processed_at: string | null
          processed_by: string | null
          reference: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          influencer_id: string
          notes?: string | null
          payout_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reference?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          influencer_id?: string
          notes?: string | null
          payout_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "influencer_payouts_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_stats: {
        Row: {
          created_at: string
          engagement_rate: number | null
          id: string
          influencer_id: string
          period_end: string
          period_start: string
          total_clicks: number | null
          total_conversions: number | null
          total_earnings: number | null
          total_impressions: number | null
          total_leads: number | null
        }
        Insert: {
          created_at?: string
          engagement_rate?: number | null
          id?: string
          influencer_id: string
          period_end: string
          period_start: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_earnings?: number | null
          total_impressions?: number | null
          total_leads?: number | null
        }
        Update: {
          created_at?: string
          engagement_rate?: number | null
          id?: string
          influencer_id?: string
          period_end?: string
          period_start?: string
          total_clicks?: number | null
          total_conversions?: number | null
          total_earnings?: number | null
          total_impressions?: number | null
          total_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_stats_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          bio: string | null
          city: string | null
          commission_rate: number
          country: string | null
          created_at: string
          email: string
          id: string
          is_deleted: boolean
          kyc_verified: boolean
          name: string
          phone: string | null
          social_accounts: Json | null
          status: string
          tier: string
          total_conversions: number
          total_earnings: number
          total_leads: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          commission_rate?: number
          country?: string | null
          created_at?: string
          email: string
          id?: string
          is_deleted?: boolean
          kyc_verified?: boolean
          name: string
          phone?: string | null
          social_accounts?: Json | null
          status?: string
          tier?: string
          total_conversions?: number
          total_earnings?: number
          total_leads?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          commission_rate?: number
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          is_deleted?: boolean
          kyc_verified?: boolean
          name?: string
          phone?: string | null
          social_accounts?: Json | null
          status?: string
          tier?: string
          total_conversions?: number
          total_earnings?: number
          total_leads?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_name: string | null
          currency: string
          customer_email: string | null
          customer_id: string
          customer_name: string
          discount_amount: number
          due_date: string | null
          id: string
          invoice_number: string
          is_deleted: boolean
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          currency?: string
          customer_email?: string | null
          customer_id: string
          customer_name: string
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number: string
          is_deleted?: boolean
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          currency?: string
          customer_email?: string | null
          customer_id?: string
          customer_name?: string
          discount_amount?: number
          due_date?: string | null
          id?: string
          invoice_number?: string
          is_deleted?: boolean
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      ip_blocklist: {
        Row: {
          blocked_at: string | null
          blocked_by: string
          expires_at: string | null
          id: string
          ip_address: unknown
          ip_range: unknown
          is_active: boolean | null
          is_permanent: boolean | null
          reason: string
          severity: string | null
          unblocked_at: string | null
          unblocked_by: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by: string
          expires_at?: string | null
          id?: string
          ip_address: unknown
          ip_range?: unknown
          is_active?: boolean | null
          is_permanent?: boolean | null
          reason: string
          severity?: string | null
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          ip_range?: unknown
          is_active?: boolean | null
          is_permanent?: boolean | null
          reason?: string
          severity?: string | null
          unblocked_at?: string | null
          unblocked_by?: string | null
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          candidate_email: string
          candidate_name: string
          candidate_phone: string | null
          cover_letter: string | null
          created_at: string
          id: string
          interview_date: string | null
          interview_notes: string | null
          is_deleted: boolean | null
          job_id: string
          rating: number | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          candidate_email: string
          candidate_name: string
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          is_deleted?: boolean | null
          job_id: string
          rating?: number | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          candidate_email?: string
          candidate_name?: string
          candidate_phone?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          interview_notes?: string | null
          is_deleted?: boolean | null
          job_id?: string
          rating?: number | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          closes_at: string | null
          created_at: string
          created_by: string | null
          department: string | null
          description: string | null
          employment_type: string | null
          id: string
          is_deleted: boolean | null
          location: string | null
          positions_count: number | null
          posted_at: string | null
          requirements: string | null
          salary_range_max: number | null
          salary_range_min: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          is_deleted?: boolean | null
          location?: string | null
          positions_count?: number | null
          posted_at?: string | null
          requirements?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          description?: string | null
          employment_type?: string | null
          id?: string
          is_deleted?: boolean | null
          location?: string | null
          positions_count?: number | null
          posted_at?: string | null
          requirements?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          lead_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          lead_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activity_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_distribution_rules: {
        Row: {
          conditions: Json
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_deleted: boolean | null
          is_enabled: boolean | null
          name: string
          priority: number | null
          rule_type: string
          updated_at: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          name: string
          priority?: number | null
          rule_type: string
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          name?: string
          priority?: number | null
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          lead_id: string
          note: string
          note_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          lead_id: string
          note: string
          note_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          lead_id?: string
          note?: string
          note_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          conversion_rate: number | null
          cost_per_lead: number | null
          created_at: string
          created_by: string | null
          daily_cap: number | null
          duplicate_filter_enabled: boolean | null
          geo_restrictions: Json | null
          id: string
          is_deleted: boolean | null
          is_enabled: boolean | null
          leads_this_month: number | null
          leads_today: number | null
          monthly_cap: number | null
          name: string
          priority: number | null
          routing_rules: Json | null
          source_type: string
          updated_at: string
        }
        Insert: {
          conversion_rate?: number | null
          cost_per_lead?: number | null
          created_at?: string
          created_by?: string | null
          daily_cap?: number | null
          duplicate_filter_enabled?: boolean | null
          geo_restrictions?: Json | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          leads_this_month?: number | null
          leads_today?: number | null
          monthly_cap?: number | null
          name: string
          priority?: number | null
          routing_rules?: Json | null
          source_type: string
          updated_at?: string
        }
        Update: {
          conversion_rate?: number | null
          cost_per_lead?: number | null
          created_at?: string
          created_by?: string | null
          daily_cap?: number | null
          duplicate_filter_enabled?: boolean | null
          geo_restrictions?: Json | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          leads_this_month?: number | null
          leads_today?: number | null
          monthly_cap?: number | null
          name?: string
          priority?: number | null
          routing_rules?: Json | null
          source_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_close_probability: number | null
          assigned_to: string | null
          budget_range: string | null
          city: string | null
          company_name: string | null
          company_size: string | null
          converted_at: string | null
          converted_to: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          designation: string | null
          email: string
          email_masked: string | null
          expected_close_date: string | null
          first_contact_at: string | null
          first_name: string | null
          id: string
          industry: string | null
          interested_products: string[] | null
          is_deleted: boolean | null
          last_contact_at: string | null
          last_name: string | null
          mobile: string | null
          mobile_masked: string | null
          referral_code: string | null
          referred_by: string | null
          source: Database["public"]["Enums"]["lead_source"] | null
          source_detail: string | null
          state: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          temperature: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          website: string | null
        }
        Insert: {
          ai_close_probability?: number | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          converted_at?: string | null
          converted_to?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          email: string
          email_masked?: string | null
          expected_close_date?: string | null
          first_contact_at?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          interested_products?: string[] | null
          is_deleted?: boolean | null
          last_contact_at?: string | null
          last_name?: string | null
          mobile?: string | null
          mobile_masked?: string | null
          referral_code?: string | null
          referred_by?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_detail?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Update: {
          ai_close_probability?: number | null
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          company_name?: string | null
          company_size?: string | null
          converted_at?: string | null
          converted_to?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          designation?: string | null
          email?: string
          email_masked?: string | null
          expected_close_date?: string | null
          first_contact_at?: string | null
          first_name?: string | null
          id?: string
          industry?: string | null
          interested_products?: string[] | null
          is_deleted?: boolean | null
          last_contact_at?: string | null
          last_name?: string | null
          mobile?: string | null
          mobile_masked?: string | null
          referral_code?: string | null
          referred_by?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          source_detail?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          temperature?: Database["public"]["Enums"]["lead_temperature"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          days_count: number
          employee_id: string
          end_date: string
          id: string
          is_deleted: boolean | null
          leave_type: string
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count: number
          employee_id: string
          end_date: string
          id?: string
          is_deleted?: boolean | null
          leave_type: string
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          days_count?: number
          employee_id?: string
          end_date?: string
          id?: string
          is_deleted?: boolean | null
          leave_type?: string
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      license_activations: {
        Row: {
          activated_at: string | null
          deactivated_at: string | null
          device_fingerprint: string
          device_name: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          license_id: string
        }
        Insert: {
          activated_at?: string | null
          deactivated_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          license_id: string
        }
        Update: {
          activated_at?: string | null
          deactivated_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          license_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_activations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          activated_at: string | null
          created_at: string | null
          current_activations: number | null
          expires_at: string | null
          id: string
          is_deleted: boolean | null
          last_validated_at: string | null
          license_key: string
          license_type: Database["public"]["Enums"]["license_type"]
          max_activations: number | null
          metadata: Json | null
          product_id: string
          sale_item_id: string | null
          status: Database["public"]["Enums"]["license_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string | null
          current_activations?: number | null
          expires_at?: string | null
          id?: string
          is_deleted?: boolean | null
          last_validated_at?: string | null
          license_key: string
          license_type: Database["public"]["Enums"]["license_type"]
          max_activations?: number | null
          metadata?: Json | null
          product_id: string
          sale_item_id?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string | null
          current_activations?: number | null
          expires_at?: string | null
          id?: string
          is_deleted?: boolean | null
          last_validated_at?: string | null
          license_key?: string
          license_type?: Database["public"]["Enums"]["license_type"]
          max_activations?: number | null
          metadata?: Json | null
          product_id?: string
          sale_item_id?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_sale_item_id_fkey"
            columns: ["sale_item_id"]
            isOneToOne: false
            referencedRelation: "sale_items"
            referencedColumns: ["id"]
          },
        ]
      }
      login_analytics: {
        Row: {
          auto_blocked: boolean | null
          browser: string | null
          city: string | null
          country_code: string | null
          country_name: string | null
          created_at: string | null
          device_fingerprint: string | null
          device_type: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown
          is_suspicious: boolean | null
          isp: string | null
          login_status: string
          os: string | null
          session_id: string | null
          suspicion_reason: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          auto_blocked?: boolean | null
          browser?: string | null
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address: unknown
          is_suspicious?: boolean | null
          isp?: string | null
          login_status?: string
          os?: string | null
          session_id?: string | null
          suspicion_reason?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          auto_blocked?: boolean | null
          browser?: string | null
          city?: string | null
          country_code?: string | null
          country_name?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          is_suspicious?: boolean | null
          isp?: string | null
          login_status?: string
          os?: string | null
          session_id?: string | null
          suspicion_reason?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_audit_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number
          campaign_type: Database["public"]["Enums"]["campaign_type"]
          clicks: number | null
          conversions: number | null
          cost_per_lead: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          geo_targeting: Json | null
          id: string
          impressions: number | null
          is_deleted: boolean | null
          leads_generated: number | null
          name: string
          paused_at: string | null
          paused_by: string | null
          paused_reason: string | null
          spent: number
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          budget?: number
          campaign_type?: Database["public"]["Enums"]["campaign_type"]
          clicks?: number | null
          conversions?: number | null
          cost_per_lead?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          geo_targeting?: Json | null
          id?: string
          impressions?: number | null
          is_deleted?: boolean | null
          leads_generated?: number | null
          name: string
          paused_at?: string | null
          paused_by?: string | null
          paused_reason?: string | null
          spent?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          budget?: number
          campaign_type?: Database["public"]["Enums"]["campaign_type"]
          clicks?: number | null
          conversions?: number | null
          cost_per_lead?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          geo_targeting?: Json | null
          id?: string
          impressions?: number | null
          is_deleted?: boolean | null
          leads_generated?: number | null
          name?: string
          paused_at?: string | null
          paused_by?: string | null
          paused_reason?: string | null
          spent?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          is_deleted: boolean
          name: string
          progress: number | null
          project_id: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_deleted?: boolean
          name: string
          progress?: number | null
          project_id: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          is_deleted?: boolean
          name?: string
          progress?: number | null
          project_id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          delivered_at: string | null
          delivery_status: string | null
          expires_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          retry_count: number | null
          target_roles: string[] | null
          target_url: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          retry_count?: number | null
          target_roles?: string[] | null
          target_url?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          retry_count?: number | null
          target_roles?: string[] | null
          target_url?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      optimization_actions: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          created_at: string | null
          id: string
          is_auto_applied: boolean | null
          metadata: Json | null
          new_config: Json | null
          old_config: Json | null
          optimization_type: string
          reason: string | null
          reverted_at: string | null
          reverted_by: string | null
          savings_actual: number | null
          savings_estimated: number | null
          status: string | null
          target_service: string
          target_service_id: string | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          id?: string
          is_auto_applied?: boolean | null
          metadata?: Json | null
          new_config?: Json | null
          old_config?: Json | null
          optimization_type: string
          reason?: string | null
          reverted_at?: string | null
          reverted_by?: string | null
          savings_actual?: number | null
          savings_estimated?: number | null
          status?: string | null
          target_service: string
          target_service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          created_at?: string | null
          id?: string
          is_auto_applied?: boolean | null
          metadata?: Json | null
          new_config?: Json | null
          old_config?: Json | null
          optimization_type?: string
          reason?: string | null
          reverted_at?: string | null
          reverted_by?: string | null
          savings_actual?: number | null
          savings_estimated?: number | null
          status?: string | null
          target_service?: string
          target_service_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          currency: string
          gateway: string
          gateway_transaction_id: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          order_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          gateway: string
          gateway_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          order_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          gateway_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          order_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          acknowledged_at: string | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          employee_comments: string | null
          employee_id: string
          goals_achieved: string | null
          id: string
          improvements: string | null
          is_deleted: boolean | null
          overall_rating: number | null
          review_period_end: string
          review_period_start: string
          reviewer_comments: string | null
          reviewer_id: string | null
          status: string | null
          strengths: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_comments?: string | null
          employee_id: string
          goals_achieved?: string | null
          id?: string
          improvements?: string | null
          is_deleted?: boolean | null
          overall_rating?: number | null
          review_period_end: string
          review_period_start: string
          reviewer_comments?: string | null
          reviewer_id?: string | null
          status?: string | null
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_comments?: string | null
          employee_id?: string
          goals_achieved?: string | null
          id?: string
          improvements?: string | null
          is_deleted?: boolean | null
          overall_rating?: number | null
          review_period_end?: string
          review_period_start?: string
          reviewer_comments?: string | null
          reviewer_id?: string | null
          status?: string | null
          strengths?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          feature_key: string
          feature_name: string
          id: string
          is_sensitive: boolean
          module: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          feature_key: string
          feature_name: string
          id?: string
          is_sensitive?: boolean
          module: string
        }
        Update: {
          created_at?: string
          description?: string | null
          feature_key?: string
          feature_name?: string
          id?: string
          is_sensitive?: boolean
          module?: string
        }
        Relationships: []
      }
      plan_mappings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_visible: boolean | null
          plan_id: string
          product_id: string
          sort_order: number | null
          updated_at: string
          visibility_regions: string[] | null
          visibility_rules: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_visible?: boolean | null
          plan_id: string
          product_id: string
          sort_order?: number | null
          updated_at?: string
          visibility_regions?: string[] | null
          visibility_rules?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_visible?: boolean | null
          plan_id?: string
          product_id?: string
          sort_order?: number | null
          updated_at?: string
          visibility_regions?: string[] | null
          visibility_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_mappings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "finance_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      port_monitoring: {
        Row: {
          anomaly_reason: string | null
          block_reason: string | null
          blocked_at: string | null
          blocked_by: string | null
          created_at: string | null
          id: string
          is_allowed: boolean | null
          is_anomalous: boolean | null
          is_open: boolean | null
          last_activity_at: string | null
          port_number: number
          protocol: string | null
          server_id: string | null
          service_name: string | null
          traffic_bytes_in: number | null
          traffic_bytes_out: number | null
          updated_at: string | null
        }
        Insert: {
          anomaly_reason?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          id?: string
          is_allowed?: boolean | null
          is_anomalous?: boolean | null
          is_open?: boolean | null
          last_activity_at?: string | null
          port_number: number
          protocol?: string | null
          server_id?: string | null
          service_name?: string | null
          traffic_bytes_in?: number | null
          traffic_bytes_out?: number | null
          updated_at?: string | null
        }
        Update: {
          anomaly_reason?: string | null
          block_reason?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          created_at?: string | null
          id?: string
          is_allowed?: boolean | null
          is_anomalous?: boolean | null
          is_open?: boolean | null
          last_activity_at?: string | null
          port_number?: number
          protocol?: string | null
          server_id?: string | null
          service_name?: string | null
          traffic_bytes_in?: number | null
          traffic_bytes_out?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "port_monitoring_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_rules: {
        Row: {
          auto_action_enabled: boolean | null
          auto_action_type: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_enabled: boolean | null
          metric_type: string
          notification_channels: string[] | null
          prediction_window_minutes: number | null
          rule_name: string
          threshold_critical: number | null
          threshold_warning: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          auto_action_enabled?: boolean | null
          auto_action_type?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          metric_type: string
          notification_channels?: string[] | null
          prediction_window_minutes?: number | null
          rule_name: string
          threshold_critical?: number | null
          threshold_warning?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          auto_action_enabled?: boolean | null
          auto_action_type?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          metric_type?: string
          notification_channels?: string[] | null
          prediction_window_minutes?: number | null
          rule_name?: string
          threshold_critical?: number | null
          threshold_warning?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"] | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          product_id: string
          slug: string
          sort_order: number | null
          storage_limit: string | null
          updated_at: string | null
          user_limit: number | null
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price: number
          product_id: string
          slug: string
          sort_order?: number | null
          storage_limit?: string | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          product_id?: string
          slug?: string
          sort_order?: number | null
          storage_limit?: string | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          id: string
          product_id: string
        }
        Insert: {
          category_id: string
          id?: string
          product_id: string
        }
        Update: {
          category_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_demo_activity_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: []
      }
      product_features: {
        Row: {
          created_at: string | null
          feature_description: string | null
          feature_name: string
          id: string
          is_highlighted: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          feature_description?: string | null
          feature_name: string
          id?: string
          is_highlighted?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          feature_description?: string | null
          feature_name?: string
          id?: string
          is_highlighted?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          media_type: string
          media_url: string
          product_id: string
          sort_order: number | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          media_type: string
          media_url: string
          product_id: string
          sort_order?: number | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          media_type?: string
          media_url?: string
          product_id?: string
          sort_order?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          banner_url: string | null
          base_price: number | null
          category_id: string | null
          commission_rate: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          demo_url: string | null
          documentation_url: string | null
          franchise_commission: number | null
          full_description: string | null
          id: string
          influencer_commission: number | null
          is_active: boolean | null
          is_deleted: boolean | null
          is_featured: boolean | null
          license_type: Database["public"]["Enums"]["license_type"] | null
          logo_url: string | null
          max_users: number | null
          meta_description: string | null
          meta_title: string | null
          min_users: number | null
          name: string
          pricing_model: Database["public"]["Enums"]["pricing_model"] | null
          reseller_commission: number | null
          short_description: string | null
          slug: string
          status: string | null
          tags: string[] | null
          updated_at: string | null
          vendor_id: string | null
          website_url: string | null
        }
        Insert: {
          banner_url?: string | null
          base_price?: number | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          demo_url?: string | null
          documentation_url?: string | null
          franchise_commission?: number | null
          full_description?: string | null
          id?: string
          influencer_commission?: number | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          license_type?: Database["public"]["Enums"]["license_type"] | null
          logo_url?: string | null
          max_users?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_users?: number | null
          name: string
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          reseller_commission?: number | null
          short_description?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          vendor_id?: string | null
          website_url?: string | null
        }
        Update: {
          banner_url?: string | null
          base_price?: number | null
          category_id?: string | null
          commission_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          demo_url?: string | null
          documentation_url?: string | null
          franchise_commission?: number | null
          full_description?: string | null
          id?: string
          influencer_commission?: number | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_featured?: boolean | null
          license_type?: Database["public"]["Enums"]["license_type"] | null
          logo_url?: string | null
          max_users?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_users?: number | null
          name?: string
          pricing_model?: Database["public"]["Enums"]["pricing_model"] | null
          reseller_commission?: number | null
          short_description?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
          vendor_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          address_line1: string | null
          address_line2: string | null
          avatar_url: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          designation: string | null
          email: string
          email_masked: string | null
          first_name: string | null
          id: string
          is_deleted: boolean | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          last_name: string | null
          mobile: string | null
          mobile_masked: string | null
          pincode: string | null
          referral_code: string | null
          referred_by: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          designation?: string | null
          email: string
          email_masked?: string | null
          first_name?: string | null
          id: string
          is_deleted?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          mobile?: string | null
          mobile_masked?: string | null
          pincode?: string | null
          referral_code?: string | null
          referred_by?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          address_line1?: string | null
          address_line2?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          designation?: string | null
          email?: string
          email_masked?: string | null
          first_name?: string | null
          id?: string
          is_deleted?: boolean | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          last_name?: string | null
          mobile?: string | null
          mobile_masked?: string | null
          pincode?: string | null
          referral_code?: string | null
          referred_by?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_developers: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          developer_id: string
          id: string
          project_id: string
          role: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          developer_id: string
          id?: string
          project_id: string
          role?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          developer_id?: string
          id?: string
          project_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_developers_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_developers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          actual_hours: number | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          estimated_hours: number | null
          id: string
          is_deleted: boolean | null
          lead_developer_id: string | null
          name: string
          production_url: string | null
          repo_url: string | null
          staging_url: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          tech_stack: string[] | null
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_deleted?: boolean | null
          lead_developer_id?: string | null
          name: string
          production_url?: string | null
          repo_url?: string | null
          staging_url?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tech_stack?: string[] | null
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_deleted?: boolean | null
          lead_developer_id?: string | null
          name?: string
          production_url?: string | null
          repo_url?: string | null
          staging_url?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tech_stack?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_lead_developer_id_fkey"
            columns: ["lead_developer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
        ]
      }
      promise_tracker: {
        Row: {
          client_id: string | null
          client_name: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          due_date: string
          escalated_at: string | null
          escalated_to: string | null
          escalation_reason: string | null
          id: string
          is_deleted: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["ticket_priority"] | null
          promise_description: string
          promised_at: string
          promised_by: string | null
          promised_by_name: string | null
          reminder_sent: boolean | null
          reminder_sent_at: string | null
          status: Database["public"]["Enums"]["promise_status"]
          ticket_id: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          client_name: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date: string
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          promise_description: string
          promised_at?: string
          promised_by?: string | null
          promised_by_name?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["promise_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          client_name?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string
          escalated_at?: string | null
          escalated_to?: string | null
          escalation_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"] | null
          promise_description?: string
          promised_at?: string
          promised_by?: string | null
          promised_by_name?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["promise_status"]
          ticket_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promise_tracker_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      pull_requests: {
        Row: {
          author_id: string | null
          created_at: string
          description: string | null
          id: string
          is_deleted: boolean
          merge_commit_hash: string | null
          merged_at: string | null
          merged_by: string | null
          pr_url: string | null
          project_id: string
          reviewer_id: string | null
          source_branch: string
          status: string
          target_branch: string
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean
          merge_commit_hash?: string | null
          merged_at?: string | null
          merged_by?: string | null
          pr_url?: string | null
          project_id: string
          reviewer_id?: string | null
          source_branch: string
          status?: string
          target_branch?: string
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean
          merge_commit_hash?: string | null
          merged_at?: string | null
          merged_by?: string | null
          pr_url?: string | null
          project_id?: string
          reviewer_id?: string | null
          source_branch?: string
          status?: string
          target_branch?: string
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pull_requests_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_merged_by_fkey"
            columns: ["merged_by"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pull_requests_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approver_name: string | null
          build_request_id: string | null
          created_at: string
          id: string
          notes: string | null
          project_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approver_name?: string | null
          build_request_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approver_name?: string | null
          build_request_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_approvals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_approvals_build_request_id_fkey"
            columns: ["build_request_id"]
            isOneToOne: false
            referencedRelation: "build_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_approvals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      qa_tests: {
        Row: {
          actual_result: string | null
          build_request_id: string | null
          created_at: string
          description: string | null
          executed_at: string | null
          executed_by: string | null
          expected_result: string | null
          id: string
          is_deleted: boolean | null
          name: string
          notes: string | null
          project_id: string
          status: Database["public"]["Enums"]["qa_test_status"]
          test_type: string | null
          updated_at: string
        }
        Insert: {
          actual_result?: string | null
          build_request_id?: string | null
          created_at?: string
          description?: string | null
          executed_at?: string | null
          executed_by?: string | null
          expected_result?: string | null
          id?: string
          is_deleted?: boolean | null
          name: string
          notes?: string | null
          project_id: string
          status?: Database["public"]["Enums"]["qa_test_status"]
          test_type?: string | null
          updated_at?: string
        }
        Update: {
          actual_result?: string | null
          build_request_id?: string | null
          created_at?: string
          description?: string | null
          executed_at?: string | null
          executed_by?: string | null
          expected_result?: string | null
          id?: string
          is_deleted?: boolean | null
          name?: string
          notes?: string | null
          project_id?: string
          status?: Database["public"]["Enums"]["qa_test_status"]
          test_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qa_tests_build_request_id_fkey"
            columns: ["build_request_id"]
            isOneToOne: false
            referencedRelation: "build_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qa_tests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_events: {
        Row: {
          affected_service: string | null
          affected_service_id: string | null
          created_at: string | null
          event_type: string
          fallback_type: string | null
          fallback_used: boolean | null
          id: string
          internal_log: string | null
          max_retries: number | null
          metadata: Json | null
          original_error: string | null
          owner_notified: boolean | null
          recovery_action: string
          recovery_status: string | null
          resolved_at: string | null
          retry_count: number | null
          updated_at: string | null
          user_message: string | null
          user_notified: boolean | null
        }
        Insert: {
          affected_service?: string | null
          affected_service_id?: string | null
          created_at?: string | null
          event_type: string
          fallback_type?: string | null
          fallback_used?: boolean | null
          id?: string
          internal_log?: string | null
          max_retries?: number | null
          metadata?: Json | null
          original_error?: string | null
          owner_notified?: boolean | null
          recovery_action: string
          recovery_status?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          updated_at?: string | null
          user_message?: string | null
          user_notified?: boolean | null
        }
        Update: {
          affected_service?: string | null
          affected_service_id?: string | null
          created_at?: string | null
          event_type?: string
          fallback_type?: string | null
          fallback_used?: boolean | null
          id?: string
          internal_log?: string | null
          max_retries?: number | null
          metadata?: Json | null
          original_error?: string | null
          owner_notified?: boolean | null
          recovery_action?: string
          recovery_status?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          updated_at?: string | null
          user_message?: string | null
          user_notified?: boolean | null
        }
        Relationships: []
      }
      recovery_rules: {
        Row: {
          action_config: Json | null
          action_type: string
          cooldown_seconds: number | null
          created_at: string | null
          created_by: string | null
          id: string
          is_enabled: boolean | null
          max_auto_retries: number | null
          priority: number | null
          requires_approval: boolean | null
          rule_name: string
          trigger_condition: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          action_config?: Json | null
          action_type: string
          cooldown_seconds?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          max_auto_retries?: number | null
          priority?: number | null
          requires_approval?: boolean | null
          rule_name: string
          trigger_condition: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          action_config?: Json | null
          action_type?: string
          cooldown_seconds?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_enabled?: boolean | null
          max_auto_retries?: number | null
          priority?: number | null
          requires_approval?: boolean | null
          rule_name?: string
          trigger_condition?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      referral_events: {
        Row: {
          commission_amount: number | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          lead_id: string | null
          referral_id: string
          sale_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          lead_id?: string | null
          referral_id: string
          sale_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          commission_amount?: number | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          lead_id?: string | null
          referral_id?: string
          sale_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_events_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_paid: number | null
          commission_pending: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          referral_code: string
          referrer_id: string
          referrer_type: Database["public"]["Enums"]["app_role"]
          total_clicks: number | null
          total_commission: number | null
          total_leads: number | null
          total_revenue: number | null
          total_sales: number | null
          total_signups: number | null
          updated_at: string | null
        }
        Insert: {
          commission_paid?: number | null
          commission_pending?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          referral_code: string
          referrer_id: string
          referrer_type: Database["public"]["Enums"]["app_role"]
          total_clicks?: number | null
          total_commission?: number | null
          total_leads?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          total_signups?: number | null
          updated_at?: string | null
        }
        Update: {
          commission_paid?: number | null
          commission_pending?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          referral_code?: string
          referrer_id?: string
          referrer_type?: Database["public"]["Enums"]["app_role"]
          total_clicks?: number | null
          total_commission?: number | null
          total_leads?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          total_signups?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reputation_actions: {
        Row: {
          action_type: string
          created_at: string
          id: string
          is_silent: boolean | null
          new_score: number | null
          previous_score: number | null
          reason: string | null
          role_id: string
          role_type: string
          triggered_by: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          is_silent?: boolean | null
          new_score?: number | null
          previous_score?: number | null
          reason?: string | null
          role_id: string
          role_type: string
          triggered_by?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          is_silent?: boolean | null
          new_score?: number | null
          previous_score?: number | null
          reason?: string | null
          role_id?: string
          role_type?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      reseller_audit_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
          reseller_id: string | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
          reseller_id?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
          reseller_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_audit_logs_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_followups: {
        Row: {
          call_outcome: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          reseller_id: string | null
          scheduled_at: string
          status: string | null
        }
        Insert: {
          call_outcome?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          reseller_id?: string | null
          scheduled_at: string
          status?: string | null
        }
        Update: {
          call_outcome?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          reseller_id?: string | null
          scheduled_at?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_followups_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_penalties: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          issued_by: string | null
          penalty_type: string
          reason: string
          reseller_id: string | null
          resolved_at: string | null
          severity: string | null
          status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          issued_by?: string | null
          penalty_type: string
          reason: string
          reseller_id?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          issued_by?: string | null
          penalty_type?: string
          reason?: string
          reseller_id?: string | null
          resolved_at?: string | null
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_penalties_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_performance: {
        Row: {
          commission_earned: number | null
          conversion_rate: number | null
          created_at: string
          id: string
          is_deleted: boolean | null
          leads_converted: number | null
          leads_received: number | null
          performance_score: number | null
          period_end: string
          period_start: string
          ranking: number | null
          reseller_id: string
          revenue_generated: number | null
          updated_at: string
        }
        Insert: {
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          leads_converted?: number | null
          leads_received?: number | null
          performance_score?: number | null
          period_end: string
          period_start: string
          ranking?: number | null
          reseller_id: string
          revenue_generated?: number | null
          updated_at?: string
        }
        Update: {
          commission_earned?: number | null
          conversion_rate?: number | null
          created_at?: string
          id?: string
          is_deleted?: boolean | null
          leads_converted?: number | null
          leads_received?: number | null
          performance_score?: number | null
          period_end?: string
          period_start?: string
          ranking?: number | null
          reseller_id?: string
          revenue_generated?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_performance_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_plans: {
        Row: {
          benefits: Json | null
          commission_rate: number
          created_at: string
          description: string | null
          geo_level: string | null
          id: string
          is_active: boolean | null
          lead_cap: number | null
          monthly_fee: number
          name: string
          setup_fee: number
          support_level: string | null
          tier: Database["public"]["Enums"]["reseller_plan_tier"]
          updated_at: string
        }
        Insert: {
          benefits?: Json | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          geo_level?: string | null
          id?: string
          is_active?: boolean | null
          lead_cap?: number | null
          monthly_fee?: number
          name: string
          setup_fee?: number
          support_level?: string | null
          tier: Database["public"]["Enums"]["reseller_plan_tier"]
          updated_at?: string
        }
        Update: {
          benefits?: Json | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          geo_level?: string | null
          id?: string
          is_active?: boolean | null
          lead_cap?: number | null
          monthly_fee?: number
          name?: string
          setup_fee?: number
          support_level?: string | null
          tier?: Database["public"]["Enums"]["reseller_plan_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      reseller_scopes: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          city: string | null
          country: string | null
          created_at: string
          expires_at: string | null
          id: string
          industry_tags: string[] | null
          is_active: boolean | null
          is_deleted: boolean | null
          lead_cap: number | null
          priority: number | null
          product_ids: string[] | null
          reseller_id: string
          scope_type: string
          state: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          lead_cap?: number | null
          priority?: number | null
          product_ids?: string[] | null
          reseller_id: string
          scope_type?: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          industry_tags?: string[] | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          lead_cap?: number | null
          priority?: number | null
          product_ids?: string[] | null
          reseller_id?: string
          scope_type?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_scopes_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_targets: {
        Row: {
          created_at: string | null
          current_value: number | null
          id: string
          period_end: string
          period_start: string
          reseller_id: string | null
          status: string | null
          target_type: string
          target_value: number
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          period_end: string
          period_start: string
          reseller_id?: string | null
          status?: string | null
          target_type: string
          target_value: number
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          id?: string
          period_end?: string
          period_start?: string
          reseller_id?: string | null
          status?: string | null
          target_type?: string
          target_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "reseller_targets_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_violations: {
        Row: {
          created_at: string
          description: string | null
          evidence: Json | null
          id: string
          is_deleted: boolean | null
          reported_at: string
          reported_by: string | null
          reseller_id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["violation_severity"]
          status: Database["public"]["Enums"]["reseller_violation_status"]
          title: string
          updated_at: string
          violation_type: string
          warning_issued_at: string | null
          warning_issued_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          is_deleted?: boolean | null
          reported_at?: string
          reported_by?: string | null
          reseller_id: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"]
          status?: Database["public"]["Enums"]["reseller_violation_status"]
          title: string
          updated_at?: string
          violation_type: string
          warning_issued_at?: string | null
          warning_issued_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          is_deleted?: boolean | null
          reported_at?: string
          reported_by?: string | null
          reseller_id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["violation_severity"]
          status?: Database["public"]["Enums"]["reseller_violation_status"]
          title?: string
          updated_at?: string
          violation_type?: string
          warning_issued_at?: string | null
          warning_issued_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reseller_violations_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      reseller_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          is_locked: boolean | null
          last_settlement_at: string | null
          locked_at: string | null
          locked_by: string | null
          locked_reason: string | null
          pending_credits: number | null
          pending_debits: number | null
          reseller_id: string
          total_earned: number | null
          total_withdrawn: number | null
          updated_at: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          is_locked?: boolean | null
          last_settlement_at?: string | null
          locked_at?: string | null
          locked_by?: string | null
          locked_reason?: string | null
          pending_credits?: number | null
          pending_debits?: number | null
          reseller_id: string
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          is_locked?: boolean | null
          last_settlement_at?: string | null
          locked_at?: string | null
          locked_by?: string | null
          locked_reason?: string | null
          pending_credits?: number | null
          pending_debits?: number | null
          reseller_id?: string
          total_earned?: number | null
          total_withdrawn?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reseller_wallets_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: true
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
        ]
      }
      resellers: {
        Row: {
          business_name: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          created_by: string | null
          geo_scope: Json | null
          id: string
          is_deleted: boolean | null
          joined_at: string | null
          kyc_documents: Json | null
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          legal_name: string
          plan_id: string | null
          profile_id: string | null
          referral_code: string | null
          status: Database["public"]["Enums"]["reseller_status"]
          suspended_at: string | null
          suspended_reason: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          geo_scope?: Json | null
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          legal_name: string
          plan_id?: string | null
          profile_id?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["reseller_status"]
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          geo_scope?: Json | null
          id?: string
          is_deleted?: boolean | null
          joined_at?: string | null
          kyc_documents?: Json | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          legal_name?: string
          plan_id?: string | null
          profile_id?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["reseller_status"]
          suspended_at?: string | null
          suspended_reason?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resellers_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reseller_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resellers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          id: string
          ip_address: unknown
          role_id: string
          role_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: unknown
          role_id: string
          role_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: unknown
          role_id?: string
          role_type?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      role_audit_logs: {
        Row: {
          action: string
          approved_by: string | null
          approved_by_name: string | null
          created_at: string
          details: string | null
          id: string
          metadata: Json | null
          requested_by: string | null
          requested_by_name: string | null
          role_affected: Database["public"]["Enums"]["app_role"] | null
          target_user_email: string | null
          target_user_id: string | null
        }
        Insert: {
          action: string
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          requested_by?: string | null
          requested_by_name?: string | null
          role_affected?: Database["public"]["Enums"]["app_role"] | null
          target_user_email?: string | null
          target_user_id?: string | null
        }
        Update: {
          action?: string
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          metadata?: Json | null
          requested_by?: string | null
          requested_by_name?: string | null
          role_affected?: Database["public"]["Enums"]["app_role"] | null
          target_user_email?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      role_auto_reroute_logs: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          original_role_id: string
          original_role_type: string
          reason: string | null
          rerouted_at: string
          rerouted_to_pool: boolean | null
          rerouted_to_role_id: string | null
          restored_at: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          original_role_id: string
          original_role_type: string
          reason?: string | null
          rerouted_at?: string
          rerouted_to_pool?: boolean | null
          rerouted_to_role_id?: string | null
          restored_at?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          original_role_id?: string
          original_role_type?: string
          reason?: string | null
          rerouted_at?: string
          rerouted_to_pool?: boolean | null
          rerouted_to_role_id?: string | null
          restored_at?: string | null
        }
        Relationships: []
      }
      role_inactivity_flags: {
        Row: {
          auto_rerouted: boolean | null
          created_at: string
          earnings_paused: boolean | null
          flagged_at: string
          id: string
          last_activity_at: string | null
          resolved_at: string | null
          resolved_by: string | null
          role_id: string
          role_name: string | null
          role_type: string
          sla_threshold_hours: number | null
          updated_at: string
        }
        Insert: {
          auto_rerouted?: boolean | null
          created_at?: string
          earnings_paused?: boolean | null
          flagged_at?: string
          id?: string
          last_activity_at?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          role_id: string
          role_name?: string | null
          role_type: string
          sla_threshold_hours?: number | null
          updated_at?: string
        }
        Update: {
          auto_rerouted?: boolean | null
          created_at?: string
          earnings_paused?: boolean | null
          flagged_at?: string
          id?: string
          last_activity_at?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          role_id?: string
          role_name?: string | null
          role_type?: string
          sla_threshold_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      role_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          role_id: string
          role_type: string
          title: string
          type: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          role_id: string
          role_type: string
          title: string
          type?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          role_id?: string
          role_type?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"]
          created_at: string
          id: string
          permission_id: string
          role_id: string
          updated_at: string
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"]
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_preferences: {
        Row: {
          created_at: string | null
          currency: string | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          role_id: string
          role_type: string
          settings: Json | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          role_id: string
          role_type: string
          settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          role_id?: string
          role_type?: string
          settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_reputation_scores: {
        Row: {
          compliance_score: number | null
          created_at: string
          id: string
          last_calculated_at: string | null
          quality_score: number | null
          reputation_score: number | null
          response_time_score: number | null
          role_id: string
          role_name: string | null
          role_type: string
          throttle_percentage: number | null
          updated_at: string
          visibility_level: string | null
        }
        Insert: {
          compliance_score?: number | null
          created_at?: string
          id?: string
          last_calculated_at?: string | null
          quality_score?: number | null
          reputation_score?: number | null
          response_time_score?: number | null
          role_id: string
          role_name?: string | null
          role_type: string
          throttle_percentage?: number | null
          updated_at?: string
          visibility_level?: string | null
        }
        Update: {
          compliance_score?: number | null
          created_at?: string
          id?: string
          last_calculated_at?: string | null
          quality_score?: number | null
          reputation_score?: number | null
          response_time_score?: number | null
          role_id?: string
          role_name?: string | null
          role_type?: string
          throttle_percentage?: number | null
          updated_at?: string
          visibility_level?: string | null
        }
        Relationships: []
      }
      role_sessions: {
        Row: {
          device_info: Json | null
          ended_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string | null
          role_id: string
          role_type: string
          started_at: string | null
        }
        Insert: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          role_id: string
          role_type: string
          started_at?: string | null
        }
        Update: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          role_id?: string
          role_type?: string
          started_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          role_key: Database["public"]["Enums"]["app_role"]
          role_type: Database["public"]["Enums"]["role_type"]
          status: Database["public"]["Enums"]["role_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          role_key: Database["public"]["Enums"]["app_role"]
          role_type?: Database["public"]["Enums"]["role_type"]
          status?: Database["public"]["Enums"]["role_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          role_key?: Database["public"]["Enums"]["app_role"]
          role_type?: Database["public"]["Enums"]["role_type"]
          status?: Database["public"]["Enums"]["role_status"]
          updated_at?: string
        }
        Relationships: []
      }
      rollback_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          deploy_request_id: string | null
          executed_at: string | null
          id: string
          impact_scope: string | null
          reason: string
          requested_by: string
          status: Database["public"]["Enums"]["deploy_status"]
          target_version: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          deploy_request_id?: string | null
          executed_at?: string | null
          id?: string
          impact_scope?: string | null
          reason: string
          requested_by: string
          status?: Database["public"]["Enums"]["deploy_status"]
          target_version: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          deploy_request_id?: string | null
          executed_at?: string | null
          id?: string
          impact_scope?: string | null
          reason?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["deploy_status"]
          target_version?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rollback_requests_deploy_request_id_fkey"
            columns: ["deploy_request_id"]
            isOneToOne: false
            referencedRelation: "deploy_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          created_at: string | null
          discount_amount: number | null
          discount_percent: number | null
          id: string
          license_duration_months: number | null
          license_key: string | null
          pricing_tier_id: string | null
          product_id: string
          quantity: number | null
          sale_id: string
          tax_amount: number | null
          tax_percent: number | null
          total_amount: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          license_duration_months?: number | null
          license_key?: string | null
          pricing_tier_id?: string | null
          product_id: string
          quantity?: number | null
          sale_id: string
          tax_amount?: number | null
          tax_percent?: number | null
          total_amount: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          discount_amount?: number | null
          discount_percent?: number | null
          id?: string
          license_duration_months?: number | null
          license_key?: string | null
          pricing_tier_id?: string | null
          product_id?: string
          quantity?: number | null
          sale_id?: string
          tax_amount?: number | null
          tax_percent?: number | null
          total_amount?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_pricing_tier_id_fkey"
            columns: ["pricing_tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          billing_address: Json | null
          commission_calculated: boolean | null
          commission_paid: boolean | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          customer_id: string | null
          discount_amount: number | null
          id: string
          invoice_url: string | null
          is_deleted: boolean | null
          lead_id: string | null
          notes: string | null
          order_number: string
          order_status: Database["public"]["Enums"]["order_status"] | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          referral_code: string | null
          referred_by: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          commission_calculated?: boolean | null
          commission_paid?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          invoice_url?: string | null
          is_deleted?: boolean | null
          lead_id?: string | null
          notes?: string | null
          order_number: string
          order_status?: Database["public"]["Enums"]["order_status"] | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          referral_code?: string | null
          referred_by?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          commission_calculated?: boolean | null
          commission_paid?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          invoice_url?: string | null
          is_deleted?: boolean | null
          lead_id?: string | null
          notes?: string | null
          order_number?: string
          order_status?: Database["public"]["Enums"]["order_status"] | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          referral_code?: string | null
          referred_by?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scaling_events: {
        Row: {
          action: string
          created_at: string
          from_instances: number | null
          id: string
          policy_id: string | null
          server_id: string | null
          to_instances: number | null
          trigger_metric: Database["public"]["Enums"]["scaling_metric"] | null
          trigger_value: number | null
        }
        Insert: {
          action: string
          created_at?: string
          from_instances?: number | null
          id?: string
          policy_id?: string | null
          server_id?: string | null
          to_instances?: number | null
          trigger_metric?: Database["public"]["Enums"]["scaling_metric"] | null
          trigger_value?: number | null
        }
        Update: {
          action?: string
          created_at?: string
          from_instances?: number | null
          id?: string
          policy_id?: string | null
          server_id?: string | null
          to_instances?: number | null
          trigger_metric?: Database["public"]["Enums"]["scaling_metric"] | null
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scaling_events_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "auto_scaling_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scaling_events_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      security_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          ai_confidence: number | null
          ai_suggestion: string | null
          alert_type: string
          auto_action_taken: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          source: string | null
          source_ip: unknown
          status: string | null
          target_resource: string | null
          target_user_id: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          ai_confidence?: number | null
          ai_suggestion?: string | null
          alert_type: string
          auto_action_taken?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source?: string | null
          source_ip?: unknown
          status?: string | null
          target_resource?: string | null
          target_user_id?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          ai_confidence?: number | null
          ai_suggestion?: string | null
          alert_type?: string
          auto_action_taken?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source?: string | null
          source_ip?: unknown
          status?: string | null
          target_resource?: string | null
          target_user_id?: string | null
          title?: string
        }
        Relationships: []
      }
      security_sessions: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string | null
          geo_location: Json | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          is_trusted: boolean | null
          last_activity_at: string | null
          session_token: string
          terminated_at: string | null
          terminated_by: string | null
          termination_reason: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          geo_location?: Json | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_activity_at?: string | null
          session_token: string
          terminated_at?: string | null
          terminated_by?: string | null
          termination_reason?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          geo_location?: Json | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          is_trusted?: boolean | null
          last_activity_at?: string | null
          session_token?: string
          terminated_at?: string | null
          terminated_by?: string | null
          termination_reason?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seo_ai_tasks: {
        Row: {
          ai_input: Json | null
          ai_output: Json | null
          created_at: string
          error_message: string | null
          executed_at: string | null
          id: string
          status: string | null
          target_country: string | null
          target_url: string | null
          task_type: string
        }
        Insert: {
          ai_input?: Json | null
          ai_output?: Json | null
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          target_country?: string | null
          target_url?: string | null
          task_type: string
        }
        Update: {
          ai_input?: Json | null
          ai_output?: Json | null
          created_at?: string
          error_message?: string | null
          executed_at?: string | null
          id?: string
          status?: string | null
          target_country?: string | null
          target_url?: string | null
          task_type?: string
        }
        Relationships: []
      }
      seo_alerts: {
        Row: {
          alert_type: string
          country_code: string | null
          created_at: string
          description: string | null
          id: string
          is_actioned: boolean | null
          is_read: boolean | null
          metadata: Json | null
          priority: string | null
          title: string
        }
        Insert: {
          alert_type: string
          country_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_actioned?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          title: string
        }
        Update: {
          alert_type?: string
          country_code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_actioned?: boolean | null
          is_read?: boolean | null
          metadata?: Json | null
          priority?: string | null
          title?: string
        }
        Relationships: []
      }
      seo_country_pages: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          currency_code: string | null
          faq_schema: Json | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          language_code: string | null
          low_bandwidth_mode: boolean | null
          meta_description: string | null
          meta_title: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          currency_code?: string | null
          faq_schema?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language_code?: string | null
          low_bandwidth_mode?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          currency_code?: string | null
          faq_schema?: Json | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          language_code?: string | null
          low_bandwidth_mode?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_issues: {
        Row: {
          created_at: string
          description: string
          id: string
          is_deleted: boolean | null
          issue_type: string
          page_id: string | null
          recommendation: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["seo_issue_severity"]
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_deleted?: boolean | null
          issue_type: string
          page_id?: string | null
          recommendation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["seo_issue_severity"]
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_deleted?: boolean | null
          issue_type?: string
          page_id?: string | null
          recommendation?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["seo_issue_severity"]
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_issues_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_keywords: {
        Row: {
          created_at: string
          created_by: string | null
          current_rank: number | null
          difficulty: number | null
          id: string
          is_deleted: boolean | null
          keyword: string
          notes: string | null
          page_url: string | null
          search_volume: number | null
          status: string | null
          target_rank: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_rank?: number | null
          difficulty?: number | null
          id?: string
          is_deleted?: boolean | null
          keyword: string
          notes?: string | null
          page_url?: string | null
          search_volume?: number | null
          status?: string | null
          target_rank?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_rank?: number | null
          difficulty?: number | null
          id?: string
          is_deleted?: boolean | null
          keyword?: string
          notes?: string | null
          page_url?: string | null
          search_volume?: number | null
          status?: string | null
          target_rank?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string
          created_by: string | null
          h1_tag: string | null
          id: string
          indexed: boolean | null
          is_deleted: boolean | null
          last_crawled_at: string | null
          meta_description: string | null
          mobile_score: number | null
          notes: string | null
          page_score: number | null
          speed_score: number | null
          title: string | null
          updated_at: string
          url: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          h1_tag?: string | null
          id?: string
          indexed?: boolean | null
          is_deleted?: boolean | null
          last_crawled_at?: string | null
          meta_description?: string | null
          mobile_score?: number | null
          notes?: string | null
          page_score?: number | null
          speed_score?: number | null
          title?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          created_by?: string | null
          h1_tag?: string | null
          id?: string
          indexed?: boolean | null
          is_deleted?: boolean | null
          last_crawled_at?: string | null
          meta_description?: string | null
          mobile_score?: number | null
          notes?: string | null
          page_score?: number | null
          speed_score?: number | null
          title?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      server_access_attempts: {
        Row: {
          attempt_type: string
          block_reason: string | null
          blocked: boolean | null
          created_at: string
          geo_location: string | null
          id: string
          server_id: string | null
          source_ip: string
          target_port: number | null
          user_agent: string | null
        }
        Insert: {
          attempt_type: string
          block_reason?: string | null
          blocked?: boolean | null
          created_at?: string
          geo_location?: string | null
          id?: string
          server_id?: string | null
          source_ip: string
          target_port?: number | null
          user_agent?: string | null
        }
        Update: {
          attempt_type?: string
          block_reason?: string | null
          blocked?: boolean | null
          created_at?: string
          geo_location?: string | null
          id?: string
          server_id?: string | null
          source_ip?: string
          target_port?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_access_attempts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_access_controls: {
        Row: {
          access_type: string
          allowed_ip: string | null
          created_at: string
          created_by: string | null
          created_by_name: string | null
          expires_at: string | null
          id: string
          ip_range: string | null
          is_deleted: boolean | null
          is_enabled: boolean | null
          name: string
          notes: string | null
          port: number | null
          server_id: string | null
          updated_at: string
        }
        Insert: {
          access_type?: string
          allowed_ip?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          expires_at?: string | null
          id?: string
          ip_range?: string | null
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          name: string
          notes?: string | null
          port?: number | null
          server_id?: string | null
          updated_at?: string
        }
        Update: {
          access_type?: string
          allowed_ip?: string | null
          created_at?: string
          created_by?: string | null
          created_by_name?: string | null
          expires_at?: string | null
          id?: string
          ip_range?: string | null
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          name?: string
          notes?: string | null
          port?: number | null
          server_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_access_controls_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_activity_logs: {
        Row: {
          action: string
          approval_status: string | null
          approved_by: string | null
          approved_by_name: string | null
          created_at: string
          details: string | null
          id: string
          requested_by: string | null
          requested_by_name: string | null
          server_id: string | null
        }
        Insert: {
          action: string
          approval_status?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          requested_by?: string | null
          requested_by_name?: string | null
          server_id?: string | null
        }
        Update: {
          action?: string
          approval_status?: string | null
          approved_by?: string | null
          approved_by_name?: string | null
          created_at?: string
          details?: string | null
          id?: string
          requested_by?: string | null
          requested_by_name?: string | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_activity_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          acknowledged_by_name: string | null
          alert_type: string
          created_at: string
          description: string | null
          id: string
          is_deleted: boolean | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolved_by_name: string | null
          server_id: string | null
          severity: string
          snoozed_until: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          acknowledged_by_name?: string | null
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          server_id?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          acknowledged_by_name?: string | null
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          resolved_by_name?: string | null
          server_id?: string | null
          severity?: string
          snoozed_until?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_alerts_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json | null
          performed_by: string | null
          performed_by_email: string | null
          server_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          performed_by?: string | null
          performed_by_email?: string | null
          server_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          performed_by?: string | null
          performed_by_email?: string | null
          server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_audit_logs_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_backups: {
        Row: {
          backup_type: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          id: string
          is_automated: boolean | null
          is_deleted: boolean | null
          retention_days: number | null
          scheduled_at: string | null
          server_id: string | null
          size_mb: number | null
          started_at: string | null
          status: string
          storage_location: string | null
        }
        Insert: {
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          is_automated?: boolean | null
          is_deleted?: boolean | null
          retention_days?: number | null
          scheduled_at?: string | null
          server_id?: string | null
          size_mb?: number | null
          started_at?: string | null
          status?: string
          storage_location?: string | null
        }
        Update: {
          backup_type?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          is_automated?: boolean | null
          is_deleted?: boolean | null
          retention_days?: number | null
          scheduled_at?: string | null
          server_id?: string | null
          size_mb?: number | null
          started_at?: string | null
          status?: string
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_backups_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_incidents: {
        Row: {
          affected_services: string[] | null
          assigned_to: string | null
          created_at: string
          description: string | null
          escalated_to: string | null
          id: string
          incident_type: string
          is_deleted: boolean | null
          recovery_time_minutes: number | null
          reported_by: string | null
          resolution: string | null
          resolved_at: string | null
          root_cause: string | null
          server_id: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          started_at: string
          status: Database["public"]["Enums"]["server_incident_status"]
          title: string
          updated_at: string
        }
        Insert: {
          affected_services?: string[] | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          escalated_to?: string | null
          id?: string
          incident_type: string
          is_deleted?: boolean | null
          recovery_time_minutes?: number | null
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          server_id?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          started_at?: string
          status?: Database["public"]["Enums"]["server_incident_status"]
          title: string
          updated_at?: string
        }
        Update: {
          affected_services?: string[] | null
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          escalated_to?: string | null
          id?: string
          incident_type?: string
          is_deleted?: boolean | null
          recovery_time_minutes?: number | null
          reported_by?: string | null
          resolution?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          server_id?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          started_at?: string
          status?: Database["public"]["Enums"]["server_incident_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_incidents_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_ip_blocklist: {
        Row: {
          blocked_at: string
          blocked_by: string | null
          blocked_by_name: string | null
          created_at: string
          expires_at: string | null
          id: string
          ip_address: string
          ip_range: string | null
          is_active: boolean | null
          is_permanent: boolean | null
          reason: string
          severity: string | null
        }
        Insert: {
          blocked_at?: string
          blocked_by?: string | null
          blocked_by_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address: string
          ip_range?: string | null
          is_active?: boolean | null
          is_permanent?: boolean | null
          reason: string
          severity?: string | null
        }
        Update: {
          blocked_at?: string
          blocked_by?: string | null
          blocked_by_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          ip_address?: string
          ip_range?: string | null
          is_active?: boolean | null
          is_permanent?: boolean | null
          reason?: string
          severity?: string | null
        }
        Relationships: []
      }
      server_maintenance: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          affected_services: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_deleted: boolean | null
          maintenance_type: string
          scheduled_end: string | null
          scheduled_start: string
          server_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          affected_services?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          maintenance_type?: string
          scheduled_end?: string | null
          scheduled_start: string
          server_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          affected_services?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          maintenance_type?: string
          scheduled_end?: string | null
          scheduled_start?: string
          server_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_maintenance_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          recorded_at: string
          server_id: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          server_id?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          server_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "server_metrics_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      server_security_rules: {
        Row: {
          action: string
          created_at: string
          created_by: string | null
          description: string | null
          destination_port: number | null
          id: string
          is_deleted: boolean | null
          is_enabled: boolean | null
          priority: number | null
          protocol: string | null
          rule_name: string
          rule_type: string
          server_id: string | null
          source_ip: string | null
          updated_at: string
        }
        Insert: {
          action?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination_port?: number | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          priority?: number | null
          protocol?: string | null
          rule_name: string
          rule_type?: string
          server_id?: string | null
          source_ip?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          destination_port?: number | null
          id?: string
          is_deleted?: boolean | null
          is_enabled?: boolean | null
          priority?: number | null
          protocol?: string | null
          rule_name?: string
          rule_type?: string
          server_id?: string | null
          source_ip?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "server_security_rules_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          added_by_email: string | null
          added_by_user_id: string | null
          added_from_ip: unknown
          auto_scale_enabled: boolean | null
          client_name: string | null
          client_sla: string | null
          cpu_spec: string | null
          created_at: string
          created_by: string | null
          current_cpu_load: number | null
          current_disk_usage: number | null
          current_ram_load: number | null
          disk_spec: string | null
          expires_at: string | null
          id: string
          ip_address: string | null
          is_deleted: boolean | null
          is_management_active: boolean | null
          last_health_check: string | null
          login_password_hash: string | null
          login_user_id: string | null
          monthly_cost: number | null
          name: string
          owner_type: Database["public"]["Enums"]["server_owner_type"]
          provider: string
          ram_spec: string | null
          region: string | null
          server_type: Database["public"]["Enums"]["server_type"]
          status: Database["public"]["Enums"]["server_status"]
          updated_at: string
        }
        Insert: {
          added_by_email?: string | null
          added_by_user_id?: string | null
          added_from_ip?: unknown
          auto_scale_enabled?: boolean | null
          client_name?: string | null
          client_sla?: string | null
          cpu_spec?: string | null
          created_at?: string
          created_by?: string | null
          current_cpu_load?: number | null
          current_disk_usage?: number | null
          current_ram_load?: number | null
          disk_spec?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_deleted?: boolean | null
          is_management_active?: boolean | null
          last_health_check?: string | null
          login_password_hash?: string | null
          login_user_id?: string | null
          monthly_cost?: number | null
          name: string
          owner_type?: Database["public"]["Enums"]["server_owner_type"]
          provider: string
          ram_spec?: string | null
          region?: string | null
          server_type?: Database["public"]["Enums"]["server_type"]
          status?: Database["public"]["Enums"]["server_status"]
          updated_at?: string
        }
        Update: {
          added_by_email?: string | null
          added_by_user_id?: string | null
          added_from_ip?: unknown
          auto_scale_enabled?: boolean | null
          client_name?: string | null
          client_sla?: string | null
          cpu_spec?: string | null
          created_at?: string
          created_by?: string | null
          current_cpu_load?: number | null
          current_disk_usage?: number | null
          current_ram_load?: number | null
          disk_spec?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: string | null
          is_deleted?: boolean | null
          is_management_active?: boolean | null
          last_health_check?: string | null
          login_password_hash?: string | null
          login_user_id?: string | null
          monthly_cost?: number | null
          name?: string
          owner_type?: Database["public"]["Enums"]["server_owner_type"]
          provider?: string
          ram_spec?: string | null
          region?: string | null
          server_type?: Database["public"]["Enums"]["server_type"]
          status?: Database["public"]["Enums"]["server_status"]
          updated_at?: string
        }
        Relationships: []
      }
      sla_breaches: {
        Row: {
          breach_type: string
          breached_at: string
          created_at: string
          escalated_at: string | null
          escalated_to: string | null
          expected_at: string
          id: string
          notes: string | null
          resolved_at: string | null
          sla_rule_id: string | null
          ticket_id: string
        }
        Insert: {
          breach_type: string
          breached_at?: string
          created_at?: string
          escalated_at?: string | null
          escalated_to?: string | null
          expected_at: string
          id?: string
          notes?: string | null
          resolved_at?: string | null
          sla_rule_id?: string | null
          ticket_id: string
        }
        Update: {
          breach_type?: string
          breached_at?: string
          created_at?: string
          escalated_at?: string | null
          escalated_to?: string | null
          expected_at?: string
          id?: string
          notes?: string | null
          resolved_at?: string | null
          sla_rule_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sla_breaches_sla_rule_id_fkey"
            columns: ["sla_rule_id"]
            isOneToOne: false
            referencedRelation: "sla_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sla_breaches_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      sla_rules: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          escalation_after_minutes: number | null
          escalation_enabled: boolean | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes: number
          response_time_minutes: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          escalation_after_minutes?: number | null
          escalation_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes: number
          response_time_minutes: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          escalation_after_minutes?: number | null
          escalation_enabled?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution_time_minutes?: number
          response_time_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      support_audit_logs: {
        Row: {
          action: string
          action_type: string
          created_at: string
          details: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          performed_by_name: string | null
        }
        Insert: {
          action: string
          action_type: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Update: {
          action?: string
          action_type?: string
          created_at?: string
          details?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          performed_by_name?: string | null
        }
        Relationships: []
      }
      support_feedback: {
        Row: {
          agent_id: string | null
          agent_name: string | null
          assist_session_id: string | null
          client_id: string | null
          client_name: string | null
          comment: string | null
          created_at: string
          feedback_type: string | null
          flagged_at: string | null
          flagged_by: string | null
          flagged_reason: string | null
          id: string
          is_deleted: boolean | null
          is_flagged: boolean | null
          rating: Database["public"]["Enums"]["feedback_rating"]
          rating_score: number | null
          ticket_id: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_name?: string | null
          assist_session_id?: string | null
          client_id?: string | null
          client_name?: string | null
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          flagged_at?: string | null
          flagged_by?: string | null
          flagged_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          is_flagged?: boolean | null
          rating: Database["public"]["Enums"]["feedback_rating"]
          rating_score?: number | null
          ticket_id?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_name?: string | null
          assist_session_id?: string | null
          client_id?: string | null
          client_name?: string | null
          comment?: string | null
          created_at?: string
          feedback_type?: string | null
          flagged_at?: string | null
          flagged_by?: string | null
          flagged_reason?: string | null
          id?: string
          is_deleted?: boolean | null
          is_flagged?: boolean | null
          rating?: Database["public"]["Enums"]["feedback_rating"]
          rating_score?: number | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_feedback_assist_session_id_fkey"
            columns: ["assist_session_id"]
            isOneToOne: false
            referencedRelation: "assist_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_feedback_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      system_freeze: {
        Row: {
          created_at: string
          duration_minutes: number | null
          freeze_type: string
          frozen_at: string
          frozen_by: string
          id: string
          is_active: boolean
          module_id: string | null
          reason: string
          resumed_at: string | null
          resumed_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          freeze_type: string
          frozen_at?: string
          frozen_by: string
          id?: string
          is_active?: boolean
          module_id?: string | null
          reason: string
          resumed_at?: string | null
          resumed_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          freeze_type?: string
          frozen_at?: string
          frozen_by?: string
          id?: string
          is_active?: boolean
          module_id?: string | null
          reason?: string
          resumed_at?: string | null
          resumed_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_takeovers: {
        Row: {
          affected_entities: Json | null
          backup_pool_assigned: boolean | null
          campaigns_paused: number | null
          commitments_honored: number | null
          created_at: string
          ended_at: string | null
          id: string
          leads_reassigned: number | null
          recovery_notes: string | null
          role_id: string
          role_name: string | null
          role_type: string
          started_at: string
          status: string | null
          takeover_reason: string
          updated_at: string
        }
        Insert: {
          affected_entities?: Json | null
          backup_pool_assigned?: boolean | null
          campaigns_paused?: number | null
          commitments_honored?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          leads_reassigned?: number | null
          recovery_notes?: string | null
          role_id: string
          role_name?: string | null
          role_type: string
          started_at?: string
          status?: string | null
          takeover_reason: string
          updated_at?: string
        }
        Update: {
          affected_entities?: Json | null
          backup_pool_assigned?: boolean | null
          campaigns_paused?: number | null
          commitments_honored?: number | null
          created_at?: string
          ended_at?: string | null
          id?: string
          leads_reassigned?: number | null
          recovery_notes?: string | null
          role_id?: string
          role_name?: string | null
          role_type?: string
          started_at?: string
          status?: string | null
          takeover_reason?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          author_id: string | null
          author_name: string | null
          content: string
          created_at: string
          id: string
          task_id: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          content: string
          created_at?: string
          id?: string
          task_id: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          content?: string
          created_at?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          blocked_reason: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          is_deleted: boolean | null
          milestone_id: string | null
          parent_task_id: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status: Database["public"]["Enums"]["task_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_deleted?: boolean | null
          milestone_id?: string | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id: string
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          is_deleted?: boolean | null
          milestone_id?: string | null
          parent_task_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          project_id?: string
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "developers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_access_grants: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          expires_at: string
          granted_by: string
          id: string
          is_active: boolean
          is_deleted: boolean
          reason: string
          role_key: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at: string
          granted_by: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          reason: string
          role_key: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          expires_at?: string
          granted_by?: string
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          reason?: string
          role_key?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          build_request_id: string | null
          coverage_percent: number | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          failed_tests: number | null
          id: string
          passed_tests: number | null
          skipped_tests: number | null
          stack_trace: string | null
          status: string
          test_name: string
          test_type: string
          total_tests: number | null
        }
        Insert: {
          build_request_id?: string | null
          coverage_percent?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          failed_tests?: number | null
          id?: string
          passed_tests?: number | null
          skipped_tests?: number | null
          stack_trace?: string | null
          status: string
          test_name: string
          test_type: string
          total_tests?: number | null
        }
        Update: {
          build_request_id?: string | null
          coverage_percent?: number | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          failed_tests?: number | null
          id?: string
          passed_tests?: number | null
          skipped_tests?: number | null
          stack_trace?: string | null
          status?: string
          test_name?: string
          test_type?: string
          total_tests?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_results_build_request_id_fkey"
            columns: ["build_request_id"]
            isOneToOne: false
            referencedRelation: "build_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      threat_events: {
        Row: {
          auto_action_taken: string | null
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          is_resolved: boolean | null
          metadata: Json | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          source_ip: unknown
          target_resource: string | null
          target_user_id: string | null
        }
        Insert: {
          auto_action_taken?: string | null
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source_ip?: unknown
          target_resource?: string | null
          target_user_id?: string | null
        }
        Update: {
          auto_action_taken?: string | null
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          is_resolved?: boolean | null
          metadata?: Json | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          source_ip?: unknown
          target_resource?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      ticket_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          assigned_to: string
          created_at: string
          id: string
          is_active: boolean | null
          notes: string | null
          ticket_id: string
          unassigned_at: string | null
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          ticket_id: string
          unassigned_at?: string | null
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          assigned_to?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          notes?: string | null
          ticket_id?: string
          unassigned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_assignments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          closed_at: string | null
          created_at: string
          created_by: string | null
          description: string | null
          first_response_at: string | null
          id: string
          is_deleted: boolean | null
          is_sla_breached: boolean | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          sla_resolution_deadline: string | null
          sla_response_deadline: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subcategory: string | null
          subject: string
          tags: string[] | null
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_sla_breached?: boolean | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          sla_resolution_deadline?: string | null
          sla_response_deadline?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subcategory?: string | null
          subject: string
          tags?: string[] | null
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          closed_at?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          first_response_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_sla_breached?: boolean | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          sla_resolution_deadline?: string | null
          sla_response_deadline?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subcategory?: string | null
          subject?: string
          tags?: string[] | null
          ticket_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      tier_features: {
        Row: {
          feature_name: string
          feature_value: string | null
          id: string
          is_included: boolean | null
          sort_order: number | null
          tier_id: string
        }
        Insert: {
          feature_name: string
          feature_value?: string | null
          id?: string
          is_included?: boolean | null
          sort_order?: number | null
          tier_id: string
        }
        Update: {
          feature_name?: string
          feature_value?: string | null
          id?: string
          is_included?: boolean | null
          sort_order?: number | null
          tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tier_features_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "pricing_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_kyc: {
        Row: {
          created_at: string | null
          document_number: string | null
          document_type: string
          document_url: string | null
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_number?: string | null
          document_type: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_number?: string | null
          document_type?: string
          document_url?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          note: string
          note_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          note: string
          note_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          note?: string
          note_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          ended_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vala_ai_action_logs: {
        Row: {
          action_details: Json
          action_scope: string
          action_type: string
          approval_required: boolean
          approval_status: string | null
          approved_by: string | null
          created_at: string
          executed_at: string | null
          id: string
          result: Json | null
          risk_level: string
          target_entity_id: string | null
          target_entity_type: string | null
        }
        Insert: {
          action_details?: Json
          action_scope: string
          action_type: string
          approval_required?: boolean
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          result?: Json | null
          risk_level?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Update: {
          action_details?: Json
          action_scope?: string
          action_type?: string
          approval_required?: boolean
          approval_status?: string | null
          approved_by?: string | null
          created_at?: string
          executed_at?: string | null
          id?: string
          result?: Json | null
          risk_level?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
        }
        Relationships: []
      }
      vala_ai_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          id: string
          is_locked: boolean
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string
          id?: string
          is_locked?: boolean
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          id?: string
          is_locked?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          commission_rate: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      wallet_ledger: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          performed_by: string | null
          performed_by_name: string | null
          reference_id: string | null
          reference_type: string | null
          reseller_id: string
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          performed_by?: string | null
          performed_by_name?: string | null
          reference_id?: string | null
          reference_type?: string | null
          reseller_id: string
          transaction_type: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          performed_by?: string | null
          performed_by_name?: string | null
          reference_id?: string | null
          reference_type?: string | null
          reseller_id?: string
          transaction_type?: Database["public"]["Enums"]["wallet_transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_reseller_id_fkey"
            columns: ["reseller_id"]
            isOneToOne: false
            referencedRelation: "resellers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_ledger_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "reseller_wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          hold_amount: number
          id: string
          is_deleted: boolean
          is_locked: boolean
          lock_reason: string | null
          locked_at: string | null
          locked_by: string | null
          owner_id: string
          owner_name: string
          updated_at: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          hold_amount?: number
          id?: string
          is_deleted?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          owner_id: string
          owner_name: string
          updated_at?: string
          wallet_type: Database["public"]["Enums"]["wallet_type"]
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          hold_amount?: number
          id?: string
          is_deleted?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          owner_id?: string
          owner_name?: string
          updated_at?: string
          wallet_type?: Database["public"]["Enums"]["wallet_type"]
        }
        Relationships: []
      }
      zero_blame_incidents: {
        Row: {
          actual_cause: string
          affected_users: number | null
          caused_by_role_id: string | null
          caused_by_role_type: string | null
          created_at: string
          id: string
          incident_type: string
          internal_details: string | null
          resolved: boolean | null
          resolved_at: string | null
          severity: string | null
          user_facing_message: string
        }
        Insert: {
          actual_cause: string
          affected_users?: number | null
          caused_by_role_id?: string | null
          caused_by_role_type?: string | null
          created_at?: string
          id?: string
          incident_type: string
          internal_details?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
          user_facing_message?: string
        }
        Update: {
          actual_cause?: string
          affected_users?: number | null
          caused_by_role_id?: string | null
          caused_by_role_type?: string | null
          created_at?: string
          id?: string
          incident_type?: string
          internal_details?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          severity?: string | null
          user_facing_message?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_super: { Args: { _user_id: string }; Returns: boolean }
      is_code_manager: { Args: { _user_id: string }; Returns: boolean }
      is_hr_manager: { Args: { _user_id: string }; Returns: boolean }
      is_manager: { Args: { _user_id: string }; Returns: boolean }
      is_product_demo_manager: { Args: never; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      access_level: "none" | "view" | "request" | "execute"
      access_request_status: "pending" | "approved" | "rejected" | "expired"
      account_status: "active" | "suspended" | "pending_verification"
      ai_suggestion_status: "pending" | "accepted" | "rejected" | "expired"
      app_role:
        | "user_basic"
        | "user_pro"
        | "reseller_basic"
        | "reseller_pro"
        | "franchise_city"
        | "franchise_state"
        | "franchise_country"
        | "influencer"
        | "lead_manager"
        | "project_manager"
        | "code_manager"
        | "seo_manager"
        | "admin"
        | "super_admin"
        | "hr_manager"
        | "product_demo_manager"
        | "vala_ai"
      approval_status: "pending" | "approved" | "rejected"
      approval_type:
        | "system"
        | "payment"
        | "risk"
        | "ai"
        | "access"
        | "deployment"
        | "rollback"
      assist_session_status: "pending" | "active" | "paused" | "ended"
      billing_cycle:
        | "monthly"
        | "quarterly"
        | "semi_annual"
        | "annual"
        | "one_time"
        | "custom"
      bug_severity: "low" | "medium" | "high" | "critical" | "blocker"
      bug_status: "open" | "in_progress" | "resolved" | "closed" | "wont_fix"
      build_status:
        | "pending"
        | "queued"
        | "building"
        | "success"
        | "failed"
        | "cancelled"
      campaign_status:
        | "draft"
        | "pending_approval"
        | "active"
        | "paused"
        | "completed"
        | "cancelled"
      campaign_type:
        | "google_ads"
        | "meta_ads"
        | "linkedin_ads"
        | "email"
        | "sms"
        | "whatsapp"
        | "organic"
      content_status:
        | "draft"
        | "pending_review"
        | "approved"
        | "published"
        | "archived"
      cost_category: "ai" | "api" | "server" | "storage" | "bandwidth" | "other"
      deploy_status:
        | "pending"
        | "approved"
        | "rejected"
        | "deploying"
        | "success"
        | "failed"
        | "rolled_back"
      developer_level: "junior" | "mid" | "senior" | "lead" | "principal"
      developer_status: "active" | "inactive" | "suspended"
      environment_type: "development" | "staging" | "production"
      feedback_rating: "very_poor" | "poor" | "average" | "good" | "excellent"
      franchise_plan_tier: "silver" | "gold" | "platinum"
      franchise_status: "pending" | "active" | "suspended" | "terminated"
      franchise_violation_status:
        | "open"
        | "warning_issued"
        | "suspended"
        | "resolved"
        | "escalated"
      franchise_violation_type:
        | "policy_breach"
        | "territory_abuse"
        | "payment_issue"
        | "sla_violation"
        | "brand_misuse"
      incident_severity: "low" | "medium" | "high" | "critical"
      invoice_status: "draft" | "pending" | "paid" | "cancelled" | "overdue"
      kyc_status: "pending" | "verified" | "rejected"
      lead_source:
        | "website"
        | "referral"
        | "google_ads"
        | "facebook_ads"
        | "linkedin"
        | "cold_call"
        | "email_campaign"
        | "trade_show"
        | "partner"
        | "other"
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "demo_scheduled"
        | "demo_done"
        | "proposal_sent"
        | "negotiation"
        | "won"
        | "lost"
        | "on_hold"
      lead_temperature: "cold" | "warm" | "hot"
      license_status: "active" | "expired" | "suspended" | "revoked"
      license_type:
        | "perpetual"
        | "subscription"
        | "trial"
        | "freemium"
        | "enterprise"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "completed"
        | "cancelled"
        | "refunded"
      payment_status: "pending" | "paid" | "failed" | "refunded" | "partial"
      payout_status:
        | "pending"
        | "approved"
        | "processing"
        | "completed"
        | "failed"
        | "held"
      plan_type: "prime_user" | "franchise" | "reseller" | "api"
      pricing_model:
        | "one_time"
        | "subscription"
        | "usage_based"
        | "freemium"
        | "tiered"
      project_status:
        | "planning"
        | "active"
        | "on_hold"
        | "completed"
        | "archived"
      promise_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "overdue"
        | "escalated"
      qa_test_status: "pending" | "passed" | "failed" | "skipped"
      reseller_plan_tier: "silver" | "gold" | "platinum"
      reseller_status: "active" | "paused" | "pending" | "suspended"
      reseller_violation_status:
        | "open"
        | "warning_issued"
        | "suspended"
        | "closed"
      role_status: "active" | "locked" | "deprecated"
      role_type: "system" | "business" | "support"
      scaling_metric: "cpu" | "memory" | "requests" | "connections"
      seo_issue_severity: "low" | "medium" | "high" | "critical"
      server_incident_status: "active" | "monitoring" | "resolved" | "escalated"
      server_owner_type: "own" | "client"
      server_status: "running" | "warning" | "down" | "maintenance"
      server_type: "cloud" | "dedicated" | "vps"
      task_priority: "low" | "medium" | "high" | "critical"
      task_status:
        | "backlog"
        | "todo"
        | "in_progress"
        | "review"
        | "completed"
        | "cancelled"
      territory_type: "exclusive" | "shared"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
      transaction_type: "credit" | "debit" | "hold" | "release"
      violation_severity: "low" | "medium" | "high" | "critical"
      wallet_transaction_type: "credit" | "debit" | "adjustment" | "settlement"
      wallet_type: "company" | "franchise" | "reseller" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      access_level: ["none", "view", "request", "execute"],
      access_request_status: ["pending", "approved", "rejected", "expired"],
      account_status: ["active", "suspended", "pending_verification"],
      ai_suggestion_status: ["pending", "accepted", "rejected", "expired"],
      app_role: [
        "user_basic",
        "user_pro",
        "reseller_basic",
        "reseller_pro",
        "franchise_city",
        "franchise_state",
        "franchise_country",
        "influencer",
        "lead_manager",
        "project_manager",
        "code_manager",
        "seo_manager",
        "admin",
        "super_admin",
        "hr_manager",
        "product_demo_manager",
        "vala_ai",
      ],
      approval_status: ["pending", "approved", "rejected"],
      approval_type: [
        "system",
        "payment",
        "risk",
        "ai",
        "access",
        "deployment",
        "rollback",
      ],
      assist_session_status: ["pending", "active", "paused", "ended"],
      billing_cycle: [
        "monthly",
        "quarterly",
        "semi_annual",
        "annual",
        "one_time",
        "custom",
      ],
      bug_severity: ["low", "medium", "high", "critical", "blocker"],
      bug_status: ["open", "in_progress", "resolved", "closed", "wont_fix"],
      build_status: [
        "pending",
        "queued",
        "building",
        "success",
        "failed",
        "cancelled",
      ],
      campaign_status: [
        "draft",
        "pending_approval",
        "active",
        "paused",
        "completed",
        "cancelled",
      ],
      campaign_type: [
        "google_ads",
        "meta_ads",
        "linkedin_ads",
        "email",
        "sms",
        "whatsapp",
        "organic",
      ],
      content_status: [
        "draft",
        "pending_review",
        "approved",
        "published",
        "archived",
      ],
      cost_category: ["ai", "api", "server", "storage", "bandwidth", "other"],
      deploy_status: [
        "pending",
        "approved",
        "rejected",
        "deploying",
        "success",
        "failed",
        "rolled_back",
      ],
      developer_level: ["junior", "mid", "senior", "lead", "principal"],
      developer_status: ["active", "inactive", "suspended"],
      environment_type: ["development", "staging", "production"],
      feedback_rating: ["very_poor", "poor", "average", "good", "excellent"],
      franchise_plan_tier: ["silver", "gold", "platinum"],
      franchise_status: ["pending", "active", "suspended", "terminated"],
      franchise_violation_status: [
        "open",
        "warning_issued",
        "suspended",
        "resolved",
        "escalated",
      ],
      franchise_violation_type: [
        "policy_breach",
        "territory_abuse",
        "payment_issue",
        "sla_violation",
        "brand_misuse",
      ],
      incident_severity: ["low", "medium", "high", "critical"],
      invoice_status: ["draft", "pending", "paid", "cancelled", "overdue"],
      kyc_status: ["pending", "verified", "rejected"],
      lead_source: [
        "website",
        "referral",
        "google_ads",
        "facebook_ads",
        "linkedin",
        "cold_call",
        "email_campaign",
        "trade_show",
        "partner",
        "other",
      ],
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "demo_scheduled",
        "demo_done",
        "proposal_sent",
        "negotiation",
        "won",
        "lost",
        "on_hold",
      ],
      lead_temperature: ["cold", "warm", "hot"],
      license_status: ["active", "expired", "suspended", "revoked"],
      license_type: [
        "perpetual",
        "subscription",
        "trial",
        "freemium",
        "enterprise",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_status: ["pending", "paid", "failed", "refunded", "partial"],
      payout_status: [
        "pending",
        "approved",
        "processing",
        "completed",
        "failed",
        "held",
      ],
      plan_type: ["prime_user", "franchise", "reseller", "api"],
      pricing_model: [
        "one_time",
        "subscription",
        "usage_based",
        "freemium",
        "tiered",
      ],
      project_status: [
        "planning",
        "active",
        "on_hold",
        "completed",
        "archived",
      ],
      promise_status: [
        "pending",
        "in_progress",
        "completed",
        "overdue",
        "escalated",
      ],
      qa_test_status: ["pending", "passed", "failed", "skipped"],
      reseller_plan_tier: ["silver", "gold", "platinum"],
      reseller_status: ["active", "paused", "pending", "suspended"],
      reseller_violation_status: [
        "open",
        "warning_issued",
        "suspended",
        "closed",
      ],
      role_status: ["active", "locked", "deprecated"],
      role_type: ["system", "business", "support"],
      scaling_metric: ["cpu", "memory", "requests", "connections"],
      seo_issue_severity: ["low", "medium", "high", "critical"],
      server_incident_status: ["active", "monitoring", "resolved", "escalated"],
      server_owner_type: ["own", "client"],
      server_status: ["running", "warning", "down", "maintenance"],
      server_type: ["cloud", "dedicated", "vps"],
      task_priority: ["low", "medium", "high", "critical"],
      task_status: [
        "backlog",
        "todo",
        "in_progress",
        "review",
        "completed",
        "cancelled",
      ],
      territory_type: ["exclusive", "shared"],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: ["open", "in_progress", "waiting", "resolved", "closed"],
      transaction_type: ["credit", "debit", "hold", "release"],
      violation_severity: ["low", "medium", "high", "critical"],
      wallet_transaction_type: ["credit", "debit", "adjustment", "settlement"],
      wallet_type: ["company", "franchise", "reseller", "user"],
    },
  },
} as const
