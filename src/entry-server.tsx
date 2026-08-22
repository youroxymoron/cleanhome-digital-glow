import { renderToString } from "react-dom/server";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import App from "./App";
import { supabase } from "./integrations/supabase/client";
import { buildStructuredData, DEFAULT_FAQS, getSeoMetadata, SeoService } from "./lib/seo";
import type { Database } from "./integrations/supabase/types";

type TableName = keyof Database["public"]["Tables"];

async function fetchActiveTable(table: string) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

async function fetchSiteContent(blockKey: string) {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("block_key", blockKey)
    .single();
  if (error) throw error;
  return data.content;
}

async function prefetchPublicData(queryClient: QueryClient, pathname: string) {
  const tasks: Promise<unknown>[] = [
    queryClient.prefetchQuery({ queryKey: ["contacts"], queryFn: () => fetchActiveTable("contacts") }),
    queryClient.prefetchQuery({ queryKey: ["site_content", "footer"], queryFn: () => fetchSiteContent("footer") }),
  ];
  const needsServices = pathname === "/" || pathname === "/services" || pathname.startsWith("/services/");

  if (needsServices) {
    tasks.push(queryClient.prefetchQuery({ queryKey: ["services"], queryFn: () => fetchActiveTable("services") }));
  }

  if (pathname === "/") {
    tasks.push(
      queryClient.prefetchQuery({ queryKey: ["faq_items"], queryFn: () => fetchActiveTable("faq_items") }),
      queryClient.prefetchQuery({ queryKey: ["reviews"], queryFn: () => fetchActiveTable("reviews") }),
      queryClient.prefetchQuery({ queryKey: ["gallery_items"], queryFn: () => fetchActiveTable("gallery_items") }),
      queryClient.prefetchQuery({ queryKey: ["site_content", "stats"], queryFn: () => fetchSiteContent("stats") }),
      queryClient.prefetchQuery({ queryKey: ["site_content", "contacts_header"], queryFn: () => fetchSiteContent("contacts_header") }),
    );
  }

  if (pathname === "/services") {
    tasks.push(queryClient.prefetchQuery({ queryKey: ["site_content", "services_header"], queryFn: () => fetchSiteContent("services_header") }));
  }

  await Promise.all(tasks);
}

export async function render(url: string) {
  const pathname = new URL(url, "https://cleanhousednr.ru").pathname.replace(/\/$/, "") || "/";
  const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } });
  await prefetchPublicData(queryClient, pathname);

  const services = (queryClient.getQueryData(["services"]) || []) as SeoService[];
  const currentService = pathname.startsWith("/services/")
    ? services.find((service) => service.id === pathname.split("/").pop())
    : undefined;
  const fetchedFaqs = (queryClient.getQueryData(["faq_items"]) || []) as NonNullable<Parameters<typeof buildStructuredData>[0]["faqs"]>;
  const faqs = fetchedFaqs.length ? fetchedFaqs : DEFAULT_FAQS;
  const reviews = (queryClient.getQueryData(["reviews"]) || []) as Parameters<typeof buildStructuredData>[0]["reviews"];
  const contacts = (queryClient.getQueryData(["contacts"]) || []) as Parameters<typeof buildStructuredData>[0]["contacts"];
  const state = dehydrate(queryClient);

  return {
    html: renderToString(<App location={pathname} queryClient={queryClient} dehydratedState={state} />),
    state,
    seo: getSeoMetadata(pathname, currentService),
    schemas: buildStructuredData({ pathname, services, currentService, faqs, reviews, contacts }),
  };
}
