import React, { useState, useEffect } from 'react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  accentColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeyp-qa-L1d3MZTsBn8oHmCUkHI_JQ9xt4sNOy2_GXOSe_7C5_VDmQ8XDWX0U7FJ2zM9_VQVZCK5czDvGmR9Dg3VaLT51O2xUEsiAIW32YLNrbvkyso7xuz_Oa26YD-9UOBJLNa-A0Sd2dZy001UogrjTW0T9kYtbX28-LHQnlWitq_aegYfNuhHhOBVeTEBUTHr7GidptRVplaF5cQqT3Od6_oAcMq9doAoGodj0ldkhm62Ki0OSRfF5pUKdDqAzIXFQvTsPT0A0',
    title: "RENUEVA TU DESCANSO",
    subtitle: "Descubre la nueva colección de otoño con hasta 40% de descuento.",
    ctaText: "VER COLECCIÓN",
    ctaLink: "cabeceros",
    accentColor: "#8DA826" // Brand Lime
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505693416388-b034680970bf?q=80&w=2069&auto=format&fit=crop',
    title: "CONFORT ABSOLUTO",
    subtitle: "Colchones premium diseñados para los sueños más exigentes.",
    ctaText: "COMPRAR AHORA",
    ctaLink: "colchones",
    accentColor: "#004945" // Brand Teal
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop',
    title: "DISEÑO Y ELEGANCIA",
    subtitle: "Transforma tu salón con nuestra línea exclusiva de sofás.",
    ctaText: "DESCUBRIR",
    ctaLink: "sofas",
    accentColor: "#8DA826" // Brand Lime
  }
];

interface HeroSliderProps {
  onCtaClick: (link: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onCtaClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[550px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms]"
            style={{ 
              backgroundImage: `url('${slide.image}')`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16 lg:px-24 max-w-5xl">
             <div className={`transition-all duration-700 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-lg drop-shadow-md">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => onCtaClick(slide.ctaLink)}
                  style={{ backgroundColor: slide.accentColor }}
                  className="px-8 py-3 text-white font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg"
                >
                  {slide.ctaText}
                </button>
             </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1 transition-all duration-300 rounded-none
              ${index === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};