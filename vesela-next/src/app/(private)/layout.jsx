import PrivateLayoutClient from "./PrivateLayoutClient";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Layout wrapper for all private (authenticated) routes.
 * Applies the Chat Application theme — primary brand: #1f222a.
 */
export default function PrivateLayout({ children }) {
  return <PrivateLayoutClient>{children}</PrivateLayoutClient>;
}
