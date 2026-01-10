import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Shield, TestTube, Eye, Ban, AlertTriangle, Clock } from "lucide-react";
import { useTestResults, useBuildRequests } from "@/hooks/useDevelopmentData";
import { formatDistanceToNow } from "date-fns";

const TestQAGatePage = () => {
  const { data: testResults, isLoading: testsLoading } = useTestResults();
  const { data: builds, isLoading: buildsLoading } = useBuildRequests();

  const isLoading = testsLoading || buildsLoading;

  // Group test results by build
  const buildTestResults = builds?.slice(0, 5).map(build => {
    const results = testResults?.filter(t => t.build_request_id === build.id) || [];
    
    const unitTests = results.filter(r => r.test_type === 'unit');
    const integrationTests = results.filter(r => r.test_type === 'integration');
    const uiTests = results.filter(r => r.test_type === 'e2e' || r.test_type === 'ui');
    const securityChecks = results.filter(r => r.test_type === 'security');

    const aggregateResults = (tests: typeof results) => ({
      passed: tests.filter(t => t.status === 'passed').length,
      failed: tests.filter(t => t.status === 'failed').length,
      total: tests.length,
    });

    const allPassed = results.length > 0 && results.every(r => r.status === 'passed');
    const anyFailed = results.some(r => r.status === 'failed');

    return {
      id: build.id,
      build: `${build.repo_name} #${build.id.slice(0, 6)}`,
      unitTests: aggregateResults(unitTests),
      integrationTests: aggregateResults(integrationTests),
      uiTests: aggregateResults(uiTests),
      securityChecks: aggregateResults(securityChecks),
      status: anyFailed ? 'failed' : allPassed ? 'passed' : results.length > 0 ? 'warning' : 'pending',
      timestamp: build.created_at,
    };
  }) || [];

  // Calculate weekly stats
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyTests = testResults?.filter(t => new Date(t.created_at) > weekAgo) || [];
  const unitPassRate = weeklyTests.filter(t => t.test_type === 'unit').length > 0
    ? (weeklyTests.filter(t => t.test_type === 'unit' && t.status === 'passed').length / 
       weeklyTests.filter(t => t.test_type === 'unit').length * 100).toFixed(1)
    : 'N/A';
  const integrationPassRate = weeklyTests.filter(t => t.test_type === 'integration').length > 0
    ? (weeklyTests.filter(t => t.test_type === 'integration' && t.status === 'passed').length / 
       weeklyTests.filter(t => t.test_type === 'integration').length * 100).toFixed(1)
    : 'N/A';
  const uiPassRate = weeklyTests.filter(t => t.test_type === 'e2e' || t.test_type === 'ui').length > 0
    ? (weeklyTests.filter(t => (t.test_type === 'e2e' || t.test_type === 'ui') && t.status === 'passed').length / 
       weeklyTests.filter(t => t.test_type === 'e2e' || t.test_type === 'ui').length * 100).toFixed(1)
    : 'N/A';
  const securityPassRate = weeklyTests.filter(t => t.test_type === 'security').length > 0
    ? (weeklyTests.filter(t => t.test_type === 'security' && t.status === 'passed').length / 
       weeklyTests.filter(t => t.test_type === 'security').length * 100).toFixed(1)
    : 'N/A';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">All Passed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "warning":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Has Warnings</Badge>;
      default:
        return <Badge variant="secondary">No Tests</Badge>;
    }
  };

  const TestCategory = ({ name, data, icon: Icon }: { name: string; data: { passed: number; failed: number; total: number }; icon: React.ComponentType<{ className?: string }> }) => {
    const passRate = data.total > 0 ? (data.passed / data.total) * 100 : 0;
    return (
      <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{name}</span>
        </div>
        {data.total > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Progress value={passRate} className="h-2 flex-1" />
              <span className="text-xs font-medium">{passRate.toFixed(0)}%</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-emerald-500">{data.passed} passed</span>
              {data.failed > 0 && <span className="text-destructive">{data.failed} failed</span>}
            </div>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">N/A</span>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test & QA Gate</h1>
            <p className="text-muted-foreground">Review test results and control release gates</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test & QA Gate</h1>
          <p className="text-muted-foreground">Review test results and control release gates</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unit Tests</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{unitPassRate}%</div>
              <p className="text-xs text-muted-foreground">pass rate this week</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integration Tests</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{integrationPassRate}%</div>
              <p className="text-xs text-muted-foreground">pass rate this week</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">UI Smoke Tests</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{uiPassRate}%</div>
              <p className="text-xs text-muted-foreground">pass rate this week</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Checks</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{securityPassRate}%</div>
              <p className="text-xs text-muted-foreground">pass rate this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>View results and control release gates</CardDescription>
          </CardHeader>
          <CardContent>
            {buildTestResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No test results available</p>
            ) : (
              <div className="space-y-6">
                {buildTestResults.map((result) => (
                  <div key={result.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <p className="font-medium">{result.build}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(result.status)}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        {result.status !== "passed" && result.status !== "pending" && (
                          <Button variant="destructive" size="sm" className="gap-2">
                            <Ban className="h-4 w-4" />
                            Block Release
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-3 md:grid-cols-4">
                      <TestCategory name="Unit Tests" data={result.unitTests} icon={TestTube} />
                      <TestCategory name="Integration Tests" data={result.integrationTests} icon={CheckCircle} />
                      <TestCategory name="UI Smoke Tests" data={result.uiTests} icon={Eye} />
                      <TestCategory name="Security Checks" data={result.securityChecks} icon={Shield} />
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

export default TestQAGatePage;
