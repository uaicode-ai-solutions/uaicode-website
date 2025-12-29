import React from "react";
import { usePhoneInput, defaultCountries, parseCountry, FlagImage, CountryIso2 } from "react-international-phone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-international-phone/style.css";

export interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: CountryIso2;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Phone number",
  defaultCountry = "us",
  className,
}) => {
  const [open, setOpen] = React.useState(false);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry,
    value,
    countries: defaultCountries,
    disableDialCodeAndPrefix: true,
    disableDialCodePrefill: true,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  return (
    <div className={cn("flex gap-2", className)}>
      {/* Country Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[140px] justify-between bg-background"
            disabled={disabled}
          >
            <div className="flex items-center gap-2">
              <FlagImage iso2={country.iso2} className="w-5 h-3" />
              <span className="text-sm">+{country.dialCode}</span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {defaultCountries.map((c) => {
                  const countryData = parseCountry(c);
                  return (
                    <CommandItem
                      key={countryData.iso2}
                      value={`${countryData.name} ${countryData.dialCode}`}
                      onSelect={() => {
                        setCountry(countryData.iso2);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          country.iso2 === countryData.iso2 ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <FlagImage iso2={countryData.iso2} className="w-5 h-3 mr-2" />
                      <span className="flex-1">{countryData.name}</span>
                      <span className="text-muted-foreground">+{countryData.dialCode}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Phone Number Input - apenas o número formatado, sem código do país */}
      <Input
        ref={inputRef}
        type="tel"
        value={inputValue}
        onChange={handlePhoneValueChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-background"
      />
    </div>
  );
};
