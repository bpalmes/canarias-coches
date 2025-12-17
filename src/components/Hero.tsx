"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative bg-white overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <div
                    className="w-full h-full bg-gradient-to-b from-[#0f286a] to-blue-500"
                    style={{
                        clipPath: "ellipse(120% 100% at 50% 0%)",
                        height: "400px",
                    }}
                />
            </div>
            <div className="relative z-10 text-white pt-12 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-12">
                        {"Le ayudamos a encontrar su coche"}
                    </h1>
                    {/* Search Bar */}
                    <div className="relative mb-8 max-w-2xl mx-auto">
                        <div className="flex items-center bg-white rounded-full px-6 py-4 shadow-lg">
                            <Search className="w-5 h-5 text-gray-400 mr-4" />
                            <Input
                                placeholder="Busque por cuota, marca, modelo, precio, etc"
                                className="flex-1 border-none bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 text-base"
                            />
                        </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-500 px-6 py-2 rounded-full font-medium"> Cuota más baja </Button>
                        <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-500 px-6 py-2 rounded-full font-medium"> Ofertas </Button>
                        <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-500 px-6 py-2 rounded-full font-medium"> Marcas </Button>
                    </div>
                    {/* Recently Viewed */}
                    <div className="text-sm">
                        <span className="text-blue-100 mr-4">Ultimas Ofertas</span>
                        <a href="#" className="underline hover:no-underline"> 2021 Ram 1500 </a>
                    </div>
                </div>
            </div>
        </section>
    );
} 