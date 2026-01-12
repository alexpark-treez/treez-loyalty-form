"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreezLogo } from "@/components/TreezLogo";
import { CheckCircle2, Clock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ThankYou() {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#6ABF4B", "#4CAF50", "#8BC34A", "#CDDC39"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#6ABF4B", "#4CAF50", "#8BC34A", "#CDDC39"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <TreezLogo className="h-12 mx-auto mb-4" />
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your onboarding submission has been received successfully.
            </p>

            <div className="space-y-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Confirmation Sent</p>
                  <p className="text-sm text-muted-foreground">
                    Check your email for a confirmation of your submission.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">What Happens Next?</p>
                  <p className="text-sm text-muted-foreground">
                    Our design team will review your brand assets and reach out
                    within <strong>24-48 hours</strong> to discuss next steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full gap-2">
                <a
                  href="https://www.treez.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Treez.io
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/">Submit Another Form</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Questions?{" "}
          <a
            href="mailto:support@treez.io"
            className="text-primary hover:underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </main>
  );
}
