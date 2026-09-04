import React from 'react';

export default function AppLogoIcon({ className = 'h-9 w-auto', ...props }) {
    return (
        <img 
            {...props}
            src="/images/logo.svg" 
            alt="FitApply" 
            className={className} 
        />
    );
}