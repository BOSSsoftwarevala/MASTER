import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useCreateAuditLog } from '@/hooks/useBossData';
import { ZarssSidebar } from '@/components/dashboard/ZarssSidebar';
import { ZarssRightPanel } from '@/components/dashboard/ZarssRightPanel';
import { Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';

type Category = Database['public']['Tables']['categories']['Row'];

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (next: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ' +
        (checked ? 'bg-[#c4f441]' : 'bg-[#2a2a2e]') +
        (disabled ? ' opacity-50 cursor-not-allowed' : ' cursor-pointer')
      }
      aria-pressed={checked}
      aria-label={checked ? 'Enabled' : 'Disabled'}
    >
      <span
        className={
          'inline-block h-5 w-5 transform rounded-full bg-[#141414] transition-transform duration-200 ' +
          (checked ? 'translate-x-5' : 'translate-x-1')
        }
      />
    </button>
  );
}

export default function CategoryManagementPage() {
  const { user } = useAuth();
  const { loading: rolesLoading, isAdmin } = useUserRoles();
  const queryClient = useQueryClient();
  const createAuditLog = useCreateAuditLog();

  const canEdit = useMemo(() => isAdmin(), [isAdmin]);
  const canView = Boolean(user);

  useEffect(() => {
    document.title = 'Category Management | Boss Panel';
  }, []);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['boss_category_management'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data ?? []) as Category[];
    },
    enabled: canView,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
  });

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: '', slug: '', description: '', sort_order: (categories?.length ?? 0) + 1, is_active: true });
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditTarget(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
      sort_order: category.sort_order ?? 0,
      is_active: Boolean(category.is_active),
    });
    setModalOpen(true);
  };

  const logSilently = async (action: string, details: string) => {
    try {
      await createAuditLog.mutateAsync({
        action,
        module: 'categories',
        user_email: user?.email || 'unknown',
        user_id: user?.id,
        user_role: 'super_admin',
        details,
        severity: 'info',
      });
    } catch (e) {
      // Silent by design
      console.error('Failed to write audit log:', e);
    }
  };

  const createCategory = useMutation({
    mutationFn: async (payload: CategoryFormState) => {
      const { error } = await supabase.from('categories').insert({
        name: payload.name,
        slug: payload.slug,
        description: payload.description || null,
        sort_order: payload.sort_order,
        is_active: payload.is_active,
        is_deleted: false,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boss_category_management'] });
      void logSilently('category_created', `Created category: ${form.name} (${form.slug})`);
      toast.success('Category added');
      setModalOpen(false);
    },
    onError: (error) => toast.error(`Failed to add category: ${error.message}`),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<CategoryFormState> }) => {
      const { error } = await supabase.from('categories').update(patch).eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['boss_category_management'] });
    },
    onError: (error) => toast.error(`Update failed: ${error.message}`),
  });

  const submitModal = () => {
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const safeSlug = form.slug.trim() ? toSlug(form.slug) : toSlug(form.name);
    const next = { ...form, slug: safeSlug };

    if (!safeSlug) {
      toast.error('Category slug is required');
      return;
    }

    if (editTarget) {
      updateCategory.mutate(
        { id: editTarget.id, patch: next },
        {
          onSuccess: () => {
            void logSilently('category_updated', `Updated category: ${editTarget.name} → ${next.name} (${next.slug})`);
            toast.success('Category updated');
            setModalOpen(false);
          },
        }
      );
    } else {
      createCategory.mutate(next);
    }
  };

  if (rolesLoading) return null;
  if (!canView) return <Navigate to="/auth" replace />;

  return (
    <div className="h-screen bg-[#0D0D0D] flex overflow-hidden">
      <ZarssSidebar />

      <main className="flex-1 bg-[#141414] p-6 overflow-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Category Management</h1>
            <p className="text-[#6b6b6b] text-sm">Boss-only global category settings</p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="px-6 py-2 bg-[#c4f441] text-[#0D0D0D] rounded-full text-sm font-semibold hover:bg-[#d4ff51] transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </header>

        <section className="bg-[#1e1e22] rounded-2xl p-5 border border-[#2a2a2e]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Categories</h2>
            <span className="text-[#6b6b6b] text-xs bg-[#2a2a2e] px-3 py-1.5 rounded-full">
              Changes are applied instantly
            </span>
          </div>

          {isLoading ? (
            <p className="text-[#6b6b6b] text-sm">Loading categories...</p>
          ) : (categories?.length ?? 0) === 0 ? (
            <p className="text-[#6b6b6b] text-sm">No categories found.</p>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-4 py-2 text-xs text-[#6b6b6b]">
                <div className="w-56">Name</div>
                <div className="flex-1">Slug</div>
                <div className="w-24 text-center">Active</div>
                <div className="w-24 text-center">Order</div>
                <div className="w-20 text-right">Edit</div>
              </div>

              {categories?.map((c) => (
                <div key={c.id} className="flex items-center gap-4 py-3 border-b border-[#2a2a2e] last:border-0">
                  <div className="w-56">
                    <p className="text-white text-sm font-medium truncate">{c.name}</p>
                    {c.description ? <p className="text-[#6b6b6b] text-xs truncate">{c.description}</p> : null}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[#6b6b6b] text-sm truncate">{c.slug}</p>
                  </div>

                  <div className="w-24 flex justify-center">
                    <Toggle
                      checked={Boolean(c.is_active)}
                      onChange={(next) => {
                        updateCategory.mutate(
                          { id: c.id, patch: { is_active: next } },
                          {
                            onSuccess: () => {
                              void logSilently('category_toggled', `Set category ${c.slug} active=${next}`);
                            },
                          }
                        );
                      }}
                      disabled={updateCategory.isPending}
                    />
                  </div>

                  <div className="w-24 flex justify-center">
                    <input
                      type="number"
                      value={c.sort_order ?? 0}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        updateCategory.mutate(
                          { id: c.id, patch: { sort_order: Number.isFinite(next) ? next : 0 } },
                          {
                            onSuccess: () => {
                              void logSilently('category_reordered', `Set category ${c.slug} sort_order=${next}`);
                            },
                          }
                        );
                      }}
                      className="w-20 bg-[#1e1e22] border border-[#2a2a2e] rounded-lg py-1.5 px-2 text-sm text-white text-center focus:outline-none focus:border-[#3a3a3e]"
                    />
                  </div>

                  <div className="w-20 flex justify-end">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="w-9 h-9 rounded-xl bg-[#2a2a2e] flex items-center justify-center text-[#6b6b6b] hover:text-white hover:bg-[#3a3a3e] transition-colors"
                      aria-label={`Edit ${c.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal */}
        {modalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
            <div className="relative w-full max-w-lg bg-[#1e1e22] rounded-2xl border border-[#2a2a2e] p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">{editTarget ? 'Edit Category' : 'Add Category'}</h3>
                  <p className="text-[#6b6b6b] text-xs">Updates apply globally</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-[#6b6b6b] hover:text-white transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#6b6b6b] text-xs mb-2">Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => {
                      const nextName = e.target.value;
                      setForm((p) => ({ ...p, name: nextName, slug: p.slug ? p.slug : toSlug(nextName) }));
                    }}
                    className="w-full bg-[#141414] border border-[#2a2a2e] rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#3a3a3e]"
                    placeholder="e.g. ERP"
                  />
                </div>

                <div>
                  <label className="block text-[#6b6b6b] text-xs mb-2">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full bg-[#141414] border border-[#2a2a2e] rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#3a3a3e]"
                    placeholder="e.g. erp"
                  />
                </div>

                <div>
                  <label className="block text-[#6b6b6b] text-xs mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full min-h-[96px] bg-[#141414] border border-[#2a2a2e] rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-[#6b6b6b] focus:outline-none focus:border-[#3a3a3e]"
                    placeholder="Short description (optional)"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-[#6b6b6b] text-xs mb-2">Order</label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                      className="w-full bg-[#141414] border border-[#2a2a2e] rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-[#3a3a3e]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <Toggle checked={form.is_active} onChange={(next) => setForm((p) => ({ ...p, is_active: next }))} />
                    <span className="text-[#6b6b6b] text-sm">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2 rounded-full bg-[#2a2a2e] text-white text-sm font-semibold hover:bg-[#3a3a3e] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitModal}
                    disabled={createCategory.isPending || updateCategory.isPending}
                    className="px-6 py-2 rounded-full bg-[#c4f441] text-[#0D0D0D] text-sm font-semibold hover:bg-[#d4ff51] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {editTarget ? 'Save Changes' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <ZarssRightPanel />
    </div>
  );
}
