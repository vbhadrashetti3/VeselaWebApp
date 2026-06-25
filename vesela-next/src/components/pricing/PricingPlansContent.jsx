"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  useTheme,
  Chip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "@/context/AuthContext";

const plans = [
  {
    id: "free",
    name: "Vesela 2 Mini",
    price: "Free",
    period: "/month",
    features: [
      "Limited to 20 messages per day",
      "No day to day memory",
      "Smaller model",
      "Human connection expert",
    ],
  },
  {
    id: "pro",
    name: "Vesela 2 Pro",
    price: "$19.99",
    period: "/month",
    features: [
      "Unlimited usage",
      "Memory included",
      "State of the Art Vesela 2 model",
      "Leader on humanitybench.org",
    ],
    link: "https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007",
    popular: true,
  },
];

export default function PricingPlansContent() {
  const theme = useTheme();
  const { plan: currentPlan, isAuthenticated } = useAuth();

  const activePlanId = isAuthenticated ? (currentPlan || "free") : null;

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        {plans.map((plan) => (
          <Grid
            key={plan.id}
            size={{ xs: 6, md: 4 }}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: 1,
                bgcolor: theme.palette.background.modalBackground,
                color: theme.palette.text.primary,
                boxShadow: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "0.25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  p: { xs: 1.5, md: 2 },
                  "&:last-child": { pb: { xs: 1.5, md: 2 } },
                }}
              >
                <Typography
                  textAlign="center"
                  fontWeight={600}
                  fontSize={{ xs: "12px", md: "14px" }}
                  noWrap
                >
                  {plan.name}
                </Typography>

                <Box textAlign="center" py={{ xs: 1, md: 2 }}>
                  <Typography
                    fontSize={{ xs: 22, md: 28 }}
                    fontWeight={700}
                    lineHeight={1.2}
                  >
                    {plan.price}
                    <Box
                      component="span"
                      sx={{ fontSize: "12px", fontWeight: 400, display: "block" }}
                    >
                      / month
                    </Box>
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {plan.features.map((f, i) => (
                    <Box key={i} display="flex" mb={0.75} alignItems="flex-start">
                      <CheckIcon fontSize="small" sx={{ fontSize: 14, mt: "2px", flexShrink: 0 }} />
                      <Typography ml={0.75} fontSize={{ xs: "11px", md: "14px" }} lineHeight={1.4}>
                        {f}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  size="medium"
                  variant={activePlanId === plan.id ? "contained" : plan.id === "free" ? "outlined" : "contained"}
                  color={activePlanId === plan.id ? "success" : "primary"}
                  disabled={activePlanId === plan.id}
                  sx={{
                    mt: 1,
                    fontSize: { xs: "11px", md: "13px" },
                    ...(activePlanId === plan.id && {
                      bgcolor: "success.main",
                      color: "common.white",
                      "&.Mui-disabled": {
                        bgcolor: "success.main",
                        color: "common.white",
                        opacity: 0.9,
                      },
                    }),
                  }}
                  onClick={() => {
                    if (plan.link) {
                      window.open(plan.link, "_blank");
                    }
                  }}
                >
                  {activePlanId === plan.id ? "Current Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
