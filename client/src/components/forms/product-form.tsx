import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import { PriceCalculator } from "@/components/price-calculator";
import { AutoTranslator } from "@/components/auto-translator";

interface ProductFormProps {
  form: UseFormReturn<any>;
}

export function ProductForm({ form }: ProductFormProps) {

  return (
    <>
      {/* Product Type */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Type *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Artesanía, Libro, Instrumento (se traducirá)" />
            </FormControl>
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
            <FormLabel>Product Description *</FormLabel>
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

      {/* Stock / Inventory */}
      <FormField
        control={form.control}
        name="inventory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Stock *</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="Available quantity" 
              />
            </FormControl>
            <FormDescription>
              How many units you have available to sell
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
            <FormLabel>Product Video (max. 1 minute) *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://www.youtube.com/watch?v=..." />
            </FormControl>
            <FormDescription>
              Video showing the product (maximum 60 seconds)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Shipping Address */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Origin Address (for shipping)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej: Cusco, Perú (se traducirá)" />
            </FormControl>
            <FormDescription>
              Users will contact the administrator to coordinate shipping
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Auto Translator */}
      <div className="pt-6 border-t">
        <AutoTranslator
          spanishTitle={form.watch("title") || ""}
          spanishDescription={form.watch("description") || ""}
          spanishLocation={form.watch("location")}
          onTranslationComplete={(translations) => {
            form.setValue("title", translations.title);
            form.setValue("description", translations.description);
            if (translations.location) form.setValue("location", translations.location);
          }}
        />
      </div>
    </>
  );
}
