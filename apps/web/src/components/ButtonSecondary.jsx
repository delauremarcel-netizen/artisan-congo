import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ButtonSecondary = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "bg-background text-primary border-2 border-primary hover:bg-primary/5 hover:text-primary shadow-sm transition-all duration-300 active:scale-[0.98] font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

ButtonSecondary.displayName = 'ButtonSecondary';

export default ButtonSecondary;