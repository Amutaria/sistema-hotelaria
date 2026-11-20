import ToastProvider from "./_components/ToastProvider";

export default function QuartosLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}