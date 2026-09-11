import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
    return (
        <section className="bg-white">
            <div className="container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8">
                <main className="flex items-center justify-center">
                    <article className="flex-[2] max-w-3xl space-y-8 flex flex-col justify-center">
                        <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
                            Encontre os melhores profissionais em um único lugar!
                        </h1>
                        <p className="text-base md:text-lg text-gray-600">
                            Nós somos uma plataforma para profissionais da saúde com foco em
                            agilizar o seu atendimento de forma simplificada e organizada.
                        </p>

                        <Button className="bg-emerald-500 hover:bg-emerald-400 w-fit px-6 font-semibold cursor-pointer">
                            Encontre uma Clínica
                        </Button>
                    </article>

                    <div className="hidden lg:block">
                        <Image
                            className="object-contain w-full h-auto"
                            src="/logo-smart-clin.svg"
                            alt="Logo SmartClin"
                            width={280}
                            height={400}
                            priority
                        />
                    </div>
                </main>
            </div>
        </section>
    )
}
