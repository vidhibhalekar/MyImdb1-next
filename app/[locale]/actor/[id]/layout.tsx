import { ReactNode } from "react";
import ClientLayout from "./ClientLayout";

export default async function Layout({
  children,
  awards,
  social,
  similar,
  params,
}: {
  children: ReactNode;
  awards: ReactNode;
  social: ReactNode;
  similar: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale = "en" } = await params;

  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    messages = (await import(`@/messages/en.json`)).default;
  }

  return (
    <ClientLayout
      messages={messages}
      awards={awards}
      social={social}
      similar={similar}
    >
      {children}
    </ClientLayout>
  );
}