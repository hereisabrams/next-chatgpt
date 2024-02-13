import React from 'react';

const Footer = ({children}: ChildrenProps) => {
    return (
        <div style={{marginTop:"auto"}} className="relative h-[20%]">
            <footer style={{marginTop:"auto"}} className="relative max-w-4xl mx-auto px-3 lg:px-0">
                {children}
            </footer>
        </div>
    );
};

export default Footer;
