import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  Home,
  Building2,
  Sofa,
  SprayCan,
  Sparkles,
  HardHat,
  Shield,
  Clock,
  Leaf,
  Award,
  Users,
  ThumbsUp,
  Phone,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Hooks
import { useAllServices, useUpdateService, useCreateService, useDeleteService, Service, categoryLabels } from "@/hooks/useServices";
import { useAllFeatures, useUpdateFeature, useCreateFeature, useDeleteFeature, Feature } from "@/hooks/useFeatures";
import { useAllContacts, useUpdateContact, useCreateContact, useDeleteContact, Contact } from "@/hooks/useContacts";
import { useAllReviews, useUpdateReview, useCreateReview, useDeleteReview, Review } from "@/hooks/useReviews";
import { useAllFaq, useUpdateFaq, useCreateFaq, useDeleteFaq, FaqItem } from "@/hooks/useFaq";
import { useAllGallery, useUpdateGallery, useCreateGallery, useDeleteGallery, GalleryItem } from "@/hooks/useGallery";
import { useSiteContent, useUpdateSiteContent, HeroContent, HeaderContent, FooterContent, StatsContent } from "@/hooks/useSiteContent";

const iconOptions = [
  { value: "Home", label: "Дом", icon: Home },
  { value: "Building2", label: "Здание", icon: Building2 },
  { value: "Sofa", label: "Диван", icon: Sofa },
  { value: "SprayCan", label: "Спрей", icon: SprayCan },
  { value: "Sparkles", label: "Блеск", icon: Sparkles },
  { value: "HardHat", label: "Каска", icon: HardHat },
  { value: "Shield", label: "Щит", icon: Shield },
  { value: "Clock", label: "Часы", icon: Clock },
  { value: "Leaf", label: "Лист", icon: Leaf },
  { value: "Award", label: "Награда", icon: Award },
  { value: "Users", label: "Пользователи", icon: Users },
  { value: "ThumbsUp", label: "Палец вверх", icon: ThumbsUp },
  { value: "Phone", label: "Телефон", icon: Phone },
  { value: "Mail", label: "Почта", icon: Mail },
  { value: "MapPin", label: "Локация", icon: MapPin },
];

const AdminPage = () => {
  const { toast } = useToast();
  
  // Data hooks
  const { data: services, isLoading: servicesLoading } = useAllServices();
  const { data: features, isLoading: featuresLoading } = useAllFeatures();
  const { data: contacts, isLoading: contactsLoading } = useAllContacts();
  const { data: reviews, isLoading: reviewsLoading } = useAllReviews();
  const { data: faqItems, isLoading: faqLoading } = useAllFaq();
  const { data: galleryItems, isLoading: galleryLoading } = useAllGallery();
  const { data: heroContent } = useSiteContent<HeroContent>("hero");
  const { data: servicesHeader } = useSiteContent<HeaderContent>("services_header");
  const { data: whyUsHeader } = useSiteContent<HeaderContent>("why_us_header");
  const { data: contactsHeader } = useSiteContent<HeaderContent>("contacts_header");
  const { data: footerContent } = useSiteContent<FooterContent>("footer");
  const { data: statsContent } = useSiteContent<StatsContent>("stats");
  
  // Mutation hooks
  const updateService = useUpdateService();
  const createService = useCreateService();
  const deleteService = useDeleteService();
  const updateFeature = useUpdateFeature();
  const createFeature = useCreateFeature();
  const deleteFeature = useDeleteFeature();
  const updateContact = useUpdateContact();
  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();
  const updateReview = useUpdateReview();
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const updateFaq = useUpdateFaq();
  const createFaq = useCreateFaq();
  const deleteFaq = useDeleteFaq();
  const updateGallery = useUpdateGallery();
  const createGallery = useCreateGallery();
  const deleteGallery = useDeleteGallery();
  const updateSiteContent = useUpdateSiteContent();
  
  // Edit states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [newService, setNewService] = useState(false);
  const [newFeature, setNewFeature] = useState(false);
  const [newContact, setNewContact] = useState(false);
  const [newReview, setNewReview] = useState(false);
  const [newFaq, setNewFaq] = useState(false);
  const [newGallery, setNewGallery] = useState(false);

  const handleSaveService = async (service: Partial<Service> & { id?: string }) => {
    try {
      if (service.id) {
        await updateService.mutateAsync(service as Service);
      } else {
        await createService.mutateAsync(service as Omit<Service, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingService(null);
      setNewService(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Удалить услугу?")) {
      await deleteService.mutateAsync(id);
      toast({ title: "Услуга удалена" });
    }
  };

  const handleSaveFeature = async (feature: Partial<Feature> & { id?: string }) => {
    try {
      if (feature.id) {
        await updateFeature.mutateAsync(feature as Feature);
      } else {
        await createFeature.mutateAsync(feature as Omit<Feature, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingFeature(null);
      setNewFeature(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (confirm("Удалить преимущество?")) {
      await deleteFeature.mutateAsync(id);
      toast({ title: "Преимущество удалено" });
    }
  };

  const handleSaveContact = async (contact: Partial<Contact> & { id?: string }) => {
    try {
      if (contact.id) {
        await updateContact.mutateAsync(contact as Contact);
      } else {
        await createContact.mutateAsync(contact as Omit<Contact, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingContact(null);
      setNewContact(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm("Удалить контакт?")) {
      await deleteContact.mutateAsync(id);
      toast({ title: "Контакт удалён" });
    }
  };

  const handleSaveReview = async (review: Partial<Review> & { id?: string }) => {
    try {
      if (review.id) {
        await updateReview.mutateAsync(review as Review);
      } else {
        await createReview.mutateAsync(review as Omit<Review, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingReview(null);
      setNewReview(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm("Удалить отзыв?")) {
      await deleteReview.mutateAsync(id);
      toast({ title: "Отзыв удалён" });
    }
  };

  const handleSaveFaq = async (faq: Partial<FaqItem> & { id?: string }) => {
    try {
      if (faq.id) {
        await updateFaq.mutateAsync(faq as FaqItem);
      } else {
        await createFaq.mutateAsync(faq as Omit<FaqItem, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingFaq(null);
      setNewFaq(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (confirm("Удалить вопрос?")) {
      await deleteFaq.mutateAsync(id);
      toast({ title: "Вопрос удалён" });
    }
  };

  const handleSaveGallery = async (item: Partial<GalleryItem> & { id?: string }) => {
    try {
      if (item.id) {
        await updateGallery.mutateAsync(item as GalleryItem);
      } else {
        await createGallery.mutateAsync(item as Omit<GalleryItem, "id">);
      }
      toast({ title: "Успешно сохранено!" });
      setEditingGallery(null);
      setNewGallery(false);
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm("Удалить элемент галереи?")) {
      await deleteGallery.mutateAsync(id);
      toast({ title: "Элемент удалён" });
    }
  };

  const handleUpdateSiteContent = async (blockKey: string, content: Record<string, unknown>) => {
    try {
      await updateSiteContent.mutateAsync({ blockKey, content: content as import("@/integrations/supabase/types").Json });
      toast({ title: "Контент обновлён!" });
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Управление контентом
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Редактируйте текст, услуги и контакты на сайте
            </p>
          </motion.div>

          <Tabs defaultValue="content" className="space-y-6 md:space-y-8">
            <div className="-mx-4 px-4 overflow-x-auto pb-2">
              <TabsList className="inline-flex w-max h-auto flex-nowrap gap-1">
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="content">Тексты</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="services">Услуги</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="features">Преимущества</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="contacts">Контакты</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="reviews">Отзывы</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="gallery">Галерея</TabsTrigger>
                <TabsTrigger className="whitespace-nowrap text-xs sm:text-sm" value="faq">FAQ</TabsTrigger>
              </TabsList>
            </div>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              {/* Hero Section */}
              <ContentEditor
                title="Hero секция"
                blockKey="hero"
                content={heroContent}
                fields={[
                  { key: "title", label: "Заголовок", type: "text" },
                  { key: "subtitle", label: "Подзаголовок", type: "text" },
                  { key: "description", label: "Описание", type: "textarea" },
                ]}
                onSave={handleUpdateSiteContent}
              />

              {/* Services Header */}
              <ContentEditor
                title="Заголовок секции услуг"
                blockKey="services_header"
                content={servicesHeader}
                fields={[
                  { key: "title", label: "Заголовок", type: "text" },
                  { key: "subtitle", label: "Подзаголовок", type: "text" },
                  { key: "description", label: "Описание", type: "textarea" },
                ]}
                onSave={handleUpdateSiteContent}
              />

              {/* Why Us Header */}
              <ContentEditor
                title="Заголовок секции 'Почему мы'"
                blockKey="why_us_header"
                content={whyUsHeader}
                fields={[
                  { key: "title", label: "Заголовок", type: "text" },
                  { key: "subtitle", label: "Подзаголовок", type: "text" },
                  { key: "description", label: "Описание", type: "textarea" },
                ]}
                onSave={handleUpdateSiteContent}
              />

              {/* Contacts Header */}
              <ContentEditor
                title="Заголовок секции контактов"
                blockKey="contacts_header"
                content={contactsHeader}
                fields={[
                  { key: "title", label: "Заголовок", type: "text" },
                  { key: "subtitle", label: "Подзаголовок", type: "text" },
                  { key: "description", label: "Описание", type: "textarea" },
                ]}
                onSave={handleUpdateSiteContent}
              />

              {/* Footer */}
              <ContentEditor
                title="Футер"
                blockKey="footer"
                content={footerContent}
                fields={[
                  { key: "description", label: "Описание компании", type: "textarea" },
                ]}
                onSave={handleUpdateSiteContent}
              />

              {/* Stats */}
              <ContentEditor
                title="Статистика (Почему мы)"
                blockKey="stats"
                content={statsContent}
                fields={[
                  { key: "years", label: "Лет опыта (например: 12+)", type: "text" },
                  { key: "clients", label: "Клиентов (например: 1000+)", type: "text" },
                  { key: "cleanings", label: "Уборок (например: 2000+)", type: "text" },
                ]}
                onSave={handleUpdateSiteContent}
              />
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Услуги</h2>
                <Button onClick={() => setNewService(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить услугу
                </Button>
              </div>

              {newService && (
                <ServiceEditor
                  service={{
                    title: "",
                    description: "",
                    price: "",
                    icon: "Home",
                    sort_order: (services?.length || 0) + 1,
                    is_active: true,
                    image_url: null,
                    full_description: null,
                    category: "cleaning",
                  }}
                  onSave={handleSaveService}
                  onCancel={() => setNewService(false)}
                />
              )}

              {servicesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {services?.map((service) => (
                    <div key={service.id}>
                      {editingService?.id === service.id ? (
                        <ServiceEditor
                          service={editingService}
                          onSave={handleSaveService}
                          onCancel={() => setEditingService(null)}
                        />
                      ) : (
                        <ServiceCard
                          service={service}
                          onEdit={() => setEditingService(service)}
                          onDelete={() => handleDeleteService(service.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Преимущества</h2>
                <Button onClick={() => setNewFeature(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить преимущество
                </Button>
              </div>

              {newFeature && (
                <FeatureEditor
                  feature={{
                    title: "",
                    description: "",
                    icon: "Shield",
                    sort_order: (features?.length || 0) + 1,
                    is_active: true,
                  }}
                  onSave={handleSaveFeature}
                  onCancel={() => setNewFeature(false)}
                />
              )}

              {featuresLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {features?.map((feature) => (
                    <div key={feature.id}>
                      {editingFeature?.id === feature.id ? (
                        <FeatureEditor
                          feature={editingFeature}
                          onSave={handleSaveFeature}
                          onCancel={() => setEditingFeature(null)}
                        />
                      ) : (
                        <FeatureCard
                          feature={feature}
                          onEdit={() => setEditingFeature(feature)}
                          onDelete={() => handleDeleteFeature(feature.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Контакты</h2>
                <Button onClick={() => setNewContact(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить контакт
                </Button>
              </div>

              {newContact && (
                <ContactEditor
                  contact={{
                    contact_type: "phone",
                    label: "",
                    value: "",
                    href: "",
                    icon: "Phone",
                    sort_order: (contacts?.length || 0) + 1,
                    is_active: true,
                  }}
                  onSave={handleSaveContact}
                  onCancel={() => setNewContact(false)}
                />
              )}

              {contactsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts?.map((contact) => (
                    <div key={contact.id}>
                      {editingContact?.id === contact.id ? (
                        <ContactEditor
                          contact={editingContact}
                          onSave={handleSaveContact}
                          onCancel={() => setEditingContact(null)}
                        />
                      ) : (
                        <ContactCard
                          contact={contact}
                          onEdit={() => setEditingContact(contact)}
                          onDelete={() => handleDeleteContact(contact.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Отзывы</h2>
                <Button onClick={() => setNewReview(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить отзыв
                </Button>
              </div>

              {newReview && (
                <ReviewEditor
                  review={{
                    author_name: "",
                    author_role: null,
                    rating: 5,
                    text: "",
                    sort_order: (reviews?.length || 0) + 1,
                    is_active: true,
                  }}
                  onSave={handleSaveReview}
                  onCancel={() => setNewReview(false)}
                />
              )}

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews?.map((review) => (
                    <div key={review.id}>
                      {editingReview?.id === review.id ? (
                        <ReviewEditor
                          review={editingReview}
                          onSave={handleSaveReview}
                          onCancel={() => setEditingReview(null)}
                        />
                      ) : (
                        <ReviewCard
                          review={review}
                          onEdit={() => setEditingReview(review)}
                          onDelete={() => handleDeleteReview(review.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">Галерея (ДО/ПОСЛЕ)</h2>
                <Button onClick={() => setNewGallery(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить элемент
                </Button>
              </div>

              {newGallery && (
                <GalleryEditor
                  item={{
                    title: "",
                    before_image_url: null,
                    after_image_url: null,
                    sort_order: (galleryItems?.length || 0) + 1,
                    is_active: true,
                  }}
                  onSave={handleSaveGallery}
                  onCancel={() => setNewGallery(false)}
                />
              )}

              {galleryLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {galleryItems?.map((item) => (
                    <div key={item.id}>
                      {editingGallery?.id === item.id ? (
                        <GalleryEditor
                          item={editingGallery}
                          onSave={handleSaveGallery}
                          onCancel={() => setEditingGallery(null)}
                        />
                      ) : (
                        <GalleryCard
                          item={item}
                          onEdit={() => setEditingGallery(item)}
                          onDelete={() => handleDeleteGallery(item.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">FAQ</h2>
                <Button onClick={() => setNewFaq(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить вопрос
                </Button>
              </div>

              {newFaq && (
                <FaqEditor
                  faq={{
                    question: "",
                    answer: "",
                    sort_order: (faqItems?.length || 0) + 1,
                    is_active: true,
                  }}
                  onSave={handleSaveFaq}
                  onCancel={() => setNewFaq(false)}
                />
              )}

              {faqLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {faqItems?.map((item) => (
                    <div key={item.id}>
                      {editingFaq?.id === item.id ? (
                        <FaqEditor
                          faq={editingFaq}
                          onSave={handleSaveFaq}
                          onCancel={() => setEditingFaq(null)}
                        />
                      ) : (
                        <FaqCard
                          faq={item}
                          onEdit={() => setEditingFaq(item)}
                          onDelete={() => handleDeleteFaq(item.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Content Editor Component
interface ContentEditorProps {
  title: string;
  blockKey: string;
  content: HeroContent | HeaderContent | FooterContent | StatsContent | undefined;
  fields: { key: string; label: string; type: "text" | "textarea" }[];
  onSave: (blockKey: string, content: Record<string, unknown>) => void;
}

function ContentEditor({ title, blockKey, content, fields, onSave }: ContentEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<Record<string, unknown>>({});

  const handleEdit = () => {
    setEditContent(content ? { ...content } : {});
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(blockKey, editContent);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={(editContent[field.key] as string) || ""}
                    onChange={(e) =>
                      setEditContent({ ...editContent, [field.key]: e.target.value })
                    }
                    rows={3}
                  />
                ) : (
                  <Input
                    value={(editContent[field.key] as string) || ""}
                    onChange={(e) =>
                      setEditContent({ ...editContent, [field.key]: e.target.value })
                    }
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-2" />
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field) => (
              <div key={field.key}>
                <span className="text-muted-foreground text-sm">{field.label}: </span>
                <span className="text-foreground">
                  {(content?.[field.key] as string) || "Не задано"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Service Editor Component
interface ServiceEditorProps {
  service: Omit<Service, "id"> & { id?: string };
  onSave: (service: Partial<Service>) => void;
  onCancel: () => void;
}

function ServiceEditor({ service, onSave, onCancel }: ServiceEditorProps) {
  const [editService, setEditService] = useState(service);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Название</label>
            <Input
              value={editService.title}
              onChange={(e) => setEditService({ ...editService, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Цена</label>
            <Input
              value={editService.price}
              onChange={(e) => setEditService({ ...editService, price: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Краткое описание</label>
          <Textarea
            value={editService.description}
            onChange={(e) => setEditService({ ...editService, description: e.target.value })}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Полное описание</label>
          <Textarea
            value={editService.full_description || ""}
            onChange={(e) => setEditService({ ...editService, full_description: e.target.value })}
            rows={4}
          />
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Категория</label>
            <Select
              value={editService.category}
              onValueChange={(value) => setEditService({ ...editService, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Иконка</label>
            <Select
              value={editService.icon}
              onValueChange={(value) => setEditService({ ...editService, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editService.sort_order}
              onChange={(e) => setEditService({ ...editService, sort_order: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Изображение услуги</label>
          <ImageUpload
            value={editService.image_url}
            onChange={(url) => setEditService({ ...editService, image_url: url })}
            folder="services"
          />
        </div>
        <div className="hidden">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">URL изображения (устаревшее)</label>
            <Input
              value={editService.image_url || ""}
              onChange={(e) => setEditService({ ...editService, image_url: e.target.value || null })}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={editService.is_active}
            onCheckedChange={(checked) => setEditService({ ...editService, is_active: checked })}
          />
          <span className="text-sm text-foreground">Активно</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editService)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Service Card Component
function ServiceCard({ service, onEdit, onDelete }: { service: Service; onEdit: () => void; onDelete: () => void }) {
  const IconComponent = iconOptions.find((o) => o.value === service.icon)?.icon || Home;

  return (
    <Card className={!service.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center gap-4">
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{service.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{service.description}</p>
        </div>
        <span className="font-bold text-primary whitespace-nowrap">{service.price}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Feature Editor Component
interface FeatureEditorProps {
  feature: Omit<Feature, "id"> & { id?: string };
  onSave: (feature: Partial<Feature>) => void;
  onCancel: () => void;
}

function FeatureEditor({ feature, onSave, onCancel }: FeatureEditorProps) {
  const [editFeature, setEditFeature] = useState(feature);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Название</label>
          <Input
            value={editFeature.title}
            onChange={(e) => setEditFeature({ ...editFeature, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Описание</label>
          <Textarea
            value={editFeature.description}
            onChange={(e) => setEditFeature({ ...editFeature, description: e.target.value })}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Иконка</label>
            <Select
              value={editFeature.icon}
              onValueChange={(value) => setEditFeature({ ...editFeature, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editFeature.sort_order}
              onChange={(e) => setEditFeature({ ...editFeature, sort_order: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={editFeature.is_active}
            onCheckedChange={(checked) => setEditFeature({ ...editFeature, is_active: checked })}
          />
          <span className="text-sm text-foreground">Активно</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editFeature)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Feature Card Component
function FeatureCard({ feature, onEdit, onDelete }: { feature: Feature; onEdit: () => void; onDelete: () => void }) {
  const IconComponent = iconOptions.find((o) => o.value === feature.icon)?.icon || Shield;

  return (
    <Card className={!feature.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Contact Editor Component
interface ContactEditorProps {
  contact: Omit<Contact, "id"> & { id?: string };
  onSave: (contact: Partial<Contact>) => void;
  onCancel: () => void;
}

function ContactEditor({ contact, onSave, onCancel }: ContactEditorProps) {
  const [editContact, setEditContact] = useState(contact);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Название</label>
            <Input
              value={editContact.label}
              onChange={(e) => setEditContact({ ...editContact, label: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Значение</label>
            <Input
              value={editContact.value}
              onChange={(e) => setEditContact({ ...editContact, value: e.target.value })}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Ссылка (href)</label>
            <Input
              value={editContact.href || ""}
              onChange={(e) => setEditContact({ ...editContact, href: e.target.value || null })}
              placeholder="tel:+7... или mailto:..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Тип</label>
            <Select
              value={editContact.contact_type}
              onValueChange={(value) => setEditContact({ ...editContact, contact_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Телефон</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="address">Адрес</SelectItem>
                <SelectItem value="hours">Часы работы</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Иконка</label>
            <Select
              value={editContact.icon}
              onValueChange={(value) => setEditContact({ ...editContact, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editContact.sort_order}
              onChange={(e) => setEditContact({ ...editContact, sort_order: parseInt(e.target.value) })}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={editContact.is_active}
            onCheckedChange={(checked) => setEditContact({ ...editContact, is_active: checked })}
          />
          <span className="text-sm text-foreground">Активно</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editContact)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Contact Card Component
function ContactCard({ contact, onEdit, onDelete }: { contact: Contact; onEdit: () => void; onDelete: () => void }) {
  const IconComponent = iconOptions.find((o) => o.value === contact.icon)?.icon || Phone;

  return (
    <Card className={!contact.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{contact.label}</h3>
          <p className="text-sm text-muted-foreground">{contact.value}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Review Editor Component
interface ReviewEditorProps {
  review: Omit<Review, "id"> & { id?: string };
  onSave: (review: Partial<Review>) => void;
  onCancel: () => void;
}

function ReviewEditor({ review, onSave, onCancel }: ReviewEditorProps) {
  const [editReview, setEditReview] = useState(review);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Имя автора</label>
            <Input
              value={editReview.author_name}
              onChange={(e) => setEditReview({ ...editReview, author_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Роль</label>
            <Input
              value={editReview.author_role || ""}
              onChange={(e) => setEditReview({ ...editReview, author_role: e.target.value || null })}
              placeholder="например: клиент"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Рейтинг (1-5)</label>
          <Input
            type="number"
            min={1}
            max={5}
            value={editReview.rating}
            onChange={(e) => setEditReview({ ...editReview, rating: parseInt(e.target.value) || 5 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Текст отзыва</label>
          <Textarea
            value={editReview.text}
            onChange={(e) => setEditReview({ ...editReview, text: e.target.value })}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editReview.sort_order}
              onChange={(e) => setEditReview({ ...editReview, sort_order: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 mt-8">
            <Switch
              checked={editReview.is_active}
              onCheckedChange={(checked) => setEditReview({ ...editReview, is_active: checked })}
            />
            <span className="text-sm text-foreground">Активно</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editReview)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Review Card Component
function ReviewCard({ review, onEdit, onDelete }: { review: Review; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className={!review.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex items-center text-primary">
          {Array.from({ length:5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted/30"}`} />
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{review.author_name}</h3>
          {review.author_role && (
            <p className="text-sm text-muted-foreground">{review.author_role}</p>
          )}
          <p className="text-sm text-muted-foreground truncate">{review.text}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Gallery Editor Component
interface GalleryEditorProps {
  item: Omit<GalleryItem, "id"> & { id?: string };
  onSave: (item: Partial<GalleryItem>) => void;
  onCancel: () => void;
}

function GalleryEditor({ item, onSave, onCancel }: GalleryEditorProps) {
  const [editItem, setEditItem] = useState(item);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Название</label>
          <Input
            value={editItem.title}
            onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
            placeholder="например: Уборка квартиры после ремонта"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Фото ДО</label>
          <ImageUpload
            value={editItem.before_image_url}
            onChange={(url) => setEditItem({ ...editItem, before_image_url: url })}
            folder="gallery"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Фото ПОСЛЕ</label>
          <ImageUpload
            value={editItem.after_image_url}
            onChange={(url) => setEditItem({ ...editItem, after_image_url: url })}
            folder="gallery"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editItem.sort_order}
              onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 mt-8">
            <Switch
              checked={editItem.is_active}
              onCheckedChange={(checked) => setEditItem({ ...editItem, is_active: checked })}
            />
            <span className="text-sm text-foreground">Активно</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editItem)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Gallery Card Component
function GalleryCard({ item, onEdit, onDelete }: { item: GalleryItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className={!item.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="flex gap-2 flex-shrink-0">
          {item.before_image_url && (
            <img src={item.before_image_url} alt="До" className="w-12 h-12 object-cover rounded" />
          )}
          {item.after_image_url && (
            <img src={item.after_image_url} alt="После" className="w-12 h-12 object-cover rounded" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground">ДО/ПОСЛЕ фото</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Editor Component
interface FaqEditorProps {
  faq: Omit<FaqItem, "id"> & { id?: string };
  onSave: (faq: Partial<FaqItem>) => void;
  onCancel: () => void;
}

function FaqEditor({ faq, onSave, onCancel }: FaqEditorProps) {
  const [editFaq, setEditFaq] = useState(faq);

  return (
    <Card className="border-primary">
      <CardContent className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Вопрос</label>
          <Input
            value={editFaq.question}
            onChange={(e) => setEditFaq({ ...editFaq, question: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ответ</label>
          <Textarea
            value={editFaq.answer}
            onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Порядок</label>
            <Input
              type="number"
              value={editFaq.sort_order}
              onChange={(e) => setEditFaq({ ...editFaq, sort_order: parseInt(e.target.value) })}
            />
          </div>
          <div className="flex items-center gap-2 mt-8">
            <Switch
              checked={editFaq.is_active}
              onCheckedChange={(checked) => setEditFaq({ ...editFaq, is_active: checked })}
            />
            <span className="text-sm text-foreground">Активно</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onSave(editFaq)}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Card Component
function FaqCard({ faq, onEdit, onDelete }: { faq: FaqItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card className={!faq.is_active ? "opacity-50" : ""}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">{faq.question}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminPage;
