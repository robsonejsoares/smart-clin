import { Footer } from "./_components/footer"
import { Header } from "./_components/header"
import { Hero } from "./_components/hero"
import { Professionals } from "./_components/professionals"

export default function Home() {
    return (<div className="flex min-h-screen flex-col bg-background"> <Header />

        <main className="flex-1">
            <Hero />
            <Professionals />
        </main>

        <Footer />
    </div>
    )
}
