import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export function useFaq() {
  return useQuery({
    queryKey: ["faq_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as FaqItem[];
    },
  });
}

export function useAllFaq() {
  return useQuery({
    queryKey: ["faq_items", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as FaqItem[];
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<FaqItem> & { id: string }) => {
      const { error } = await supabase.from("faq_items").update(item).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faq_items"] }),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<FaqItem, "id">) => {
      const { error } = await supabase.from("faq_items").insert(item);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faq_items"] }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faq_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faq_items"] }),
  });
}
