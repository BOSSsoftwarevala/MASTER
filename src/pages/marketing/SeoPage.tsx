import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUserRoles } from '@/hooks/useUserRoles';
import { 
  useSeoKeywords, 
  useCreateSeoKeyword, 
  useUpdateSeoKeyword,
  useDeleteSeoKeyword,
  useSeoPages,
  useCreateSeoPage,
  useUpdateSeoPage,
  useDeleteSeoPage,
  useSeoIssues,
  useResolveSeoIssue
} from '@/hooks/useMarketingManagerData';
import { 
  Search, 
  Plus, 
  Trash2, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const severityColors: Record<string, string> = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export default function SeoPage() {
  const { isManager, isAdmin } = useUserRoles();
  const { data: keywords, isLoading: keywordsLoading } = useSeoKeywords();
  const { data: pages, isLoading: pagesLoading } = useSeoPages();
  const { data: issues, isLoading: issuesLoading } = useSeoIssues();
  
  const createKeyword = useCreateSeoKeyword();
  const updateKeyword = useUpdateSeoKeyword();
  const deleteKeyword = useDeleteSeoKeyword();
  const createPage = useCreateSeoPage();
  const updatePage = useUpdateSeoPage();
  const deletePage = useDeleteSeoPage();
  const resolveIssue = useResolveSeoIssue();

  const [addKeywordOpen, setAddKeywordOpen] = useState(false);
  const [editKeywordOpen, setEditKeywordOpen] = useState(false);
  const [deleteKeywordOpen, setDeleteKeywordOpen] = useState(false);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [editPageOpen, setEditPageOpen] = useState(false);
  const [deletePageOpen, setDeletePageOpen] = useState(false);
  const [resolveIssueOpen, setResolveIssueOpen] = useState(false);
  
  const [selectedKeyword, setSelectedKeyword] = useState<any>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  
  const [keywordForm, setKeywordForm] = useState({ keyword: '', search_volume: '', difficulty: '', target_rank: '' });
  const [pageForm, setPageForm] = useState({ url: '', title: '', meta_description: '' });

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

  const handleAddKeyword = () => {
    createKeyword.mutate({
      keyword: keywordForm.keyword,
      search_volume: parseInt(keywordForm.search_volume) || null,
      difficulty: parseInt(keywordForm.difficulty) || null,
      target_rank: parseInt(keywordForm.target_rank) || null,
    }, {
      onSuccess: () => {
        setAddKeywordOpen(false);
        setKeywordForm({ keyword: '', search_volume: '', difficulty: '', target_rank: '' });
      },
    });
  };

  const handleEditKeyword = (kw: any) => {
    setSelectedKeyword(kw);
    setKeywordForm({
      keyword: kw.keyword || '',
      search_volume: kw.search_volume?.toString() || '',
      difficulty: kw.difficulty?.toString() || '',
      target_rank: kw.target_rank?.toString() || '',
    });
    setEditKeywordOpen(true);
  };

  const handleUpdateKeyword = () => {
    if (selectedKeyword) {
      updateKeyword.mutate({
        id: selectedKeyword.id,
        keyword: keywordForm.keyword,
        search_volume: parseInt(keywordForm.search_volume) || null,
        difficulty: parseInt(keywordForm.difficulty) || null,
        target_rank: parseInt(keywordForm.target_rank) || null,
      }, {
        onSuccess: () => {
          setEditKeywordOpen(false);
          setSelectedKeyword(null);
          setKeywordForm({ keyword: '', search_volume: '', difficulty: '', target_rank: '' });
        },
      });
    }
  };

  const handleDeleteKeyword = (kw: any) => {
    setSelectedKeyword(kw);
    setDeleteKeywordOpen(true);
  };

  const confirmDeleteKeyword = () => {
    if (selectedKeyword) {
      deleteKeyword.mutate(selectedKeyword.id, {
        onSuccess: () => {
          setDeleteKeywordOpen(false);
          setSelectedKeyword(null);
        },
      });
    }
  };

  const handleAddPage = () => {
    createPage.mutate({
      url: pageForm.url,
      title: pageForm.title || null,
      meta_description: pageForm.meta_description || null,
    }, {
      onSuccess: () => {
        setAddPageOpen(false);
        setPageForm({ url: '', title: '', meta_description: '' });
      },
    });
  };

  const handleEditPage = (page: any) => {
    setSelectedPage(page);
    setPageForm({
      url: page.url || '',
      title: page.title || '',
      meta_description: page.meta_description || '',
    });
    setEditPageOpen(true);
  };

  const handleUpdatePage = () => {
    if (selectedPage) {
      updatePage.mutate({
        id: selectedPage.id,
        url: pageForm.url,
        title: pageForm.title || null,
        meta_description: pageForm.meta_description || null,
      }, {
        onSuccess: () => {
          setEditPageOpen(false);
          setSelectedPage(null);
          setPageForm({ url: '', title: '', meta_description: '' });
        },
      });
    }
  };

  const handleDeletePage = (page: any) => {
    setSelectedPage(page);
    setDeletePageOpen(true);
  };

  const confirmDeletePage = () => {
    if (selectedPage) {
      deletePage.mutate(selectedPage.id, {
        onSuccess: () => {
          setDeletePageOpen(false);
          setSelectedPage(null);
        },
      });
    }
  };

  const handleResolveIssue = (issue: any) => {
    setSelectedIssue(issue);
    setResolveIssueOpen(true);
  };

  const confirmResolveIssue = () => {
    if (selectedIssue) {
      resolveIssue.mutate(selectedIssue.id, {
        onSuccess: () => {
          setResolveIssueOpen(false);
          setSelectedIssue(null);
        },
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">SEO Management</h1>
          <p className="text-muted-foreground mt-1">Track keywords, manage pages, and resolve issues</p>
        </div>

        <Tabs defaultValue="keywords">
          <TabsList>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="keywords" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tracked Keywords</h2>
              <Button onClick={() => setAddKeywordOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Keyword
              </Button>
            </div>

            {keywordsLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </Card>
            ) : keywords?.length === 0 ? (
              <Card className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No keywords tracked yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {keywords?.map((kw) => (
                  <Card key={kw.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{kw.keyword}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span>Volume: {kw.search_volume?.toLocaleString() || '-'}</span>
                            <span>Difficulty: {kw.difficulty || '-'}%</span>
                            <span className="flex items-center gap-1">
                              Rank: {kw.current_rank || '-'}
                              {kw.current_rank && kw.target_rank && (
                                kw.current_rank <= kw.target_rank 
                                  ? <TrendingUp className="h-4 w-4 text-green-500" />
                                  : <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </span>
                            <span>Target: {kw.target_rank || '-'}</span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditKeyword(kw)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Keyword
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => handleDeleteKeyword(kw)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Keyword
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tracked Pages</h2>
              <Button onClick={() => setAddPageOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>

            {pagesLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </Card>
            ) : pages?.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pages tracked yet</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pages?.map((page) => (
                  <Card key={page.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{page.title || page.url}</h3>
                            <a href={page.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </a>
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-xl">{page.url}</p>
                          <div className="flex gap-4 text-sm mt-2">
                            <span>Page Score: {page.page_score || '-'}</span>
                            <span>Mobile: {page.mobile_score || '-'}</span>
                            <span>Speed: {page.speed_score || '-'}</span>
                            <Badge variant={page.indexed ? 'default' : 'secondary'}>
                              {page.indexed ? 'Indexed' : 'Not Indexed'}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPage(page)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Page
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => handleDeletePage(page)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Page
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <h2 className="text-xl font-semibold">SEO Issues</h2>

            {issuesLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              </Card>
            ) : issues?.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No open issues</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {issues?.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            <h3 className="font-semibold">{issue.issue_type}</h3>
                            <Badge className={severityColors[issue.severity]}>
                              {issue.severity}
                            </Badge>
                            <Badge variant={issue.status === 'open' ? 'destructive' : 'secondary'}>
                              {issue.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{issue.description}</p>
                          {issue.recommendation && (
                            <p className="text-sm mt-2"><strong>Recommendation:</strong> {issue.recommendation}</p>
                          )}
                        </div>
                        {issue.status === 'open' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResolveIssue(issue)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Keyword Dialog */}
      <Dialog open={addKeywordOpen} onOpenChange={setAddKeywordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Keyword</DialogTitle>
            <DialogDescription>Track a new keyword for SEO</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Keyword *</Label>
              <Input
                value={keywordForm.keyword}
                onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                placeholder="Enter keyword"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search Volume</Label>
                <Input
                  type="number"
                  value={keywordForm.search_volume}
                  onChange={(e) => setKeywordForm({ ...keywordForm, search_volume: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty %</Label>
                <Input
                  type="number"
                  value={keywordForm.difficulty}
                  onChange={(e) => setKeywordForm({ ...keywordForm, difficulty: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Rank</Label>
                <Input
                  type="number"
                  value={keywordForm.target_rank}
                  onChange={(e) => setKeywordForm({ ...keywordForm, target_rank: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddKeywordOpen(false)}>Cancel</Button>
            <Button onClick={handleAddKeyword} disabled={!keywordForm.keyword || createKeyword.isPending}>
              Add Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Keyword Dialog */}
      <Dialog open={editKeywordOpen} onOpenChange={setEditKeywordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Keyword</DialogTitle>
            <DialogDescription>Update keyword details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Keyword *</Label>
              <Input
                value={keywordForm.keyword}
                onChange={(e) => setKeywordForm({ ...keywordForm, keyword: e.target.value })}
                placeholder="Enter keyword"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Search Volume</Label>
                <Input
                  type="number"
                  value={keywordForm.search_volume}
                  onChange={(e) => setKeywordForm({ ...keywordForm, search_volume: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty %</Label>
                <Input
                  type="number"
                  value={keywordForm.difficulty}
                  onChange={(e) => setKeywordForm({ ...keywordForm, difficulty: e.target.value })}
                  placeholder="0-100"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Rank</Label>
                <Input
                  type="number"
                  value={keywordForm.target_rank}
                  onChange={(e) => setKeywordForm({ ...keywordForm, target_rank: e.target.value })}
                  placeholder="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditKeywordOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateKeyword} disabled={!keywordForm.keyword || updateKeyword.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Keyword Confirmation */}
      <Dialog open={deleteKeywordOpen} onOpenChange={setDeleteKeywordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Keyword</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the keyword "{selectedKeyword?.keyword}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteKeywordOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteKeyword} disabled={deleteKeyword.isPending}>
              Delete Keyword
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Page Dialog */}
      <Dialog open={addPageOpen} onOpenChange={setAddPageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Page</DialogTitle>
            <DialogDescription>Track a new page for SEO</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                value={pageForm.url}
                onChange={(e) => setPageForm({ ...pageForm, url: e.target.value })}
                placeholder="https://example.com/page"
              />
            </div>
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={pageForm.title}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                placeholder="Page title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={pageForm.meta_description}
                onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                placeholder="Meta description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPageOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPage} disabled={!pageForm.url || createPage.isPending}>
              Add Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Page Dialog */}
      <Dialog open={editPageOpen} onOpenChange={setEditPageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>Update page SEO details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL *</Label>
              <Input
                value={pageForm.url}
                onChange={(e) => setPageForm({ ...pageForm, url: e.target.value })}
                placeholder="https://example.com/page"
              />
            </div>
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input
                value={pageForm.title}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                placeholder="Page title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={pageForm.meta_description}
                onChange={(e) => setPageForm({ ...pageForm, meta_description: e.target.value })}
                placeholder="Meta description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPageOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePage} disabled={!pageForm.url || updatePage.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Page Confirmation */}
      <Dialog open={deletePageOpen} onOpenChange={setDeletePageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this page from tracking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePageOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletePage} disabled={deletePage.isPending}>
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Issue Confirmation */}
      <Dialog open={resolveIssueOpen} onOpenChange={setResolveIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Issue</DialogTitle>
            <DialogDescription>
              Mark the issue "{selectedIssue?.issue_type}" as resolved?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveIssueOpen(false)}>Cancel</Button>
            <Button onClick={confirmResolveIssue} disabled={resolveIssue.isPending}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
