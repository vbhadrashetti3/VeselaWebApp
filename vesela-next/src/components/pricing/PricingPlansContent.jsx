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
  alpha,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "@/context/AuthContext";
import { getStripePaymentUrl } from "@/utils/stripeUtil";
import ManagePlanButton from "../subscription/ManagePlanButton";

const plans = [
  {
    id: "free",
    name: "Vesela 2 Mini",
    price: "Free",
    period: "/month",
    features: [
      "20 messages/day",
      "No memory",
      "No live internet search",
      "Human aligned AI",
    ],
  },
  {
    id: "pro",
    name: "Vesela 2 Pro",
    price: "$18.99",
    period: "/month",
    features: [
      "Unlimited messages",
      "Memory included",
      "Live internet search",
      "#1 on HumanityBench.org",
    ],
    link: "https://buy.stripe.com/3cIaEX5Ktai56dR08h2400a",
    popular: true,
  },
];

export default function PricingPlansContent({ mdSize = 4 }) {
  const theme = useTheme();
  const { plan: currentPlan, isAuthenticated, user, canManageStripeBilling } = useAuth();

  const isProUser = isAuthenticated && Boolean(currentPlan) && currentPlan !== "free";

  const isPlanActive = (planId) => {
    if (!isAuthenticated) return false;
    if (planId === "pro") return isProUser;
    if (planId === "free") return !isProUser;
    return false;
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {plans.map((plan) => {
        const active = isPlanActive(plan.id);

        return (
          <Grid
            key={plan.id}
            size={{ xs: 12, sm: 6, md: mdSize }}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: 2,
                bgcolor: active
                  ? theme.palette.mode === "dark"
                    ? "rgba(23, 111, 156, 0.08)"
                    : "rgba(23, 111, 156, 0.03)"
                  : "background.paper",
                color: "text.primary",
                border: "2px solid",
                borderColor: active
                  ? theme.palette.primary.main
                  : theme.palette.divider,
                boxShadow: active
                  ? theme.palette.mode === "dark"
                    ? `0 8px 32px rgba(0, 0, 0, 0.6), 0 0 16px ${alpha(theme.palette.primary.main, 0.25)}`
                    : `0 8px 24px ${alpha(theme.palette.primary.main, 0.18)}`
                  : theme.palette.mode === "dark"
                    ? "0 4px 20px rgba(0,0,0,0.4)"
                    : "0 2px 12px rgba(16,17,19,0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(!active && {
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 8px 32px rgba(0,0,0,0.6)"
                      : "0 6px 24px rgba(16,17,19,0.12)",
                  },
                }),
              }}
            >
              {/* Prominent Current Plan Badge */}
              {active && (
                <Chip
                  label="Current Plan"
                  size="small"
                  color="primary"
                  icon={<CheckCircleIcon sx={{ fontSize: "14px !important", color: "inherit" }} />}
                  sx={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    fontWeight: 700,
                    fontSize: "11px",
                    height: "24px",
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                    px: 0.5,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
              )}

              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  p: { xs: 2, md: 2.5 },
                  "&:last-child": { pb: { xs: 2, md: 2.5 } },
                }}
              >
                {/* Plan Name */}
                <Typography
                  fontWeight={700}
                  fontSize={{ xs: "15px", md: "17px" }}
                  color={active ? "primary.main" : "text.primary"}
                  sx={{ pr: active ? 12 : 0, mb: 1.5 }}
                >
                  {plan.name}
                </Typography>

                {/* Price Display */}
                <Box py={{ xs: 1, md: 1.5 }} mb={2}>
                  <Typography
                    fontSize={{ xs: 26, md: 32 }}
                    fontWeight={800}
                    lineHeight={1.1}
                    color="text.primary"
                  >
                    {plan.price}
                    <Box
                      component="span"
                      sx={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "text.secondary",
                        display: "block",
                        mt: 0.5,
                      }}
                    >
                      / month
                    </Box>
                  </Typography>
                </Box>

                {/* Features List */}
                <Box sx={{ flexGrow: 1, mb: 3 }}>
                  {plan.features.map((f, i) => (
                    <Box
                      key={i}
                      display="flex"
                      mb={1.25}
                      alignItems="center"
                      sx={{ gap: 1 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          bgcolor: active
                            ? alpha(theme.palette.primary.main, 0.15)
                            : alpha(theme.palette.text.secondary, 0.1),
                          color: active ? "primary.main" : "text.secondary",
                          flexShrink: 0,
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 12 }} />
                      </Box>
                      <Typography
                        fontSize={{ xs: "12px", md: "13.5px" }}
                        lineHeight={1.5}
                        color={active ? "text.primary" : "text.secondary"}
                        fontWeight={active ? 500 : 400}
                      >
                        {f}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Action Area */}
                <Box sx={{ mt: "auto" }}>
                  {active ? (
                    canManageStripeBilling && plan.id !== "free" ? (
                      <ManagePlanButton fullWidth size="medium" />
                    ) : (
                      <Button
                        fullWidth
                        size="medium"
                        variant="contained"
                        color="primary"
                        disabled
                        sx={{
                          borderRadius: 1,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: { xs: "12px", md: "13px" },
                          "&.Mui-disabled": {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Current Plan
                      </Button>
                    )
                  ) : (
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      color="primary"
                      disabled={isProUser && plan.id === "free"}
                      sx={{
                        borderRadius: 1,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: { xs: "12px", md: "13px" },
                        ...((isProUser && plan.id === "free") && {
                          "&.Mui-disabled": {
                            bgcolor: "text.secondary",
                            color: "background.default",
                            opacity: 0.6,
                          },
                        }),
                      }}
                      onClick={() => {
                        if (plan.link) {
                          const finalUrl = getStripePaymentUrl(plan.link, user);
                          window.open(finalUrl, "_blank");
                        }
                      }}
                    >
                      {isProUser && plan.id === "free" ? "Included" : "Select Plan"}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
