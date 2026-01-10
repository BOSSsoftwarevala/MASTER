import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentItem, useUpdateContentItem } from '@/hooks/useMarketingManagerData';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';

export default function EditContentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: content, isLoading } = useContentItem(id!);
  const updateContent = useUpdateContentItem();
  
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'blog',
    body: '',
    author_name: '',
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        content_type: content.content_type,
        body: content.body || '',
        author_name: content.author_name || '',
        seo_title: content.seo_title || '',
        seo_description: content.seo_description || '',
      });
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent.mutate({
      id: id!,
      title: formData.title,
      content_type: formData.content_type,
      body: formData.body || null,
      author_name: formData.author_name || null,
      seo_title: formData.seo_title || null,
      seo_description: formData.seo_description || null,
    }, {
      onSuccess: () => navigate('/dashboard/marketing/content'),
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/marketing/content')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">Edit Content</h1>
            <p className="text-muted-foreground mt-1">Update content details</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Details
            </CardTitle>
            <CardDescription>Update the content information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter content title"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Content Type *</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) => setFormData({ ...formData, content_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog">Blog Post</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="landing_page">Landing Page</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="social">Social Post</SelectItem>
                      <SelectItem value="video_script">Video Script</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author Name</Label>
                  <Input
                    id="author"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Content Body</Label>
                <Textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Write your content here..."
                  rows={10}
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seo_title">SEO Title</Label>
                    <Input
                      id="seo_title"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      placeholder="SEO optimized title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Description</Label>
                    <Textarea
                      id="seo_description"
                      value={formData.seo_description}
                      onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                      placeholder="Meta description for search engines"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/marketing/content')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateContent.isPending}>
                  {updateContent.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
