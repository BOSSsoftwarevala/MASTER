export interface ServerWizardData {
  // Step 1 - Server Type
  serverType: 'company_core' | 'client_managed' | 'client_dedicated' | 'build_ci' | 'backup_dr' | '';
  serverName: string;
  purpose: 'app' | 'db' | 'cache' | 'backup' | '';

  // Step 2 - Provider & Region
  provider: 'aws' | 'gcp' | 'azure' | 'cloudflare' | 'hetzner' | 'vultr' | 'digitalocean' | 'contabo' | 'linode' | 'other' | '';
  providerOther: string;
  region: string;
  availabilityZone: string;
  ipType: 'public' | 'private' | 'both';

  // Step 3 - Resource Configuration
  cpuCores: number;
  ramGB: number;
  diskType: 'ssd' | 'hdd' | 'nvme';
  diskGB: number;
  bandwidthLimit: number;

  // Step 4 - Security Level
  securityLevel: 'low' | 'medium' | 'high' | '';
  firewallPreset: 'basic' | 'standard' | 'strict' | 'custom';
  sshAccess: boolean;
  ipAllowlist: string;

  // Step 5 - Monitoring & Backup
  monitoringLevel: 'basic' | 'advanced';
  metricInterval: number;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'hourly' | '';

  // Step 6 - Auto Scaling & Healing
  autoScaling: boolean;
  minNodes: number;
  maxNodes: number;
  cpuTrigger: number;
  ramTrigger: number;
  autoHealing: boolean;

  // Step 7 - Tagging & Grouping
  environment: 'prod' | 'staging' | 'dev' | '';
  tags: string[];
  serverGroup: string;

  // Step 8 - Confirmation
  confirmCreate: boolean;
  creationReason: string;
}

export const initialWizardData: ServerWizardData = {
  serverType: '',
  serverName: '',
  purpose: '',
  provider: '',
  providerOther: '',
  region: '',
  availabilityZone: '',
  ipType: 'public',
  cpuCores: 2,
  ramGB: 4,
  diskType: 'ssd',
  diskGB: 100,
  bandwidthLimit: 1000,
  securityLevel: '',
  firewallPreset: 'standard',
  sshAccess: true,
  ipAllowlist: '',
  monitoringLevel: 'basic',
  metricInterval: 60,
  backupEnabled: true,
  backupFrequency: 'daily',
  autoScaling: false,
  minNodes: 1,
  maxNodes: 3,
  cpuTrigger: 80,
  ramTrigger: 80,
  autoHealing: false,
  environment: '',
  tags: [],
  serverGroup: '',
  confirmCreate: false,
  creationReason: '',
};

export const WIZARD_STEPS = [
  { id: 1, title: 'Server Type', description: 'Choose server type and purpose' },
  { id: 2, title: 'Provider & Region', description: 'Select cloud provider and location' },
  { id: 3, title: 'Resources', description: 'Configure CPU, RAM, and storage' },
  { id: 4, title: 'Security', description: 'Set security level and firewall rules' },
  { id: 5, title: 'Monitoring', description: 'Configure monitoring and backups' },
  { id: 6, title: 'Scaling', description: 'Auto-scaling and healing options' },
  { id: 7, title: 'Tagging', description: 'Environment and grouping' },
  { id: 8, title: 'Review', description: 'Confirm and create server' },
];

export const SERVER_TYPES = [
  { value: 'company_core', label: 'Company Core Server', icon: '🏢', description: 'Main infrastructure for internal operations' },
  { value: 'client_managed', label: 'Client Managed Server', icon: '👥', description: 'Server managed on behalf of clients' },
  { value: 'client_dedicated', label: 'Client Dedicated Server', icon: '🎯', description: 'Dedicated server for a single client' },
  { value: 'build_ci', label: 'Build / CI Server', icon: '⚙️', description: 'Continuous integration and build automation' },
  { value: 'backup_dr', label: 'Backup / DR Server', icon: '💾', description: 'Disaster recovery and backup storage' },
];

export const PURPOSES = [
  { value: 'app', label: 'Application', description: 'Web apps, APIs, services' },
  { value: 'db', label: 'Database', description: 'Database servers' },
  { value: 'cache', label: 'Cache', description: 'Redis, Memcached, etc.' },
  { value: 'backup', label: 'Backup', description: 'Storage and archival' },
];

export const PROVIDERS = [
  { value: 'aws', label: 'Amazon AWS', icon: '☁️', description: 'Enterprise cloud, global reach' },
  { value: 'gcp', label: 'Google Cloud', icon: '🌐', description: 'AI/ML optimized, fast network' },
  { value: 'azure', label: 'Microsoft Azure', icon: '🔷', description: 'Enterprise integration' },
  { value: 'cloudflare', label: 'Cloudflare', icon: '🔶', description: 'Edge CDN, DDoS protection, Workers' },
  { value: 'hetzner', label: 'Hetzner', icon: '🇩🇪', description: 'Best price/performance, Germany/Finland' },
  { value: 'vultr', label: 'Vultr', icon: '⚡', description: 'NVMe SSD, Mumbai/Singapore available' },
  { value: 'digitalocean', label: 'DigitalOcean', icon: '🌊', description: 'Simple, Bangalore datacenter' },
  { value: 'contabo', label: 'Contabo', icon: '💰', description: 'Cheapest high RAM/storage' },
  { value: 'linode', label: 'Linode (Akamai)', icon: '🟢', description: 'Reliable, Mumbai datacenter' },
  { value: 'other', label: 'Other', icon: '📦', description: 'Custom provider' },
];

export const SECURITY_LEVELS = [
  { value: 'low', label: 'Low', description: 'Non-critical systems', color: 'text-yellow-500' },
  { value: 'medium', label: 'Medium', description: 'Standard production', color: 'text-blue-500' },
  { value: 'high', label: 'High', description: 'Critical / Client systems', color: 'text-red-500' },
];

export const ENVIRONMENTS = [
  { value: 'prod', label: 'Production', color: 'bg-red-500' },
  { value: 'staging', label: 'Staging', color: 'bg-yellow-500' },
  { value: 'dev', label: 'Development', color: 'bg-green-500' },
];
