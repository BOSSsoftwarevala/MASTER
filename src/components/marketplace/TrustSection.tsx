import { Shield, CheckCircle, Globe, Users, Code, Briefcase } from 'lucide-react';

const stats = [
  { value: '4000+', label: 'Software Products', icon: Code },
  { value: '10+', label: 'Countries', icon: Globe },
  { value: '52+', label: 'Franchises', icon: Briefcase },
  { value: '500+', label: 'Global Developers', icon: Users },
];

const badges = [
  { icon: Shield, label: '100% Genuine Software' },
  { icon: CheckCircle, label: 'No Crack' },
  { icon: CheckCircle, label: 'Fixed Price' },
  { icon: Shield, label: 'Secure License' },
];

export function TrustSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-6 text-center group hover:border-primary/40 transition-all duration-300">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass-icon">
                <Icon className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground/80">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
