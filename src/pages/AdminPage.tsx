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
  Image as ImageIcon
} from "lucide-react";
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
import { useAllServices, useUpdateService, useCreateService, useDeleteService, Service } from "@/hooks/useServices";
import { useAllFeatures, useUpdateFeature, useCreateFeature, useDeleteFeature, Feature } from "@/hooks/useFeatures";
import { useAllContacts, useUpdateContact, useCreateContact, useDeleteContact, Contact } from "@/hooks/useContacts";
import { useSiteContent, useUpdateSiteContent, HeroContent, HeaderContent, FooterContent } from "@/hooks/useSiteContent";

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
  const { data: heroContent } = useSiteContent<HeroContent>("hero");
  const { data: servicesHeader } = useSiteContent<HeaderContent>("services_header");
  const { data: whyUsHeader } = useSiteContent<HeaderContent>("why_us_header");
  const { data: contactsHeader } = useSiteContent<HeaderContent>("contacts_header");
  const { data: footerContent } = useSiteContent<FooterContent>("footer");
  
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
  const updateSiteContent = useUpdateSiteContent();

  // Edit states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newService, setNewService] = useState(false);
  const [newFeature, setNewFeature] = useState(false);
  const [newContact, setNewContact] = useState(false);

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

  const handleUpdateSiteContent = async (blockKey: string, content: Record<string, unknown>) => {
    try {
      await updateSiteContent.mutateAsync({ blockKey, content: content as import("@/integrations/supabase/types").Json });
      toast({ title: "Контент обновлён!" });
    } catch (error) {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Управление контентом
            </h1>
            <p className="text-muted-foreground">
              Редактируйте текст, услуги и контакты на сайте
            </p>
          </motion.div>

          <Tabs defaultValue="content" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="content">Тексты</TabsTrigger>
              <TabsTrigger value="services">Услуги</TabsTrigger>
              <TabsTrigger value="features">Преимущества</TabsTrigger>
              <TabsTrigger value="contacts">Контакты</TabsTrigger>
            </TabsList>

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
  content: HeroContent | HeaderContent | FooterContent | undefined;
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
        <div className="grid md:grid-cols-3 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">URL изображения</label>
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

export default AdminPage;
