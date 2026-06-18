import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ButtonPrimary = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

ButtonPrimary.displayName = 'ButtonPrimary';

export default ButtonPrimary;