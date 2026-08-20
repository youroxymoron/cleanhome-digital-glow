import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryItem {
  id: string;
  title: string;
  before_image_url: string | null;
  after_image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
}

export function useAllGallery() {
  return useQuery({
    queryKey: ["gallery_items", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
}

export function useUpdateGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<GalleryItem> & { id: string }) => {
      const { error } = await supabase.from("gallery_items").update(item).eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery_items"] }),
  });
}

export function useCreateGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<GalleryItem, "id">) => {
      const { error } = await supabase.from("gallery_items").insert(item);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery_items"] }),
  });
}

export function useDeleteGallery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gallery_items"] }),
  });
}
