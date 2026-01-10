import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  useContentItems, 
  useDeleteContentItem,
  useApproveContent,
  usePublishContent 
} from '@/hooks/useMarketingManagerData';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Send,
  Clock,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500',
  pending_review: 'bg-yellow-500',
  approved: 'bg-blue-500',
  published: 'bg-green-500',
  archived: 'bg-gray-500',
};

export default function ContentPage() {
  const { isManager, isAdmin } = useUserRoles();
  const navigate = useNavigate();
  const { data: content, isLoading } = useContentItems();
  const deleteContent = useDeleteContentItem();
  const approveContent = useApproveContent();
  const publishContent = usePublishContent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  if (!isManager() && !isAdmin()) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Access Denied</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const filteredContent = content?.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.content_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSelectedContent(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedContent && deleteReason) {
      deleteContent.mutate(selectedContent);
      setDeleteDialogOpen(false);
      setDeleteReason('');
      setSelectedContent(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Content</h1>
            <p className="text-muted-foreground mt-1">Create, manage, and publish content</p>
          </div>
          <Button onClick={() => navigate('/dashboard/marketing/content/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            </Card>
          ) : filteredContent?.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No content found</p>
              <Button className="mt-4" onClick={() => navigate('/dashboard/marketing/content/create')}>
                Create your first content
              </Button>
            </Card>
          ) : (
            filteredContent?.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <Badge className={statusColors[item.status]}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{item.content_type}</Badge>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {item.author_name && <span>By: {item.author_name}</span>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(item.created_at), 'MMM d, yyyy')}
                        </span>
                        {item.views !== null && (
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views.toLocaleString()} views
                          </span>
                        )}
                        {item.scheduled_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Scheduled: {format(new Date(item.scheduled_at), 'MMM d, yyyy HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/marketing/content/edit/${item.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {item.status === 'draft' && (
                          <DropdownMenuItem onClick={() => approveContent.mutate(item.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {item.status === 'approved' && (
                          <DropdownMenuItem onClick={() => publishContent.mutate(item.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/marketing/content/schedule/${item.id}`)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for deleting this content.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for deletion..."
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={!deleteReason || deleteContent.isPending}>
              Delete Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
