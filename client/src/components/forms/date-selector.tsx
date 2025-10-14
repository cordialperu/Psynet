import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { X } from "lucide-react";

interface DateSelectorProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  category: string;
  className?: string;
}

export function DateSelector({ selectedDates, onDatesChange, category, className }: DateSelectorProps) {
  // Colores por categoría
  const getCategoryColor = () => {
    switch (category) {
      case 'ceremonias': return 'border-purple-300 dark:border-purple-500';
      case 'terapias': return 'border-blue-300 dark:border-blue-500';
      case 'eventos': return 'border-pink-300 dark:border-pink-500';
      default: return 'border-gray-300 dark:border-gray-500';
    }
  };

  const getCategoryBadgeColor = () => {
    switch (category) {
      case 'ceremonias': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600';
      case 'terapias': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600';
      case 'eventos': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-600';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const removeDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      date => date.getTime() !== dateToRemove.getTime()
    );
    onDatesChange(newDates);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Calendar */}
        <Card className={`bg-white dark:bg-gray-800 border-2 ${getCategoryColor()} rounded-2xl overflow-hidden transition-colors duration-300 p-4`}>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => onDatesChange(dates || [])}
            className="rounded-xl"
            disabled={{ before: new Date() }}
          />
        </Card>

        {/* Selected Dates */}
        {selectedDates.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Selected dates ({selectedDates.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={`${getCategoryBadgeColor()} border px-3 py-1.5 rounded-xl font-medium transition-colors duration-300 flex items-center gap-2`}
                  >
                    <span>{format(date, 'MMM dd, yyyy')}</span>
                    <button
                      onClick={() => removeDate(date)}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {selectedDates.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2 transition-colors duration-300">
            Select dates from the calendar above
          </p>
        )}
      </div>
    </div>
  );
}
