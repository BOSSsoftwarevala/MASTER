import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MessageCircle, Shield, Award, Globe, Lock, CheckCircle, Phone, Mail } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import logo from '@/assets/logo.jpg';

const footerLinks = {
  Company: [
    { name: 'About', href: '/marketplace/about' },
    { name: 'Careers', href: '/marketplace/careers' },
    { name: 'Blog', href: '/marketplace/blog' },
    { name: 'Press', href: '/marketplace/press' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/marketplace/privacy' },
    { name: 'Terms of Service', href: '/marketplace/terms' },
    { name: 'Refund Policy', href: '/marketplace/refund' },
    { name: 'License Agreement', href: '/marketplace/license' },
  ],
  Support: [
    { name: 'Help Center', href: '/marketplace/help' },
    { name: 'Contact Us', href: '/marketplace/contact' },
    { name: 'FAQs', href: '/marketplace/faq' },
    { name: 'Security', href: '/marketplace/security' },
  ],
  Partners: [
    { name: 'Become a Reseller', href: '/marketplace/reseller' },
    { name: 'Franchise', href: '/marketplace/franchise' },
    { name: 'Affiliate Program', href: '/marketplace/affiliate' },
    { name: 'API Access', href: '/marketplace/api' },
  ],
};

const faqItems = [
  {
    question: 'What do I get in lifetime license?',
    answer: 'A lifetime license includes full software access, all future updates, priority support, and complete ownership with no recurring fees.'
  },
  {
    question: 'Is demo free or paid?',
    answer: 'Basic demos are free with limited features. Premium demos with full functionality are available for a small fee, refundable upon purchase.'
  },
  {
    question: 'Can I customize software?',
    answer: 'Yes! Our AI-powered customization allows you to tailor the software to your needs. Additional custom development is available on request.'
  },
  {
    question: 'Is source code included?',
    answer: 'Source code is included with Developer and Enterprise licenses. Standard licenses include compiled software only.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We accept all major credit cards, PayPal, bank transfers, UPI, and regional payment methods available by country.'
  },
  {
    question: 'Is support included?',
    answer: 'Yes, all licenses include email support. Premium and Enterprise plans include priority phone support and dedicated account managers.'
  },
  {
    question: 'Can I upgrade later?',
    answer: 'Absolutely! You can upgrade your license anytime. The upgrade cost is the difference between your current and new license.'
  },
  {
    question: 'Is this original software?',
    answer: '100% original and genuine. All software is directly sourced from verified developers with full licensing rights.'
  },
];

const blogPosts = [
  {
    title: 'Top 10 Business Software Trends for 2026',
    description: 'Discover the latest innovations shaping the software industry this year.',
    date: 'Jan 3, 2026',
    href: '/marketplace/blog/software-trends-2026'
  },
  {
    title: 'How to Choose the Right ERP System',
    description: 'A comprehensive guide to selecting enterprise resource planning software.',
    date: 'Jan 1, 2026',
    href: '/marketplace/blog/choose-erp-system'
  },
  {
    title: 'Security Best Practices for SaaS',
    description: 'Protect your business with these essential security measures.',
    date: 'Dec 28, 2025',
    href: '/marketplace/blog/saas-security'
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/share/1HpGSvExis', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/new_software_vala', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://wa.me/918348838383', label: 'WhatsApp' },
  { icon: Youtube, href: 'https://youtube.com/@softwarevala', label: 'YouTube' },
];

const trustBadges = [
  { icon: Shield, text: '100% Original Software' },
  { icon: Lock, text: 'No Crack • No Copy' },
  { icon: Award, text: 'Enterprise-Grade Security' },
  { icon: Globe, text: 'Trusted by Global Clients' },
  { icon: CheckCircle, text: 'All Rights Reserved' },
];

const contactInfo = {
  phones: ['+91-8768878787', '+91-8348838383'],
  email: 'hellosoftwarevala@gmail.com',
  websites: [
    { name: 'Online Software', url: 'https://softwarevala.net' },
    { name: 'Offline Software', url: 'https://erpvala.com' },
  ],
};

export function MarketplaceFooter() {
  return (
    <footer className="border-t border-border/50">
      {/* FAQ Section */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`}
                  className="glass-card rounded-xl px-6"
                >
                  <AccordionTrigger className="text-foreground hover:text-primary text-left py-4">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Blogs & Updates
            </h2>
            <Link 
              to="/marketplace/blog" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View All Blogs →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <Link 
                key={index} 
                to={post.href}
                className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all group"
              >
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <h3 className="text-lg font-semibold text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {post.description}
                </p>
                <span className="text-primary text-sm font-medium">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social & Trust Section */}
      <section className="py-12 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Contact Us
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    {contactInfo.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/-/g, '')}`} className="hover:text-primary transition-colors">
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <div className="flex flex-col">
                    {contactInfo.websites.map((site, i) => (
                      <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        {site.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Follow Us
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 rounded-xl glass-icon flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Trust & Security
              </h3>
              <div className="flex flex-wrap gap-3">
                {trustBadges.map((badge, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full glass-icon text-sm"
                  >
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span className="text-foreground/80">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Links Grid */}
      <section className="py-16 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Logo Column */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/marketplace" className="flex items-center gap-3 mb-4">
                <img src={logo} alt="Software Vala" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-lg font-bold text-foreground">Software Vala</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The Name of Trust. Premium software solutions for every business.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>52+ Franchises Worldwide</p>
                <p>10+ Countries Served</p>
                <p>4000+ Software Products</p>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-foreground mb-4">{title}</h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal & Trademark */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-4">Legal & Trademark</h4>
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto mb-4">
              All product names, logos, and software displayed on this platform are protected under applicable trademark and copyright laws. 
              Unauthorized copying, resale, redistribution, or reverse engineering of any software is strictly prohibited and may result in legal action.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link to="/marketplace/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-border">•</span>
              <Link to="/marketplace/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span className="text-border">•</span>
              <Link to="/marketplace/refund" className="text-muted-foreground hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <span className="text-border">•</span>
              <Link to="/marketplace/license" className="text-muted-foreground hover:text-primary transition-colors">
                License Agreement
              </Link>
              <span className="text-border">•</span>
              <Link to="/marketplace/trademark" className="text-muted-foreground hover:text-primary transition-colors">
                Trademark Usage Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">Software Vala</span> © {new Date().getFullYear()}. All Rights Reserved.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              SOC2 Compliant • GDPR Ready • ISO 27001 Certified
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
