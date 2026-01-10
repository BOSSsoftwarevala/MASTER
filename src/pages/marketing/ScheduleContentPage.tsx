import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContentItem, useUpdateContentItem } from '@/hooks/useMarketingManagerData';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';

export default function ScheduleContentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: content, isLoading } = useContentItem(id!);
  const updateContent = useUpdateContentItem();
  
  const [formData, setFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    platform: 'website',
  });

  // Pre-populate form with existing scheduled date if available
  useEffect(() => {
    if (content?.scheduled_at) {
      const scheduledDate = new Date(content.scheduled_at);
      setFormData({
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        scheduled_time: scheduledDate.toTimeString().slice(0, 5),
        platform: 'website',
      });
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledAt = formData.scheduled_date && formData.scheduled_time
      ? `${formData.scheduled_date}T${formData.scheduled_time}:00`
      : null;
    
    updateContent.mutate({
      id: id!,
      scheduled_at: scheduledAt,
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
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/marketing/content')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">Schedule Content</h1>
            <p className="text-muted-foreground mt-1">{content?.title}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule Settings
            </CardTitle>
            <CardDescription>Choose when to publish this content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Scheduled Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Scheduled Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/marketing/content')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateContent.isPending}>
                  {updateContent.isPending ? 'Scheduling...' : 'Schedule Content'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
