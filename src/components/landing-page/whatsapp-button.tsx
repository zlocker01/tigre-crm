"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { branding, buildWhatsAppUrl } from "@/config/branding";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleWhatsAppClick = () => {
    window.open(buildWhatsAppUrl(), "_blank");
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0",
      )}
    >
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 max-w-xs animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">¿Necesitas ayuda?</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleOpen}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Contactanos por WhatsApp para agendar tu clase o resolver cualquier
            duda.
          </p>
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Chatear por WhatsApp
          </Button>
        </div>
      )}

      <Button
        onClick={isOpen ? handleWhatsAppClick : toggleOpen}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center",
          isOpen
            ? "bg-green-500 hover:bg-green-600"
            : "bg-[#25D366] hover:bg-[#128C7E] text-white",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          viewBox="0 0 16 16"
          className="text-white"
        >
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
        <span className="sr-only">{`WhatsApp ${branding.appName}`}</span>
      </Button>
    </div>
  );
}
