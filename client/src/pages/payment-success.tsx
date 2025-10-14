import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, MessageCircle } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    // Recuperar información del pago pendiente
    const paymentInfoStr = localStorage.getItem('pendingPayPalPayment');
    const adminWhatsApp = localStorage.getItem('adminWhatsApp');

    if (paymentInfoStr && adminWhatsApp && !notificationSent) {
      const paymentInfo = JSON.parse(paymentInfoStr);
      
      // Construir mensaje para el admin
      const mensaje = `*PAYPAL PAYMENT RECEIVED*\n\n` +
        `Type: ${paymentInfo.type}\n` +
        `Service/Product: ${paymentInfo.title}\n` +
        `Amount: $${paymentInfo.price} ${paymentInfo.currency}\n` +
        `Guide/Seller: ${paymentInfo.guide}\n` +
        `Location: ${paymentInfo.location}\n` +
        (paymentInfo.date !== 'N/A' ? `Date: ${paymentInfo.date}\n` : '') +
        (paymentInfo.duration !== 'N/A' ? `Duration: ${paymentInfo.duration}\n` : '') +
        `\n*Payment Status: COMPLETED*\n` +
        `Please confirm and reserve this booking.`;

      const mensajeCodificado = encodeURIComponent(mensaje);
      const numeroWhatsApp = adminWhatsApp.replace(/[^0-9]/g, '');

      // Abrir WhatsApp automáticamente
      if (numeroWhatsApp) {
        window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, '_blank');
        setNotificationSent(true);
      }

      // Limpiar localStorage
      localStorage.removeItem('pendingPayPalPayment');
      localStorage.removeItem('adminWhatsApp');
    }
  }, [notificationSent]);

  const handleSendAgain = () => {
    const adminWhatsApp = localStorage.getItem('adminWhatsApp');
    if (adminWhatsApp) {
      const numeroWhatsApp = adminWhatsApp.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${numeroWhatsApp}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Payment Successful!</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="text-sm text-gray-900 dark:text-white font-medium mb-2">
              What happens next?
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>The administrator has been notified via WhatsApp</li>
              <li>Your booking will be confirmed shortly</li>
              <li>You will receive confirmation details</li>
            </ul>
          </div>

          {notificationSent && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                WhatsApp notification sent to administrator
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={() => setLocation("/")}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <Button
              onClick={handleSendAgain}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Administrator
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
