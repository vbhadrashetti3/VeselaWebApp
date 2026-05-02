"use client";

import { useState, useEffect } from "react";
import DOMPurify from "dompurify"; 
import { get } from "@/lib/apiService";

export const useFetchHtml = (endpoint) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await get(endpoint);
        
        // Handle axios response structure or direct data
        const data = response?.data || response;

        if (data && typeof data === "string") {
          // Sanitize HTML to prevent XSS
          const cleanHtml = DOMPurify.sanitize(data);
          setHtmlContent(cleanHtml);
        } else {
          setHtmlContent("");
        }
      } catch (err) {
        console.error(`❌ Failed to fetch content from ${endpoint}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchContent();
    }
  }, [endpoint]);

  return { htmlContent, loading, error };
};