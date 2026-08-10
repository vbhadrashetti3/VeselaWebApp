"use client";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

export function CardSkeleton() {
  return (
    <Box className="blog-card-skeleton" sx={{ borderRadius: 3, overflow: "hidden", p: 2, border: "1px solid var(--line)", background: "var(--card)" }}>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 2 }} />
      <Skeleton variant="text" width="30%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={18} />
          <Skeleton variant="text" width="30%" height={14} />
        </Box>
      </Box>
    </Box>
  );
}

export function FeaturedSkeleton() {
  return (
    <Box className="featured-skeleton" sx={{ borderRadius: 4, p: 3, mb: 6, border: "1px solid var(--line)", background: "var(--card)", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
      <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Skeleton variant="text" width="25%" height={28} sx={{ mb: 1.5 }} />
        <Skeleton variant="text" width="95%" height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="85%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={44} height={44} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="35%" height={20} />
            <Skeleton variant="text" width="25%" height={16} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function PostDetailSkeleton() {
  return (
    <Box className="blog-detail-skeleton" sx={{ maxWidth: 840, mx: "auto", px: 2, py: 6 }}>
      <Skeleton variant="text" width="20%" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="90%" height={48} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="75%" height={48} sx={{ mb: 3 }} />
      <Skeleton variant="text" width="60%" height={24} sx={{ mb: 4 }} />
      <Skeleton variant="rectangular" width="100%" height={420} sx={{ borderRadius: 3, mb: 4 }} />
      <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="98%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="95%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="85%" height={24} sx={{ mb: 1 }} />
    </Box>
  );
}

export default function BlogSkeleton({ type = "grid" }) {
  if (type === "detail") return <PostDetailSkeleton />;
  return (
    <Box sx={{ width: "100%" }}>
      {type === "grid" && <FeaturedSkeleton />}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </Box>
    </Box>
  );
}
