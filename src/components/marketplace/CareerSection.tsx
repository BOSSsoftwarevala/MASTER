import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code, Megaphone, Users } from 'lucide-react';

const careers = [
  { 
    title: 'Developer', 
    description: 'Join our global team of developers building next-gen software solutions.',
    icon: Code,
    color: 'from-blue-500 to-cyan-400',
    link: '/marketplace/careers/developer'
  },
  { 
    title: 'Sales Partner', 
    description: 'Become a sales partner and earn commissions on every successful deal.',
    icon: Megaphone,
    color: 'from-orange-500 to-amber-400',
    link: '/marketplace/careers/sales'
  },
  { 
    title: 'Influencer', 
    description: 'Promote our software and earn through our influencer program.',
    icon: Users,
    color: 'from-violet-500 to-purple-400',
    link: '/marketplace/careers/influencer'
  },
];

export function CareerSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Network</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Be part of a global network of developers, sales partners, and influencers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {careers.map((career, i) => {
            const Icon = career.icon;
            return (
              <div key={i} className="glass-card rounded-2xl p-8 text-center group hover:glass-card-hover transition-all duration-300">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${career.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Apply as {career.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{career.description}</p>
                <Link to={career.link}>
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                    Apply Now
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
