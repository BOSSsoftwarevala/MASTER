import { useParams, Link } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceFooter } from '@/components/marketplace/MarketplaceFooter';
import { SoftwareCard } from '@/components/marketplace/SoftwareCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Type for software item
type SoftwareItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  techStack: string[];
  price: number;
  status: 'live' | 'hot' | 'upcoming';
  subCategory: string;
};

// Type for category
type CategoryData = {
  name: string;
  description: string;
  software: SoftwareItem[];
};

// Category data with sub-categories and software
const categoryData: Record<string, CategoryData> = {
  education: {
    name: 'Education Software Solutions',
    description: 'Comprehensive software for schools, colleges, coaching institutes, and e-learning platforms.',
    software: [
      { id: 'school-erp-basic', name: 'School ERP Basic', description: 'Essential school management with admissions, attendance, and basic reporting.', features: ['Admissions', 'Attendance', 'Reports', 'SMS'], techStack: ['React', 'Node.js', 'MySQL'], price: 29999, status: 'live', subCategory: 'School Management' },
      { id: 'school-erp-pro', name: 'School ERP Pro', description: 'Complete school management with fees, exams, transport, and parent portal.', features: ['Fee Management', 'Exams', 'Transport', 'Portal'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 49999, status: 'hot', subCategory: 'School Management' },
      { id: 'coaching-hub', name: 'Coaching Hub', description: 'Institute management with batch scheduling, test series, and student tracking.', features: ['Batches', 'Tests', 'Analytics', 'Payments'], techStack: ['Vue.js', 'Python', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Coaching Institute' },
      { id: 'coaching-pro', name: 'Coaching Pro', description: 'Advanced coaching management with live classes, doubt clearing, and performance analytics.', features: ['Live Classes', 'Doubts', 'Performance', 'Reports'], techStack: ['React', 'Node.js', 'MongoDB'], price: 44999, status: 'hot', subCategory: 'Coaching Institute' },
      { id: 'lms-starter', name: 'LMS Starter', description: 'Basic learning management with course creation, quizzes, and student progress.', features: ['Courses', 'Quizzes', 'Progress', 'Certificates'], techStack: ['React', 'Laravel', 'MySQL'], price: 39999, status: 'live', subCategory: 'LMS Platform' },
      { id: 'lms-enterprise', name: 'LMS Enterprise', description: 'Enterprise LMS with SCORM, gamification, and advanced analytics.', features: ['SCORM', 'Gamification', 'Analytics', 'API'], techStack: ['Next.js', 'Python', 'PostgreSQL'], price: 79999, status: 'hot', subCategory: 'LMS Platform' },
      { id: 'college-erp-basic', name: 'College ERP Basic', description: 'University management with departments, faculty, and student lifecycle.', features: ['Departments', 'Faculty', 'Students', 'Exams'], techStack: ['React', 'Java', 'PostgreSQL'], price: 59999, status: 'live', subCategory: 'College / University' },
      { id: 'college-erp-pro', name: 'College ERP Pro', description: 'Complete university ERP with placement cell, research, and alumni management.', features: ['Placements', 'Research', 'Alumni', 'Finance'], techStack: ['Angular', 'Java', 'Oracle'], price: 99999, status: 'hot', subCategory: 'College / University' },
      { id: 'library-manager', name: 'Library Manager', description: 'Digital library management with catalog, lending, and member portal.', features: ['Catalog', 'Lending', 'Members', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Library Management' },
    ],
  },
  healthcare: {
    name: 'Healthcare & Beauty Solutions',
    description: 'Software for clinics, hospitals, labs, salons, and wellness centers.',
    software: [
      { id: 'clinic-basic', name: 'Clinic Basic', description: 'Simple clinic management with appointments and patient records.', features: ['Appointments', 'Patients', 'Prescriptions', 'Billing'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Clinic Management' },
      { id: 'clinic-pro', name: 'Clinic Pro', description: 'Advanced clinic with EMR, lab integration, and telemedicine.', features: ['EMR', 'Lab', 'Telemedicine', 'Analytics'], techStack: ['React', 'Python', 'PostgreSQL'], price: 49999, status: 'hot', subCategory: 'Clinic Management' },
      { id: 'hospital-erp', name: 'Hospital ERP', description: 'Complete hospital management with IPD, OPD, pharmacy, and billing.', features: ['IPD', 'OPD', 'Pharmacy', 'Billing'], techStack: ['Angular', 'Java', 'Oracle'], price: 149999, status: 'hot', subCategory: 'Hospital Management' },
      { id: 'lab-manager', name: 'Lab Manager', description: 'Diagnostic lab management with test processing and report generation.', features: ['Tests', 'Reports', 'Billing', 'Integration'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Lab Management' },
      { id: 'salon-basic', name: 'Salon Basic', description: 'Salon booking and management with staff scheduling.', features: ['Booking', 'Staff', 'Inventory', 'POS'], techStack: ['React', 'Node.js', 'MySQL'], price: 19999, status: 'live', subCategory: 'Salon & Spa' },
      { id: 'salon-pro', name: 'Salon Pro', description: 'Multi-branch salon management with loyalty and marketing.', features: ['Multi-Branch', 'Loyalty', 'Marketing', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 39999, status: 'hot', subCategory: 'Salon & Spa' },
      { id: 'wellness-center', name: 'Wellness Center', description: 'Gym and wellness center management with memberships and trainers.', features: ['Memberships', 'Trainers', 'Classes', 'Payments'], techStack: ['Vue.js', 'Laravel', 'MySQL'], price: 29999, status: 'live', subCategory: 'Wellness & Gym' },
      { id: 'pharmacy-pos', name: 'Pharmacy POS', description: 'Pharmacy management with inventory, billing, and expiry tracking.', features: ['Inventory', 'Billing', 'Expiry', 'GST'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Pharmacy' },
      { id: 'dental-clinic', name: 'Dental Clinic', description: 'Specialized dental practice management with treatment planning.', features: ['Appointments', 'Treatments', 'X-Ray', 'Billing'], techStack: ['React', 'Python', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Dental Clinic' },
    ],
  },
  'real-estate': {
    name: 'Real Estate Solutions',
    description: 'Property management, CRM, and listing platforms for real estate businesses.',
    software: [
      { id: 'property-listing', name: 'Property Listing', description: 'Property listing portal with search and inquiries.', features: ['Listings', 'Search', 'Inquiries', 'Analytics'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Property Portal' },
      { id: 'realtor-crm', name: 'Realtor CRM', description: 'Real estate CRM with lead management and pipeline tracking.', features: ['Leads', 'Pipeline', 'Tasks', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 29999, status: 'hot', subCategory: 'CRM' },
      { id: 'property-management', name: 'Property Management', description: 'Rental property management with tenant and maintenance tracking.', features: ['Tenants', 'Maintenance', 'Payments', 'Contracts'], techStack: ['Vue.js', 'Laravel', 'PostgreSQL'], price: 39999, status: 'live', subCategory: 'Property Management' },
      { id: 'builder-erp', name: 'Builder ERP', description: 'Construction project management with inventory and finance.', features: ['Projects', 'Inventory', 'Finance', 'Reports'], techStack: ['Angular', 'Java', 'PostgreSQL'], price: 79999, status: 'hot', subCategory: 'Construction' },
      { id: 'broker-portal', name: 'Broker Portal', description: 'Multi-broker property marketplace with commission tracking.', features: ['Marketplace', 'Brokers', 'Commission', 'Payments'], techStack: ['Next.js', 'Node.js', 'PostgreSQL'], price: 49999, status: 'live', subCategory: 'Broker Network' },
      { id: 'society-manager', name: 'Society Manager', description: 'Housing society management with complaints and billing.', features: ['Complaints', 'Billing', 'Notices', 'Parking'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Society Management' },
      { id: 'commercial-lease', name: 'Commercial Lease', description: 'Commercial property leasing with contract management.', features: ['Leasing', 'Contracts', 'Renewals', 'Reports'], techStack: ['React', 'Python', 'PostgreSQL'], price: 44999, status: 'live', subCategory: 'Commercial' },
      { id: 'land-registry', name: 'Land Registry', description: 'Land record management with document tracking.', features: ['Records', 'Documents', 'Verification', 'Reports'], techStack: ['Angular', 'Java', 'Oracle'], price: 59999, status: 'upcoming', subCategory: 'Land Records' },
      { id: 'interior-design', name: 'Interior Design', description: 'Interior design project management with 3D visualization.', features: ['Projects', '3D View', 'Materials', 'Billing'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Interior Design' },
    ],
  },
  ecommerce: {
    name: 'E-Commerce Solutions',
    description: 'Online stores, marketplaces, and retail management platforms.',
    software: [
      { id: 'ecom-starter', name: 'E-Com Starter', description: 'Simple online store with product catalog and checkout.', features: ['Catalog', 'Cart', 'Checkout', 'Orders'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 29999, status: 'live', subCategory: 'Online Store' },
      { id: 'ecom-pro', name: 'E-Com Pro', description: 'Advanced e-commerce with inventory, shipping, and analytics.', features: ['Inventory', 'Shipping', 'Analytics', 'SEO'], techStack: ['Next.js', 'Node.js', 'PostgreSQL'], price: 49999, status: 'hot', subCategory: 'Online Store' },
      { id: 'multi-vendor', name: 'Multi-Vendor', description: 'Multi-vendor marketplace with seller management.', features: ['Vendors', 'Commission', 'Payouts', 'Reports'], techStack: ['Next.js', 'Node.js', 'MongoDB'], price: 79999, status: 'hot', subCategory: 'Marketplace' },
      { id: 'retail-pos', name: 'Retail POS', description: 'Retail point of sale with inventory and billing.', features: ['POS', 'Inventory', 'GST', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Retail POS' },
      { id: 'grocery-delivery', name: 'Grocery Delivery', description: 'Grocery delivery app with real-time tracking.', features: ['Catalog', 'Delivery', 'Tracking', 'Payments'], techStack: ['React Native', 'Node.js', 'PostgreSQL'], price: 59999, status: 'hot', subCategory: 'Grocery' },
      { id: 'food-delivery', name: 'Food Delivery', description: 'Food ordering and delivery platform with restaurant management.', features: ['Restaurants', 'Orders', 'Delivery', 'Ratings'], techStack: ['React Native', 'Node.js', 'MongoDB'], price: 69999, status: 'hot', subCategory: 'Food Delivery' },
      { id: 'b2b-portal', name: 'B2B Portal', description: 'B2B wholesale portal with bulk ordering and credit.', features: ['Bulk Orders', 'Credit', 'Pricing', 'Reports'], techStack: ['React', 'Python', 'PostgreSQL'], price: 54999, status: 'live', subCategory: 'B2B' },
      { id: 'fashion-store', name: 'Fashion Store', description: 'Fashion e-commerce with size guides and AR try-on.', features: ['Size Guide', 'AR Try-On', 'Wishlist', 'Returns'], techStack: ['Next.js', 'Node.js', 'PostgreSQL'], price: 44999, status: 'live', subCategory: 'Fashion' },
      { id: 'subscription-box', name: 'Subscription Box', description: 'Subscription commerce with recurring billing.', features: ['Subscriptions', 'Billing', 'Shipping', 'Analytics'], techStack: ['React', 'Node.js', 'Stripe'], price: 39999, status: 'upcoming', subCategory: 'Subscription' },
    ],
  },
  finance: {
    name: 'Finance & Accounting Solutions',
    description: 'Accounting, billing, payroll, and financial management software.',
    software: [
      { id: 'accounting-basic', name: 'Accounting Basic', description: 'Simple accounting with invoicing and expense tracking.', features: ['Invoicing', 'Expenses', 'Reports', 'GST'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 19999, status: 'live', subCategory: 'Accounting' },
      { id: 'accounting-pro', name: 'Accounting Pro', description: 'Advanced accounting with multi-company and audit trail.', features: ['Multi-Company', 'Audit', 'Budgets', 'Reports'], techStack: ['React', 'Python', 'PostgreSQL'], price: 39999, status: 'hot', subCategory: 'Accounting' },
      { id: 'payroll-manager', name: 'Payroll Manager', description: 'Payroll processing with tax calculations and compliance.', features: ['Payroll', 'Tax', 'Compliance', 'Slips'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 29999, status: 'live', subCategory: 'Payroll' },
      { id: 'billing-suite', name: 'Billing Suite', description: 'GST-compliant billing with e-invoicing.', features: ['E-Invoice', 'GST', 'E-Way Bill', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Billing' },
      { id: 'lending-platform', name: 'Lending Platform', description: 'Loan management with EMI calculation and collection.', features: ['Loans', 'EMI', 'Collection', 'Reports'], techStack: ['React', 'Java', 'PostgreSQL'], price: 79999, status: 'hot', subCategory: 'Lending' },
      { id: 'investment-tracker', name: 'Investment Tracker', description: 'Portfolio tracking with performance analytics.', features: ['Portfolio', 'Analytics', 'Alerts', 'Reports'], techStack: ['React', 'Python', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Investment' },
      { id: 'expense-manager', name: 'Expense Manager', description: 'Corporate expense management with approvals.', features: ['Expenses', 'Approvals', 'Policies', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 24999, status: 'live', subCategory: 'Expense' },
      { id: 'tax-filing', name: 'Tax Filing', description: 'Tax computation and filing assistant.', features: ['Computation', 'Filing', 'Documents', 'History'], techStack: ['React', 'Python', 'PostgreSQL'], price: 29999, status: 'upcoming', subCategory: 'Tax' },
      { id: 'insurance-crm', name: 'Insurance CRM', description: 'Insurance agent CRM with policy tracking.', features: ['Policies', 'Renewals', 'Claims', 'Commission'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Insurance' },
    ],
  },
  logistics: {
    name: 'Logistics & Transportation Solutions',
    description: 'Fleet management, delivery tracking, and warehouse management.',
    software: [
      { id: 'fleet-basic', name: 'Fleet Basic', description: 'Basic fleet tracking with GPS and fuel management.', features: ['GPS', 'Fuel', 'Drivers', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Fleet Management' },
      { id: 'fleet-pro', name: 'Fleet Pro', description: 'Advanced fleet with route optimization and maintenance.', features: ['Routes', 'Maintenance', 'Analytics', 'Alerts'], techStack: ['React', 'Python', 'PostgreSQL'], price: 59999, status: 'hot', subCategory: 'Fleet Management' },
      { id: 'warehouse-manager', name: 'Warehouse Manager', description: 'Warehouse management with inventory and picking.', features: ['Inventory', 'Picking', 'Shipping', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 49999, status: 'live', subCategory: 'Warehouse' },
      { id: 'delivery-tracker', name: 'Delivery Tracker', description: 'Last-mile delivery with real-time tracking.', features: ['Tracking', 'POD', 'Routes', 'Analytics'], techStack: ['React Native', 'Node.js', 'PostgreSQL'], price: 39999, status: 'hot', subCategory: 'Delivery' },
      { id: 'courier-management', name: 'Courier Management', description: 'Courier and parcel management with AWB tracking.', features: ['AWB', 'Tracking', 'Billing', 'Reports'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 44999, status: 'live', subCategory: 'Courier' },
      { id: 'transport-booking', name: 'Transport Booking', description: 'Transport booking portal with vehicle selection.', features: ['Booking', 'Vehicles', 'Pricing', 'Tracking'], techStack: ['React', 'Node.js', 'PostgreSQL'], price: 34999, status: 'live', subCategory: 'Transport' },
      { id: 'cold-chain', name: 'Cold Chain', description: 'Cold chain logistics with temperature monitoring.', features: ['Temperature', 'Alerts', 'Compliance', 'Reports'], techStack: ['React', 'Python', 'PostgreSQL'], price: 69999, status: 'upcoming', subCategory: 'Cold Chain' },
      { id: 'freight-forwarder', name: 'Freight Forwarder', description: 'Freight forwarding with customs and documentation.', features: ['Customs', 'Documents', 'Tracking', 'Billing'], techStack: ['React', 'Java', 'PostgreSQL'], price: 79999, status: 'live', subCategory: 'Freight' },
      { id: 'taxi-dispatch', name: 'Taxi Dispatch', description: 'Taxi booking and dispatch with driver app.', features: ['Booking', 'Dispatch', 'Payments', 'Ratings'], techStack: ['React Native', 'Node.js', 'MongoDB'], price: 54999, status: 'hot', subCategory: 'Taxi' },
    ],
  },
};

// Default category for undefined routes
const defaultCategory: CategoryData = {
  name: 'Software Solutions',
  description: 'Browse our collection of premium software solutions.',
  software: [],
};

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? categoryData[categoryId] || defaultCategory : defaultCategory;

  // Group software by sub-category
  const subCategories = category.software.reduce<Record<string, SoftwareItem[]>>((acc, software) => {
    if (!acc[software.subCategory]) {
      acc[software.subCategory] = [];
    }
    acc[software.subCategory].push(software);
    return acc;
  }, {});

  return (
    <div className="min-h-screen marketplace-bg dark">
      <MarketplaceHeader />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button & Header */}
          <div className="mb-10">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-3">{category.name}</h1>
            <p className="text-lg text-muted-foreground">{category.description}</p>
          </div>

          {/* Software by Sub-Category */}
          {Object.entries(subCategories).map(([subCategory, softwareList]) => (
            <div key={subCategory} className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border/50">{subCategory}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {softwareList.map((software) => (
                  <SoftwareCard key={software.id} {...software} category={categoryId || ''} />
                ))}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {category.software.length === 0 && (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-muted-foreground mb-4">No software found in this category.</p>
              <Link to="/marketplace">
                <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90">
                  Browse All Software
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <MarketplaceFooter />
    </div>
  );
}
