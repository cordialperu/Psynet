import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Plus, X, Clock } from "lucide-react";

interface TimeSlot {
  date: string; // ISO format (YYYY-MM-DD)
  times: string[]; // Array of time strings (HH:mm)
}

interface TimeSelectorProps {
  selectedDates: Date[];
  selectedTimes: TimeSlot[];
  onTimesChange: (times: TimeSlot[]) => void;
  mode?: 'selector' | 'informative';
  className?: string;
}

export function TimeSelector({ 
  selectedDates, 
  selectedTimes, 
  onTimesChange, 
  mode = 'selector',
  className 
}: TimeSelectorProps) {
  const [selectedDateForTime, setSelectedDateForTime] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");

  const addTime = () => {
    if (!selectedDateForTime || !newTime) return;

    const existingSlot = selectedTimes.find(slot => slot.date === selectedDateForTime);
    
    if (existingSlot) {
      // Agregar tiempo a fecha existente
      if (!existingSlot.times.includes(newTime)) {
        const updatedTimes = selectedTimes.map(slot =>
          slot.date === selectedDateForTime
            ? { ...slot, times: [...slot.times, newTime].sort() }
            : slot
        );
        onTimesChange(updatedTimes);
      }
    } else {
      // Crear nuevo slot
      onTimesChange([...selectedTimes, { date: selectedDateForTime, times: [newTime] }]);
    }

    setNewTime("");
  };

  const removeTime = (date: string, time: string) => {
    const updatedTimes = selectedTimes
      .map(slot => {
        if (slot.date === date) {
          const newTimes = slot.times.filter(t => t !== time);
          return newTimes.length > 0 ? { ...slot, times: newTimes } : null;
        }
        return slot;
      })
      .filter((slot): slot is TimeSlot => slot !== null);
    
    onTimesChange(updatedTimes);
  };

  const getDateFromIso = (isoDate: string): Date => {
    return new Date(isoDate + 'T00:00:00');
  };

  // Determinar si es modo informativo (una sola hora en total)
  const totalTimes = selectedTimes.reduce((acc, slot) => acc + slot.times.length, 0);
  const isInformativeMode = mode === 'informative' || totalTimes === 1;

  return (
    <div className={className}>
      <div className="space-y-4">
        <Card className="bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-2xl p-4 md:p-6 transition-colors duration-300">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                {isInformativeMode ? 'Time Information' : 'Available Time Slots'}
              </h3>
            </div>

            {selectedDates.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                Please select dates first
              </p>
            ) : (
              <>
                {/* Add Time Interface */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={selectedDateForTime}
                    onChange={(e) => setSelectedDateForTime(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition-colors duration-300"
                  >
                    <option value="">Select date</option>
                    {selectedDates.map((date) => {
                      const isoDate = format(date, 'yyyy-MM-dd');
                      return (
                        <option key={isoDate} value={isoDate}>
                          {format(date, 'MMM dd, yyyy')}
                        </option>
                      );
                    })}
                  </select>

                  <Input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="HH:mm"
                  />

                  <Button
                    onClick={addTime}
                    disabled={!selectedDateForTime || !newTime}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-300"
                    type="button"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time
                  </Button>
                </div>

                {/* Time Slots Display */}
                {selectedTimes.length > 0 && (
                  <div className="space-y-3 mt-6">
                    {selectedTimes
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .map((slot) => (
                        <div
                          key={slot.date}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 transition-colors duration-300"
                        >
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {format(getDateFromIso(slot.date), 'EEEE, MMM dd, yyyy')}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slot.times.map((time) => (
                              <Badge
                                key={time}
                                variant="secondary"
                                className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 px-3 py-1.5 rounded-lg font-medium transition-colors duration-300 flex items-center gap-2"
                              >
                                <Clock className="w-3 h-3" />
                                <span>{time}</span>
                                <button
                                  onClick={() => removeTime(slot.date, time)}
                                  className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                  type="button"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {isInformativeMode && totalTimes > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      This time will be displayed as information only (not a selector for users)
                    </p>
                  </div>
                )}

                {!isInformativeMode && totalTimes > 1 && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Users will be able to choose from these available times
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
