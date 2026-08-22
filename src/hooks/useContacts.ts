import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contact {
  id: string;
  contact_type: string;
  label: string;
  value: string;
  href: string | null;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export const DEFAULT_CONTACTS: Contact[] = [
  { id: "default-phone-primary", contact_type: "phone", label: "Телефон", value: "+7 949 501 57 51", href: "tel:+79495015751", icon: "Phone", sort_order: 1, is_active: true },
  { id: "default-phone-secondary", contact_type: "phone", label: "Второй телефон", value: "+7 949 376 38 97", href: "tel:+79493763897", icon: "Phone", sort_order: 2, is_active: true },
  { id: "default-email", contact_type: "email", label: "Email", value: "info@cleanhousednr.ru", href: "mailto:info@cleanhousednr.ru", icon: "Mail", sort_order: 3, is_active: true },
  { id: "default-address", contact_type: "address", label: "Адрес", value: "г. Донецк, ДНР", href: null, icon: "MapPin", sort_order: 4, is_active: true },
  { id: "default-hours", contact_type: "hours", label: "Режим работы", value: "Пн–Сб: 8:00–20:00", href: null, icon: "Clock", sort_order: 5, is_active: true },
];

export function getDisplayContacts(contacts?: Contact[]) {
  return contacts?.length ? contacts : DEFAULT_CONTACTS;
}

export function useContacts() {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data as Contact[];
    },
  });
}

export function useAllContacts() {
  return useQuery({
    queryKey: ["contacts", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as Contact[];
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Partial<Contact> & { id: string }) => {
      const { error } = await supabase
        .from("contacts")
        .update(contact)
        .eq("id", contact.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contact: Omit<Contact, "id">) => {
      const { error } = await supabase.from("contacts").insert(contact);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
