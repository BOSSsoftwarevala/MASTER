import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, GitCommit, Play, Shield, Clock, AlertTriangle } from "lucide-react";
import { usePendingBuildRequests, useCreateBuildRequest } from "@/hooks/useDevelopmentData";
import { formatDistanceToNow } from "date-fns";

const BuildTriggerPage = () => {
  const { data: pendingRequests, isLoading } = usePendingBuildRequests();
  const createBuild = useCreateBuildRequest();

  const [formData, setFormData] = useState({
    repo_name: "",
    branch: "",
    commit_hash: "",
    build_type: "" as 'development' | 'staging' | 'production' | "",
  });

  const requiredChecks = [
    { id: "lint", name: "Linting", required: true },
    { id: "unit", name: "Unit Tests", required: true },
    { id: "integration", name: "Integration Tests", required: true },
    { id: "security", name: "Security Scan", required: true },
    { id: "coverage", name: "Code Coverage > 80%", required: false },
  ];

  const handleRequestBuild = () => {
    if (!formData.repo_name || !formData.branch || !formData.build_type) {
      return;
    }

    createBuild.mutate({
      repo_name: formData.repo_name,
      branch: formData.branch,
      commit_hash: formData.commit_hash || null,
      build_type: formData.build_type as 'development' | 'staging' | 'production',
      status: 'pending',
    });

    setFormData({ repo_name: "", branch: "", commit_hash: "", build_type: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Build Trigger</h1>
          <p className="text-muted-foreground">Request new builds (Approval Required)</p>
        </div>

        {/* Build Request Form */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Request New Build
            </CardTitle>
            <CardDescription>All build requests require Boss/Admin approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="repo">Repository</Label>
                <Select 
                  value={formData.repo_name} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, repo_name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select repository" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-app">main-app</SelectItem>
                    <SelectItem value="api-service">api-service</SelectItem>
                    <SelectItem value="admin-portal">admin-portal</SelectItem>
                    <SelectItem value="mobile-app">mobile-app</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="e.g., main, feature/auth" 
                    value={formData.branch}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commit">Commit Reference</Label>
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="e.g., a1b2c3d or HEAD" 
                    value={formData.commit_hash}
                    onChange={(e) => setFormData(prev => ({ ...prev, commit_hash: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Build Type</Label>
                <Select 
                  value={formData.build_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, build_type: value as typeof formData.build_type }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select build type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Required Checks */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Required Checks
              </Label>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {requiredChecks.map((check) => (
                  <div key={check.id} className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <Checkbox id={check.id} checked={check.required} disabled={check.required} />
                    <label htmlFor={check.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {check.name}
                      {check.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
              <Button 
                onClick={handleRequestBuild} 
                className="gap-2"
                disabled={!formData.repo_name || !formData.branch || !formData.build_type || createBuild.isPending}
              >
                <Play className="h-4 w-4" />
                {createBuild.isPending ? "Submitting..." : "Request Build"}
              </Button>
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <AlertTriangle className="h-4 w-4" />
                Requires approval before execution
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Build Requests
            </CardTitle>
            <CardDescription>Builds awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !pendingRequests || pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending build requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium">{request.repo_name} / {request.branch}</p>
                        <p className="text-sm text-muted-foreground">
                          Commit: {request.commit_hash?.slice(0, 7) || 'HEAD'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={request.build_type === "production" ? "destructive" : "secondary"}>
                        {request.build_type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </span>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                        Awaiting Approval
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BuildTriggerPage;
