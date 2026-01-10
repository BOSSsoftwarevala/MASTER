import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ServerWizardData, ENVIRONMENTS } from '../ServerWizardTypes';
import { cn } from '@/lib/utils';
import { Tag, FolderTree, X, Plus } from 'lucide-react';

interface Step7Props {
  data: ServerWizardData;
  updateData: (updates: Partial<ServerWizardData>) => void;
}

const SUGGESTED_TAGS = ['critical', 'client', 'internal', 'api', 'frontend', 'backend', 'database', 'cache'];
const SERVER_GROUPS = ['Web Cluster', 'Database Cluster', 'Cache Cluster', 'Build Servers', 'Client Servers', 'Standalone'];

export function Step7Tagging({ data, updateData }: Step7Props) {
  const [newTag, setNewTag] = useState('');

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !data.tags.includes(normalizedTag)) {
      updateData({ tags: [...data.tags, normalizedTag] });
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    updateData({ tags: data.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Tagging & Grouping</h3>

      {/* Environment Selection */}
      <div>
        <Label className="mb-3 block">Environment *</Label>
        <div className="flex gap-4">
          {ENVIRONMENTS.map((env) => (
            <Card
              key={env.value}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50 flex-1',
                data.environment === env.value && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => updateData({ environment: env.value as ServerWizardData['environment'] })}
            >
              <CardContent className="p-4 text-center">
                <div className={cn('w-4 h-4 rounded-full mx-auto mb-2', env.color)} />
                <p className="font-medium">{env.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <Label>Tags</Label>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add custom tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(newTag);
              }
            }}
            className="max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => addTag(newTag)}
            disabled={!newTag.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Suggested tags:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.filter((t) => !data.tags.includes(t)).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => addTag(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Server Group */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderTree className="h-5 w-5 text-emerald-500" />
          <Label>Server Group</Label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SERVER_GROUPS.map((group) => (
            <Card
              key={group}
              className={cn(
                'cursor-pointer transition-all hover:border-primary/50',
                data.serverGroup === group && 'border-primary ring-2 ring-primary/20'
              )}
              onClick={() => updateData({ serverGroup: group })}
            >
              <CardContent className="p-3 text-center">
                <p className="text-sm font-medium">{group}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Input
          placeholder="Or enter custom group name..."
          value={SERVER_GROUPS.includes(data.serverGroup) ? '' : data.serverGroup}
          onChange={(e) => updateData({ serverGroup: e.target.value })}
          className="max-w-xs"
        />
      </div>
    </div>
  );
}
