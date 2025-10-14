import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CountryCode = "PE" | "MX";

interface CountryContextType {
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() => {
    // Initialize from localStorage or default to Mexico
    const saved = localStorage.getItem("selectedCountry");
    return (saved === "MX" || saved === "PE") ? saved : "MX";
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem("selectedCountry", selectedCountry);
  }, [selectedCountry]);

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}
