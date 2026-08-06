"use client";

import React from "react";
import PricingPlansContent from "../pricing/PricingPlansContent";
import SettingSection from "./SettingSection";

const SubscriptionContent = () => {
  return (
    <SettingSection
      title="My Subscription"
      description="Manage your plan and usage limits"
    >
      <PricingPlansContent mdSize={6} />
    </SettingSection>
  );
};

export default SubscriptionContent;
