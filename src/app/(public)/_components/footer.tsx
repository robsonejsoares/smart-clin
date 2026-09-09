import { Professionals } from "./professionals";

export function Footer() {
    return (
        <footer className="py-6 text-center text-gray-500 text-sm md:text-base bg-emerald-50">
            <p>
                Todos os direitos reservados © {new Date().getFullYear()} -{" "}
                <a
                    href="https://www.linkedin.com/in/robson-soares-b22513170/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-emerald-700 font-medium"
                >
                    @oProgramadorAutonomo
                </a>
            </p>
        </footer>
    )
}