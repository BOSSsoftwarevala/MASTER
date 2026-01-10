import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';

interface SecurityOverlayProps {
  reason?: string;
  onClose?: () => void;
}

export function SecurityOverlay({ reason = 'Security breach detected', onClose }: SecurityOverlayProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center">
      <div className="text-center p-12 max-w-md">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping">
            <Shield className="w-24 h-24 mx-auto text-red-500/30" />
          </div>
          <Shield className="w-24 h-24 mx-auto text-red-500 relative" />
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h1 className="text-2xl font-bold text-red-500">Security Alert</h1>
        </div>
        
        <p className="text-gray-400 mb-6">{reason}</p>
        
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <Lock className="w-5 h-5" />
          <span>Session terminated for security</span>
        </div>
        
        <div className="text-sm text-gray-600">
          Redirecting in {countdown}s...
        </div>
      </div>
    </div>
  );
}
