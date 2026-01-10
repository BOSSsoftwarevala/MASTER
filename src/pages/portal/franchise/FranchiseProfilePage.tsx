import { RoleLayout } from '@/components/layout/RoleLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { UserCircle, MapPin, Phone, Mail, FileText, Building, Calendar, Edit, Lock } from 'lucide-react';

export default function FranchiseProfilePage() {
  const franchise = {
    name: 'Mumbai Central Franchise',
    ownerName: 'Manoj Kumar',
    territory: 'Mumbai Central, Maharashtra',
    phone: '+91 98***-***45',
    email: 'mum***@softwarevala.com',
    joinedDate: '2024-01-15',
    status: 'active',
    documents: [
      { name: 'Business Registration', status: 'verified' },
      { name: 'Identity Proof', status: 'verified' },
      { name: 'Address Proof', status: 'verified' },
      { name: 'Agreement Copy', status: 'verified' },
    ],
  };

  return (
    <RoleLayout role="franchise">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-muted-foreground mt-1">Your franchise profile information</p>
          </div>
          <Badge variant="default" className="gap-1 bg-emerald-500">
            {franchise.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-emerald-500" />
                Franchise Information
              </CardTitle>
              <CardDescription>Basic information about your franchise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Building className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{franchise.name}</h3>
                  <p className="text-muted-foreground">{franchise.ownerName}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Territory
                  </Label>
                  <p className="font-medium">{franchise.territory}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </Label>
                  <p className="font-medium">{franchise.joinedDate}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact (Masked)
                  </Label>
                  <p className="font-medium">{franchise.phone}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email (Masked)
                  </Label>
                  <p className="font-medium">{franchise.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Edit Profile (Limited)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" defaultValue={franchise.ownerName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altPhone">Alternate Phone</Label>
                    <Input id="altPhone" placeholder="Enter alternate phone" />
                  </div>
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-500" />
                Documents
              </CardTitle>
              <CardDescription>Your verified documents (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {franchise.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{doc.name}</span>
                  </div>
                  <Badge variant="default" className="bg-emerald-500 text-xs">
                    {doc.status}
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-muted-foreground text-center mt-4">
                Contact support to update documents
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleLayout>
  );
}
