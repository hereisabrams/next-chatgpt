import React from 'react';

const Footer = ({children}: ChildrenProps) => {
    return (
        <div className="relative h-[110px]">
            <footer className="relative max-w-4xl mx-auto px-3 lg:px-0">
                {children}
            </footer>
        </div>
    );
};

export default Footer;
