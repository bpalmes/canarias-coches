"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
    LogOut,
    User,
    LayoutDashboard,
    Globe,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

function useClickOutside(ref: any, handler: () => void) {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler();
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

export default function AdminHeader() {
    const { data: session } = useSession();

    const [isWebOpen, setIsWebOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);

    const webRef = useRef(null);
    const userRef = useRef(null);

    useClickOutside(webRef, () => setIsWebOpen(false));
    useClickOutside(userRef, () => setIsUserOpen(false));

    const publicLinks = [
        { name: "Inicio", href: "/" },
        { name: "Coches", href: "/buscador" },
        { name: "Ofertas", href: "/ofertas" },
        { name: "Contacto", href: "/contact" },
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10 shrink-0">

            {/* Left: Public Navigation Shortcut */}
            <div className="flex items-center space-x-4">
                <div className="relative" ref={webRef}>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setIsWebOpen(!isWebOpen)}
                    >
                        <Globe className="h-5 w-5" />
                        <span>Ir a la Web</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>

                    {isWebOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400">Páginas Públicas</div>
                            <div className="border-b border-gray-100 mb-1"></div>
                            {publicLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsWebOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Link href="/admin" className="text-gray-500 hover:text-gray-900 text-sm hidden md:block">
                    / Dashboard
                </Link>
            </div>

            {/* Right: User Menu */}
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden md:inline-block">
                    {session?.user?.name || session?.user?.email}
                </span>

                <div className="relative" ref={userRef}>
                    <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full bg-gray-100 ring-1 ring-gray-900/10 hover:bg-gray-200 flex items-center justify-center p-0"
                        onClick={() => setIsUserOpen(!isUserOpen)}
                    >
                        <User className="h-6 w-6 text-gray-600" />
                    </Button>

                    {isUserOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400">Mi Cuenta</div>
                            <div className="border-b border-gray-100 mb-1"></div>

                            <Link
                                href="/admin/profile"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 bg-white w-full text-left"
                                onClick={() => setIsUserOpen(false)}
                            >
                                <User className="mr-2 h-4 w-4" />
                                <span>Perfil</span>
                            </Link>

                            <Link
                                href="/admin"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 bg-white w-full text-left"
                                onClick={() => setIsUserOpen(false)}
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Volver al Panel</span>
                            </Link>

                            <div className="border-t border-gray-100 my-1"></div>

                            <button
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                onClick={() => signOut({ callbackUrl: '/login' })}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
