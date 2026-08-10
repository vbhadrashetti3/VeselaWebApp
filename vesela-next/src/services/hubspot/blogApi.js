/**
 * HubSpot Blog API Service Layer
 * Abstracts HubSpot v3 CMS Blog Posts API endpoints into clean domain functions.
 */

import { hubspotFetch } from "./hubspotClient";

// Sample fallback posts for development when HUBSPOT_ACCESS_TOKEN is not configured
const SAMPLE_POSTS = [
  {
    id: "post-1",
    slug: "future-of-human-alignment-ai",
    title: "The Future of Human Alignment AI: Building Empathetic Systems",
    summary: "Explore how recent breakthroughs in human alignment models enable AI assistants to better comprehend nuance, ethics, and emotion.",
    htmlContent: `
      <p>As artificial intelligence systems become deeply integrated into daily personal and professional workflows, the fundamental challenge is no longer just raw capabilities, but alignment. How do we ensure intelligent systems resonate with human values, emotional intelligence, and safety?</p>

      <h2>1. Defining Human Alignment in Modern AI</h2>
      <p>Human alignment AI focuses on training models to comprehend subtle context, tone, and moral boundaries. Rather than optimizing purely for statistical likelihood, alignment architectures emphasize user safety, empathy, and constructive dialogue.</p>

      <blockquote>"The true metric of AI intelligence is not merely answering questions, but understanding the human heart behind the query."</blockquote>

      <h2>2. Core Architectural Pillars</h2>
      <p>To achieve meaningful alignment, contemporary platforms rely on three primary pillars:</p>
      <ul>
        <li><strong>Reinforcement Learning from Ethical Human Feedback (RLHF):</strong> Aligning responses against verified human feedback benchmarks.</li>
        <li><strong>Contextual Empathy Engines:</strong> Analyzing conversational sentiment and adapting response cadence.</li>
        <li><strong>Transparent Safety Rails:</strong> Guaranteeing data privacy and preventing harmful output generation.</li>
      </ul>

      <h2>3. Real-World Applications & Impact</h2>
      <p>From personalized mental wellness support to intuitive enterprise copilots, aligned AI systems create safer, more meaningful user interactions across diverse industries.</p>

      <pre><code>// Example: Alignment scoring function configuration
const alignmentConfig = {
  empathyWeight: 0.85,
  contextSensitivity: "high",
  safetyThreshold: 0.99
};</code></pre>

      <h2>Conclusion</h2>
      <p>The journey toward fully aligned artificial intelligence is collaborative and ongoing. By placing human empathy at the center of technological progress, we build tools that enhance rather than diminish human connection.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    authorName: "Dr. Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    publishDate: "2026-08-01T10:00:00Z",
    category: "Technology",
    tags: ["AI Alignment", "Technology", "Research"],
    readTimeMinutes: 5,
  },
  {
    id: "post-2",
    slug: "designing-intuitive-conversational-interfaces",
    title: "Designing Intuitive Conversational Interfaces for Enterprise Users",
    summary: "A deep dive into UI/UX patterns, micro-interactions, and visual design rules for next-generation AI chat applications.",
    htmlContent: `
      <p>Conversational interfaces have evolved beyond simple chatbots into full-featured work hubs. Designing these interfaces requires a balance between speed, visual clarity, and rich interactivity.</p>

      <h2>Key Design Considerations</h2>
      <p>When crafting complex conversational web apps, focus on visual hierarchy, theme adaptability (light and dark mode support), and accessible typographic contrast.</p>

      <h2>Fluid Micro-Animations</h2>
      <p>Subtle loading animations and streaming message reveals prevent cognitive lag and maintain user context during real-time interactions.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    authorName: "Marcus Vance",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    publishDate: "2026-07-25T14:30:00Z",
    category: "Product Design",
    tags: ["UX Design", "Product Design", "Frontend"],
    readTimeMinutes: 4,
  },
  {
    id: "post-3",
    slug: "scaling-nextjs-performance-best-practices",
    title: "Scaling Next.js Applications: Production Performance & Caching",
    summary: "Learn how to optimize Next.js server side rendering, static site generation, component revalidation, and asset caching.",
    htmlContent: `
      <p>Building high-performing web applications requires leveraging Next.js caching layers effectively without introducing stale data bugs.</p>

      <h2>Incremental Static Revalidation</h2>
      <p>Combining dynamic routing with background revalidation ensures instant load times for users while keeping dynamic CMS content up to date.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    authorName: "Sarah Chen",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    publishDate: "2026-07-18T09:15:00Z",
    category: "Engineering",
    tags: ["Engineering", "Next.js", "Performance"],
    readTimeMinutes: 6,
  },
  {
    id: "post-4",
    slug: "ethical-ai-benchmarks-and-evaluation",
    title: "Understanding Ethical AI Benchmarks: Beyond Standard Accuracy Metrics",
    summary: "Why traditional accuracy metrics fail to capture alignment quality, and how modern benchmark suites evaluate safety and truthfulness.",
    htmlContent: `
      <p>Measuring AI progress has traditionally relied on benchmark datasets focused on code generation or standardized test taking. However, evaluating safety and human preference requires entirely new testing paradigms.</p>

      <h2>Humanity Bench Metrics</h2>
      <p>Evaluating models across context sensitivity, ethical boundary compliance, and logical reasoning under uncertainty.</p>
    `,
    featuredImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
    authorName: "Dr. Elena Rostova",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    publishDate: "2026-07-10T11:00:00Z",
    category: "Research",
    tags: ["Research", "AI Alignment", "Ethics"],
    readTimeMinutes: 7,
  },
];

/**
 * Calculates estimated reading time in minutes based on HTML content.
 * @param {string} html 
 * @returns {number}
 */
export function calculateReadTime(html) {
  if (!html) return 3;
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Normalizes raw HubSpot post object into clean application schema.
 * @param {Object} rawPost - Raw post object from HubSpot v3 API
 * @returns {BlogPost}
 */
export function normalizePost(rawPost) {
  if (!rawPost) return null;

  const content = rawPost.postBody || rawPost.postSummary || rawPost.post_body || "";
  const summary = rawPost.postSummary || rawPost.metaDescription || (content ? content.replace(/<[^>]+>/g, "").slice(0, 160) + "..." : "");

  // Author details
  const authorName = rawPost.blogAuthor?.name || rawPost.authorName || rawPost.authorNameCustom || "Gray Sky AI Team";
  const authorAvatar = rawPost.blogAuthor?.avatar || rawPost.blogAuthor?.hasAvatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  // Featured Image
  const featuredImage = rawPost.featuredImage || rawPost.featured_image || rawPost.postFeaturedImageIfEnabled || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80";

  // Category & Tags
  const category = rawPost.topicNames?.[0] || rawPost.blogCategory?.name || rawPost.category || "Insights";
  const tags = rawPost.tagNames || rawPost.topicNames || [category];

  // Slug normalization (strip leading/trailing slashes if present)
  let slug = rawPost.slug || rawPost.id;
  if (typeof slug === "string") {
    slug = slug.replace(/^\/+|\/+$/g, "").replace(/^blog\//, "");
  }

  return {
    id: String(rawPost.id),
    slug: String(slug),
    title: rawPost.name || rawPost.title || "Untitled Post",
    summary: summary,
    htmlContent: content,
    featuredImage: featuredImage,
    authorName: authorName,
    authorAvatar: authorAvatar,
    publishDate: rawPost.publishDate || rawPost.created || rawPost.publish_date || new Date().toISOString(),
    category: category,
    tags: Array.isArray(tags) ? tags : [category],
    readTimeMinutes: calculateReadTime(content),
  };
}

/**
 * Fetches paginated blog posts from HubSpot CMS API.
 * Supports filtering by page, search query, category, and tag.
 * 
 * @param {Object} [params={}]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=6]
 * @param {string} [params.search=""]
 * @param {string} [params.category=""]
 * @param {string} [params.tag=""]
 * @returns {Promise<{ posts: Array<BlogPost>, total: number, totalPages: number, currentPage: number, categories: Array<string> }>}
 */
export async function getBlogPosts(params = {}) {
  const page = parseInt(params.page || 1, 10);
  const limit = parseInt(params.limit || 6, 10);
  const search = (params.search || "").trim().toLowerCase();
  const category = (params.category || "").trim();
  const tag = (params.tag || "").trim();

  // If token is missing, return sample posts gracefully
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    let filtered = [...SAMPLE_POSTS];

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.summary.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (tag) {
      filtered = filtered.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedPosts = filtered.slice(startIndex, startIndex + limit);

    // Extract all unique categories
    const categories = ["All", ...new Set(SAMPLE_POSTS.map((p) => p.category))];

    return {
      posts: paginatedPosts,
      total,
      totalPages,
      currentPage: page,
      categories,
    };
  }

  try {
    const blogId = process.env.HUBSPOT_BLOG_ID;
    const offset = (page - 1) * limit;
    
    let endpoint = `/cms/v3/blogs/posts?limit=${limit}&offset=${offset}&state=PUBLISHED&sort=-publishDate`;
    if (blogId) {
      endpoint += `&contentGroupId=${blogId}`;
    }

    const data = await hubspotFetch(endpoint);
    const rawResults = data.results || [];
    let posts = rawResults.map(normalizePost);

    // Apply search filter if requested
    if (search) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.summary.toLowerCase().includes(search)
      );
    }

    // Apply category filter if requested
    if (category && category !== "All") {
      posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    const total = data.total || posts.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Extract categories
    const categories = ["All", ...new Set(posts.map((p) => p.category))];

    return {
      posts,
      total,
      totalPages,
      currentPage: page,
      categories,
    };
  } catch (error) {
    console.error("HubSpot API getBlogPosts Error:", error.message);
    throw error;
  }
}

/**
 * Fetches a single blog post by slug.
 * @param {string} slug 
 * @returns {Promise<BlogPost|null>}
 */
export async function getBlogPostBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "").replace(/^blog\//, "");

  // If token is missing, return sample post matching slug
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    const post = SAMPLE_POSTS.find((p) => p.slug === cleanSlug);
    return post || null;
  }

  try {
    // Query post by slug using HubSpot v3 Posts endpoint filter
    const endpoint = `/cms/v3/blogs/posts?slug=${encodeURIComponent(cleanSlug)}&state=PUBLISHED`;
    const data = await hubspotFetch(endpoint);
    
    if (data.results && data.results.length > 0) {
      return normalizePost(data.results[0]);
    }

    // Try fetching with "blog/" prefix if direct slug fails
    const altEndpoint = `/cms/v3/blogs/posts?slug=blog/${encodeURIComponent(cleanSlug)}&state=PUBLISHED`;
    const altData = await hubspotFetch(altEndpoint);
    if (altData.results && altData.results.length > 0) {
      return normalizePost(altData.results[0]);
    }

    return null;
  } catch (error) {
    console.error(`HubSpot API getBlogPostBySlug (${cleanSlug}) Error:`, error.message);
    return null;
  }
}

/**
 * Fetches related blog articles based on matching tags or category.
 * @param {string} currentPostId 
 * @param {Array<string>} tags 
 * @param {number} [limit=3] 
 * @returns {Promise<Array<BlogPost>>}
 */
export async function getRelatedPosts(currentPostId, tags = [], limit = 3) {
  try {
    const { posts } = await getBlogPosts({ limit: 12 });
    const otherPosts = posts.filter((p) => String(p.id) !== String(currentPostId));

    if (tags.length === 0) {
      return otherPosts.slice(0, limit);
    }

    // Sort by number of matching tags
    const scored = otherPosts.map((post) => {
      const matchCount = post.tags.filter((t) => tags.includes(t)).length;
      return { post, score: matchCount };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((item) => item.post).slice(0, limit);
  } catch (error) {
    console.error("HubSpot API getRelatedPosts Error:", error.message);
    return [];
  }
}
