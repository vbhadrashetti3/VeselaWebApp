import AppSidebar from "@/components/app/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
