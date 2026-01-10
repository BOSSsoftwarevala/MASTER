import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSupportData } from '@/hooks/useSupportData';
import { ArrowLeft, Save, Shield } from 'lucide-react';

function generateSessionCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CreateAssistSessionPage() {
  const navigate = useNavigate();
  const { createAssistSession } = useSupportData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    session_code: generateSessionCode(),
    client_name: '',
    client_email: '',
    recording_enabled: false,
    idle_timeout_minutes: 15,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createAssistSession({
      ...formData,
      status: 'pending',
      client_consent_given: false,
    });
    setLoading(false);
    if (result) {
      navigate('/dashboard/support/assist');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/support/assist')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Create Assist Session</h1>
            <p className="text-muted-foreground mt-1">Start a new remote assistance session</p>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Shield className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-muted-foreground">
              Client must provide explicit consent before the session can begin. The session code will be shared with the client.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session_code">Session Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="session_code"
                    value={formData.session_code}
                    readOnly
                    className="font-mono text-lg"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setFormData({ ...formData, session_code: generateSessionCode() })}
                  >
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Share this code with the client to connect</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_name">Client Name *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Client name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Client Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idle_timeout">Idle Timeout (minutes)</Label>
                <Input
                  id="idle_timeout"
                  type="number"
                  min={5}
                  max={60}
                  value={formData.idle_timeout_minutes}
                  onChange={(e) => setFormData({ ...formData, idle_timeout_minutes: parseInt(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">Session will auto-disconnect after this period of inactivity</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="recording">Enable Recording</Label>
                  <p className="text-xs text-muted-foreground">Record the session for quality assurance</p>
                </div>
                <Switch
                  id="recording"
                  checked={formData.recording_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, recording_enabled: checked })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard/support/assist')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="h-4 w-4" />
                  {loading ? 'Creating...' : 'Create Session'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
