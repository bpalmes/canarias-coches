"use client";
import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Home2() {
  return (
    <div className="relative w-full bg-white">
      {/* Main Banner Section */}
      <div className="relative w-full">
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/7b9d803c82427838cf2f1231db7c32c83600892d?width=3840"
          alt="Banner"
          width={3840}
          height={671}
          className="block object-cover w-full rounded-none h-[671px]"
          priority
        />
        
        {/* Logo */}
        <div className="absolute left-[297px] top-[34px] z-10 w-[155px] h-[22px]">
          <svg 
            width="156" 
            height="23" 
            viewBox="0 0 156 23" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <g clipPath="url(#clip0_4_15)">
              <path d="M0 22.0497H3.58L6.22 7.09973L10.27 22.0497H12.75L22.05 7.09973L19.42 22.0497H23L26.86 0.219727H23.03L12.38 17.3397L7.73 0.219727H3.86L0 22.0497Z" fill="white"/>
              <path d="M31.78 5.24023L28.81 22.0502H25.36L28.33 5.24023H31.78Z" fill="white"/>
              <path d="M66.11 5.76953H62.74L61.11 15.0495C60.55 17.8895 58.66 19.3695 56.23 19.3695C53.8 19.3695 52.45 17.8295 52.95 14.8495L54.55 5.77953H51.21L49.53 15.3595C48.73 19.9095 51.21 22.3095 55.03 22.3095C56.95 22.3095 58.9 21.5095 60.2 20.1495L59.87 22.0695H63.24L66.11 5.77953V5.76953Z" fill="white"/>
              <path d="M80.79 17.2098H77.15C76.32 18.4798 74.99 19.4898 72.92 19.4898C70.41 19.4898 68.72 17.8098 69.05 15.0598H81.49C81.67 14.4998 81.82 13.9698 81.9 13.4598C82.73 8.72977 80.01 5.50977 75.37 5.50977C70.73 5.50977 66.68 8.78976 65.76 13.8998C64.84 19.0098 67.74 22.3198 72.41 22.3198C76.4 22.3198 79.36 20.0398 80.77 17.2098M74.73 8.33977C77.24 8.33977 78.96 9.93977 78.54 12.6298H69.5C70.24 9.93977 72.4 8.33977 74.73 8.33977Z" fill="white"/>
              <path d="M81.57 22.0497H84.94L88.81 0.179688H85.44L81.57 22.0497Z" fill="white"/>
              <path d="M31.75 13.8C30.87 18.8 33.9 22.31 38.75 22.31C43.2 22.31 46.78 19.2 48.05 15.81L48.58 12.89H39.54L39.11 15.42H44.85C43.94 17.81 41.98 19.29 39.42 19.29C36.29 19.29 34.57 17.19 35.19 13.79C35.76 10.47 38.23 8.34 41.21 8.34C42.98 8.34 44.22 9.08 44.75 10.49H48.6C48.1 7.14 45.47 5.25 41.74 5.25C36.91 5.25 32.63 8.79 31.75 13.78" fill="white"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M29.25 0.0800781H32.72C32.52 1.24008 32.31 2.39008 32.11 3.55008H28.64C28.84 2.39008 29.05 1.24008 29.25 0.0800781Z" fill="white"/>
              <path d="M93.98 17.91H102.4L101.67 22.05H87.88L91.77 0H97.14L93.98 17.91Z" fill="white"/>
              <path d="M118.58 16.5903H113.89C113.33 17.4803 112.26 18.7103 110.31 18.7103C108.36 18.7103 106.95 17.3803 107.21 14.9603H119.18C119.33 14.4603 119.45 13.9803 119.53 13.5103C120.42 8.51031 117.55 5.32031 112.73 5.32031C107.91 5.32031 103.83 8.57031 102.92 13.8003C101.97 19.0303 104.9 22.2803 109.75 22.2803C113.86 22.2803 117.2 19.8003 118.59 16.5803M111.96 8.66031C113.72 8.64031 115.5 9.55031 115.15 12.0903H107.66C108.31 9.85031 109.87 8.68031 111.96 8.66031Z" fill="white"/>
              <path d="M124.65 14.8903C124.65 12.0603 126.44 9.03031 129.54 9.03031C131.73 9.03031 133.05 10.6503 133.05 12.7903C133.05 15.6003 131.14 18.5903 128.1 18.5903C125.92 18.5903 124.65 17.0103 124.65 14.8903ZM137.62 12.2703C137.62 8.10031 134.64 5.32031 130.32 5.32031C124.47 5.32031 120.12 9.67031 120.12 15.3703C120.12 19.5403 123.05 22.2903 127.36 22.2903C133.15 22.2903 137.62 18.0303 137.62 12.2703Z" fill="white"/>
              <path d="M148.21 22.0499H153.23L154.96 12.4099C155.76 7.97988 153.67 5.37988 149.83 5.37988C147.61 5.37988 145.66 6.35988 144.42 7.76988L144.81 5.54988H139.76L136.84 22.0399H141.89L143.5 12.9399V13.0899C143.89 10.8399 145.34 9.59988 147.29 9.59988C149.24 9.59988 150.21 10.8399 149.83 13.0899L148.22 22.0499H148.21Z" fill="white"/>
              <path d="M137.71 0.0800781H131.52L127.62 4.40008H132.31L137.71 0.0800781Z" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_4_15">
                <rect width="155.13" height="22.32" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Ver Catálogo Button */}
        <div className="absolute z-10 h-[46px] left-[871px] top-[570px] w-[178px] max-md:left-2/4 max-md:-translate-x-2/4 max-md:top-[500px] max-md:w-[150px] max-sm:text-xs max-sm:w-[120px]">
          <Button 
            variant="outline" 
            className="w-full h-full rounded-3xl border-white bg-transparent text-white hover:bg-white/10 flex items-center justify-center gap-2"
          >
            <span className="text-sm tracking-tight">Ver Catálogo</span>
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.35355 4.35355C9.54882 4.15829 9.54882 3.84171 9.35355 3.64645L6.17157 0.464466C5.97631 0.269204 5.65973 0.269204 5.46447 0.464466C5.2692 0.659728 5.2692 0.976311 5.46447 1.17157L8.29289 4L5.46447 6.82843C5.2692 7.02369 5.2692 7.34027 5.46447 7.53553C5.65973 7.7308 5.97631 7.7308 6.17157 7.53553L9.35355 4.35355ZM0 4L0 4.5H9V4V3.5H0L0 4Z" fill="white"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Últimas Ofertas Section */}
      <div className="relative mx-auto my-0 mt-0 w-full h-[830px] max-w-[1390px] z-[5] max-md:p-5 max-md:mt-0 max-md:h-auto max-md:max-w-[90%]">
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/da4b1e18005fecdf893baf1e80d2e20b0c15e062?width=748"
          alt="Car"
          width={374}
          height={374}
          className="object-cover absolute top-0 h-[374px] left-[49px] w-[374px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <div className="absolute text-5xl font-bold tracking-tighter h-[68px] left-[471px] text-blue-950 top-[179px] w-[328px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:text-4xl max-md:text-center max-sm:text-3xl">
          Últimas Ofertas
        </div>
        
        <div className="absolute text-base h-[57px] left-[471px] text-neutral-600 top-[253px] w-[646px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-8 max-md:w-full max-md:text-center max-sm:text-sm">
          <div>Encuentra <span className="font-bold">promociones activas</span> por tiempo limitado en todas nuestras islas. Elige la campaña que más se adapte a tus necesidades.</div>
        </div>
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/435fd91664d1b860a8315916e33b25f8813a14a2?width=896"
          alt="Promoción 1"
          width={448}
          height={448}
          className="object-cover absolute left-0 border border-solid border-zinc-200 h-[448px] rounded-[40px] top-[381px] w-[448px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/5ef9bfa6d543bfef2035160982b32518b3d7752d?width=896"
          alt="Promoción 2"
          width={448}
          height={449}
          className="object-cover absolute border border-solid border-zinc-200 h-[449px] left-[471px] rounded-[40px] top-[381px] w-[448px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/1db054ea4ad87ce5e508ad63fd3d2857d343878f?width=898"
          alt="Promoción 3"
          width={449}
          height={449}
          className="object-cover absolute h-[449px] left-[941px] rounded-[40px] top-[381px] w-[449px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
      </div>

      {/* Formas de empezar a buscar Section */}
      <div className="relative mx-auto my-0 mt-10 w-full h-[427px] max-w-[1390px] max-md:p-5 max-md:h-auto max-md:max-w-[90%]">
        <div className="absolute top-0 left-0 h-14 text-4xl font-bold tracking-tighter text-blue-950 w-[518px] max-md:w-full max-md:text-3xl max-md:text-center max-sm:text-2xl">
          Formas de empezar a buscar
        </div>
        
        <div className="flex absolute left-0 gap-8 top-[95px] max-md:relative max-md:flex-wrap max-md:gap-5 max-md:justify-center max-md:top-[60px] max-sm:text-sm">
          <div className="text-base font-bold text-blue-700 h-[19px] w-[55px]">
            Popular
          </div>
          <div className="ml-12 text-base font-bold h-[19px] text-neutral-600 w-[120px]">
            Explorar por tipo
          </div>
          <div className="ml-7 text-base font-bold h-[19px] text-neutral-600 w-[135px]">
            Explorar por marca
          </div>
          <div className="ml-8 text-base font-bold h-[19px] text-neutral-600 w-[59px]">
            Reseñas
          </div>
        </div>
        
        <div className="absolute left-0 top-32 w-full h-px bg-zinc-200" />
        <div className="absolute left-0 h-px bg-blue-700 top-[127px] w-[91px]" />
        
        <div className="flex absolute left-0 gap-28 top-[155px] max-md:relative max-md:flex-col max-md:gap-8 max-md:top-[120px]">
          <div className="text-base leading-10 h-[205px] text-neutral-600 w-[166px] max-sm:text-sm max-sm:leading-9">
            <div>Acura MDX</div>
            <div>BMW M3</div>
            <div>BMW X6</div>
            <div>Chevrolet Colorado</div>
            <div>Chevrolet Equinox</div>
          </div>
          <div className="text-base leading-10 h-[205px] text-neutral-600 w-[166px] max-sm:text-sm max-sm:leading-9">
            <div>Dodge Journey</div>
            <div>Vehículos eléctricos</div>
            <div>Ford Escape</div>
            <div>Ford Expedition</div>
            <div>Ford Explorer</div>
          </div>
          <div className="text-base leading-10 h-[205px] text-neutral-600 w-[166px] max-sm:text-sm max-sm:leading-9">
            <div>Hyundai Santa Fe</div>
            <div>Infiniti Q50</div>
            <div>Nissan Qashqai</div>
            <div>Kia Stonic</div>
            <div>Fiat 500</div>
          </div>
          <div className="text-base leading-10 h-[205px] text-neutral-600 w-[166px] max-sm:text-sm max-sm:leading-9">
            <div>Dodge Journey</div>
            <div>Vehículos eléctricos</div>
            <div>Ford Escape</div>
            <div>Ford Expedition</div>
            <div>Ford Explorer</div>
          </div>
          <div className="text-base leading-10 h-[205px] text-neutral-600 w-[166px] max-sm:text-sm max-sm:leading-9">
            <div>Acura MDX</div>
            <div>BMW M3</div>
            <div>BMW X6</div>
            <div>Chevrolet Colorado</div>
            <div>Chevrolet Equinox</div>
          </div>
        </div>
        
        <div className="absolute left-0 w-full h-[46px] top-[381px]">
          <Button 
            variant="outline" 
            className="w-full h-full rounded-3xl border-zinc-200 bg-transparent text-neutral-500 hover:bg-zinc-50 flex items-center justify-center gap-2"
          >
            <span className="text-base font-bold">Ver más</span>
            <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[14px] h-[14px] transform rotate-90">
              <path d="M3.64645 14.3536C3.84171 14.5488 4.15829 14.5488 4.35355 14.3536L7.53553 11.1716C7.7308 10.9763 7.7308 10.6597 7.53553 10.4645C7.34027 10.2692 7.02369 10.2692 6.82843 10.4645L4 13.2929L1.17157 10.4645C0.97631 10.2692 0.659728 10.2692 0.464466 10.4645C0.269203 10.6597 0.269203 10.9763 0.464466 11.1716L3.64645 14.3536ZM4 0L3.5 -2.18557e-08L3.5 14L4 14L4.5 14L4.5 2.18557e-08L4 0Z" fill="#7D7A7A"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Trust Score Section */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/be3973ade3f31e5a2898f54871f18862a13d10a4?width=2780"
        alt="Puntuación de confianza"
        width={1390}
        height={344}
        className="block object-cover mx-auto my-0 w-full h-[344px] max-w-[1390px]"
      />

      {/* Entregas que Apasionan Section */}
      <div className="relative mx-auto my-0 mt-10 w-full h-[858px] max-w-[1491px] max-md:p-5 max-md:h-auto max-md:max-w-[90%]">
        <div className="absolute left-0 w-full bg-white border border-solid border-zinc-200 h-[722px] rounded-[40px] top-[136px]" />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/2be9ae493b7b24ce8d35c8507f8bd515ebbd5f47?width=800"
          alt="Keys"
          width={400}
          height={400}
          className="object-cover absolute top-0 h-[400px] left-[86px] w-[400px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <div className="absolute text-4xl font-bold tracking-tighter h-[62px] left-[520px] text-blue-950 top-[186px] w-[477px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:text-3xl max-md:text-center max-sm:text-3xl">
          Entregas que Apasionan
        </div>
        
        <div className="absolute text-base h-[54px] left-[520px] text-neutral-600 top-[258px] w-[528px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-8 max-md:w-full max-md:text-center max-sm:text-sm">
          <div>Encuentra <span className="font-bold">promociones activas</span> por tiempo limitado en todas nuestras islas. Elige la campaña que más se adapte a tus necesidades.</div>
        </div>
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/db02cc3f39492c16b8152a70de09617923061842?width=664"
          alt="Gallery 1"
          width={332}
          height={342}
          className="object-cover absolute h-[342px] left-[51px] rounded-[40px] top-[390px] w-[332px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/fef8f873c114c88ada8abbcb1f22664d908bfe30?width=662"
          alt="Gallery 2"
          width={331}
          height={343}
          className="object-cover absolute h-[343px] left-[404px] rounded-[40px] top-[390px] w-[331px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/2f23ebd3f03bc9a47a551dfd6d6654061f582490?width=664"
          alt="Gallery 3"
          width={332}
          height={342}
          className="object-cover absolute h-[342px] left-[756px] rounded-[40px] top-[390px] w-[332px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/cd240acc4e249e50d922b1abe28e0344e979d543?width=664"
          alt="Gallery 4"
          width={332}
          height={342}
          className="object-cover absolute h-[342px] left-[1109px] rounded-[40px] top-[391px] w-[332px] max-md:relative max-md:top-0 max-md:left-0 max-md:mb-5 max-md:w-full max-md:h-auto"
        />
        
        {/* Navigation Arrows */}
        <div className="absolute left-[686px] top-[773px] flex gap-4 items-center">
          <button className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-50">
            <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.646446 3.64645C0.451185 3.84171 0.451185 4.15829 0.646446 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646446 3.64645ZM19 4V3.5L1 3.5V4V4.5L19 4.5V4Z" fill="#9A9A9A"/>
            </svg>
          </button>
          <button className="w-12 h-12 rounded-full border border-zinc-300 flex items-center justify-center hover:bg-zinc-50">
            <svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.3536 4.35355C18.5488 4.15829 18.5488 3.84171 18.3536 3.64645L15.1716 0.464467C14.9763 0.269205 14.6597 0.269205 14.4645 0.464467C14.2692 0.65973 14.2692 0.976312 14.4645 1.17157L17.2929 4L14.4645 6.82843C14.2692 7.02369 14.2692 7.34027 14.4645 7.53554C14.6597 7.7308 14.9763 7.7308 15.1716 7.53554L18.3536 4.35355ZM0 4L-4.37114e-08 4.5L18 4.5L18 4L18 3.5L4.37114e-08 3.5L0 4Z" fill="#9A9A9A"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Background Image */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/d370dea56a213a08239c0a263a1cbc9bc511299e?width=3840"
        alt="Background"
        width={3840}
        height={1488}
        className="block object-cover w-full h-[1488px]"
      />

      {/* Footer */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/fbb40b879bcd28a2a10dfc76677006dfc0d79f17?width=3850"
        alt="Footer"
        width={3850}
        height={572}
        className="block object-cover w-full h-[572px]"
      />
    </div>
  );
}

export default Home2;
