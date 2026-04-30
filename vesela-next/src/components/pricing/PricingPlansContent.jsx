"use client";

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
  },
];

const PricingPlansContent = () => {
  const theme = useTheme();

  const handleSelectPlan = (link) => {
    if (!link) return;
    window.open(link, "_blank");
  };

  return (
    <Box pt={2}>
      <Grid container spacing={2} sx={{ mt: 2 }} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan.id}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 2,
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                {/* Plan Name */}
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 14,
                    fontWeight: 600,
                    mb: 1,
                    color: theme.palette.text.secondary,
                  }}
                >
                  {plan.name}
                </Typography>

                {/* Price */}
                <Box
                  sx={{
                    textAlign: "center",
                    pb: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 30,
                      fontWeight: 700,
                    }}
                  >
                    {plan.price}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 14,
                        ml: 0.5,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {plan.period}
                    </Typography>
                  </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ mt: 2, flexGrow: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <CheckIcon
                        sx={{
                          fontSize: 16,
                          mr: 1,
                          color: theme.palette.primary.main,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: 13,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Button */}
                <Box
                  sx={{
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Button
                    fullWidth
                    variant={plan.id === "free" ? "outlined" : "contained"}
                    disabled={plan.disabled}
                    onClick={() => handleSelectPlan(plan.link)}
                    sx={{
                      borderRadius: "25px",
                      py: 1.2,
                      fontWeight: 600,

                      ...(plan.disabled && {
                        bgcolor: "#cbd5e1",
                        color: "#fff",
                      }),
                    }}
                  >
                    Select Plan
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
