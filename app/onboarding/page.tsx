import Link from "next/link";
import { GlassCard, NeonButton } from "@/components/ui/kit";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg p-6 pt-24">
      <GlassCard className="p-6 text-center">
        <h1 className="text-2xl font-bold">Welcome to Logistika AI</h1>
        <p className="mt-2 text-sm text-slate-400">Role tanlanmagan yoki onboarding tugallanmagan.</p>
        <Link href="/login" className="mt-4 inline-block">
          <NeonButton>Back to Login</NeonButton>
        </Link>
      </GlassCard>
    </div>
  );
}
