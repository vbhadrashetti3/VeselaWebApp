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

const plans = [
  {
    id: "free",
    name: "Grace 2 Mini",
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
    name: "Grace 2 Pro",
    price: "$19.99",
    period: "/month",
    features: [
      "Unlimited usage",
      "Memory included",
      "State of the Art Grace 2 model",
      "Leader on humanitybench.org",
    ],
    link: "https://buy.stripe.com/5kQ8wPdcV75TfOrf3b24007",
    popular: true,
  },
];

export default function PricingPlansContent() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {plans.map((plan) => (
          <Grid
            key={plan.id}
            size={{ xs: 12, sm: 6, md: 4 }} // ✅ correct v7 API
            sx={{ display: "flex" }} // ✅ required for equal height
          >
            <Card
              sx={{
                width: "100%",
                minHeight: 350, // 🔥 SAME HEIGHT
                borderRadius: 3,
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
                  flexGrow: 1, // ✅ pushes button down
                }}
              >
                <Typography textAlign="center" fontWeight={600}>
                  {plan.name}
                </Typography>

                <Box textAlign="center" py={2}>
                  <Typography fontSize={28} fontWeight={700}>
                    {plan.price}
                    <span style={{ fontSize: "14px", fontWeight: 400 }}>
                      / month
                    </span>
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {plan.features.map((f, i) => (
                    <Box key={i} display="flex" mb={1}>
                      <CheckIcon fontSize="small" />
                      <Typography ml={1}>{f}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant={plan.id === "free" ? "outlined" : "contained"}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
