import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export type CountryCode = "PE" | "MX";

interface Country {
  code: CountryCode;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
];

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const currentCountry = countries.find((c) => c.code === selectedCountry) || countries[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="text-lg leading-none">{currentCountry.flag}</span>
          <span className="text-xs font-medium hidden sm:inline">{currentCountry.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {countries.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => onCountryChange(country.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm">{country.name}</span>
            </div>
            {selectedCountry === country.code && (
              <Check className="h-4 w-4 text-emerald-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
