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
      "20 messages per day",
      "Vesela Mini model",
      "Human connection expert",
      "No day to day memory",
    ],
  },
  {
    id: "pro",
    name: "Vesela 2 Pro",
    price: "$18.99",
    period: "/month",
    features: [
      "Unlimited usage",
      "Memory included",
      "State-of-the-art Vesela model",
      "Vesela 3 — Humanity Bench leader",
    ],
    link: "https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007",
    popular: true,
  },
];

export default function PricingPlansContent({ mdSize = 4 }) {
  const theme = useTheme();
  const { plan: currentPlan, isAuthenticated } = useAuth();

  const activePlanId = isAuthenticated ? (currentPlan || "free") : null;

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 } }}>
      <Grid container spacing={{ xs: 1.5, md: 2 }}>
        {plans.map((plan) => (
          <Grid
            key={plan.id}
            size={{ xs: 12, sm: 6, md: mdSize }}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                width: "100%",
                borderRadius: 1,
                bgcolor: "background.paper",
                color: "text.primary",
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === "dark"
                  ? "0 4px 24px rgba(0,0,0,0.5)"
                  : "0 2px 12px rgba(16,17,19,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.25s, box-shadow 0.25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0,0,0,0.65)"
                    : "0 6px 24px rgba(16,17,19,0.14)",
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
                  variant="contained"
                  color="primary"
                  disabled={activePlanId === plan.id}
                  sx={{
                    mt: 1,
                    fontSize: { xs: "11px", md: "13px" },
                    ...(activePlanId === plan.id && {
                      "&.Mui-disabled": {
                        bgcolor: "text.secondary",
                        color: "background.default",
                        opacity: 0.7,
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
