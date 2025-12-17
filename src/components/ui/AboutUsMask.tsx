"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AboutUsTextContent = ({ onTextEnter, onTextLeave, isRevealed }: { onTextEnter: () => void, onTextLeave: () => void, isRevealed: boolean }) => {
    
    const Highlight = ({ children }: { children: React.ReactNode }) => (
        <span style={{ 
            color: isRevealed ? '#0f286a' : 'inherit',
            fontWeight: isRevealed ? 'bold' : 'normal',
            transition: 'color 0.3s, font-weight 0.3s'
        }}>
            {children}
        </span>
    );

    return (
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className={`text-3xl font-bold tracking-tight ${!isRevealed ? 'text-white' : 'text-black'}`}>
                    <span className="text-lg font-semibold" style={{ color: '#0f286a' }}>01</span>
                    <span className="ml-4" style={{ color: '#0f286a' }}>Sobre Nosotros</span>
                </h2>
            </div>
            <div className="md:col-span-2">
                <p 
                    onMouseEnter={onTextEnter}
                    onMouseLeave={onTextLeave}
                    className={`text-3xl leading-relaxed ${isRevealed ? 'text-black' : 'text-gray-200'}`}
                >
                    En <Highlight>Miguel León</Highlight>, una empresa canaria con más de 25 años de experiencia en el sector del automóvil en <Highlight>Canarias</Highlight>, combinamos la atención personalizada con la innovación digital para ofrecer a nuestros clientes una experiencia de compra y venta de vehículos ágil y eficiente. Contamos con concesionarios y centros de servicio en <Highlight>Gran Canaria</Highlight>, <Highlight>Tenerife</Highlight>, <Highlight>Fuerteventura</Highlight> y <Highlight>Lanzarote</Highlight>, facilitando operaciones tanto entre islas como con la <Highlight>Península</Highlight>.
                </p>
                <button className={`mt-12 border rounded-full px-8 py-3 text-sm font-medium flex items-center gap-4 transition-colors ${isRevealed ? 'border-black hover:bg-black hover:text-white' : 'border-white hover:bg-white hover:text-black'}`}>
                    Ver más
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};


export const AboutUsMask = () => {
    const [isHoveringText, setIsHoveringText] = useState(false);
    const [mousePosition, setMousePosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const maskSize = isHoveringText ? 400 : 30;

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="bg-black text-white py-24 sm:py-32 relative"
        >
            <motion.div
                className="absolute inset-0"
                style={{
                    maskImage: 'url(/mask.svg)',
                    maskRepeat: 'no-repeat',
                    WebkitMaskImage: 'url(/mask.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                }}
                animate={{
                    maskSize: `${maskSize}px`,
                    maskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2}px`,
                }}
                transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
            >
                <div className="bg-white py-24 sm:py-32 h-full">
                    <AboutUsTextContent 
                        onTextEnter={() => setIsHoveringText(true)} 
                        onTextLeave={() => setIsHoveringText(false)}
                        isRevealed={true} 
                    />
                </div>
            </motion.div>

            <div className="h-full">
                <AboutUsTextContent 
                    onTextEnter={() => setIsHoveringText(true)} 
                    onTextLeave={() => setIsHoveringText(false)}
                    isRevealed={false} 
                />
            </div>
        </section>
    );
};