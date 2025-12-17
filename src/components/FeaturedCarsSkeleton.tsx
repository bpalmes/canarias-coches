import React from 'react';

const FeaturedCarsSkeleton = () => {
    return (
        <section className="bg-gray-100 py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="text-center md:text-left mb-16">
                    <div className="h-16 bg-gray-300 rounded-md w-1/3 mx-auto md:mx-0"></div>
                    <div className="mt-4 md:flex md:items-baseline md:justify-between">
                        <div className="h-6 bg-gray-300 rounded-md w-2/3 mx-auto md:mx-0"></div>
                        <div className="h-6 bg-gray-300 rounded-md w-1/2 mx-auto md:mx-0 mt-4 md:mt-0"></div>
                    </div>
                </div>

                <div className="relative h-[600px] w-full bg-gray-300 rounded-2xl">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
                        Cargando coches...
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCarsSkeleton;
