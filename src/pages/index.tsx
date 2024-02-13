import Layout from "@/components/Layout";
import TemplateCard from "@/components/home/TemplateCard";
import {templateCards} from "@/data/templateCards";
import router from "next/router";
import { useEffect } from "react";

export default function Home() {

    useEffect(() => {
        router.push('/chat');
    }, []);

  return (
    <Layout title="Home">
        <div className="w-full h-full flex flex-col items-center justify-center px-4 lg:px-32">
            <h1 className="text-3xl font-bold">Bem-vindo!</h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 mt-8">
                {/* {templateCards.map((card, index) => (
                    <TemplateCard
                        key={index}
                        href={card.href}
                        title={card.title}
                        description={card.description}
                    />
                ))} */}
            </div>
        </div>
    </Layout>
  )
}
