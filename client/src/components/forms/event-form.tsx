import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateSelector } from "./date-selector";
import type { UseFormReturn } from "react-hook-form";
import { PriceCalculator } from "@/components/price-calculator";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface EventFormProps {
  form: UseFormReturn<any>;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  fixedTime?: string;
  setFixedTime?: (time: string) => void;
  category: string;
}

const eventTypes = [
  { value: "concierto", label: "Concierto" },
  { value: "cafe-concierto", label: "Café Concierto" },
  { value: "musica-aire-libre", label: "Música al Aire Libre" },
  { value: "festival", label: "Festival" },
  { value: "taller", label: "Taller" },
  { value: "retiro", label: "Retiro" },
  { value: "danza", label: "Danza Consciente" },
  { value: "kirtan", label: "Kirtan / Mantras" },
];

export function EventForm({ form, selectedDates, setSelectedDates, fixedTime = "", setFixedTime = () => {}, category }: EventFormProps) {
  return (
    <>
      {/* Tipo de Evento */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Evento *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descripción */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción del Evento *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe el evento, artistas, actividades, qué incluye..."
                className="min-h-32"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Calculadora de Precio */}
      <div>
        <FormLabel>Precio de Entrada *</FormLabel>
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

      {/* Ubicación del Evento */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ubicación / Venue *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Centro Cultural Barranco, Lima" />
            </FormControl>
            <FormDescription>
              Dónde se realizará el evento
            </FormDescription>
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
            <FormLabel>Video Promocional (máx. 1 minuto) *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
            </FormControl>
            <FormDescription>
              Video promocional del evento (máximo 60 segundos)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fechas del Evento */}
      <div>
        <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Event Dates *</FormLabel>
        <DateSelector
          selectedDates={selectedDates}
          onDatesChange={setSelectedDates}
          category={category}
          className="mt-2"
        />
        <FormDescription className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Select the dates when the event will take place
        </FormDescription>
      </div>

      {/* Hora Fija del Evento */}
      <div>
        <FormLabel className="text-gray-900 dark:text-white transition-colors duration-300">Event Start Time *</FormLabel>
        <Card className="bg-white dark:bg-gray-800 border border-pink-300 dark:border-pink-600 rounded-2xl p-4 mt-2 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <Input
              type="time"
              value={fixedTime}
              onChange={(e) => setFixedTime(e.target.value)}
              className="flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="HH:mm"
            />
          </div>
          <p className="text-sm text-pink-800 dark:text-pink-300 mt-3 flex items-center gap-2">
            This time will be displayed as information (same time for all event dates)
          </p>
        </Card>
        <FormDescription className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Set the start time for the event (this will be the same for all dates)
        </FormDescription>
      </div>

      {/* Artistas / Facilitadores */}
      <FormField
        control={form.control}
        name="specificFields.artistas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artistas / Facilitadores</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Nombres de artistas o facilitadores (uno por línea)"
                className="min-h-20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Aforo Máximo */}
      <FormField
        control={form.control}
        name="specificFields.aforoMaximo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aforo Máximo</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="Número máximo de asistentes" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

    </>
  );
}
