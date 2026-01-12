import { Card, CardContent } from "@/components/ui/card";
import { LoyaltyForm } from "@/components/LoyaltyForm";
import { TreezLogo } from "@/components/TreezLogo";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <TreezLogo className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loyalty Onboarding
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Get started with Treez Loyalty - submit your brand assets
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <LoyaltyForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? Contact us at{" "}
          <a
            href="mailto:support@treez.io"
            className="text-primary hover:underline"
          >
            support@treez.io
          </a>
        </p>
      </div>
    </main>
  );
}
