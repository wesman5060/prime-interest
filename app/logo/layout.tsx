export default function LogoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#111", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 80, padding: "80px 40px" }}>
      {children}
    </div>
  );
}
