import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import { PriceCalculator } from "@/components/price-calculator";

interface MedicinaFormProps {
  form: UseFormReturn<any>;
}

export function MedicinaForm({ form }: MedicinaFormProps) {

  return (
    <>
      {/* Tipo de Medicina */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Medicina *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Rapé, Sananga, Palo Santo, Cacao Ceremonial" />
            </FormControl>
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
            <FormLabel>Descripción *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe la medicina, sus propiedades, beneficios, componentes naturales, cómo se usa..."
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
        <FormLabel>Precio *</FormLabel>
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

      {/* Componentes / Ingredientes */}
      <FormField
        control={form.control}
        name="specificFields.componentes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Componentes Naturales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Lista los ingredientes o componentes (uno por línea)"
                className="min-h-20"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Ingredientes naturales que componen la medicina
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Beneficios / Usos Medicinales */}
      <FormField
        control={form.control}
        name="specificFields.beneficios"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Beneficios y Usos Medicinales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Qué cura, para qué sirve, beneficios terapéuticos..."
                className="min-h-20"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stock / Inventario */}
      <FormField
        control={form.control}
        name="inventory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stock Disponible *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="Cantidad disponible" 
              />
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
            <FormLabel>Video de la Medicina (máx. 1 minuto) *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
            </FormControl>
            <FormDescription>
              Video mostrando la medicina y explicando su uso (máximo 60 segundos)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dirección de Envío */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección de Origen (para envío)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ciudad o región desde donde envías" />
            </FormControl>
            <FormDescription>
              Los usuarios contactarán al administrador para coordinar el envío
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
