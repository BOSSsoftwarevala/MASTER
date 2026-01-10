import { ZarssSidebar } from './ZarssSidebar';
import { ZarssMainContent } from './ZarssMainContent';
import { ZarssRightPanel } from './ZarssRightPanel';

export const ZarssDashboardLayout = () => {
  return (
    <div className="h-screen bg-[#0D0D0D] flex overflow-hidden">
      <ZarssSidebar />
      <ZarssMainContent />
      <ZarssRightPanel />
    </div>
  );
};
