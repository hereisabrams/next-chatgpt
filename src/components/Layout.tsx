import React from 'react';
import Head from 'next/head'
import Sidebar from "@/components/Sidebar";

type LayoutProps = {
    children: React.ReactNode;
    title: string;
}

const Layout = ({children, title}: LayoutProps) => {
    title = `Assistente Medida Cheque-Formação + Digital - ${title}`
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="ChatGPT application built with OpenAI API, Next.js, TypeScript, and TailwindCSS." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <Sidebar /> */}

            <main className="md:pt-0 md:pl-0 flex flex-col flex-1">
                {/* <div className="flex-1"> */}
                    <div className="flex flex-col flex-1 h-full">
                        {children}
                    </div>
                {/* </div> */}
            </main>
        </>
    );
};

export default Layout;
