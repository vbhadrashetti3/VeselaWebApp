"use client";

import React from "react";
import { Box, useTheme, Typography } from "@mui/material";
import SettingSection from "./SettingSection";

const PrivacyContent = () => {
  const theme = useTheme();

  return (
    <SettingSection title="Privacy Policy" description="Read our Privacy Policy">
      <Box
        sx={{
          width: "100%",
          color: theme.palette.text.primary,
          // Standardized document styling matching TermsContent
          "& h1, & h2, & h3": {
            color: theme.palette.primary.main,
            fontWeight: 600,
            mt: 4,
            mb: 2,
          },
          "& h4": {
            color: theme.palette.text.primary,
            fontWeight: 600,
            mt: 3,
            mb: 1.5,
          },
          "& p": {
            lineHeight: 1.8,
            mb: 2,
            color: theme.palette.text.secondary,
            fontSize: "0.95rem",
          },
          "& strong": {
            color: theme.palette.text.primary,
          },
          "& ul, & ol": {
            mb: 2,
            pl: 4,
            color: theme.palette.text.secondary,
          },
          "& li": {
            mb: 1,
            lineHeight: 1.6,
            fontSize: "0.95rem",
          },
          "& a": {
            color: theme.palette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}>
          PRIVACY POLICY
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Last Updated:</strong> April 17, 2025
          </Typography>
        </Box>

        <h3>1. INTRODUCTION</h3>
        <p>
          Welcome to Gray Sky AI. We understand the importance of your personal information and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI counseling services.
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy.
        </p>

        <h3>2. INFORMATION WE COLLECT</h3>
        <h4>2.1 Personal Information</h4>
        <p>We may collect the following categories of personal information:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> Name, email address, phone number, and other contact details you provide when creating an account.
          </li>
          <li>
            <strong>Demographic Information:</strong> Age, gender, location, and other demographic information you choose to provide.
          </li>
          <li>
            <strong>Health Information:</strong> Mental health history, treatment information, and other health-related information you share during counseling sessions.
          </li>
          <li>
            <strong>Session Data:</strong> Information shared during counseling sessions, including text, audio, or video communications with our AI counselor.
          </li>
          <li>
            <strong>Technical Information:</strong> Device information, IP address, browser type, operating system, and other technical identifiers.
          </li>
        </ul>

        <h4>2.2 Information Collected Automatically</h4>
        <p>When you use our services, we automatically collect certain information, including:</p>
        <ul>
          <li>
            <strong>Usage Data:</strong> How you interact with our service, including session duration, features used, and navigation patterns.
          </li>
          <li>
            <strong>Device Information:</strong> Information about your device, including device type, operating system, and browser.
          </li>
          <li>
            <strong>Location Information:</strong> General location information based on IP address.
          </li>
        </ul>

        <h3>3. HOW WE USE YOUR INFORMATION</h3>
        <p>We use your information for the following purposes:</p>
        <ul>
          <li>To provide and maintain our AI counseling services</li>
          <li>To personalize your experience and improve our AI's responses</li>
          <li>To analyze usage patterns and improve our services</li>
          <li>To communicate with you regarding service updates, feedback, or support</li>
          <li>To ensure the security and integrity of our platform</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h3>4. DATA STORAGE AND SECURITY</h3>
        <h4>4.1 Data Storage</h4>
        <p>
          We store your personal information on secure servers with appropriate technical and organizational measures to protect against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h4>4.2 Data Retention</h4>
        <p>
          We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
        </p>

        <h4>4.3 Security Measures</h4>
        <p>We implement a variety of security measures to maintain the safety of your personal information, including:</p>
        <ul>
          <li>Encryption of sensitive data</li>
          <li>Regular security assessments</li>
          <li>Access controls and authentication procedures</li>
          <li>Staff training on data protection</li>
          <li>Incident response plans</li>
        </ul>

        <h3>5. SHARING YOUR INFORMATION</h3>
        <h4>5.1 Service Providers</h4>
        <p>
          We may share your information with third-party service providers who perform services on our behalf, such as hosting providers, analytics services, and customer support tools. These providers have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
        </p>

        <h4>5.2 Legal Requirements</h4>
        <p>
          We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
        </p>

        <h4>5.3 Business Transfers</h4>
        <p>
          If Gray Sky AI is involved in a merger, acquisition, or asset sale, your personal information may be transferred as a business asset. We will notify you before your personal information is transferred and becomes subject to a different Privacy Policy.
        </p>

        <h4>5.4 With Your Consent</h4>
        <p>
          We may share your information in any other circumstances where we have your consent.
        </p>

        <h3>6. YOUR RIGHTS AND CHOICES</h3>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>The right to access the personal information we hold about you</li>
          <li>The right to request correction of inaccurate personal information</li>
          <li>The right to request deletion of your personal information</li>
          <li>The right to restrict or object to our processing of your personal information</li>
          <li>The right to data portability</li>
          <li>The right to withdraw consent at any time, where we rely on consent to process your information</li>
        </ul>
        <p>
          To exercise these rights, please contact us using the details provided in the "Contact Us" section.
        </p>

        <h3>7. CHILDREN'S PRIVACY</h3>
        <p>
          Our services are not intended for individuals under the age of 18. We do not knowingly collect or solicit personal information from anyone under the age of 18. If we learn that we have collected personal information from a child under 18, we will promptly delete that information.
        </p>

        <h3>8. INTERNATIONAL DATA TRANSFERS</h3>
        <p>
          Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We have taken appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy.
        </p>

        <h3>9. CHANGES TO THIS PRIVACY POLICY</h3>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h3>10. SPECIFIC PROVISIONS FOR AI COUNSELING</h3>
        <h4>10.1 AI Training and Improvement</h4>
        <p>
          To improve our AI counseling service, we may use de-identified and aggregated data from counseling sessions to train and refine our AI systems. This process involves removing all personally identifiable information from the data.
        </p>

        <h4>10.2 Human Review</h4>
        <p>
          In certain limited circumstances, authorized human staff may review counseling sessions to ensure quality, address technical issues, or improve our AI systems. All staff are bound by strict confidentiality obligations.
        </p>

        <h4>10.3 Crisis Intervention</h4>
        <p>
          If our AI counselor detects expressions of self-harm or harm to others during a session, we may take appropriate steps to provide crisis resources or, in severe cases, contact emergency services.
        </p>

        <h3>11. CONTACT US</h3>
        <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
        <p>
          <strong>Gray Sky AI</strong>
          <br />
          Email: <a href="mailto:support@grayskyai.com">support@grayskyai.com</a>
        </p>

        <h3>12. GOVERNING LAW</h3>
        <p>
          This Privacy Policy is governed by and construed in accordance with the laws of Texas, without giving effect to any principles of conflicts of law.
        </p>
      </Box>
    </SettingSection>
  );
};

export default PrivacyContent;
