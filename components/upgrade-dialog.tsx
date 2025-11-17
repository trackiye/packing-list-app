// components/upgrade-dialog.tsx
'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle } from 'lucide-react';

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Brand: Adventurous yet reliable, using gradients
const gradientButtonClass = 'bg-gradient-to-r from-cyan-400 to-emerald-600 hover:from-cyan-500 hover:to-emerald-700 text-white';

export default function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  const handleUpgradeClick = () => {
    // Redirect to your Stripe checkout page
    window.location.href = '/api/stripe/checkout';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center">
            <Zap className="h-6 w-6 mr-2 text-yellow-500" /> Unlock Pro Power!
          </DialogTitle>
          <DialogDescription className="mt-2 text-md text-gray-600">
            You've hit the **3-list limit** for free generation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
            <p className="text-lg font-semibold text-center text-emerald-600">
                Get the **Lifetime Pro** deal for just $19!
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Unlimited packing lists</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> PDF export & Email lists</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Affiliate links (Amazon gear!)</li>
            </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleUpgradeClick} className={`w-full h-10 ${gradientButtonClass}`}>
            Go Pro for $19 Lifetime!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
