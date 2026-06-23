export type PricingDisplay = {
  proFreelancer: {
    name: string;
    priceUah: number;
    features: readonly string[];
  };
  featureProject: {
    name: string;
    priceUah: number;
    days: number;
  };
  featureProfile: {
    name: string;
    priceUah: number;
    days: number;
  };
};

export function toPricingDisplay(pricing: {
  proFreelancer: {
    name: string;
    priceUah: number;
    features: readonly string[];
  };
  featureProject: {
    name: string;
    priceUah: number;
    days: number;
  };
  featureProfile: {
    name: string;
    priceUah: number;
    days: number;
  };
}): PricingDisplay {
  return {
    proFreelancer: {
      name: pricing.proFreelancer.name,
      priceUah: pricing.proFreelancer.priceUah,
      features: pricing.proFreelancer.features,
    },
    featureProject: {
      name: pricing.featureProject.name,
      priceUah: pricing.featureProject.priceUah,
      days: pricing.featureProject.days,
    },
    featureProfile: {
      name: pricing.featureProfile.name,
      priceUah: pricing.featureProfile.priceUah,
      days: pricing.featureProfile.days,
    },
  };
}
