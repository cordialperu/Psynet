import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { ceremonyTypes, type Category } from "@shared/schema";
import type { UseFormReturn } from "react-hook-form";

interface CategoryFormFieldsProps {
  category: Category;
  form: UseFormReturn<any>;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
}

export function CategoryFormFields({ category, form, selectedDates, setSelectedDates }: CategoryFormFieldsProps) {
  
  // Campos para CEREMONIAS
  if (category === "ceremonias") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Ceremonia</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ceremonyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 3 días, 2 noches" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Cusco, Perú" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Fechas Disponibles</FormLabel>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="rounded-md border"
          />
          <FormDescription>
            Selecciona las fechas en las que realizarás esta ceremonia
          </FormDescription>
        </div>
      </>
    );
  }

  // Campos para TERAPIAS
  if (category === "terapias") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Terapia</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Terapia Holística, Reiki, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultorio / Ubicación</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dirección del consultorio" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="googleMapsUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link de Google Maps</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://maps.google.com/..." />
              </FormControl>
              <FormDescription>
                Los usuarios podrán ver tu ubicación en el mapa
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración de la Sesión</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 1 hora, 90 minutos" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Fechas/Horarios Disponibles</FormLabel>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="rounded-md border"
          />
        </div>
      </>
    );
  }

  // Campos para MICRODOSIS
  if (category === "microdosis") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Microdosis</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Psilocibina, LSD, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración del Tratamiento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: 30 días, 3 meses" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inventory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Disponible</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder="Cantidad disponible" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Opciones de Entrega</FormLabel>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Envío a domicilio</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Recojo en punto</span>
            </label>
          </div>
        </div>
      </>
    );
  }

  // Campos para MEDICINA
  if (category === "medicina") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Medicina</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Rapé, Sananga, Kambo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inventory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Disponible</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder="Cantidad disponible" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Opciones de Entrega</FormLabel>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Envío a domicilio</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Recojo en punto</span>
            </label>
          </div>
        </div>
      </>
    );
  }

  // Campos para EVENTOS
  if (category === "eventos") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="concierto">Concierto</SelectItem>
                  <SelectItem value="cafe-concierto">Café Concierto</SelectItem>
                  <SelectItem value="musica-aire-libre">Música al Aire Libre</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="taller">Taller</SelectItem>
                  <SelectItem value="retiro">Retiro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación del Evento</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dirección o lugar" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Fechas del Evento</FormLabel>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            className="rounded-md border"
          />
        </div>
      </>
    );
  }

  // Campos para PRODUCTOS
  if (category === "productos") {
    return (
      <>
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Producto</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ej: Artesanía, Libro, Instrumento" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inventory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Disponible</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  placeholder="Cantidad disponible" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Opciones de Entrega</FormLabel>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Envío a domicilio</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-sm">Recojo en punto</span>
            </label>
          </div>
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Punto de Recojo (opcional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dirección para recojo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return null;
}
