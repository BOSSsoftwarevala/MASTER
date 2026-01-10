import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { PositiveErrorBoundary } from "@/components/PositiveErrorBoundary";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users/UsersPage";
import RolesPage from "./pages/roles/RolesPage";
import RoleRegistryPage from "./pages/roles/RoleRegistryPage";
import PermissionMatrixPage from "./pages/roles/PermissionMatrixPage";
import RoleAssignmentPage from "./pages/roles/RoleAssignmentPage";
import TempAccessPage from "./pages/roles/TempAccessPage";
import PrivilegeEscalationPage from "./pages/roles/PrivilegeEscalationPage";
import AccessViolationLogPage from "./pages/roles/AccessViolationLogPage";
import RoleAuditLogPage from "./pages/roles/RoleAuditLogPage";
import LeadsPage from "./pages/leads/LeadsPage";
import NotFound from "./pages/NotFound";

// Boss Panel Pages - Oversight & Approval ONLY
import BossOverviewPage from "./pages/boss/BossOverviewPage";
import ApprovalCenterPage from "./pages/boss/ApprovalCenterPage";
import SystemFreezePage from "./pages/boss/SystemFreezePage";
import AccessOverridePage from "./pages/boss/AccessOverridePage";
import FinancialSnapshotPage from "./pages/boss/FinancialSnapshotPage";
import ServerSnapshotPage from "./pages/boss/ServerSnapshotPage";
import DeploymentSnapshotPage from "./pages/boss/DeploymentSnapshotPage";
import SecurityAlertsPage from "./pages/boss/SecurityAlertsPage";
import AuditLogPage from "./pages/boss/AuditLogPage";
import SessionControlPage from "./pages/boss/SessionControlPage";
import BossSettingsPage from "./pages/boss/BossSettingsPage";
import LegalCompliancePage from "./pages/boss/LegalCompliancePage";
import BlackBoxVaultPage from "./pages/boss/BlackBoxVaultPage";

// Approval Center Pages
import ApprovalDashboardPage from "./pages/boss/approvals/ApprovalDashboardPage";
import PendingApprovalsPage from "./pages/boss/approvals/PendingApprovalsPage";
import ApprovalDetailPage from "./pages/boss/approvals/ApprovalDetailPage";
import HighRiskApprovalsPage from "./pages/boss/approvals/HighRiskApprovalsPage";
import AIApprovalsPage from "./pages/boss/approvals/AIApprovalsPage";
import PaymentApprovalsPage from "./pages/boss/approvals/PaymentApprovalsPage";
import AccessApprovalsPage from "./pages/boss/approvals/AccessApprovalsPage";
import ApprovalHistoryPage from "./pages/boss/approvals/ApprovalHistoryPage";

// AI/API Manager Pages
import AiApiManagerPage from "./pages/boss/aiapi/AiApiManagerPage";
import AiServicesPage from "./pages/boss/aiapi/AiServicesPage";
import ApiProvidersPage from "./pages/boss/aiapi/ApiProvidersPage";
import AiApiLogsPage from "./pages/boss/aiapi/AiApiLogsPage";
import AutoRecoveryPage from "./pages/boss/aiapi/AutoRecoveryPage";
import IncidentPredictionPage from "./pages/boss/aiapi/IncidentPredictionPage";
import CostOptimizerPage from "./pages/boss/aiapi/CostOptimizerPage";
import ApiRegistryPage from "./pages/boss/aiapi/ApiRegistryPage";
import FallbackRulesPage from "./pages/boss/aiapi/FallbackRulesPage";
import AiDecisionsLogPage from "./pages/boss/aiapi/AiDecisionsLogPage";

// Security Pages
import ThreatMonitorPage from "./pages/boss/ThreatMonitorPage";
import IPBlocklistPage from "./pages/boss/IPBlocklistPage";
import DeviceTrustPage from "./pages/boss/DeviceTrustPage";
import SecurityModelPage from "./pages/boss/SecurityModelPage";

// AI CEO Pages
import AiCeoDashboard from "./pages/boss/aiceo/AiCeoDashboard";
import AiCeoSystemMonitor from "./pages/boss/aiceo/AiCeoSystemMonitor";
import AiCeoBusinessIntel from "./pages/boss/aiceo/AiCeoBusinessIntel";
import AiCeoRiskDetection from "./pages/boss/aiceo/AiCeoRiskDetection";
import AiCeoSuggestions from "./pages/boss/aiceo/AiCeoSuggestions";
import AiCeoPredictions from "./pages/boss/aiceo/AiCeoPredictions";
import AiCeoDecisionLog from "./pages/boss/aiceo/AiCeoDecisionLog";

// VALA AI Command Center
import ValaAICommandCenter from "./pages/boss/vala/ValaAICommandCenter";
import ValaSubPage from "./pages/boss/vala/ValaSubPage";
import ValaAICeoInsights from "./pages/boss/vala/ValaAICeoInsights";
import ValaAILiveDecisions from "./pages/boss/vala/ValaAILiveDecisions";
import ValaAIActiveTasks from "./pages/boss/vala/ValaAIActiveTasks";
import ValaAIPriorityQueue from "./pages/boss/vala/ValaAIPriorityQueue";
import ValaAIGrowth from "./pages/boss/vala/ValaAIGrowth";

// Governance Pages (Fail-Safe Layer)
import InactivityGovernancePage from "./pages/boss/governance/InactivityGovernancePage";
import ReputationProtectionPage from "./pages/boss/governance/ReputationProtectionPage";
import SystemTakeoverPage from "./pages/boss/governance/SystemTakeoverPage";
import AiFailsafePage from "./pages/boss/governance/AiFailsafePage";
import ZeroBlameIncidentsPage from "./pages/boss/governance/ZeroBlameIncidentsPage";
import BossOverridePage from "./pages/boss/governance/BossOverridePage";

import ServerOverviewPage from "./pages/server/ServerOverviewPage";
import ServerManagerDashboard from "./pages/server/ServerManagerDashboard";
import OwnServerPage from "./pages/server/OwnServerPage";
import ClientServerPage from "./pages/server/ClientServerPage";
import AutoScalingPage from "./pages/server/AutoScalingPage";
import ServerExpiryPage from "./pages/server/ServerExpiryPage";
import ServerIncidentPage from "./pages/server/ServerIncidentPage";
import ServerSecurityPage from "./pages/server/ServerSecurityPage";
import ServerActivityLogPage from "./pages/server/ServerActivityLogPage";
import AddServerPage from "./pages/server/AddServerPage";
import EditServerPage from "./pages/server/EditServerPage";
import DeleteServerPage from "./pages/server/DeleteServerPage";
import SecurityRulesPage from "./pages/server/SecurityRulesPage";
import BackupsPage from "./pages/server/BackupsPage";
import MaintenancePage from "./pages/server/MaintenancePage";
import ServerHealthPage from "./pages/server/ServerHealthPage";
import ServerLoadPage from "./pages/server/ServerLoadPage";
import ServerSnapshotMonitorPage from "./pages/server/ServerSnapshotPage";
import ServerUptimePage from "./pages/server/ServerUptimePage";
import ServerAlertsPage from "./pages/server/ServerAlertsPage";
import ServerAccessControlPage from "./pages/server/ServerAccessControlPage";
import ThresholdRulesPage from "./pages/server/ThresholdRulesPage";
import ServerListPage from "./pages/server/ServerListPage";
import ServerDetailPage from "./pages/server/ServerDetailPage";
import ServerSettingsPage from "./pages/server/ServerSettingsPage";

// Server Module Extensions (Mirage Core)
import ServerSecurityCenterPage from "./pages/server/ServerSecurityCenterPage";
import ServerSecurityModelPage from "./pages/server/ServerSecurityModelPage";
import UserActivityPage from "./pages/server/UserActivityPage";
import GeoControlPage from "./pages/server/GeoControlPage";
import BackdoorScanPage from "./pages/server/BackdoorScanPage";
import PortControlPage from "./pages/server/PortControlPage";
import CostControlPage from "./pages/server/CostControlPage";
import ServerLogsPage from "./pages/server/ServerLogsPage";

// Development Control Pages (Build • Deploy • Version Governance)
import BuildPipelineOverviewPage from "./pages/development/BuildPipelineOverviewPage";
import BuildTriggerPage from "./pages/development/BuildTriggerPage";
import TestQAGatePage from "./pages/development/TestQAGatePage";
import DeploymentControlPage from "./pages/development/DeploymentControlPage";
import ReleaseManagementPage from "./pages/development/ReleaseManagementPage";
import RollbackControlPage from "./pages/development/RollbackControlPage";
import VersionGovernancePage from "./pages/development/VersionGovernancePage";
import DeployIncidentPage from "./pages/development/DeployIncidentPage";
import CategoryManagementPage from "./pages/development/CategoryManagementPage";

// Franchise Control Pages
import FranchiseRegistryPage from "./pages/franchise/FranchiseRegistryPage";
import FranchiseOnboardingPage from "./pages/franchise/FranchiseOnboardingPage";
import TerritoryAssignmentPage from "./pages/franchise/TerritoryAssignmentPage";
import FranchisePlansPage from "./pages/franchise/FranchisePlansPage";
import FranchisePerformancePage from "./pages/franchise/FranchisePerformancePage";
import FranchiseWalletPage from "./pages/franchise/FranchiseWalletPage";
import FranchiseViolationsPage from "./pages/franchise/FranchiseViolationsPage";
import FranchiseAuditLogPage from "./pages/franchise/FranchiseAuditLogPage";

// Development Manager Pages
import DevManagerDashboard from "./pages/devmanager/DevManagerDashboard";
import DevelopersPage from "./pages/devmanager/DevelopersPage";
import AddDeveloperPage from "./pages/devmanager/AddDeveloperPage";
import EditDeveloperPage from "./pages/devmanager/EditDeveloperPage";
import DeleteDeveloperPage from "./pages/devmanager/DeleteDeveloperPage";
import ProjectsPage from "./pages/devmanager/ProjectsPage";
import CreateProjectPage from "./pages/devmanager/CreateProjectPage";
import EditProjectPage from "./pages/devmanager/EditProjectPage";
import DeleteProjectPage from "./pages/devmanager/DeleteProjectPage";
import TasksPage from "./pages/devmanager/TasksPage";
import CreateTaskPage from "./pages/devmanager/CreateTaskPage";
import EditTaskPage from "./pages/devmanager/EditTaskPage";
import BugsPage from "./pages/devmanager/BugsPage";
import ReportBugPage from "./pages/devmanager/ReportBugPage";
import EditBugPage from "./pages/devmanager/EditBugPage";
import BuildsPage from "./pages/devmanager/BuildsPage";
import CreateBuildPage from "./pages/devmanager/CreateBuildPage";
import QATestsPage from "./pages/devmanager/QATestsPage";
import CreateQATestPage from "./pages/devmanager/CreateQATestPage";
import MilestonesPage from "./pages/devmanager/MilestonesPage";
import PullRequestsPage from "./pages/devmanager/PullRequestsPage";
import CodeReviewsPage from "./pages/devmanager/CodeReviewsPage";
import QAApprovalsPage from "./pages/devmanager/QAApprovalsPage";
import AccessExpiryPage from "./pages/devmanager/AccessExpiryPage";
import BlockedTasksPage from "./pages/devmanager/BlockedTasksPage";
import FailedBuildsPage from "./pages/devmanager/FailedBuildsPage";

import ResellerManagerDashboard from "./pages/reseller/ResellerManagerDashboard";
import ResellersListPage from "./pages/reseller/ResellersListPage";
import AddResellerPage from "./pages/reseller/AddResellerPage";
import EditResellerPage from "./pages/reseller/EditResellerPage";
import DeleteResellerPage from "./pages/reseller/DeleteResellerPage";
import ResellerScopesPage from "./pages/reseller/ResellerScopesPage";
import ResellerWalletsPage from "./pages/reseller/ResellerWalletsPage";
import ResellerPerformancePage from "./pages/reseller/ResellerPerformancePage";
import ResellerViolationsPage from "./pages/reseller/ResellerViolationsPage";
import ResellerPlansPage from "./pages/reseller/ResellerPlansPage";

// Marketing Manager Pages
import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import CampaignsPage from "./pages/marketing/CampaignsPage";
import CreateCampaignPage from "./pages/marketing/CreateCampaignPage";
import EditCampaignPage from "./pages/marketing/EditCampaignPage";
import BudgetHistoryPage from "./pages/marketing/BudgetHistoryPage";
import SeoPage from "./pages/marketing/SeoPage";
import AiSeoEnginePage from "./pages/marketing/AiSeoEnginePage";
import AiLeadEnginePage from "./pages/marketing/AiLeadEnginePage";
import AiSalesBotPage from "./pages/marketing/AiSalesBotPage";
import ContentPage from "./pages/marketing/ContentPage";
import CreateContentPage from "./pages/marketing/CreateContentPage";
import EditContentPage from "./pages/marketing/EditContentPage";
import ScheduleContentPage from "./pages/marketing/ScheduleContentPage";
import LeadSourcesPage from "./pages/marketing/LeadSourcesPage";
import AiToolsPage from "./pages/marketing/AiToolsPage";
import AnalyticsPage from "./pages/marketing/AnalyticsPage";

// Support Manager Pages
import SupportDashboard from "./pages/support/SupportDashboard";
import TicketsPage from "./pages/support/TicketsPage";
import CreateTicketPage from "./pages/support/CreateTicketPage";
import EditTicketPage from "./pages/support/EditTicketPage";
import AssistSessionsPage from "./pages/support/AssistSessionsPage";
import CreateAssistSessionPage from "./pages/support/CreateAssistSessionPage";
import SlaManagementPage from "./pages/support/SlaManagementPage";
import PromiseTrackerPage from "./pages/support/PromiseTrackerPage";
import FeedbackPage from "./pages/support/FeedbackPage";

// Marketplace Pages
import MarketplacePage from "./pages/marketplace/MarketplacePage";
import CategoryPage from "./pages/marketplace/CategoryPage";
import SoftwareDetailPage from "./pages/marketplace/SoftwareDetailPage";
import DemoPage from "./pages/marketplace/DemoPage";
import CartPage from "./pages/marketplace/CartPage";
import PricingPage from "./pages/marketplace/PricingPage";

// Finance Manager Pages
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import WalletsPage from "./pages/finance/WalletsPage";
import InvoicesPage from "./pages/finance/InvoicesPage";
import CreateInvoicePage from "./pages/finance/CreateInvoicePage";
import PlansPage from "./pages/finance/PlansPage";
import PayoutsPage from "./pages/finance/PayoutsPage";
import CostsPage from "./pages/finance/CostsPage";
import SubscriptionsPage from "./pages/finance/SubscriptionsPage";

// HR Manager Pages
import HRDashboard from "./pages/hr/HRDashboard";
import EmployeesPage from "./pages/hr/EmployeesPage";
import AddEmployeePage from "./pages/hr/AddEmployeePage";
import EditEmployeePage from "./pages/hr/EditEmployeePage";
import EmployeeViewPage from "./pages/hr/EmployeeViewPage";
import JobsPage from "./pages/hr/JobsPage";
import CreateJobPage from "./pages/hr/CreateJobPage";
import EditJobPage from "./pages/hr/EditJobPage";
import ApplicationsPage from "./pages/hr/ApplicationsPage";
import AttendancePage from "./pages/hr/AttendancePage";
import LeavePage from "./pages/hr/LeavePage";
import SalarySummaryPage from "./pages/hr/SalarySummaryPage";
import PayslipsPage from "./pages/hr/PayslipsPage";
import ReviewsPage from "./pages/hr/ReviewsPage";
import CreateReviewPage from "./pages/hr/CreateReviewPage";
import GoalsPage from "./pages/hr/GoalsPage";
import ExitsPage from "./pages/hr/ExitsPage";
import DocumentsPage from "./pages/hr/DocumentsPage";

// Product Manager Pages
import ProductManagerDashboard from "./pages/productdemo/ProductManagerDashboard";
import ProductListPage from "./pages/productdemo/ProductListPage";
import CreateProductPage from "./pages/productdemo/CreateProductPage";
import EditProductPage from "./pages/productdemo/EditProductPage";
import CategoriesPage from "./pages/productdemo/CategoriesPage";
import FeaturesPage from "./pages/productdemo/FeaturesPage";
import PlanMappingPage from "./pages/productdemo/PlanMappingPage";
import VisibilityRulesPage from "./pages/productdemo/VisibilityRulesPage";

// Demo Manager Pages
import DemoManagerDashboard from "./pages/productdemo/DemoManagerDashboard";
import ActiveDemosPage from "./pages/productdemo/ActiveDemosPage";
import ExpiredDemosPage from "./pages/productdemo/ExpiredDemosPage";
import DemoRequestsPage from "./pages/productdemo/DemoRequestsPage";
import CreateDemoPage from "./pages/productdemo/CreateDemoPage";
import DemoUsagePage from "./pages/productdemo/DemoUsagePage";
import ConversionFunnelPage from "./pages/productdemo/ConversionFunnelPage";

// Role Portal Dashboards
import FranchiseDashboard from "./pages/portal/FranchiseDashboard";
import ResellerDashboard from "./pages/portal/ResellerDashboard";
import DeveloperDashboard from "./pages/portal/DeveloperDashboard";
import InfluencerDashboard from "./pages/portal/InfluencerDashboard";

// Franchise Portal Pages
import FranchisePortalLeadsPage from "./pages/portal/franchise/FranchiseLeadsPage";
import FranchisePortalWalletPage from "./pages/portal/franchise/FranchiseWalletPage";
import FranchiseResellersPage from "./pages/portal/franchise/FranchiseResellersPage";
import FranchiseCompliancePage from "./pages/portal/franchise/FranchiseCompliancePage";
import FranchiseProfilePage from "./pages/portal/franchise/FranchiseProfilePage";
import FranchiseSecurityPage from "./pages/portal/franchise/FranchiseSecurityPage";
import FranchiseKeysPage from "./pages/portal/franchise/FranchiseKeysPage";
import FranchiseTerritoryPage from "./pages/portal/franchise/FranchiseTerritoryPage";
import FranchiseOrdersPage from "./pages/portal/franchise/FranchiseOrdersPage";
import FranchiseSlaPage from "./pages/portal/franchise/FranchiseSlaPage";
import PlaceOrderPage from "./pages/portal/franchise/PlaceOrderPage";
import OrderStatusPage from "./pages/portal/franchise/OrderStatusPage";
import FranchiseResellerPerformancePage from "./pages/portal/franchise/FranchiseResellerPerformancePage";
import FranchiseStaffPage from "./pages/portal/franchise/FranchiseStaffPage";
import FranchiseAiInsightsPage from "./pages/portal/franchise/FranchiseAiInsightsPage";
import FranchiseAddWizardPage from "./pages/portal/franchise/FranchiseAddWizardPage";

// Reseller Portal Pages
import ResellerLeadsPage from "./pages/portal/reseller/ResellerLeadsPage";
import ResellerFollowupsPage from "./pages/portal/reseller/ResellerFollowupsPage";
import ResellerTargetsPage from "./pages/portal/reseller/ResellerTargetsPage";
import ResellerPenaltiesPage from "./pages/portal/reseller/ResellerPenaltiesPage";
import ResellerWalletPage from "./pages/portal/reseller/ResellerWalletPage";
import ResellerLeaderboardPage from "./pages/portal/reseller/ResellerLeaderboardPage";
import ResellerProfilePage from "./pages/portal/reseller/ResellerProfilePage";

// Developer Portal Pages
import DeveloperTasksPage from "./pages/portal/developer/DeveloperTasksPage";
import DeveloperBugsPage from "./pages/portal/developer/DeveloperBugsPage";
import DeveloperReleasesPage from "./pages/portal/developer/DeveloperReleasesPage";
import DeveloperTimeLogPage from "./pages/portal/developer/DeveloperTimeLogPage";
import DeveloperProfilePage from "./pages/portal/developer/DeveloperProfilePage";
import DeveloperProjectsPage from "./pages/portal/developer/DeveloperProjectsPage";
import DeveloperSprintBoardPage from "./pages/portal/developer/DeveloperSprintBoardPage";
import DeveloperCodeReviewsPage from "./pages/portal/developer/DeveloperCodeReviewsPage";
import DeveloperWorkLogPage from "./pages/portal/developer/DeveloperWorkLogPage";
import DeveloperProductivityPage from "./pages/portal/developer/DeveloperProductivityPage";
import DeveloperBuildStatusPage from "./pages/portal/developer/DeveloperBuildStatusPage";
import DeveloperPipelinePage from "./pages/portal/developer/DeveloperPipelinePage";
import DeveloperRollbackPage from "./pages/portal/developer/DeveloperRollbackPage";
import DeveloperQAPage from "./pages/portal/developer/DeveloperQAPage";
import DeveloperChatPage from "./pages/portal/developer/DeveloperChatPage";
import DeveloperCommentsPage from "./pages/portal/developer/DeveloperCommentsPage";
import DeveloperAnnouncementsPage from "./pages/portal/developer/DeveloperAnnouncementsPage";
import DeveloperNDAPage from "./pages/portal/developer/DeveloperNDAPage";
import DeveloperAccessScopePage from "./pages/portal/developer/DeveloperAccessScopePage";
import DeveloperActivityLogPage from "./pages/portal/developer/DeveloperActivityLogPage";

// Influencer Portal Pages
import InfluencerCampaignsPage from "./pages/portal/influencer/InfluencerCampaignsPage";
import InfluencerLinksPage from "./pages/portal/influencer/InfluencerLinksPage";
import InfluencerContentPage from "./pages/portal/influencer/InfluencerContentPage";
import InfluencerBonusPage from "./pages/portal/influencer/InfluencerBonusPage";
import InfluencerPayoutsPage from "./pages/portal/influencer/InfluencerPayoutsPage";
import InfluencerProfilePage from "./pages/portal/influencer/InfluencerProfilePage";

// Manager Portal Dashboards
import ProductManagerPortal from "./pages/manager/ProductManagerPortal";
import DemoManagerPortal from "./pages/manager/DemoManagerPortal";
import SeoManagerPortal from "./pages/manager/SeoManagerPortal";
import HrManagerPortal from "./pages/manager/HrManagerPortal";
import SalesManagerPortal from "./pages/manager/SalesManagerPortal";
import SupportManagerPortal from "./pages/manager/SupportManagerPortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <PositiveErrorBoundary module="global">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SecurityProvider>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/users" element={<UsersPage />} />
            <Route path="/dashboard/roles" element={<Navigate to="/dashboard/roles/registry" replace />} />
            <Route path="/dashboard/roles/registry" element={<RoleRegistryPage />} />
            <Route path="/dashboard/roles/matrix" element={<PermissionMatrixPage />} />
            <Route path="/dashboard/roles/assignment" element={<RoleAssignmentPage />} />
            <Route path="/dashboard/roles/temp-access" element={<TempAccessPage />} />
            <Route path="/dashboard/roles/escalation" element={<PrivilegeEscalationPage />} />
            <Route path="/dashboard/roles/violations" element={<AccessViolationLogPage />} />
            <Route path="/dashboard/roles/audit" element={<RoleAuditLogPage />} />
            <Route path="/dashboard/leads" element={<LeadsPage />} />
            
            {/* Boss Panel Routes - Super Admin Only (Oversight & Approval) */}
            <Route path="/dashboard/boss" element={<BossOverviewPage />} />
            <Route path="/dashboard/boss/home" element={<BossOverviewPage />} />
            <Route path="/dashboard/boss/approvals" element={<ApprovalDashboardPage />} />
            <Route path="/dashboard/boss/approvals/pending" element={<PendingApprovalsPage />} />
            <Route path="/dashboard/boss/approvals/detail/:id" element={<ApprovalDetailPage />} />
            <Route path="/dashboard/boss/approvals/high-risk" element={<HighRiskApprovalsPage />} />
            <Route path="/dashboard/boss/approvals/ai" element={<AIApprovalsPage />} />
            <Route path="/dashboard/boss/approvals/payment" element={<PaymentApprovalsPage />} />
            <Route path="/dashboard/boss/approvals/access" element={<AccessApprovalsPage />} />
            <Route path="/dashboard/boss/approvals/history" element={<ApprovalHistoryPage />} />
            <Route path="/dashboard/boss/freeze" element={<SystemFreezePage />} />
            <Route path="/dashboard/boss/access" element={<AccessOverridePage />} />
            <Route path="/dashboard/boss/finance-snapshot" element={<FinancialSnapshotPage />} />
            <Route path="/dashboard/boss/server-snapshot" element={<Navigate to="/dashboard/boss/server/monitoring/snapshot" replace />} />
            <Route path="/dashboard/boss/deploy-snapshot" element={<DeploymentSnapshotPage />} />
            <Route path="/dashboard/boss/security" element={<SecurityAlertsPage />} />
            <Route path="/dashboard/boss/security/model" element={<SecurityModelPage />} />
            <Route path="/dashboard/boss/security/threats" element={<ThreatMonitorPage />} />
            <Route path="/dashboard/boss/security/ip-blocklist" element={<IPBlocklistPage />} />
            <Route path="/dashboard/boss/security/devices" element={<DeviceTrustPage />} />
            <Route path="/dashboard/boss/audit" element={<AuditLogPage />} />
            
            {/* AI CEO Routes */}
            <Route path="/dashboard/boss/ai-ceo" element={<AiCeoDashboard />} />
            <Route path="/dashboard/boss/ai-ceo/monitor" element={<AiCeoSystemMonitor />} />
            <Route path="/dashboard/boss/ai-ceo/business" element={<AiCeoBusinessIntel />} />
            <Route path="/dashboard/boss/ai-ceo/risks" element={<AiCeoRiskDetection />} />
            <Route path="/dashboard/boss/ai-ceo/suggestions" element={<AiCeoSuggestions />} />
            <Route path="/dashboard/boss/ai-ceo/predictions" element={<AiCeoPredictions />} />
            <Route path="/dashboard/boss/ai-ceo/decisions" element={<AiCeoDecisionLog />} />
            
            {/* VALA AI Command Center */}
            <Route path="/dashboard/boss/vala" element={<ValaAICommandCenter />} />
            <Route path="/dashboard/boss/vala/decisions" element={<ValaAILiveDecisions />} />
            <Route path="/dashboard/boss/vala/tasks" element={<ValaAIActiveTasks />} />
            <Route path="/dashboard/boss/vala/priority" element={<ValaAIPriorityQueue />} />
            <Route path="/dashboard/boss/vala/ceo" element={<ValaAICeoInsights />} />
            <Route path="/dashboard/boss/vala/growth" element={<ValaAIGrowth />} />
            <Route path="/dashboard/boss/vala/risks" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/builds" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/autofix" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/bugs" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/demo" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/features" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/servers" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/backups" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/issues" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/resolution" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/silent-fixes" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/threats" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/violations" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/audit" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/models" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/api-usage" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/keys" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/emergency" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/rollback" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/hard-stop" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/logs" element={<ValaSubPage />} />
            <Route path="/dashboard/boss/vala/timeline" element={<ValaSubPage />} />
            
            <Route path="/dashboard/boss/blackbox" element={<BlackBoxVaultPage />} />
            <Route path="/dashboard/boss/legal" element={<LegalCompliancePage />} />
            <Route path="/dashboard/boss/sessions" element={<SessionControlPage />} />
            <Route path="/dashboard/boss/settings" element={<BossSettingsPage />} />
            <Route path="/dashboard/settings" element={<BossSettingsPage />} />

            {/* AI/API Manager (Boss Root) */}
            <Route path="/dashboard/boss/aiapi" element={<AiApiManagerPage />} />
            <Route path="/dashboard/boss/aiapi/ai-services" element={<AiServicesPage />} />
            <Route path="/dashboard/boss/aiapi/ai-services/:serviceKey" element={<AiServicesPage />} />
            <Route path="/dashboard/boss/aiapi/auto-recovery" element={<AutoRecoveryPage />} />
            <Route path="/dashboard/boss/aiapi/incident-prediction" element={<IncidentPredictionPage />} />
            <Route path="/dashboard/boss/aiapi/cost-optimizer" element={<CostOptimizerPage />} />
            <Route path="/dashboard/boss/aiapi/api-providers" element={<ApiProvidersPage />} />
            <Route path="/dashboard/boss/aiapi/api-providers/:providerKey" element={<ApiProvidersPage />} />
            <Route path="/dashboard/boss/aiapi/api-registry" element={<ApiRegistryPage />} />
            <Route path="/dashboard/boss/aiapi/fallback-rules" element={<FallbackRulesPage />} />
            <Route path="/dashboard/boss/aiapi/logs" element={<AiApiLogsPage />} />
            <Route path="/dashboard/boss/aiapi/decisions" element={<AiDecisionsLogPage />} />
            <Route path="/dashboard/boss/aiapi/settings" element={<AiApiManagerPage />} />

            {/* Fail-Safe Governance Layer (Boss Only) */}
            <Route path="/dashboard/boss/governance/inactivity" element={<InactivityGovernancePage />} />
            <Route path="/dashboard/boss/governance/reputation" element={<ReputationProtectionPage />} />
            <Route path="/dashboard/boss/governance/takeover" element={<SystemTakeoverPage />} />
            <Route path="/dashboard/boss/governance/ai-failsafe" element={<AiFailsafePage />} />
            <Route path="/dashboard/boss/governance/zero-blame" element={<ZeroBlameIncidentsPage />} />
            <Route path="/dashboard/boss/governance/override" element={<BossOverridePage />} />

            {/* Server Manager - Boss Root Dashboard */}
            <Route path="/dashboard/boss/server" element={<ServerManagerDashboard />} />
            <Route path="/dashboard/boss/server/dashboard" element={<ServerManagerDashboard />} />
            <Route path="/dashboard/boss/server/overview" element={<ServerOverviewPage />} />
            <Route path="/dashboard/boss/server/servers/company" element={<OwnServerPage />} />
            <Route path="/dashboard/boss/server/servers/client" element={<ClientServerPage />} />
            <Route path="/dashboard/boss/server/add" element={<AddServerPage />} />
            <Route path="/dashboard/boss/server/list" element={<ServerListPage />} />
            <Route path="/dashboard/boss/server/detail/:id" element={<ServerDetailPage />} />
            <Route path="/dashboard/boss/server/settings" element={<ServerSettingsPage />} />
            <Route path="/dashboard/boss/server/edit/:id" element={<EditServerPage />} />
            <Route path="/dashboard/boss/server/delete/:id" element={<DeleteServerPage />} />

{/* Mirage Core - Server Module Extensions */}
            <Route path="/dashboard/boss/server/security-center" element={<ServerSecurityCenterPage />} />
            <Route path="/dashboard/boss/server/security-model" element={<ServerSecurityModelPage />} />
            <Route path="/dashboard/boss/server/user-activity" element={<UserActivityPage />} />
            <Route path="/dashboard/boss/server/geo-control" element={<GeoControlPage />} />
            <Route path="/dashboard/boss/server/backdoor-scan" element={<BackdoorScanPage />} />
            <Route path="/dashboard/boss/server/port-control" element={<PortControlPage />} />
            <Route path="/dashboard/boss/server/cost-control" element={<CostControlPage />} />
            <Route path="/dashboard/boss/server/logs" element={<ServerLogsPage />} />

            <Route path="/dashboard/boss/server/monitoring/snapshot" element={<ServerSnapshotMonitorPage />} />
            <Route path="/dashboard/boss/server/monitoring/health" element={<ServerHealthPage />} />
            <Route path="/dashboard/boss/server/monitoring/load" element={<ServerLoadPage />} />
            <Route path="/dashboard/boss/server/monitoring/uptime" element={<ServerUptimePage />} />
            <Route path="/dashboard/boss/server/scaling/auto" element={<AutoScalingPage />} />
            <Route path="/dashboard/boss/server/scaling/rules" element={<ThresholdRulesPage />} />
            <Route path="/dashboard/boss/server/security/access-control" element={<ServerAccessControlPage />} />
            <Route path="/dashboard/boss/server/security/firewall" element={<SecurityRulesPage />} />
            <Route path="/dashboard/boss/server/security/logs" element={<ServerActivityLogPage />} />
            <Route path="/dashboard/boss/server/backups" element={<BackupsPage />} />
            <Route path="/dashboard/boss/server/alerts" element={<ServerAlertsPage />} />
            <Route path="/dashboard/boss/server/renewals" element={<ServerExpiryPage />} />
            <Route path="/dashboard/boss/server/maintenance" element={<MaintenancePage />} />
            <Route path="/dashboard/boss/server/incidents" element={<ServerIncidentPage />} />

            {/* Server Aliases (Plural route map support) */}
            <Route path="/dashboard/boss/servers" element={<ServerManagerDashboard />} />
            <Route path="/dashboard/boss/servers/company" element={<Navigate to="/dashboard/boss/server/servers/company" replace />} />
            <Route path="/dashboard/boss/servers/clients" element={<Navigate to="/dashboard/boss/server/servers/client" replace />} />
            <Route path="/dashboard/boss/servers/monitoring" element={<Navigate to="/dashboard/boss/server/monitoring/health" replace />} />
            <Route path="/dashboard/boss/servers/scaling" element={<Navigate to="/dashboard/boss/server/scaling/auto" replace />} />
            <Route path="/dashboard/boss/servers/security" element={<Navigate to="/dashboard/boss/server/security/access-control" replace />} />
            <Route path="/dashboard/boss/servers/alerts" element={<Navigate to="/dashboard/boss/server/alerts" replace />} />
            <Route path="/dashboard/boss/servers/*" element={<Navigate to="/dashboard/boss/servers" replace />} />

            {/* Legacy Server Routes - Redirect to Boss (exact mapping) */}
            <Route path="/dashboard/server/add" element={<Navigate to="/dashboard/boss/server/add" replace />} />
            <Route path="/dashboard/server/health" element={<Navigate to="/dashboard/boss/server/monitoring/health" replace />} />
            <Route path="/dashboard/server/scaling" element={<Navigate to="/dashboard/boss/server/scaling/auto" replace />} />
            <Route path="/dashboard/server/access-control" element={<Navigate to="/dashboard/boss/server/security/access-control" replace />} />
            <Route path="/dashboard/server/alerts" element={<Navigate to="/dashboard/boss/server/alerts" replace />} />
            <Route path="/dashboard/server/backups" element={<Navigate to="/dashboard/boss/server/backups" replace />} />
            <Route path="/dashboard/server/incidents" element={<Navigate to="/dashboard/boss/server/incidents" replace />} />
            <Route path="/dashboard/server/own" element={<Navigate to="/dashboard/boss/server/servers/company" replace />} />
            <Route path="/dashboard/server" element={<Navigate to="/dashboard/boss/server" replace />} />
            <Route path="/dashboard/server/*" element={<Navigate to="/dashboard/boss/server" replace />} />
            
            {/* Development Control Routes (Boss Root) */}
            <Route path="/dashboard/boss/development" element={<BuildPipelineOverviewPage />} />
            <Route path="/dashboard/boss/development/category" element={<CategoryManagementPage />} />
            <Route path="/dashboard/boss/development/trigger" element={<BuildTriggerPage />} />
            <Route path="/dashboard/boss/development/tests" element={<TestQAGatePage />} />
            <Route path="/dashboard/boss/development/deploy" element={<DeploymentControlPage />} />
            <Route path="/dashboard/boss/development/releases" element={<ReleaseManagementPage />} />
            <Route path="/dashboard/boss/development/rollback" element={<RollbackControlPage />} />
            <Route path="/dashboard/boss/development/governance" element={<VersionGovernancePage />} />
            <Route path="/dashboard/boss/development/incidents" element={<DeployIncidentPage />} />
            {/* Legacy Development Routes */}
            <Route path="/dashboard/development/*" element={<Navigate to="/dashboard/boss/development" replace />} />

            {/* Franchise Control Routes (Boss Root) */}
            <Route path="/dashboard/boss/franchise" element={<FranchiseRegistryPage />} />
            <Route path="/dashboard/boss/franchise/onboarding" element={<FranchiseOnboardingPage />} />
            <Route path="/dashboard/boss/franchise/territories" element={<TerritoryAssignmentPage />} />
            <Route path="/dashboard/boss/franchise/plans" element={<FranchisePlansPage />} />
            <Route path="/dashboard/boss/franchise/performance" element={<FranchisePerformancePage />} />
            <Route path="/dashboard/boss/franchise/wallet" element={<FranchiseWalletPage />} />
            <Route path="/dashboard/boss/franchise/violations" element={<FranchiseViolationsPage />} />
            <Route path="/dashboard/boss/franchise/audit" element={<FranchiseAuditLogPage />} />
            {/* Legacy Franchise Routes */}
            <Route path="/dashboard/franchise/*" element={<Navigate to="/dashboard/boss/franchise" replace />} />
            <Route path="/dashboard/franchise" element={<Navigate to="/dashboard/boss/franchise" replace />} />
            
            {/* Developer Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/devmanager" element={<DevManagerDashboard />} />
            <Route path="/dashboard/boss/devmanager/developers" element={<DevelopersPage />} />
            <Route path="/dashboard/boss/devmanager/developers/add" element={<AddDeveloperPage />} />
            <Route path="/dashboard/boss/devmanager/developers/edit/:id" element={<EditDeveloperPage />} />
            <Route path="/dashboard/boss/devmanager/developers/delete/:id" element={<DeleteDeveloperPage />} />
            <Route path="/dashboard/boss/devmanager/projects" element={<ProjectsPage />} />
            <Route path="/dashboard/boss/devmanager/projects/create" element={<CreateProjectPage />} />
            <Route path="/dashboard/boss/devmanager/projects/edit/:id" element={<EditProjectPage />} />
            <Route path="/dashboard/boss/devmanager/projects/delete/:id" element={<DeleteProjectPage />} />
            <Route path="/dashboard/boss/devmanager/tasks" element={<TasksPage />} />
            <Route path="/dashboard/boss/devmanager/tasks/create" element={<CreateTaskPage />} />
            <Route path="/dashboard/boss/devmanager/tasks/edit/:id" element={<EditTaskPage />} />
            <Route path="/dashboard/boss/devmanager/bugs" element={<BugsPage />} />
            <Route path="/dashboard/boss/devmanager/bugs/report" element={<ReportBugPage />} />
            <Route path="/dashboard/boss/devmanager/bugs/edit/:id" element={<EditBugPage />} />
            <Route path="/dashboard/boss/devmanager/builds" element={<BuildsPage />} />
            <Route path="/dashboard/boss/devmanager/builds/create" element={<CreateBuildPage />} />
            <Route path="/dashboard/boss/devmanager/builds/failed" element={<FailedBuildsPage />} />
            <Route path="/dashboard/boss/devmanager/qa" element={<QATestsPage />} />
            <Route path="/dashboard/boss/devmanager/qa/create" element={<CreateQATestPage />} />
            <Route path="/dashboard/boss/devmanager/qa/approvals" element={<QAApprovalsPage />} />
            <Route path="/dashboard/boss/devmanager/milestones" element={<MilestonesPage />} />
            <Route path="/dashboard/boss/devmanager/pull-requests" element={<PullRequestsPage />} />
            <Route path="/dashboard/boss/devmanager/code-reviews" element={<CodeReviewsPage />} />
            <Route path="/dashboard/boss/devmanager/access-expiry" element={<AccessExpiryPage />} />
            <Route path="/dashboard/boss/devmanager/blocked-tasks" element={<BlockedTasksPage />} />
            {/* Legacy Dev Manager Routes */}
            <Route path="/dashboard/devmanager/*" element={<Navigate to="/dashboard/boss/devmanager" replace />} />
            <Route path="/dashboard/devmanager" element={<Navigate to="/dashboard/boss/devmanager" replace />} />
            
            {/* Reseller Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/reseller" element={<ResellerManagerDashboard />} />
            <Route path="/dashboard/boss/reseller/list" element={<ResellersListPage />} />
            <Route path="/dashboard/boss/reseller/add" element={<AddResellerPage />} />
            <Route path="/dashboard/boss/reseller/edit/:id" element={<EditResellerPage />} />
            <Route path="/dashboard/boss/reseller/delete/:id" element={<DeleteResellerPage />} />
            <Route path="/dashboard/boss/reseller/scopes" element={<ResellerScopesPage />} />
            <Route path="/dashboard/boss/reseller/wallets" element={<ResellerWalletsPage />} />
            <Route path="/dashboard/boss/reseller/performance" element={<ResellerPerformancePage />} />
            <Route path="/dashboard/boss/reseller/violations" element={<ResellerViolationsPage />} />
            <Route path="/dashboard/boss/reseller/plans" element={<ResellerPlansPage />} />
            {/* Legacy Reseller Routes */}
            <Route path="/dashboard/reseller/*" element={<Navigate to="/dashboard/boss/reseller" replace />} />
            <Route path="/dashboard/reseller" element={<Navigate to="/dashboard/boss/reseller" replace />} />
            
            {/* Marketing Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/marketing" element={<MarketingDashboard />} />
            <Route path="/dashboard/boss/marketing/campaigns" element={<CampaignsPage />} />
            <Route path="/dashboard/boss/marketing/campaigns/create" element={<CreateCampaignPage />} />
            <Route path="/dashboard/boss/marketing/campaigns/edit/:id" element={<EditCampaignPage />} />
            <Route path="/dashboard/boss/marketing/campaigns/budget-history/:id" element={<BudgetHistoryPage />} />
            <Route path="/dashboard/boss/marketing/seo" element={<SeoPage />} />
            <Route path="/dashboard/boss/marketing/ai-seo" element={<AiSeoEnginePage />} />
            <Route path="/dashboard/boss/marketing/ai-leads" element={<AiLeadEnginePage />} />
            <Route path="/dashboard/boss/marketing/ai-sales-bot" element={<AiSalesBotPage />} />
            <Route path="/dashboard/boss/marketing/content" element={<ContentPage />} />
            <Route path="/dashboard/boss/marketing/content/create" element={<CreateContentPage />} />
            <Route path="/dashboard/boss/marketing/content/edit/:id" element={<EditContentPage />} />
            <Route path="/dashboard/boss/marketing/content/schedule/:id" element={<ScheduleContentPage />} />
            <Route path="/dashboard/boss/marketing/lead-sources" element={<LeadSourcesPage />} />
            <Route path="/dashboard/boss/marketing/ai-tools" element={<AiToolsPage />} />
            <Route path="/dashboard/boss/marketing/analytics" element={<AnalyticsPage />} />
            {/* Legacy Marketing Routes */}
            <Route path="/dashboard/marketing/*" element={<Navigate to="/dashboard/boss/marketing" replace />} />
            <Route path="/dashboard/marketing" element={<Navigate to="/dashboard/boss/marketing" replace />} />
            
            {/* Support Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/support" element={<SupportDashboard />} />
            <Route path="/dashboard/boss/support/tickets" element={<TicketsPage />} />
            <Route path="/dashboard/boss/support/tickets/create" element={<CreateTicketPage />} />
            <Route path="/dashboard/boss/support/tickets/edit/:id" element={<EditTicketPage />} />
            <Route path="/dashboard/boss/support/assist" element={<AssistSessionsPage />} />
            <Route path="/dashboard/boss/support/assist/create" element={<CreateAssistSessionPage />} />
            <Route path="/dashboard/boss/support/sla" element={<SlaManagementPage />} />
            <Route path="/dashboard/boss/support/promises" element={<PromiseTrackerPage />} />
            <Route path="/dashboard/boss/support/feedback" element={<FeedbackPage />} />
            {/* Legacy Support Routes */}
            <Route path="/dashboard/support/*" element={<Navigate to="/dashboard/boss/support" replace />} />
            <Route path="/dashboard/support" element={<Navigate to="/dashboard/boss/support" replace />} />
            
            {/* Finance Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/finance" element={<FinanceDashboard />} />
            <Route path="/dashboard/boss/finance/wallets" element={<WalletsPage />} />
            <Route path="/dashboard/boss/finance/invoices" element={<InvoicesPage />} />
            <Route path="/dashboard/boss/finance/invoices/create" element={<CreateInvoicePage />} />
            <Route path="/dashboard/boss/finance/plans" element={<PlansPage />} />
            <Route path="/dashboard/boss/finance/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/dashboard/boss/finance/payouts" element={<PayoutsPage />} />
            <Route path="/dashboard/boss/finance/costs" element={<CostsPage />} />
            {/* Legacy Finance Routes */}
            <Route path="/dashboard/finance/*" element={<Navigate to="/dashboard/boss/finance" replace />} />
            <Route path="/dashboard/finance" element={<Navigate to="/dashboard/boss/finance" replace />} />
            
            {/* HR Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/hr" element={<HRDashboard />} />
            <Route path="/dashboard/boss/hr/employees" element={<EmployeesPage />} />
            <Route path="/dashboard/boss/hr/employees/on-notice" element={<EmployeesPage />} />
            <Route path="/dashboard/boss/hr/employees/inactive" element={<EmployeesPage />} />
            <Route path="/dashboard/boss/hr/employees/add" element={<AddEmployeePage />} />
            <Route path="/dashboard/boss/hr/employees/edit/:id" element={<EditEmployeePage />} />
            <Route path="/dashboard/boss/hr/employees/view/:id" element={<EmployeeViewPage />} />
            <Route path="/dashboard/boss/hr/jobs" element={<JobsPage />} />
            <Route path="/dashboard/boss/hr/jobs/create" element={<CreateJobPage />} />
            <Route path="/dashboard/boss/hr/jobs/edit/:id" element={<EditJobPage />} />
            <Route path="/dashboard/boss/hr/applications" element={<ApplicationsPage />} />
            <Route path="/dashboard/boss/hr/attendance" element={<AttendancePage />} />
            <Route path="/dashboard/boss/hr/leave" element={<LeavePage />} />
            <Route path="/dashboard/boss/hr/salary" element={<SalarySummaryPage />} />
            <Route path="/dashboard/boss/hr/payslips" element={<PayslipsPage />} />
            <Route path="/dashboard/boss/hr/reviews" element={<ReviewsPage />} />
            <Route path="/dashboard/boss/hr/reviews/create" element={<CreateReviewPage />} />
            <Route path="/dashboard/boss/hr/goals" element={<GoalsPage />} />
            <Route path="/dashboard/boss/hr/exits" element={<ExitsPage />} />
            <Route path="/dashboard/boss/hr/documents" element={<DocumentsPage />} />
            {/* Legacy HR Routes */}
            <Route path="/dashboard/hr/*" element={<Navigate to="/dashboard/boss/hr" replace />} />
            <Route path="/dashboard/hr" element={<Navigate to="/dashboard/boss/hr" replace />} />
            
            {/* Product Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/product" element={<ProductManagerDashboard />} />
            <Route path="/dashboard/boss/product/products" element={<ProductListPage />} />
            <Route path="/dashboard/boss/product/products/new" element={<CreateProductPage />} />
            <Route path="/dashboard/boss/product/products/:id" element={<EditProductPage />} />
            <Route path="/dashboard/boss/product/products/:id/edit" element={<EditProductPage />} />
            <Route path="/dashboard/boss/product/categories" element={<CategoriesPage />} />
            <Route path="/dashboard/boss/product/features" element={<FeaturesPage />} />
            <Route path="/dashboard/boss/product/pricing/mapping" element={<PlanMappingPage />} />
            <Route path="/dashboard/boss/product/pricing/visibility" element={<VisibilityRulesPage />} />
            {/* Legacy Product Routes */}
            <Route path="/dashboard/product/*" element={<Navigate to="/dashboard/boss/product" replace />} />
            <Route path="/dashboard/product" element={<Navigate to="/dashboard/boss/product" replace />} />
            
            {/* Demo Manager Routes (Boss Root) */}
            <Route path="/dashboard/boss/demo" element={<DemoManagerDashboard />} />
            <Route path="/dashboard/boss/demo/active" element={<ActiveDemosPage />} />
            <Route path="/dashboard/boss/demo/expired" element={<ExpiredDemosPage />} />
            <Route path="/dashboard/boss/demo/requests" element={<DemoRequestsPage />} />
            <Route path="/dashboard/boss/demo/new" element={<CreateDemoPage />} />
            <Route path="/dashboard/boss/demo/usage" element={<DemoUsagePage />} />
            <Route path="/dashboard/boss/demo/funnel" element={<ConversionFunnelPage />} />
            {/* Legacy Demo Routes */}
            <Route path="/dashboard/demo/*" element={<Navigate to="/dashboard/boss/demo" replace />} />
            <Route path="/dashboard/demo" element={<Navigate to="/dashboard/boss/demo" replace />} />
            
            {/* Role & Permission Routes (Boss Root) */}
            <Route path="/dashboard/boss/roles" element={<RoleRegistryPage />} />
            <Route path="/dashboard/boss/roles/matrix" element={<PermissionMatrixPage />} />
            <Route path="/dashboard/boss/roles/assignment" element={<RoleAssignmentPage />} />
            <Route path="/dashboard/boss/roles/temp-access" element={<TempAccessPage />} />
            <Route path="/dashboard/boss/roles/escalation" element={<PrivilegeEscalationPage />} />
            <Route path="/dashboard/boss/roles/violations" element={<AccessViolationLogPage />} />
            <Route path="/dashboard/boss/roles/audit" element={<RoleAuditLogPage />} />
            {/* Legacy Role Routes */}
            <Route path="/dashboard/roles/*" element={<Navigate to="/dashboard/boss/roles" replace />} />
            <Route path="/dashboard/roles" element={<Navigate to="/dashboard/boss/roles" replace />} />
            
            {/* User Dashboard - Redirect to Boss */}
            <Route path="/dashboard/user" element={<Navigate to="/dashboard/boss" replace />} />
            
            {/* Marketplace Routes */}
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/marketplace/categories" element={<CategoryPage />} />
            <Route path="/marketplace/category/:categoryId" element={<CategoryPage />} />
            <Route path="/marketplace/software/:softwareId" element={<SoftwareDetailPage />} />
            <Route path="/marketplace/demo" element={<DemoPage />} />
            <Route path="/marketplace/demo/:softwareId" element={<DemoPage />} />
            <Route path="/marketplace/cart" element={<CartPage />} />
            <Route path="/marketplace/pricing" element={<PricingPage />} />

            {/* ============= ROLE PORTALS (Isolated Dashboards) ============= */}
            
            {/* Franchise Portal */}
            <Route path="/portal/franchise" element={<FranchiseDashboard />} />
            <Route path="/portal/franchise/leads" element={<FranchisePortalLeadsPage />} />
            <Route path="/portal/franchise/orders" element={<FranchiseOrdersPage />} />
            <Route path="/portal/franchise/place-order" element={<PlaceOrderPage />} />
            <Route path="/portal/franchise/order-status" element={<OrderStatusPage />} />
            <Route path="/portal/franchise/wallet" element={<FranchisePortalWalletPage />} />
            <Route path="/portal/franchise/territory" element={<FranchiseTerritoryPage />} />
            <Route path="/portal/franchise/resellers" element={<FranchiseResellersPage />} />
            <Route path="/portal/franchise/reseller-performance" element={<FranchiseResellerPerformancePage />} />
            <Route path="/portal/franchise/sla" element={<FranchiseSlaPage />} />
            <Route path="/portal/franchise/compliance" element={<FranchiseCompliancePage />} />
            <Route path="/portal/franchise/keys" element={<FranchiseKeysPage />} />
            <Route path="/portal/franchise/security" element={<FranchiseSecurityPage />} />
            <Route path="/portal/franchise/profile" element={<FranchiseProfilePage />} />
            <Route path="/portal/franchise/staff" element={<FranchiseStaffPage />} />
            <Route path="/portal/franchise/ai-insights" element={<FranchiseAiInsightsPage />} />
            <Route path="/portal/franchise/add-wizard" element={<FranchiseAddWizardPage />} />

            {/* Reseller Portal */}
            <Route path="/portal/reseller" element={<ResellerDashboard />} />
            <Route path="/portal/reseller/leads" element={<ResellerLeadsPage />} />
            <Route path="/portal/reseller/followups" element={<ResellerFollowupsPage />} />
            <Route path="/portal/reseller/targets" element={<ResellerTargetsPage />} />
            <Route path="/portal/reseller/penalties" element={<ResellerPenaltiesPage />} />
            <Route path="/portal/reseller/wallet" element={<ResellerWalletPage />} />
            <Route path="/portal/reseller/leaderboard" element={<ResellerLeaderboardPage />} />
            <Route path="/portal/reseller/profile" element={<ResellerProfilePage />} />

            {/* Developer Portal */}
            <Route path="/portal/developer" element={<DeveloperDashboard />} />
            <Route path="/portal/developer/tasks" element={<DeveloperTasksPage />} />
            <Route path="/portal/developer/projects" element={<DeveloperProjectsPage />} />
            <Route path="/portal/developer/bugs" element={<DeveloperBugsPage />} />
            <Route path="/portal/developer/reviews" element={<DeveloperCodeReviewsPage />} />
            <Route path="/portal/developer/sprint" element={<DeveloperSprintBoardPage />} />
            <Route path="/portal/developer/time" element={<DeveloperTimeLogPage />} />
            <Route path="/portal/developer/worklog" element={<DeveloperWorkLogPage />} />
            <Route path="/portal/developer/productivity" element={<DeveloperProductivityPage />} />
            <Route path="/portal/developer/builds" element={<DeveloperBuildStatusPage />} />
            <Route path="/portal/developer/pipeline" element={<DeveloperPipelinePage />} />
            <Route path="/portal/developer/releases" element={<DeveloperReleasesPage />} />
            <Route path="/portal/developer/rollback" element={<DeveloperRollbackPage />} />
            <Route path="/portal/developer/qa" element={<DeveloperQAPage />} />
            <Route path="/portal/developer/chat" element={<DeveloperChatPage />} />
            <Route path="/portal/developer/comments" element={<DeveloperCommentsPage />} />
            <Route path="/portal/developer/announcements" element={<DeveloperAnnouncementsPage />} />
            <Route path="/portal/developer/nda" element={<DeveloperNDAPage />} />
            <Route path="/portal/developer/access" element={<DeveloperAccessScopePage />} />
            <Route path="/portal/developer/activity" element={<DeveloperActivityLogPage />} />
            <Route path="/portal/developer/profile" element={<DeveloperProfilePage />} />

            {/* Influencer Portal */}
            <Route path="/portal/influencer" element={<InfluencerDashboard />} />
            <Route path="/portal/influencer/campaigns" element={<InfluencerCampaignsPage />} />
            <Route path="/portal/influencer/links" element={<InfluencerLinksPage />} />
            <Route path="/portal/influencer/content" element={<InfluencerContentPage />} />
            <Route path="/portal/influencer/bonus" element={<InfluencerBonusPage />} />
            <Route path="/portal/influencer/payouts" element={<InfluencerPayoutsPage />} />
            <Route path="/portal/influencer/profile" element={<InfluencerProfilePage />} />

            {/* ============= MANAGER PORTALS (Isolated Dashboards) ============= */}
            
            {/* Product Manager Portal */}
            <Route path="/manager/product" element={<ProductManagerPortal />} />
            <Route path="/manager/product/products" element={<ProductManagerPortal />} />
            <Route path="/manager/product/categories" element={<ProductManagerPortal />} />
            <Route path="/manager/product/features" element={<ProductManagerPortal />} />
            <Route path="/manager/product/pricing" element={<ProductManagerPortal />} />
            <Route path="/manager/product/status" element={<ProductManagerPortal />} />
            <Route path="/manager/product/versions" element={<ProductManagerPortal />} />
            <Route path="/manager/product/profile" element={<ProductManagerPortal />} />

            {/* Demo Manager Portal */}
            <Route path="/manager/demo" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/demos" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/urls" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/access" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/conversion" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/expiry" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/security" element={<DemoManagerPortal />} />
            <Route path="/manager/demo/profile" element={<DemoManagerPortal />} />

            {/* SEO Manager Portal */}
            <Route path="/manager/seo" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/content" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/pages" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/keywords" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/regions" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/traffic" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/rankings" element={<SeoManagerPortal />} />
            <Route path="/manager/seo/profile" element={<SeoManagerPortal />} />

            {/* HR Manager Portal */}
            <Route path="/manager/hr" element={<HrManagerPortal />} />
            <Route path="/manager/hr/jobs" element={<HrManagerPortal />} />
            <Route path="/manager/hr/applications" element={<HrManagerPortal />} />
            <Route path="/manager/hr/interviews" element={<HrManagerPortal />} />
            <Route path="/manager/hr/employees" element={<HrManagerPortal />} />
            <Route path="/manager/hr/attendance" element={<HrManagerPortal />} />
            <Route path="/manager/hr/policies" element={<HrManagerPortal />} />
            <Route path="/manager/hr/profile" element={<HrManagerPortal />} />

            {/* Sales Manager Portal */}
            <Route path="/manager/sales" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/leads" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/pipeline" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/followups" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/deals" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/closed" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/targets" element={<SalesManagerPortal />} />
            <Route path="/manager/sales/profile" element={<SalesManagerPortal />} />

            {/* Support Manager Portal */}
            <Route path="/manager/support" element={<SupportManagerPortal />} />
            <Route path="/manager/support/tickets" element={<SupportManagerPortal />} />
            <Route path="/manager/support/priority" element={<SupportManagerPortal />} />
            <Route path="/manager/support/sla" element={<SupportManagerPortal />} />
            <Route path="/manager/support/assist" element={<SupportManagerPortal />} />
            <Route path="/manager/support/logs" element={<SupportManagerPortal />} />
            <Route path="/manager/support/feedback" element={<SupportManagerPortal />} />
            <Route path="/manager/support/profile" element={<SupportManagerPortal />} />
            
            <Route path="*" element={<NotFound />} />
              </Routes>
            </SecurityProvider>
          </BrowserRouter>
        </PositiveErrorBoundary>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
