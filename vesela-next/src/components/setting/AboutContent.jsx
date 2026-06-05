import { Box, Typography } from "@mui/material";

const AboutContents = [
  {
    heading: "WHO WE ARE",
    content:
      "Gray Sky AI is a division of Beyond the Gray Sky LLC, the parent company of Pursuit of Happiness, Luxe Media Productions, and Gray Sky AI. This enables us access to massive counseling datasets from which we train our bespoke counseling models.",
    contentImg:
      "https://d3v1yfd0v1riv5.cloudfront.net/static/index/img/gsai_promo1_2x.jpg",
  },
  {
    heading: "WHY AI",
    content:
      "Pursuit of Happiness is the largest counseling organization for kids in foster care in the world. Their partnership enables us to draw on expertise in working with foster kids and caregivers to deliver expert insights into how these custom AI systems should be designed and trained. Our models think and speak just like a real counselor.",
    contentImg:
      "https://d3v1yfd0v1riv5.cloudfront.net/static/index/img/gsai_promo2_2x.jpg",
  },
  {
    heading: "SAFETY IS OUR PRIORITY",
    content:
      "We conduct rigorous testing to make sure that our AI systems are safe, helpful, and can benefit humanity. Our AI counselors are tied to actual license holders, and have been thoroughly tested to ensure their safety, including alerts to the license holder when a user reports danger to themselves or others, or reports abuse of a minor. Our background safety agent scans the conversations for risks and alerts a license holder should the need arise..",
    contentImg:
      "https://d3v1yfd0v1riv5.cloudfront.net/static/index/img/image_fx_-6.jpg",
  },
  {
    heading: "POLICY ON YOUR DATA",
    content:
      "Gray Sky AI DOES NOT sell data to third parties for any reason. Given that our models are tied to license holders, we are subject to the same privacy requirements of our licenses, and are strongly ideologically opposed to selling your data.",
    contentImg: "",
  },
];

const AboutContent = () => {
  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      {AboutContents.map((item, index) => {
        return (
          <div key={index}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, marginBottom: "16px" }}
            >
              {item.heading}
            </Typography>
            <Typography sx={{ mb: 2 }} variant="subtitle2">
              {item.content}
            </Typography>

            {item?.contentImg && (
              <div style={{ marginBottom: "10px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img style={{ width: "100%" }} src={item?.contentImg} alt={item.heading} />
              </div>
            )}
          </div>
        );
      })}
    </Box>
  );
};
export default AboutContent;
