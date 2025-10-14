import type { UseFormReturn } from "react-hook-form";
import { CeremonyForm } from "./ceremony-form";
import { MicrodosisForm } from "./microdosis-form";
import { MedicinaForm } from "./medicina-form";
import { EventForm } from "./event-form";
import { ProductForm } from "./product-form";

interface TimeSlot {
  date: string;
  times: string[];
}

interface DynamicCategoryFormProps {
  category: string;
  form: UseFormReturn<any>;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  selectedTimes?: TimeSlot[];
  setSelectedTimes?: (times: TimeSlot[]) => void;
  fixedTime?: string;
  setFixedTime?: (time: string) => void;
}

export function DynamicCategoryForm({ 
  category, 
  form, 
  selectedDates, 
  setSelectedDates,
  selectedTimes = [],
  setSelectedTimes = () => {},
  fixedTime = "",
  setFixedTime = () => {}
}: DynamicCategoryFormProps) {
  
  switch (category) {
    case "ceremonias":
      return <CeremonyForm form={form} selectedDates={selectedDates} setSelectedDates={setSelectedDates} category={category} />;
    
    case "terapias":
      return <CeremonyForm form={form} selectedDates={selectedDates} setSelectedDates={setSelectedDates} selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} category={category} />;
    
    case "microdosis":
      return <MicrodosisForm form={form} />;
    
    case "medicina":
      return <MedicinaForm form={form} />;
    
    case "eventos":
      return <EventForm form={form} selectedDates={selectedDates} setSelectedDates={setSelectedDates} fixedTime={fixedTime} setFixedTime={setFixedTime} category={category} />;
    
    case "productos":
      return <ProductForm form={form} />;
    
    default:
      return <CeremonyForm form={form} selectedDates={selectedDates} setSelectedDates={setSelectedDates} category={category} />;
  }
}
