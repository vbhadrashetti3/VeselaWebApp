"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const plans = [
  {
    title: "Nirvana",
    price: "$18.99",
    period: "month",
    features: [
      "Trained on real counseling sessions",
      "Available 24/7 with thoughtful support",
      "No waitlists. No pressure. Just presence",
      "Unlimited access",
    ],
    link: "https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007",
  },
];

const PricingPlansContent = ({ isSettingModal = false }) => {
  const theme = useTheme();

  const [userDetails, setUserDetails] = useState(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("userdetails");
      return user ? JSON.parse(user) : null;
    }
    return null;
  });
  const [planDetails, setPlanDetails] = useState(() => {
    if (typeof window !== "undefined") {
      const plan = localStorage.getItem("plan_details");
      return plan ? JSON.parse(plan) : null;
    }
    return null;
  });

  // ✅ Safe localStorage access (client only)
  // useEffect(() => {
  //   const user = localStorage.getItem("userdetails");
  //   const plan = localStorage.getItem("plan_details");

  //   if (user) setUserDetails(JSON.parse(user));
  //   if (plan) setPlanDetails(JSON.parse(plan));
  // }, []);

  const handleSelectPlan = (baseUrl) => {
    if (!userDetails) {
      console.error("User details not found");
      return;
    }

    const params = new URLSearchParams({
      prefilled_email: userDetails.email,
      client_reference_id: userDetails.pk,
    });

    const finalUrl = `${baseUrl}?${params.toString()}`;
    window.open(finalUrl, "_blank");
  };

  const planSelected = planDetails?.plan && planDetails?.plan !== "free";

  return (
    <Box pt={2}>
      <Grid container spacing={2}>
        {plans.map((plan, index) => (
          <Grid item xs={12} md={isSettingModal ? 4 : 12} key={index}>
            <Card
              sx={{
                borderRadius: 2,
                textAlign: "center",
                bgcolor: theme.palette.background.modalBackground,
                color: theme.palette.text.primary,
                boxShadow: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.2s",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontSize: 14 }}>
                  {plan.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    pb: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {plan.price}
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ ml: 1, color: theme.palette.text.secondary }}
                  >
                    /{plan.period}
                  </Typography>
                </Typography>

                {/* Features */}
                <Box sx={{ textAlign: "left", mt: 2 }}>
                  {plan.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <CheckIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Button */}
                <Box
                  sx={{
                    pt: 3,
                    mt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      borderRadius: "30px",
                      px: 4,
                      py: 1,
                      fontWeight: 600,
                    }}
                    onClick={() => handleSelectPlan(plan.link)}
                    disabled={planSelected}
                  >
                    {planSelected ? "Your Plan Selected" : "Select Plan"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PricingPlansContent;
