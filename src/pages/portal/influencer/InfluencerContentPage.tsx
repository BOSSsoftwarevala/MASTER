import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  FileText, 
  Video,
  Image,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  Brain,
  Link,
  Camera,
  Calendar
} from 'lucide-react';

const contentItems = [
  { 
    id: 1,
    title: 'Summer Product Launch Video',
    type: 'video',
    campaign: 'Summer Product Launch',
    status: 'approved',
    submittedAt: 'Jan 2, 2026',
    approvedAt: 'Jan 3, 2026',
    aiScore: 92,
    views: 45000
  },
  { 
    id: 2,
    title: 'Tech Tutorial Part 3',
    type: 'video',
    campaign: 'Tech Tutorial Series',
    status: 'pending',
    submittedAt: 'Jan 4, 2026',
    aiScore: 88,
    views: null
  },
  { 
    id: 3,
    title: 'Product Comparison Post',
    type: 'image',
    campaign: 'New Year Promo',
    status: 'revision_needed',
    submittedAt: 'Jan 3, 2026',
    rejectionReason: 'Please add pricing information',
    aiScore: 75,
    views: null
  },
  { 
    id: 4,
    title: 'Holiday Campaign Reel',
    type: 'video',
    campaign: 'Holiday Campaign',
    status: 'approved',
    submittedAt: 'Dec 20, 2025',
    approvedAt: 'Dec 21, 2025',
    aiScore: 95,
    views: 120000
  },
];

const contentStats = {
  total: 15,
  approved: 12,
  pending: 2,
  revisionNeeded: 1,
  avgScore: 89,
};

export default function InfluencerContentPage() {
  const [submitProofOpen, setSubmitProofOpen] = useState(false);

  const handleSubmitProof = () => {
    toast.success('Performance proof submitted for verification');
    setSubmitProofOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'image': return <Image className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <RoleLayout role="influencer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Approval Status</h1>
            <p className="text-muted-foreground">Track your content submissions and approvals</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={submitProofOpen} onOpenChange={setSubmitProofOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Submit Proof
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Performance Proof</DialogTitle>
                  <DialogDescription>Upload screenshots and post URLs to verify your content</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content / Campaign</Label>
                    <Input placeholder="Select content to submit proof for" />
                  </div>
                  <div className="space-y-2">
                    <Label>Post URL</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="https://instagram.com/p/..." />
                      </div>
                      <Button variant="outline" size="icon">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">We'll verify the post exists and check the timestamp</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Screenshot Upload</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-cyan-500 mt-0.5" />
                      <p className="text-xs text-cyan-400">
                        <strong>Auto-verification:</strong> Post timestamps will be verified automatically. 
                        Content posted after deadlines may affect bonus eligibility.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSubmitProofOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmitProof}>Submit Proof</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Submit Content
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{contentStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{contentStats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{contentStats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revision</p>
                  <p className="text-2xl font-bold">{contentStats.revisionNeeded}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{contentStats.avgScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Content Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${
                  item.status === 'revision_needed' ? 'border-red-500/30 bg-red-500/10' :
                  item.status === 'pending' ? 'border-amber-500/30 bg-amber-500/10' :
                  'bg-muted/50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        item.type === 'video' ? 'bg-violet-500/20' : 'bg-blue-500/20'
                      }`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.campaign}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Submitted: {item.submittedAt}</span>
                          {item.approvedAt && <span>Approved: {item.approvedAt}</span>}
                        </div>
                        {item.rejectionReason && (
                          <div className="mt-2 p-2 rounded bg-red-500/20 border border-red-500/30">
                            <p className="text-xs text-red-400">
                              <strong>Revision needed:</strong> {item.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        item.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                        'bg-red-500/20 text-red-400 border-red-500/30'
                      }>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      <div className="mt-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-cyan-500" />
                        <span className="text-sm font-medium">AI Score: {item.aiScore}</span>
                      </div>
                      {item.views && (
                        <div className="mt-1 flex items-center gap-2 justify-end">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.views.toLocaleString()} views</span>
                        </div>
                      )}
                      {item.status === 'revision_needed' && (
                        <Button size="sm" className="mt-2">
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Tips */}
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <p className="text-sm text-cyan-400">
            <strong>AI Content Tips:</strong> Posts with clear product shots and pricing info get approved 50% faster. 
            Your best performing content is tutorial-style videos – consider making more!
          </p>
        </div>
      </div>
    </RoleLayout>
  );
}
