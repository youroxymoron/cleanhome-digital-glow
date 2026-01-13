import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  stats: {
    years: string;
    clients: string;
    cleanings: string;
  };
}

export interface HeaderContent {
  title: string;
  subtitle: string;
  description: string;
}

export interface FooterContent {
  description: string;
}

export function useSiteContent<T>(blockKey: string) {
  return useQuery({
    queryKey: ["site_content", blockKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("block_key", blockKey)
        .single();

      if (error) throw error;
      return data.content as T;
    },
  });
}

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blockKey, content }: { blockKey: string; content: Json }) => {
      const { error } = await supabase
        .from("site_content")
        .update({ content })
        .eq("block_key", blockKey);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["site_content", variables.blockKey] });
    },
  });
}
