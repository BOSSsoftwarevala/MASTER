import { SoftwareCard } from './SoftwareCard';

const featuredSoftware = [
  {
    id: 'school-erp-pro',
    name: 'School ERP Pro',
    description: 'Complete school management system with admissions, fees, exams, and parent portal.',
    features: ['Admissions', 'Fee Management', 'Exams', 'Reports'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    price: 49999,
    status: 'hot' as const,
    category: 'education',
  },
  {
    id: 'clinic-manager',
    name: 'Clinic Manager',
    description: 'Healthcare practice management with appointments, billing, and patient records.',
    features: ['Appointments', 'Billing', 'EMR', 'Inventory'],
    techStack: ['React', 'Python', 'MySQL'],
    price: 39999,
    status: 'live' as const,
    category: 'healthcare',
  },
  {
    id: 'realtor-crm',
    name: 'Realtor CRM',
    description: 'Property listing and CRM for real estate agents with lead management.',
    features: ['Listings', 'Lead CRM', 'Contracts', 'Analytics'],
    techStack: ['Vue.js', 'Laravel', 'PostgreSQL'],
    price: 34999,
    status: 'live' as const,
    category: 'real-estate',
  },
  {
    id: 'ecom-suite',
    name: 'E-Com Suite',
    description: 'Multi-vendor e-commerce platform with payment gateway and delivery tracking.',
    features: ['Multi-Vendor', 'Payments', 'Delivery', 'Reports'],
    techStack: ['Next.js', 'Node.js', 'MongoDB'],
    price: 59999,
    status: 'hot' as const,
    category: 'ecommerce',
  },
  {
    id: 'hotel-booking',
    name: 'Hotel Booking Pro',
    description: 'Hotel and resort management with online booking and POS integration.',
    features: ['Booking', 'POS', 'Housekeeping', 'Analytics'],
    techStack: ['React', 'Django', 'PostgreSQL'],
    price: 44999,
    status: 'live' as const,
    category: 'hospitality',
  },
  {
    id: 'fleet-tracker',
    name: 'Fleet Tracker',
    description: 'GPS fleet management with route optimization and driver management.',
    features: ['GPS Tracking', 'Routes', 'Drivers', 'Fuel'],
    techStack: ['React Native', 'Node.js', 'PostgreSQL'],
    price: 54999,
    status: 'upcoming' as const,
    category: 'logistics',
  },
];

export function FeaturedSoftware() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Software</h2>
            <p className="text-muted-foreground">Top-rated solutions ready for deployment</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSoftware.map((software, index) => (
            <SoftwareCard key={software.id} {...software} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
