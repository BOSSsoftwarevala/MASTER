import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDevelopers, useUpdateDeveloper } from '@/hooks/useDevelopmentManagerData';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditDeveloperPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: developers } = useDevelopers();
  const updateDeveloper = useUpdateDeveloper();

  const developer = developers?.find((d) => d.id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    level: 'mid' as 'junior' | 'mid' | 'senior' | 'lead' | 'principal',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    skill_set: '',
  });

  useEffect(() => {
    if (developer) {
      setFormData({
        name: developer.name,
        email: developer.email,
        phone: developer.phone || '',
        department: developer.department || '',
        level: developer.level,
        status: developer.status,
        skill_set: developer.skill_set?.join(', ') || '',
      });
    }
  }, [developer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    await updateDeveloper.mutateAsync({
      id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      department: formData.department || null,
      level: formData.level,
      status: formData.status,
      skill_set: formData.skill_set.split(',').map(s => s.trim()).filter(Boolean),
    });

    navigate('/dashboard/devmanager/developers');
  };

  if (!developer) {
    return (
      <DashboardLayout>
        <div className="text-center py-8 text-muted-foreground">Developer not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Developer</h1>
            <p className="text-muted-foreground">Update developer information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Developer Information</CardTitle>
            <CardDescription>Update the developer's details below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: typeof formData.level) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Mid</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: typeof formData.status) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  value={formData.skill_set}
                  onChange={(e) => setFormData({ ...formData, skill_set: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={updateDeveloper.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {updateDeveloper.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
