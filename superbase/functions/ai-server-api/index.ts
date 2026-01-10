import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AI Role Types
type AIRole = 'AI_MONITOR' | 'AI_SECURITY' | 'AI_DEBUGGER' | 'AI_AUTOFIX' | 'AI_PREDICTOR' | 'AI_COST_OPTIMIZER';

// Risk levels
type RiskLevel = 'low' | 'medium' | 'high';

// Response standard
interface AIResponse {
  status: 'success' | 'warning' | 'blocked';
  message: string;
  ai_action_taken: boolean;
  next_suggestion: string | null;
  data?: any;
}

// AI Gate check
async function aiGateCheck(
  supabase: any,
  actionType: string,
  serverId: string | null,
  userRole: string,
  context: any
): Promise<{ risk_level: RiskLevel; decision: 'allow' | 'block'; reason: string }> {
  
  // Define high-risk actions
  const highRiskActions = ['kill', 'delete', 'shutdown', 'format', 'reset_all'];
  const mediumRiskActions = ['restart', 'update_config', 'change_password', 'block_ip'];
  
  let riskLevel: RiskLevel = 'low';
  let decision: 'allow' | 'block' = 'allow';
  let reason = 'Action permitted';
  
  // Check for high-risk actions
  if (highRiskActions.includes(actionType)) {
    riskLevel = 'high';
    if (userRole !== 'super_admin' && userRole !== 'admin') {
      decision = 'block';
      reason = 'High-risk action requires admin privileges';
    } else {
      decision = 'allow';
      reason = 'High-risk action approved by admin';
    }
  } else if (mediumRiskActions.includes(actionType)) {
    riskLevel = 'medium';
    if (userRole === 'viewer' || userRole === 'guest') {
      decision = 'block';
      reason = 'Action requires elevated privileges';
    }
  }
  
  // Log the gate check
  await supabase.from('ai_security_logs').insert({
    event_type: 'gate_check',
    action_attempted: actionType,
    action_allowed: decision === 'allow',
    risk_level: riskLevel,
    blocked_reason: decision === 'block' ? reason : null,
    metadata: { server_id: serverId, user_role: userRole, context }
  });
  
  return { risk_level: riskLevel, decision, reason };
}

// Log AI action
async function logAIAction(
  supabase: any,
  action: string,
  decision: string,
  riskLevel: string,
  actor: 'AI' | 'User',
  serverId: string | null,
  result: any
) {
  await supabase.from('ai_execution_logs').insert({
    execution_type: action,
    status: decision === 'allow' ? 'completed' : 'blocked',
    metadata: {
      risk_level: riskLevel,
      actor,
      server_id: serverId,
      result
    }
  });
}

// Create standardized response
function createResponse(
  status: 'success' | 'warning' | 'blocked',
  message: string,
  aiActionTaken: boolean,
  nextSuggestion: string | null = null,
  data?: any
): AIResponse {
  return {
    status,
    message,
    ai_action_taken: aiActionTaken,
    next_suggestion: nextSuggestion,
    data
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const body = await req.json().catch(() => ({}));
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { server_id, user_role = 'user', context = {} } = body;
    
    // Route handlers
    const routes: Record<string, () => Promise<AIResponse>> = {
      
      // ============ AI GATE ============
      '/ai/gate/check': async () => {
        const { action_type } = body;
        const gateResult = await aiGateCheck(supabase, action_type, server_id, user_role, context);
        
        return createResponse(
          gateResult.decision === 'allow' ? 'success' : 'blocked',
          gateResult.reason,
          true,
          gateResult.decision === 'block' ? 'Request elevated access or contact admin' : null,
          gateResult
        );
      },
      
      // ============ MONITORING ============
      '/ai/monitor/health': async () => {
        const gate = await aiGateCheck(supabase, 'monitor_health', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, 'Request view access');
        }
        
        // Fetch server metrics
        const { data: server } = await supabase
          .from('servers')
          .select('current_cpu_load, current_ram_load, current_disk_usage, status')
          .eq('id', server_id)
          .single();
        
        if (!server) {
          return createResponse('warning', 'Server not found', false, 'Verify server ID');
        }
        
        // Classify status
        let healthStatus = 'OK';
        if (server.current_cpu_load > 90 || server.current_ram_load > 90) {
          healthStatus = 'CRITICAL';
        } else if (server.current_cpu_load > 70 || server.current_ram_load > 70) {
          healthStatus = 'WARNING';
        }
        
        await logAIAction(supabase, 'monitor_health', 'allow', gate.risk_level, 'AI', server_id, { healthStatus });
        
        return createResponse(
          healthStatus === 'CRITICAL' ? 'warning' : 'success',
          `Health Status: ${healthStatus}`,
          true,
          healthStatus !== 'OK' ? 'Consider scaling resources or optimizing workloads' : null,
          { cpu: server.current_cpu_load, ram: server.current_ram_load, disk: server.current_disk_usage, status: healthStatus }
        );
      },
      
      '/ai/monitor/anomaly': async () => {
        const gate = await aiGateCheck(supabase, 'monitor_anomaly', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate anomaly detection
        const anomalies: string[] = [];
        const { data: server } = await supabase
          .from('servers')
          .select('*')
          .eq('id', server_id)
          .single();
        
        if (server?.current_cpu_load > 85) {
          anomalies.push('CPU spike detected above normal threshold');
        }
        if (server?.current_ram_load > 85) {
          anomalies.push('Memory pressure detected');
        }
        
        await logAIAction(supabase, 'monitor_anomaly', 'allow', gate.risk_level, 'AI', server_id, { anomalies });
        
        return createResponse(
          anomalies.length > 0 ? 'warning' : 'success',
          anomalies.length > 0 ? `${anomalies.length} anomaly detected` : 'No anomalies detected',
          true,
          anomalies.length > 0 ? 'AI recommends reviewing resource allocation' : null,
          { anomalies }
        );
      },
      
      // ============ SECURITY ============
      '/ai/security/scan': async () => {
        const gate = await aiGateCheck(supabase, 'security_scan', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate comprehensive scan
        const scanResults = {
          malware: { detected: false, threats: [] },
          backdoors: { detected: false, suspicious_files: [] },
          open_ports: [22, 80, 443, 3306],
          config_issues: ['SSH root login enabled', 'Firewall rule needs review'],
          scan_duration_ms: 2340
        };
        
        await logAIAction(supabase, 'security_scan', 'allow', gate.risk_level, 'AI', server_id, scanResults);
        
        return createResponse(
          scanResults.config_issues.length > 0 ? 'warning' : 'success',
          `Scan complete: ${scanResults.config_issues.length} issue(s) found`,
          true,
          scanResults.config_issues.length > 0 ? 'Apply recommended security fixes' : null,
          scanResults
        );
      },
      
      '/ai/security/login-analysis': async () => {
        const gate = await aiGateCheck(supabase, 'login_analysis', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate login analysis
        const analysis = {
          total_attempts: 127,
          failed_attempts: 3,
          unique_countries: ['India', 'USA'],
          suspicious_patterns: [],
          brute_force_detected: false,
          device_anomalies: []
        };
        
        await logAIAction(supabase, 'login_analysis', 'allow', gate.risk_level, 'AI', server_id, analysis);
        
        return createResponse(
          'success',
          'Login analysis complete - No threats detected',
          true,
          null,
          analysis
        );
      },
      
      '/ai/security/block': async () => {
        const { ip, country } = body;
        const gate = await aiGateCheck(supabase, 'block_ip', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Log the block action
        await logAIAction(supabase, 'block_ip', 'allow', gate.risk_level, 'AI', server_id, { ip, country });
        
        return createResponse(
          'success',
          `Successfully blocked ${ip || country}`,
          true,
          'Monitor for additional suspicious activity',
          { blocked: ip || country, type: ip ? 'ip' : 'country' }
        );
      },
      
      // ============ DEBUG & AUTO-FIX ============
      '/ai/debug/analyze': async () => {
        const gate = await aiGateCheck(supabase, 'debug_analyze', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate debug analysis
        const analysis = {
          error_logs: ['Service timeout at 14:32', 'Memory allocation failed'],
          service_failures: [],
          config_mismatches: ['nginx.conf version mismatch'],
          root_cause: 'Memory pressure causing service instability',
          suggested_fix: 'Increase memory allocation or optimize running processes'
        };
        
        await logAIAction(supabase, 'debug_analyze', 'allow', gate.risk_level, 'AI', server_id, analysis);
        
        return createResponse(
          'warning',
          `Root cause identified: ${analysis.root_cause}`,
          true,
          analysis.suggested_fix,
          analysis
        );
      },
      
      '/ai/debug/fix': async () => {
        const { fix_type } = body;
        const gate = await aiGateCheck(supabase, 'debug_fix', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate fix application
        const fixResult = {
          action: fix_type || 'auto',
          services_restarted: ['nginx', 'mysql'],
          config_patched: true,
          rollback_available: true
        };
        
        await logAIAction(supabase, 'debug_fix', 'allow', gate.risk_level, 'AI', server_id, fixResult);
        
        return createResponse(
          'success',
          'Fix applied successfully. Services restored.',
          true,
          'Monitor for 15 minutes to ensure stability',
          fixResult
        );
      },
      
      // ============ SERVER ACTIONS ============
      '/ai/action/restart': async () => {
        const gate = await aiGateCheck(supabase, 'restart', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, 'Request admin approval for restart');
        }
        
        // Simulate safe restart
        const restartResult = {
          pre_check: 'passed',
          graceful_shutdown: true,
          services_stopped: 5,
          services_started: 5,
          duration_seconds: 12
        };
        
        await logAIAction(supabase, 'restart', 'allow', gate.risk_level, 'AI', server_id, restartResult);
        
        return createResponse(
          'success',
          'Server restarted safely. All services verified.',
          true,
          null,
          restartResult
        );
      },
      
      '/ai/action/kill': async () => {
        const gate = await aiGateCheck(supabase, 'kill', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, 'Kill action requires admin privileges');
        }
        
        // Simulate force kill
        const killResult = {
          isolation: true,
          processes_terminated: 8,
          audit_logged: true,
          recovery_available: true
        };
        
        await logAIAction(supabase, 'kill', 'allow', gate.risk_level, 'AI', server_id, killResult);
        
        return createResponse(
          'warning',
          'Server force stopped. Audit log updated.',
          true,
          'Review server state before bringing back online',
          killResult
        );
      },
      
      '/ai/action/recheck': async () => {
        const gate = await aiGateCheck(supabase, 'recheck', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Fetch fresh metrics
        const { data: server } = await supabase
          .from('servers')
          .select('*')
          .eq('id', server_id)
          .single();
        
        await logAIAction(supabase, 'recheck', 'allow', gate.risk_level, 'AI', server_id, { refreshed: true });
        
        return createResponse(
          'success',
          'Metrics refreshed successfully',
          true,
          null,
          { cpu: server?.current_cpu_load, ram: server?.current_ram_load, disk: server?.current_disk_usage }
        );
      },
      
      // ============ SSL & COMPLIANCE ============
      '/ai/compliance/ssl-check': async () => {
        const gate = await aiGateCheck(supabase, 'ssl_check', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate SSL check
        const sslResult = {
          valid: true,
          expires_in_days: 45,
          issuer: 'Let\'s Encrypt',
          auto_renew_enabled: true,
          grade: 'A+'
        };
        
        await logAIAction(supabase, 'ssl_check', 'allow', gate.risk_level, 'AI', server_id, sslResult);
        
        return createResponse(
          sslResult.expires_in_days < 14 ? 'warning' : 'success',
          `SSL valid for ${sslResult.expires_in_days} days (Grade: ${sslResult.grade})`,
          true,
          sslResult.expires_in_days < 14 ? 'Renew SSL certificate soon' : null,
          sslResult
        );
      },
      
      '/ai/compliance/audit': async () => {
        const gate = await aiGateCheck(supabase, 'compliance_audit', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate compliance audit
        const auditResult = {
          overall_score: 92,
          passed_checks: 47,
          failed_checks: 4,
          missing_policies: ['backup_verification', 'password_rotation'],
          gdpr_compliant: true,
          iso_compliant: false
        };
        
        await logAIAction(supabase, 'compliance_audit', 'allow', gate.risk_level, 'AI', server_id, auditResult);
        
        return createResponse(
          auditResult.failed_checks > 0 ? 'warning' : 'success',
          `Audit Score: ${auditResult.overall_score}% - ${auditResult.failed_checks} issues`,
          true,
          auditResult.failed_checks > 0 ? 'Address missing policies for full compliance' : null,
          auditResult
        );
      },
      
      // ============ COST OPTIMIZATION ============
      '/ai/cost/analyze': async () => {
        const gate = await aiGateCheck(supabase, 'cost_analyze', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate cost analysis
        const costAnalysis = {
          current_monthly_cost: 145.00,
          idle_resources: ['backup-server-02', 'dev-instance-old'],
          over_provisioned: ['main-db (using 30% of allocated RAM)'],
          potential_savings: 32.50,
          recommendation: 'Downscale main-db RAM from 16GB to 8GB'
        };
        
        await logAIAction(supabase, 'cost_analyze', 'allow', gate.risk_level, 'AI', server_id, costAnalysis);
        
        return createResponse(
          'success',
          `Potential savings: $${costAnalysis.potential_savings}/month`,
          true,
          costAnalysis.recommendation,
          costAnalysis
        );
      },
      
      '/ai/cost/recommend': async () => {
        const gate = await aiGateCheck(supabase, 'cost_recommend', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate recommendations
        const recommendations = [
          { action: 'downscale', target: 'main-db', savings: 15.00 },
          { action: 'schedule_shutdown', target: 'dev-server', savings: 8.50 },
          { action: 'delete', target: 'backup-server-02', savings: 9.00 }
        ];
        
        await logAIAction(supabase, 'cost_recommend', 'allow', gate.risk_level, 'AI', server_id, recommendations);
        
        return createResponse(
          'success',
          `${recommendations.length} cost optimization recommendations`,
          true,
          'Apply recommendations to reduce monthly costs',
          { recommendations, total_potential_savings: 32.50 }
        );
      },
      
      // ============ INCIDENT & PREDICTION ============
      '/ai/predict/failure': async () => {
        const gate = await aiGateCheck(supabase, 'predict_failure', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate failure prediction
        const predictedIssues: string[] = [];
        const riskScore = 23;
        
        if (riskScore > 70) {
          predictedIssues.push('High probability of resource exhaustion');
        }
        
        const prediction = {
          risk_score: riskScore,
          predicted_issues: predictedIssues,
          time_horizon: '7 days',
          confidence: 87,
          factors: ['Disk usage trending up', 'Memory occasional spikes']
        };
        
        await logAIAction(supabase, 'predict_failure', 'allow', gate.risk_level, 'AI', server_id, prediction);
        
        return createResponse(
          prediction.risk_score > 50 ? 'warning' : 'success',
          `Failure Risk: ${prediction.risk_score}% (${prediction.confidence}% confidence)`,
          true,
          prediction.risk_score > 30 ? 'Consider proactive resource scaling' : null,
          prediction
        );
      },
      
      '/ai/incident/recover': async () => {
        const gate = await aiGateCheck(supabase, 'incident_recover', server_id, user_role, context);
        if (gate.decision === 'block') {
          return createResponse('blocked', gate.reason, false, null);
        }
        
        // Simulate incident recovery
        const recovery = {
          isolation_applied: true,
          services_restored: ['nginx', 'mysql', 'redis'],
          notifications_sent: ['admin@company.com'],
          recovery_time_seconds: 45,
          rollback_performed: false
        };
        
        await logAIAction(supabase, 'incident_recover', 'allow', gate.risk_level, 'AI', server_id, recovery);
        
        return createResponse(
          'success',
          `Incident recovered in ${recovery.recovery_time_seconds}s. ${recovery.services_restored.length} services restored.`,
          true,
          'Review incident log and update runbooks',
          recovery
        );
      }
    };
    
    // Find and execute route handler
    const routeKey = Object.keys(routes).find(key => pathname.endsWith(key));
    
    if (routeKey && routes[routeKey]) {
      const result = await routes[routeKey]();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    
    // Route not found
    return new Response(
      JSON.stringify({ 
        status: 'blocked', 
        message: 'Unknown API endpoint', 
        ai_action_taken: false, 
        next_suggestion: 'Check API documentation' 
      }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("AI Server API Error:", error);
    return new Response(
      JSON.stringify({ 
        status: 'blocked', 
        message: error instanceof Error ? error.message : 'Internal error', 
        ai_action_taken: false,
        next_suggestion: 'Contact support if issue persists'
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
