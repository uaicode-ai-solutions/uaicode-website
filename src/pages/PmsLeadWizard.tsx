import { useState } from "react";
import { toast } from "sonner";
import { sanitizeFormData } from "@/lib/inputSanitization";
import LeadWizardLayout from "@/components/pms-lead-wizard/LeadWizardLayout";
import WelcomeStep from "@/components/pms-lead-wizard/steps/WelcomeStep";
import FullNameStep from "@/components/pms-lead-wizard/steps/FullNameStep";
import EmailStep from "@/components/pms-lead-wizard/steps/EmailStep";
import PhoneStep from "@/components/pms-lead-wizard/steps/PhoneStep";
import LinkedInStep from "@/components/pms-lead-wizard/steps/LinkedInStep";
import CountryStep from "@/components/pms-lead-wizard/steps/CountryStep";
import RoleStep from "@/components/pms-lead-wizard/steps/RoleStep";
import SaasTypeStep from "@/components/pms-lead-wizard/steps/SaasTypeStep";
import IndustryStep from "@/components/pms-lead-wizard/steps/IndustryStep";
import DescriptionStep from "@/components/pms-lead-wizard/steps/DescriptionStep";
import SaasNameStep from "@/components/pms-lead-wizard/steps/SaasNameStep";
import LogoStep from "@/components/pms-lead-wizard/steps/LogoStep";
import GeographicRegionStep from "@/components/pms-lead-wizard/steps/GeographicRegionStep";
import ThankYouStep from "@/components/pms-lead-wizard/steps/ThankYouStep";

const TOTAL_STEPS = 14;
const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  country: string;
  countryOther: string;
  role: string;
  roleOther: string;
  saasType: string;
  saasTypeOther: string;
  industry: string;
  industryOther: string;
  description: string;
  saasName: string;
  saasLogo: string;
  geographicRegion: string;
  geographicRegionOther: string;
}

const initialForm: FormData = {
  fullName: "",
  email: "",
  phone: "",
  linkedin: "",
  country: "",
  countryOther: "",
  role: "",
  roleOther: "",
  saasType: "",
  saasTypeOther: "",
  industry: "",
  industryOther: "",
  description: "",
  saasName: "",
  saasLogo: "",
  geographicRegion: "",
  geographicRegionOther: "",
};

const PmsLeadWizard = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardId, setWizardId] = useState<string | null>(null);

  const set = (field: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const canGoNext = (): boolean => {
    switch (step) {
      case 0: return true;
      case 1: return form.fullName.trim().length >= 2;
      case 2: return emailRegex.test(form.email.trim());
      case 3: return form.phone.length >= 7;
      case 4: return true; // optional
      case 5: return form.country !== "" && (form.country !== "other" || form.countryOther.trim().length >= 2);
      case 6: return form.role !== "" && (form.role !== "other" || form.roleOther.trim().length >= 2);
      case 7: return form.saasType !== "" && (form.saasType !== "other" || form.saasTypeOther.trim().length >= 2);
      case 8: return form.industry !== "" && (form.industry !== "other" || form.industryOther.trim().length >= 2);
      case 9: return form.description.trim().length >= 20;
      case 10: return form.saasName.trim().length >= 3;
      case 11: return true; // optional
      case 12: return form.geographicRegion !== "" && (form.geographicRegion !== "other" || form.geographicRegionOther.trim().length >= 2);
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const sanitized = sanitizeFormData({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        linkedin: form.linkedin,
        country: form.country === "other" ? form.countryOther : form.country,
        role: form.role,
        role_other: form.role === "other" ? form.roleOther : null,
        saas_type: form.saasType,
        saas_type_other: form.saasType === "other" ? form.saasTypeOther : null,
        industry: form.industry,
        industry_other: form.industry === "other" ? form.industryOther : null,
        description: form.description,
        saas_name: form.saasName,
        saas_logo_url: form.saasLogo || null,
        geographic_region: form.geographicRegion,
        geographic_region_other: form.geographicRegion === "other" ? form.geographicRegionOther : null,
      });

      const res = await fetch(`${SUPABASE_URL}/functions/v1/pms-lp-wizard-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY },
        body: JSON.stringify(sanitized),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Submission failed");
      }

      const data = await res.json();
      setWizardId(data.id);
      setStep(TOTAL_STEPS - 1); // Thank you
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (step === TOTAL_STEPS - 2) {
      handleSubmit();
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    }
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep onStart={() => setStep(1)} />;
      case 1: return <FullNameStep value={form.fullName} onChange={set("fullName")} />;
      case 2: return <EmailStep value={form.email} onChange={set("email")} />;
      case 3: return <PhoneStep value={form.phone} onChange={set("phone")} />;
      case 4: return <LinkedInStep value={form.linkedin} onChange={set("linkedin")} />;
      case 5: return <CountryStep value={form.country} otherValue={form.countryOther} onChange={set("country")} onOtherChange={set("countryOther")} />;
      case 6: return <RoleStep value={form.role} otherValue={form.roleOther} onChange={set("role")} onOtherChange={set("roleOther")} />;
      case 7: return <SaasTypeStep value={form.saasType} otherValue={form.saasTypeOther} onChange={set("saasType")} onOtherChange={set("saasTypeOther")} />;
      case 8: return <IndustryStep value={form.industry} otherValue={form.industryOther} onChange={set("industry")} onOtherChange={set("industryOther")} />;
      case 9: return <DescriptionStep value={form.description} onChange={set("description")} saasType={form.saasType} industry={form.industry} />;
      case 10: return <SaasNameStep value={form.saasName} onChange={set("saasName")} description={form.description} saasType={form.saasType} industry={form.industry} />;
      case 11: return <LogoStep value={form.saasLogo} onChange={set("saasLogo")} description={form.description} saasName={form.saasName} saasType={form.saasType} industry={form.industry} />;
      case 12: return <GeographicRegionStep value={form.geographicRegion} otherValue={form.geographicRegionOther} onChange={set("geographicRegion")} onOtherChange={set("geographicRegionOther")} />;
      case 13: return <ThankYouStep wizardId={wizardId} />;
      default: return null;
    }
  };

  return (
    <LeadWizardLayout
      currentStep={step}
      totalSteps={TOTAL_STEPS}
      onBack={handleBack}
      onNext={handleNext}
      canGoNext={canGoNext()}
      isSubmitting={isSubmitting}
      showNav={step !== 0 && step !== TOTAL_STEPS - 1}
    >
      <div key={step}>{renderStep()}</div>
    </LeadWizardLayout>
  );
};

export default PmsLeadWizard;
