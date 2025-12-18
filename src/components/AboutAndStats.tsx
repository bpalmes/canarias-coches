"use client";
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const statsData = [
    {
        value: '+25',
        title: 'AÑOS DE EXPERIENCIA',
        description: 'Más de dos décadas en el sector del automóvil en Canarias, ofreciendo confianza y un servicio excepcional.'
    },
    {
        value: '+110',
        title: 'PROFESIONALES',
        description: 'Un equipo especializado para guiarte en cada paso del proceso de compra y postventa.'
    },
    {
        value: '+1.500',
        title: 'VEHÍCULOS EN STOCK',
        description: 'Un amplio stock de las principales marcas, revisados y garantizados para asegurar su calidad y fiabilidad.'
    },
    {
        value: '4',
        title: 'ISLAS CON PRESENCIA',
        description: 'Contamos con concesionarios y centros de servicio en Gran Canaria, Tenerife, Fuerteventura y Lanzarote.'
    },
    {
        value: '100%',
        title: 'FINANCIACIÓN A MEDIDA',
        description: 'Ofrecemos opciones de financiación flexibles, incluso sin entrada, para facilitar la adquisición de tu nuevo vehículo.'
    },
    {
        value: '24/7',
        title: 'ATENCIÓN DIGITAL',
        description: 'Contacta con nosotros a través de chat, WhatsApp, email o teléfono para una comunicación directa y eficiente.'
    }
];

export default function AboutAndStats() {
    const statsRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: statsRef,
        offset: ["start end", "end center"]
    });

    const backgroundColor = useTransform(scrollYProgress, [0.3, 0.5], ["#000000", "#FFFFFF"]);
    const textColor = useTransform(scrollYProgress, [0.3, 0.5], ["#FFFFFF", "#0C689a"]);
    const descriptionColor = useTransform(scrollYProgress, [0.3, 0.5], ["#a1a1aa", "#374151"]);

    return (
        <>
            {/* Stats Section with Scroll Animation */}
            <motion.section
                ref={statsRef}
                style={{ backgroundColor }}
                className="pt-20 pb-20"
            >
                <div className="mx-auto px-6 md:px-24 max-w-[1390px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {statsData.map((stat, index) => (
                            <div key={index} className="relative pl-8 flex flex-col justify-between" style={{ minHeight: '300px' }}>
                                <div>
                                    <motion.div className="absolute top-0 left-0 h-full w-px" style={{ backgroundColor: '#0C689a' }} />
                                    <motion.p className="text-9xl font-thin tracking-tighter" style={{ color: textColor }}>{stat.value}</motion.p>
                                    <motion.p className="mt-4 text-sm font-semibold uppercase tracking-widest" style={{ color: '#0C689a' }}>{stat.title}</motion.p>
                                </div>
                                <motion.p className="text-sm max-w-xs" style={{ color: descriptionColor }}>{stat.description}</motion.p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </>
    );
}