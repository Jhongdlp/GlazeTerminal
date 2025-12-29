import React, { useRef, useImperativeHandle } from 'react';
import { cn } from "../../lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className, label, type, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleIncrement = () => {
      if (inputRef.current) {
        inputRef.current.stepUp();
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    const handleDecrement = () => {
       if (inputRef.current) {
        inputRef.current.stepDown();
        inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        inputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    return (
      <div className={cn("relative", className)}>
        {/* Optional Icon */}
        {props.icon && (
            <div className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none transition-colors duration-200",
                "peer-focus:text-[#2196f3] peer-valid:text-[#2196f3]",
                props.disabled && "text-neutral-600"
            )}>
                {props.icon}
            </div>
        )}

        <input
          {...props}
          type={type}
          ref={inputRef}
          className={cn(
            "peer block w-full border-[1.5px] border-[#9e9e9e] rounded-[1rem] bg-transparent p-[1rem] text-[1rem] text-[#f5f5f5] focus:outline-none focus:border-[#1a73e8] valid:border-[#1a73e8] transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
            type === "number" && "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-12",
            props.icon && "pl-12" // Add padding if icon exists
          )}
          placeholder=" "
        />
        <label className={cn(
            "absolute top-1/2 -translate-y-1/2 text-[#e8e8e8] pointer-events-none transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-left",
            // Floating states
            "peer-focus:-translate-y-[2.2rem] peer-focus:scale-[0.8] peer-focus:bg-[#09090b] peer-focus:px-[0.2em] peer-focus:text-[#2196f3]",
            "peer-valid:-translate-y-[2.2rem] peer-valid:scale-[0.8] peer-valid:bg-[#09090b] peer-valid:px-[0.2em] peer-valid:text-[#2196f3]",
            // Disabled state floating - ensure we override any potential conflict
            "peer-disabled:-translate-y-[2.2rem] peer-disabled:scale-[0.8] peer-disabled:bg-[#09090b] peer-disabled:px-[0.2em] peer-disabled:text-[#e8e8e8]/40",
            // Horizontal position
            props.icon ? "left-[3rem]" : "left-[15px]",
            // Adjust left position when floating if icon exists? No, keep it aligned with the text start or move back?
            // Actually, normally floating labels move to the top left corner of the input.
            // If icon is there, we probably want the label to float to the same X position as when it's inside, OR move slightly left.
            // Let's keep it simple: utilize the left padding.
             props.icon && "peer-focus:left-[15px] peer-valid:left-[15px] peer-disabled:left-[15px]"
        )}>
          {label}
        </label>
        
        {type === "number" && (
           <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 z-10 opacity-0 hover:opacity-100 peer-focus:opacity-100 transition-opacity">
              <button 
                type="button"
                onClick={handleIncrement}
                className="flex items-center justify-center text-neutral-500 hover:text-white transition-colors cursor-pointer p-0.5 active:scale-90 active:text-[#2196f3]"
                tabIndex={-1}
                disabled={props.disabled}
              >
                 <ChevronUp className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
              <button 
                type="button"
                onClick={handleDecrement}
                 className="flex items-center justify-center text-neutral-500 hover:text-white transition-colors cursor-pointer p-0.5 active:scale-90 active:text-[#2196f3]"
                 tabIndex={-1}
                 disabled={props.disabled}
              >
                 <ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
           </div>
        )}
      </div>
    );
  }
);
StyledInput.displayName = "StyledInput";

interface StyledSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const StyledSwitch = React.forwardRef<HTMLInputElement, StyledSwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <label className={cn("relative inline-block w-[60px] h-[30px]", className)}>
        <input 
            type="checkbox" 
            className="peer sr-only" 
            ref={ref}
            {...props}
        />
        <div className="w-full h-full bg-neutral-400 rounded-[20px] overflow-hidden flex items-center border-[4px] border-transparent transition-colors duration-300 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.25)] cursor-pointer peer-checked:bg-[#2196F3] peer-checked:[&>div]:translate-x-[30px] peer-checked:[&>div]:shadow-[0_0_10px_3px_rgba(0,0,0,0.25)]">
            <div className="w-full h-full bg-white rounded-[20px] shadow-[0_0_10px_3px_rgba(0,0,0,0.25)] transition-transform duration-300 -translate-x-[30px] peer-active:translate-x-0" />
        </div>
      </label>
    );
  }
);
StyledSwitch.displayName = "StyledSwitch";
