import { supabase } from '@/integrations/supabase/client';
import type { Json, Database } from '@/integrations/supabase/types';

export type NotificationType = 
  | 'system' | 'payment' | 'security' | 'incident' | 'finance'
  | 'lead' | 'sales' | 'support' | 'ticket' | 'assist' | 'sla'
  | 'demo' | 'license' | 'hr' | 'job' | 'application' | 'interview'
  | 'task' | 'build' | 'deploy' | 'bug' | 'code_review'
  | 'franchise' | 'reseller' | 'commission' | 'performance'
  | 'campaign' | 'content' | 'bonus' | 'conversion';

export type NotificationPriority = 'low' | 'medium' | 'high';

type AppRole = Database['public']['Enums']['app_role'];

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  targetUrl?: string;
  targetRoles?: string[];
  metadata?: Json;
  expiresAt?: Date;
}

interface BroadcastNotificationParams {
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  targetUrl?: string;
  targetRoles: AppRole[];
  metadata?: Json;
}

/**
 * Create a notification for a specific user
 */
export async function createNotification({
  userId,
  title,
  message,
  type,
  priority = 'medium',
  targetUrl,
  targetRoles = [],
  metadata = null,
  expiresAt,
}: CreateNotificationParams) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      priority,
      target_url: targetUrl,
      target_roles: targetRoles,
      metadata,
      expires_at: expiresAt?.toISOString(),
      delivery_status: 'pending',
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    throw error;
  }

  return data;
}

/**
 * Broadcast notification to all users with specific roles
 */
export async function broadcastToRoles({
  title,
  message,
  type,
  priority = 'medium',
  targetUrl,
  targetRoles,
  metadata = null,
}: BroadcastNotificationParams) {
  // Get all users with the target roles
  const { data: userRoles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .in('role', targetRoles);

  if (rolesError) {
    console.error('Error fetching users by role:', rolesError);
    throw rolesError;
  }

  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  // Get unique user IDs
  const uniqueUserIds = [...new Set(userRoles.map(ur => ur.user_id))];

  // Create notifications for all users
  const notifications = uniqueUserIds.map(userId => ({
    user_id: userId,
    title,
    message,
    type,
    priority,
    target_url: targetUrl,
    target_roles: targetRoles as string[],
    metadata,
    delivery_status: 'pending',
    is_read: false,
  }));

  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select();

  if (error) {
    console.error('Error broadcasting notifications:', error);
    throw error;
  }

  return data;
}

/**
 * Create system-wide notification (for all users)
 */
export async function createSystemNotification({
  title,
  message,
  priority = 'high',
  targetUrl,
  metadata = null,
}: {
  title: string;
  message: string;
  priority?: NotificationPriority;
  targetUrl?: string;
  metadata?: Json;
}) {
  // Get all active users
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id');

  if (profilesError) {
    console.error('Error fetching users:', profilesError);
    throw profilesError;
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  const notifications = profiles.map(profile => ({
    user_id: profile.id,
    title,
    message,
    type: 'system' as NotificationType,
    priority,
    target_url: targetUrl,
    target_roles: ['all'],
    metadata,
    delivery_status: 'pending',
    is_read: false,
  }));

  const { data, error } = await supabase
    .from('notifications')
    .insert(notifications)
    .select();

  if (error) {
    console.error('Error creating system notifications:', error);
    throw error;
  }

  return data;
}

/**
 * Quick notification helpers for common scenarios - ENTERPRISE GRADE
 */
export const NotificationHelpers = {
  // ============ PAYMENT NOTIFICATIONS ============
  paymentSuccess: (userId: string, amount: number, currency: string) =>
    createNotification({
      userId,
      title: 'Payment Successful',
      message: `Your payment of ${currency} ${amount.toFixed(2)} has been processed successfully.`,
      type: 'payment',
      priority: 'medium',
      targetUrl: '/finance/invoices',
    }),

  paymentPending: (userId: string, orderId: string) =>
    createNotification({
      userId,
      title: 'Payment Pending',
      message: `Your payment is being verified. Order ID: ${orderId}`,
      type: 'payment',
      priority: 'medium',
      targetUrl: '/finance/invoices',
    }),

  paymentFailed: (userId: string, orderId: string, reason?: string) =>
    createNotification({
      userId,
      title: 'Payment Failed',
      message: reason ? `Payment failed: ${reason}` : `Your payment could not be processed. Please try again.`,
      type: 'payment',
      priority: 'high',
      targetUrl: '/finance/invoices',
    }),

  refundProcessed: (userId: string, amount: number, currency: string) =>
    createNotification({
      userId,
      title: 'Refund Processed',
      message: `Your refund of ${currency} ${amount.toFixed(2)} has been processed.`,
      type: 'payment',
      priority: 'medium',
      targetUrl: '/finance/invoices',
    }),

  invoiceGenerated: (userId: string, invoiceId: string) =>
    createNotification({
      userId,
      title: 'Invoice Generated',
      message: `Invoice #${invoiceId} has been generated and is ready for download.`,
      type: 'finance',
      priority: 'low',
      targetUrl: '/finance/invoices',
    }),

  // ============ DEMO & LICENSE NOTIFICATIONS ============
  demoReady: (userId: string, productName: string) =>
    createNotification({
      userId,
      title: 'Demo Ready',
      message: `Your demo for ${productName} is ready to use.`,
      type: 'demo',
      priority: 'medium',
      targetUrl: '/demos/active',
    }),

  demoExpiring: (userId: string, productName: string, daysLeft: number) =>
    createNotification({
      userId,
      title: 'Demo Expiring Soon',
      message: `Your ${productName} demo expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Upgrade now to keep access.`,
      type: 'demo',
      priority: 'high',
      targetUrl: '/marketplace/pricing',
    }),

  demoExpired: (userId: string, productName: string) =>
    createNotification({
      userId,
      title: 'Demo Expired',
      message: `Your ${productName} demo has expired. Upgrade to continue using all features.`,
      type: 'demo',
      priority: 'high',
      targetUrl: '/marketplace/pricing',
    }),

  licenseIssued: (userId: string, productName: string, licenseKey: string) =>
    createNotification({
      userId,
      title: 'License Issued',
      message: `Your license for ${productName} has been issued. License key: ${licenseKey.slice(0, 8)}...`,
      type: 'license',
      priority: 'medium',
      targetUrl: '/licenses',
    }),

  upgradeRequired: (userId: string, feature: string) =>
    createNotification({
      userId,
      title: 'Upgrade Required',
      message: `To access ${feature}, please upgrade your plan.`,
      type: 'license',
      priority: 'medium',
      targetUrl: '/marketplace/pricing',
    }),

  // ============ LEAD & SALES NOTIFICATIONS ============
  newLead: (userId: string, leadName: string) =>
    createNotification({
      userId,
      title: 'New Lead Assigned',
      message: `A new lead "${leadName}" has been assigned to you.`,
      type: 'lead',
      priority: 'high',
      targetUrl: '/leads',
    }),

  leadAssigned: (userId: string, leadName: string, assignedBy: string) =>
    createNotification({
      userId,
      title: 'Lead Assigned to You',
      message: `${assignedBy} assigned lead "${leadName}" to you.`,
      type: 'lead',
      priority: 'medium',
      targetUrl: '/leads',
    }),

  leadConverted: (userId: string, leadName: string, dealValue?: number) =>
    createNotification({
      userId,
      title: 'Lead Converted!',
      message: dealValue 
        ? `Congratulations! Lead "${leadName}" converted with deal value of $${dealValue.toLocaleString()}.`
        : `Congratulations! Lead "${leadName}" has been successfully converted.`,
      type: 'conversion',
      priority: 'high',
      targetUrl: '/leads',
    }),

  // ============ SUPPORT NOTIFICATIONS ============
  ticketCreated: (userId: string, ticketId: string) =>
    createNotification({
      userId,
      title: 'Support Ticket Created',
      message: `Your support ticket #${ticketId} has been created. Our team will respond shortly.`,
      type: 'support',
      priority: 'medium',
      targetUrl: '/support/tickets',
    }),

  ticketResolved: (userId: string, ticketId: string) =>
    createNotification({
      userId,
      title: 'Ticket Resolved',
      message: `Your support ticket #${ticketId} has been resolved.`,
      type: 'support',
      priority: 'medium',
      targetUrl: '/support/tickets',
    }),

  ticketUpdated: (userId: string, ticketId: string, updateType: string) =>
    createNotification({
      userId,
      title: 'Ticket Updated',
      message: `Ticket #${ticketId} has been updated: ${updateType}`,
      type: 'ticket',
      priority: 'medium',
      targetUrl: `/support/tickets/${ticketId}`,
    }),

  assistRequest: (userId: string, clientName: string, sessionCode: string) =>
    createNotification({
      userId,
      title: 'Remote Assist Request',
      message: `${clientName} is requesting remote assistance. Session: ${sessionCode}`,
      type: 'assist',
      priority: 'high',
      targetUrl: '/support/assist-sessions',
    }),

  issueResolved: (userId: string, issueTitle: string) =>
    createNotification({
      userId,
      title: 'Issue Resolved',
      message: `The issue "${issueTitle}" has been resolved.`,
      type: 'support',
      priority: 'low',
      targetUrl: '/support/tickets',
    }),

  // ============ SYSTEM & SERVER NOTIFICATIONS ============
  serverDown: (severity: 'low' | 'medium' | 'high', serverName: string) =>
    broadcastToRoles({
      title: 'Server Down Alert',
      message: `Server "${serverName}" is experiencing downtime. Investigating...`,
      type: 'incident',
      priority: severity,
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/boss/server-snapshot',
    }),

  serverRecovery: (serverName: string) =>
    broadcastToRoles({
      title: 'Server Recovered',
      message: `Server "${serverName}" has recovered and is back online.`,
      type: 'system',
      priority: 'medium',
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/boss/server-snapshot',
    }),

  autoScalingEvent: (action: 'scale-up' | 'scale-down', serverName: string, instances: number) =>
    broadcastToRoles({
      title: `Auto-Scaling: ${action === 'scale-up' ? 'Scale Up' : 'Scale Down'}`,
      message: `${serverName} ${action === 'scale-up' ? 'scaled up to' : 'scaled down to'} ${instances} instances.`,
      type: 'system',
      priority: 'low',
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/server/auto-scaling',
    }),

  securityAlert: (severity: 'low' | 'medium' | 'high', threatType: string, details: string) =>
    broadcastToRoles({
      title: `Security Alert: ${threatType}`,
      message: details,
      type: 'security',
      priority: severity,
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/boss/security-alerts',
    }),

  incidentPredicted: (incidentType: string, probability: number) =>
    broadcastToRoles({
      title: 'Incident Predicted',
      message: `AI detected ${Math.round(probability * 100)}% probability of ${incidentType}. Review recommended.`,
      type: 'incident',
      priority: probability > 0.8 ? 'high' : 'medium',
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/boss/aiapi/incident-prediction',
    }),

  serverIncident: (severity: 'low' | 'medium' | 'high', message: string) =>
    broadcastToRoles({
      title: `System Alert: ${severity === 'high' ? 'Critical' : severity === 'medium' ? 'Warning' : 'Info'}`,
      message,
      type: 'incident',
      priority: severity,
      targetRoles: ['super_admin', 'admin'] as AppRole[],
      targetUrl: '/boss/server-snapshot',
    }),

  // ============ HR & JOB NOTIFICATIONS ============
  applicationReceived: (userId: string, jobTitle: string, applicantName: string) =>
    createNotification({
      userId,
      title: 'New Application Received',
      message: `${applicantName} applied for ${jobTitle}.`,
      type: 'application',
      priority: 'medium',
      targetUrl: '/hr/applications',
    }),

  interviewScheduled: (userId: string, candidateName: string, jobTitle: string, dateTime: string) =>
    createNotification({
      userId,
      title: 'Interview Scheduled',
      message: `Interview with ${candidateName} for ${jobTitle} scheduled for ${dateTime}.`,
      type: 'interview',
      priority: 'high',
      targetUrl: '/hr/applications',
    }),

  applicationApproved: (userId: string, jobTitle: string) =>
    createNotification({
      userId,
      title: 'Application Approved',
      message: `Congratulations! Your application for ${jobTitle} has been approved.`,
      type: 'job',
      priority: 'high',
      targetUrl: '/hr/applications',
    }),

  applicationRejected: (userId: string, jobTitle: string) =>
    createNotification({
      userId,
      title: 'Application Status Update',
      message: `Your application for ${jobTitle} was not selected. Thank you for your interest.`,
      type: 'job',
      priority: 'medium',
      targetUrl: '/hr/applications',
    }),

  // ============ BUILD & DEPLOY NOTIFICATIONS ============
  buildSuccess: (userId: string, projectName: string, buildNumber?: string) =>
    createNotification({
      userId,
      title: 'Build Successful',
      message: buildNumber 
        ? `Build #${buildNumber} for ${projectName} completed successfully.`
        : `Build for ${projectName} completed successfully.`,
      type: 'build',
      priority: 'low',
      targetUrl: '/development/builds',
    }),

  buildFailed: (userId: string, projectName: string, error: string) =>
    createNotification({
      userId,
      title: 'Build Failed',
      message: `Build for ${projectName} failed: ${error}`,
      type: 'build',
      priority: 'high',
      targetUrl: '/development/builds',
    }),

  deploymentSuccess: (userId: string, projectName: string, environment: string) =>
    createNotification({
      userId,
      title: 'Deployment Successful',
      message: `${projectName} deployed to ${environment} successfully.`,
      type: 'deploy',
      priority: 'medium',
      targetUrl: '/development/deployments',
    }),

  deploymentFailed: (userId: string, projectName: string, environment: string, error: string) =>
    createNotification({
      userId,
      title: 'Deployment Failed',
      message: `${projectName} deployment to ${environment} failed: ${error}`,
      type: 'deploy',
      priority: 'high',
      targetUrl: '/development/deployments',
    }),

  // ============ FRANCHISE & RESELLER NOTIFICATIONS ============
  franchiseAlert: (userId: string, alertType: string, message: string) =>
    createNotification({
      userId,
      title: `Franchise Alert: ${alertType}`,
      message,
      type: 'franchise',
      priority: 'medium',
      targetUrl: '/portal/franchise',
    }),

  resellerAlert: (userId: string, alertType: string, message: string) =>
    createNotification({
      userId,
      title: `Reseller Alert: ${alertType}`,
      message,
      type: 'reseller',
      priority: 'medium',
      targetUrl: '/portal/reseller',
    }),

  commissionEarned: (userId: string, amount: number, currency: string, source: string) =>
    createNotification({
      userId,
      title: 'Commission Earned!',
      message: `You earned ${currency} ${amount.toFixed(2)} commission from ${source}.`,
      type: 'commission',
      priority: 'medium',
      targetUrl: '/portal/reseller/earnings',
    }),

  performanceAlert: (userId: string, metric: string, status: 'above' | 'below' | 'at', target: string) =>
    createNotification({
      userId,
      title: 'Performance Update',
      message: `Your ${metric} is ${status} target: ${target}`,
      type: 'performance',
      priority: status === 'below' ? 'high' : 'low',
      targetUrl: '/portal/performance',
    }),
};
