import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface PriceCalculatorProps {
  value: string;
  onChange: (basePrice: string, finalPrice: string, platformFee: string) => void;
  currency?: string;
}

export function PriceCalculator({ value, onChange, currency = "USD" }: PriceCalculatorProps) {
  const [basePrice, setBasePrice] = useState(value || "");
  const PLATFORM_FEE_PERCENTAGE = 0.25; // 25%

  useEffect(() => {
    if (value !== basePrice) {
      setBasePrice(value);
    }
  }, [value]);

  const calculatePrices = (base: string) => {
    const basePriceNum = parseFloat(base) || 0;
    const platformFee = basePriceNum * PLATFORM_FEE_PERCENTAGE;
    const finalPrice = basePriceNum + platformFee;

    return {
      basePrice: basePriceNum.toFixed(2),
      platformFee: platformFee.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    };
  };

  const handleChange = (newValue: string) => {
    // Only keep the raw value, don't format while typing
    setBasePrice(newValue);
  };

  const handleBlur = () => {
    // Format and update only when user finishes typing
    if (basePrice) {
      const prices = calculatePrices(basePrice);
      onChange(prices.basePrice, prices.finalPrice, prices.platformFee);
      setBasePrice(prices.basePrice);
    }
  };

  const prices = calculatePrices(basePrice);

  return (
    <div className="space-y-4">
      {/* Base price input */}
      <div>
        <Label htmlFor="basePrice" className="text-gray-900 dark:text-white transition-colors duration-300">Base Price</Label>
        <div className="flex gap-2 items-center mt-1">
          <span className="text-gray-600 dark:text-gray-400">{currency}</span>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            min="0"
            value={basePrice}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="0.00"
            className="flex-1 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors duration-300"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
          This is the amount you will receive for your service/product
        </p>
      </div>

      {/* Price breakdown */}
      {basePrice && parseFloat(basePrice) > 0 && (
        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Your base price:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {currency} {prices.basePrice}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Platform fee (+25%):
              </span>
              <span className="font-medium text-orange-600 dark:text-orange-400">
                + {currency} {prices.platformFee}
              </span>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-600 pt-3 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  Published price:
                </span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  {currency} {prices.finalPrice}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                This is the price users will see
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 transition-colors duration-300">
        <p className="text-xs text-blue-800 dark:text-blue-300 transition-colors duration-300">
          💡 <strong>Note:</strong> The 25% fee covers platform costs, 
          payment processing, support and marketing of your service/product.
        </p>
      </div>
    </div>
  );
}
