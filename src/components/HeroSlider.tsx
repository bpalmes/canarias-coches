"use client";
import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    supertitle: 'Te guiamos en la compra de tu coche',
    title: 'Consigue tu coche ideal',
    description: 'Te llevamos de la mano en la importante decisión de comprar tu coche',
    cta: 'Ver Catálogo',
    video: '/graciosamirador.mp4'
  },
  {
    id: 2,
    supertitle: 'Viaja por nuestras islas ',
    title: 'Explora con nosotros',
    description: 'Te ayudamos a elegir el coche que mas se ajusta a tu estilo de vida y necesidades',
    cta: 'Ver Ofertas',
    video: '/islas-montaña.mp4'
  },
  {
    id: 3,
    supertitle: 'La mejor experiencia',
    title: 'Para los que más te importan',
    description: 'Te ayudamos a elegir ese coche seguro familair y cómodo para los tuyos',
    cta: 'Ver Módelos',
    video: '/nieta.mp4'
  },
  {
    id: 4,
    supertitle: 'Nuestro equipo te asesora',
    title: 'Te vas con las llaves ',
    description: ' Nuestro equipo con mas de 30 años de experiencia te lleva de la mano durante el proceso de manera que solo debe preocuparse por elegir qué coches le gusta mas',
    cta: 'Echa un vistazo',
    video: '/llaves.mp4'
  },
];

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1, duration: 0.5 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideData = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
        {/* Background Videos */}
        <AnimatePresence>
        <motion.video
            key={slideData.id}
            className="absolute top-0 left-0 h-full w-full object-cover"
            src={slideData.video}
            autoPlay
            loop
            muted
            playsInline
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        />
        </AnimatePresence>
        <div className="absolute top-0 left-0 h-full w-full bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center text-white">
        <div className="container mx-auto px-6 flex justify-between items-end h-full pb-24">
            {/* Left Side: Text Content */}
            <div className="max-w-xl">
            <AnimatePresence mode="wait">
                <motion.div
                key={slideData.id}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                >
                <motion.p variants={textVariants} className="text-sm font-semibold uppercase tracking-widest text-gray-300">
                    {slideData.supertitle}
                </motion.p>
                <motion.h1 variants={textVariants} className="text-6xl md:text-8xl font-bold my-4">
                    {slideData.title}
                </motion.h1>
                <motion.p variants={textVariants} className="text-lg text-gray-200">
                    {slideData.description}
                </motion.p>
                <motion.button variants={textVariants} className="mt-8 border border-white rounded-full px-8 py-3 text-sm font-medium flex items-center gap-4 hover:bg-white hover:text-black transition-colors">
                    {slideData.cta}
                    <ArrowRight className="h-4 w-4" />
                </motion.button>
                </motion.div>
            </AnimatePresence>
            </div>

            {/* Right Side: Navigation */}
            <div className="flex flex-col items-end space-y-6">
            <div className="text-sm">
                <span>{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="text-gray-400"> / {String(slides.length).padStart(2, '0')}</span>
            </div>
            <div className="relative h-px w-32 bg-white/20">
                <motion.div 
                className="absolute top-0 left-0 h-px bg-white"
                initial={{ width: `${(1/slides.length) * 100}%`}}
                animate={{ x: `${currentSlide * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
            <div className="flex items-center gap-2">
                <button onClick={prevSlide} className="border border-white/30 rounded-full p-3 hover:bg-white/10 transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <button onClick={nextSlide} className="border border-white/30 rounded-full p-3 hover:bg-white/10 transition-colors">
                    <ArrowRight className="h-5 w-5" />
                </button>
            </div>
            </div>
        </div>
        </div>
    </section>
  );
}