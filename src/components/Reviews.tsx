"use client";
import React, { useState, useEffect } from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    name: "ROMNY D.LOAIZA",
    date: "Hace 2 meses",
    review:
      "La experiencia de la compra del coche genial. En todo momento fui acompañado desde la venta hasta la entrega del coche todo el personal muy amable y todo muy correcto me explicaron todo muy bien .. a pesar que fue todo por teléfono el coche está fenomenal . Muchas gracias los recomiendo 100%",
  },
  {
    name: "mencey luis rodriguez ramirez",
    date: "Hace 9 meses",
    review:
      "Llevo tiempo buscando un concesionario que ofrezca no solo una amplia variedad de vehículos, sino también un servicio profesional y cercano. En Miguel León he encontrado exactamente eso.",
  },
  {
    name: "Jose Carlos",
    date: "Hace 2 meses",
    review:
      "En mi caso contacte con la empresa Miguel Leon para vender mi coche. Mi experiencia ha sido extraordinaria, tasación en pocas horas y una vez aceptada los trámites muy sencillos.",
  },
  {
    name: "Gema Pérez Díaz",
    date: "Hace 2 meses",
    review:
      "Tuve una excelente experiencia en Miguel Leon Las Palmas. Desde el primer momento, el trato fue profesional, amable y sin presiones. Me ayudaron a encontrar el vehículo ideal para mis necesidades, explicándome cada detalle con claridad.",
  },
  {
    name: "Antonio Aridany González Negrín",
    date: "Hace 2 meses",
    review:
      "Acabo de comprar un coche nuevo y entregar el mío anterior en Miguel León, y no puedo estar más satisfecho con todo el proceso. Desde el primer momento, la profesionalidad, cercanía y empatía del equipo ha sido ejemplar.",
  },
  {
    name: "Rosadelia",
    date: "Hace 3 meses",
    review:
      "Hemos ido a Miguel león por mirar, y al final hemos comprado un coche",
  },
  {
    name: "Fernando",
    date: "Hace 3 semanas",
    review:
      "Profesionales, serios y atentos. Fui atendido por Mariám y por Daniel y todo fue fantástico. Más que recomendable. La entrega la hizo Juan María y todo fue estupendo. Sin duda, un acierto.",
  },
  {
    name: "Ramiro Meza",
    date: "Hace un año",
    review:
      "Excelente experiencia desde el minuto 1, tanto online por WhatsApp con el Sr. Guillermo, en la oficina con el Sr Juan María y trato cercano del Sr Miguel León. Super bien y profesional de parte de todos .",
  },
  {
    name: "Alexander Rodriguez",
    date: "Hace un año",
    review:
      "Recibiendo mi coche. Cómo siempre, el equipo de Miguel León Las Palmas muy profesional. Muy claros con el proceso de venta del vehículo, con información detallada y con un trato excepcional.",
  },
  {
    name: "Kilian fleitas",
    date: "Hace 2 meses",
    review:
      "Mi experiencia fue muy positiva de principio a fin. Desde el momento en que llegué, el personal fue amable, atento y sin presiones. Me recibieron con una sonrisa y estuvieron dispuestos a responder todas mis preguntas, tanto sobre los modelos nuevos como los de segunda mano.",
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 3000); // Wait 3 seconds before showing the next review
      return () => clearTimeout(timer);
    }
  }, [animationComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-10">
        Nuestros clientes opinan
      </h2>
      <div className="w-full max-w-4xl text-center h-80 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TextGenerateEffect
              words={reviews[currentIndex].review}
              onAnimationComplete={() => setAnimationComplete(true)}
            />
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {animationComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <div className="flex justify-center items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.91l6.572-.955L10 1l2.939 5.955 6.572.955-4.756 3.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="font-semibold">{reviews[currentIndex].name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Reviews;