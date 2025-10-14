import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VideoUploadField } from "./video-upload-field";
import { DateSelector } from "./date-selector";
import { TimeSelector } from "./time-selector";
import { ceremonyTypes } from "@shared/schema";
import { PriceCalculator } from "@/components/price-calculator";
import { AutoTranslator } from "@/components/auto-translator";

interface TimeSlot {
  date: string;
  times: string[];
}

interface CeremonyFormProps {
  form: UseFormReturn<any>;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  selectedTimes?: TimeSlot[];
  setSelectedTimes?: (times: TimeSlot[]) => void;
  category: string;
}

export function CeremonyForm({ form, selectedDates, setSelectedDates, selectedTimes = [], setSelectedTimes = () => {}, category }: CeremonyFormProps) {
  const isTerapias = category === 'terapias';
  
  return (
    <>
      {/* Ceremony Type */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ceremony Type *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ceremonyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Type of medicine or ceremony you offer
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Escribe en español - Se auto-traducirá al inglés antes de publicar"
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price Calculator */}
      <div>
        <FormLabel>Price *</FormLabel>
        <PriceCalculator
          value={form.watch("basePrice") || ""}
          onChange={(basePrice, finalPrice, platformFee) => {
            form.setValue("basePrice", basePrice);
            form.setValue("price", finalPrice);
            form.setValue("platformFee", platformFee);
          }}
          currency={form.watch("currency") || "USD"}
        />
      </div>

      {/* Duration */}
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: 3 días, 2 noches (se traducirá automáticamente)" />
            </FormControl>
            <FormDescription>
              How long the ceremony lasts
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Location */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Valle Sagrado, Cusco, Perú (se traducirá)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Video URL */}
      <FormField
        control={form.control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Explanatory Video (max. 1 minute) *</FormLabel>
            <FormControl>
              <VideoUploadField
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="https://www.youtube.com/watch?v=..."
                description="Add a YouTube link or upload a video (max 60 seconds)"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Available Dates */}
      <div>
        <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Available Dates *</FormLabel>
        <DateSelector
          selectedDates={selectedDates}
          onDatesChange={setSelectedDates}
          category={category}
          className="mt-2"
        />
        <FormDescription className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Select the dates when you will hold this {category === 'ceremonias' ? 'ceremony' : category === 'terapias' ? 'therapy' : 'service'}
        </FormDescription>
      </div>

      {/* Time Selector - Solo para terapias */}
      {isTerapias && (
        <div>
          <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Time Slots (Optional)</FormLabel>
          <TimeSelector
            selectedDates={selectedDates}
            selectedTimes={selectedTimes}
            onTimesChange={setSelectedTimes}
            className="mt-2"
          />
          <FormDescription className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Add time slots for each date. If you add only one time, it will be informative. Multiple times will let users choose.
          </FormDescription>
        </div>
      )}

      {/* Auto Translator */}
      <div className="pt-6 border-t">
        <AutoTranslator
          spanishTitle={form.watch("title") || ""}
          spanishDescription={form.watch("description") || ""}
          spanishLocation={form.watch("location")}
          spanishDuration={form.watch("duration")}
          onTranslationComplete={(translations) => {
            form.setValue("title", translations.title);
            form.setValue("description", translations.description);
            if (translations.location) form.setValue("location", translations.location);
            if (translations.duration) form.setValue("duration", translations.duration);
          }}
        />
      </div>

    </>
  );
}
