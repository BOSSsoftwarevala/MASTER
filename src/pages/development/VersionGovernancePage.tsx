import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Tag, AlertTriangle, Calendar, Clock, Lock, CheckCircle } from "lucide-react";

const VersionGovernancePage = () => {
  const versionPolicy = {
    majorVersionCycle: "Quarterly",
    minorVersionCycle: "Bi-weekly",
    patchVersionCycle: "As needed",
    hotfixSLA: "4 hours",
    testingRequirement: "All tests must pass",
    approvalRequirement: "Boss/Admin approval required"
  };

  const hotfixRules = [
    { id: 1, rule: "Only critical security or breaking bugs qualify for hotfix", priority: "critical" },
    { id: 2, rule: "Hotfix must have a rollback plan ready before deployment", priority: "high" },
    { id: 3, rule: "Minimum testing: unit tests + smoke tests required", priority: "high" },
    { id: 4, rule: "Hotfix must be merged back to main branch within 24 hours", priority: "medium" },
    { id: 5, rule: "Post-mortem required within 48 hours of hotfix", priority: "medium" },
  ];

  const freezeWindows = [
    { id: 1, name: "End of Quarter Freeze", startDate: "Mar 25, 2024", endDate: "Mar 31, 2024", status: "upcoming", reason: "Financial quarter close" },
    { id: 2, name: "Holiday Freeze", startDate: "Dec 23, 2024", endDate: "Jan 2, 2025", status: "scheduled", reason: "Holiday period - reduced staff" },
    { id: 3, name: "Major Release Freeze", startDate: "Feb 1, 2024", endDate: "Feb 5, 2024", status: "scheduled", reason: "Major version 3.0 preparation" },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>;
      case "upcoming":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Upcoming</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Version Governance</h1>
          <p className="text-muted-foreground">Version policy, hotfix rules, and freeze windows (View Only)</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Version Policy */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Version Policy
              </CardTitle>
              <CardDescription>Release cycle and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">Major Version Cycle</span>
                    <Badge variant="outline">{versionPolicy.majorVersionCycle}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">Minor Version Cycle</span>
                    <Badge variant="outline">{versionPolicy.minorVersionCycle}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">Patch Version Cycle</span>
                    <Badge variant="outline">{versionPolicy.patchVersionCycle}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="text-sm font-medium">Hotfix SLA</span>
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                      {versionPolicy.hotfixSLA}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>{versionPolicy.testingRequirement}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>{versionPolicy.approvalRequirement}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hotfix Rules */}
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Hotfix Rules
              </CardTitle>
              <CardDescription>Emergency deployment guidelines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hotfixRules.map((rule, index) => (
                  <div key={rule.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{rule.rule}</p>
                    </div>
                    {getPriorityBadge(rule.priority)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Freeze Windows */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Freeze Windows
            </CardTitle>
            <CardDescription>Scheduled deployment freeze periods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {freezeWindows.map((freeze) => (
                <div key={freeze.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${freeze.status === 'active' ? 'bg-destructive/20' : freeze.status === 'upcoming' ? 'bg-amber-500/20' : 'bg-muted/50'}`}>
                      <Lock className={`h-5 w-5 ${freeze.status === 'active' ? 'text-destructive' : freeze.status === 'upcoming' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{freeze.name}</p>
                      <p className="text-sm text-muted-foreground">{freeze.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{freeze.startDate}</span>
                        <span>→</span>
                        <span>{freeze.endDate}</span>
                      </div>
                    </div>
                    {getStatusBadge(freeze.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VersionGovernancePage;
