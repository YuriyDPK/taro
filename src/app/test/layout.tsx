export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#333] w-full p-0 m-0">
      {children}
    </div>
  );
}
