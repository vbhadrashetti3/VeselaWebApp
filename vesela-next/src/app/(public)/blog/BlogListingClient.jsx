"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import BlogCard from "@/components/blog/BlogCard";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSkeleton from "@/components/blog/BlogSkeleton";
import BlogEmptyState from "@/components/blog/BlogEmptyState";
import BlogErrorState from "@/components/blog/BlogErrorState";

export default function BlogListingClient({
  initialData,
  initialError,
  initialPage = 1,
  initialSearch = "",
  initialCategory = "All",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [postsData, setPostsData] = useState(initialData);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || initialPage, 10);
  const currentSearch = searchParams.get("search") || initialSearch;
  const currentCategory = searchParams.get("category") || initialCategory;

  useEffect(() => {
    let isMounted = true;
    const fetchFilteredPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (currentPage > 1) query.set("page", currentPage);
        if (currentSearch) query.set("search", currentSearch);
        if (currentCategory && currentCategory !== "All") query.set("category", currentCategory);

        const res = await fetch(`/api/blog?${query.toString()}`);
        const data = await res.json();

        if (isMounted) {
          if (data.success) {
            setPostsData(data);
          } else {
            setError(data.message || "Failed to fetch blog posts");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError("Network error. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFilteredPosts();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value === "All" || (key === "page" && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newPath = queryString ? `/blog?${queryString}` : "/blog";

    startTransition(() => {
      router.push(newPath, { scroll: false });
    });
  };

  const handleSearch = (searchTerm) => {
    updateQueryParams({ search: searchTerm, page: 1 });
  };

  const handleCategorySelect = (categoryName) => {
    updateQueryParams({ category: categoryName, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResetFilters = () => {
    startTransition(() => {
      router.push("/blog");
    });
  };

  const posts = postsData?.posts || [];
  const totalPages = postsData?.totalPages || 1;
  const categories = postsData?.categories || ["All"];

  return (
    <main className="blog-listing-page" style={{ paddingTop: "90px", paddingBottom: "80px", minHeight: "80vh" }}>
      <Container maxWidth="lg">
        {/* Simple Clean Blog Header */}
        <Box sx={{ textAlign: "center", maxWidth: 640, mx: "auto", mb: 5 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.5rem" },
              mb: 1,
              color: "var(--ink)",
            }}
          >
            Blog
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", sm: "1.125rem" },
              color: "var(--muted)",
            }}
          >
            Latest insights, updates and articles.
          </Typography>
        </Box>

        {/* Search & Category Filter Control Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 4,
          }}
        >
          <BlogSearch value={currentSearch} onSearch={handleSearch} />
          <BlogFilters categories={categories} activeCategory={currentCategory} onSelectCategory={handleCategorySelect} />
        </Box>

        {/* States / Content */}
        {loading && !postsData ? (
          <BlogSkeleton type="grid" />
        ) : error ? (
          <BlogErrorState onRetry={() => updateQueryParams({ page: currentPage })} />
        ) : posts.length === 0 ? (
          <BlogEmptyState search={currentSearch} onReset={handleResetFilters} />
        ) : (
          <>
            {/* Simple Responsive Blog Grid (3-col desktop, 2-col tablet, 1-col mobile) */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
                my: 2,
              }}
            >
              {posts.map((post) => (
                <BlogCard key={post.id || post.slug} post={post} />
              ))}
            </Box>

            {/* Pagination */}
            <BlogPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </Container>
    </main>
  );
}
