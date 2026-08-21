import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const Offer = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Договор публичной оферты — Clean House"
        description="Публичная оферта клининговой компании Clean House. Условия заказа, оплата, сроки, гарантии."
        keywords="договор оферты, публичная оферта, клининг Донецк, условия заказа, оплата уборки"
      />
      <StructuredData pageType="home" />
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Договор публичной оферты
          </h1>

          <div className="prose prose-lg max-w-none text-foreground space-y-6">
            <p className="text-muted-foreground">
              Последнее обновление: {new Date().toLocaleDateString("ru-RU")}
            </p>

            <p>
              Настоящий документ (Договор публичной оферты) является публичной
              офертой в соответствии со ст. 436.1 Гражданского кодекса
              Российской Федерации и определяет условия оказания услуг по
              клинингу (далее — Услуги) сайтом{" "}
              <strong>cleanhousednr.ru</strong> (далее — Сайт, Оperator).
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">1. Предмет оферты</h2>
            <p>Оperator предлагает оказывать услуги по профессиональному клинингу:
              уборка квартир, домов, офисов, химчистка мебели, мойка окон,
              уборка после ремонта и иные связанные услуги.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">2. Заказ услуг</h2>
            <p>Заказ услуг осуществляется Покупателем посредством:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Заполнения формы на Сайте (раздел «Контакты»);</li>
              <li>Звонка по телефону: <strong>+7 949 501 57 51</strong>;</li>
              <li>Отправки email на: <strong>info@cleanhousednr.ru</strong>.</li>
            </ul>
            <p>Нажимая кнопку «Отправить заявку» или звоня, Покупатель
              подтверждает согласие с Договором.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">3. Стоимость и оплата</h2>
            <p>Цены указаны на Сайте в разделе «Услуги» и являются ориентировочными.
              Точная стоимость определяется после выезда специалиста на осмотр
              объекта. Оплата возможна:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Наличными по факту выполненных работ;</li>
              <li>Безналичным расчётом (по договору с юридическим лицом).</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8">4. Сроки и порядок выполнения</h2>
            <p>Сроки выполнения услуг согласуются с Покупателем по телефону.
              Работы выполняются в согласованное время. Стандартный выезд —
              в течение 1–2 рабочих дней с момента подтверждения заказа.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">5. Гарантии</h2>
            <p>Operator гарантирует высокое качество услуг и соответствие
              выполненных работ требованиям. Если качество услуг не устраивает,
              Покупатель может потребовать повторного выезда для устранения
              замечаний в течение 14 дней с момента выполнения услуг.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">6. Ответственность сторон</h2>
            <p>За нарушение сроков оплаты Покупателем начислятся пени в размере
              0,1% от суммы задолженности за каждый день просрочки. За нарушение
              сроков выполнения работ Оperator возвращает часть оплаченных средств.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">7. Форс-мажор</h2>
            <p>Стороны освобождаются от ответственности за полное или частичное
              неисполнение обязательств, если это вызвано обстоятельствами
              непреодолимой силы (стихийные бедствия, военное время, эпидемия и др.).</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">8. Персональные данные</h2>
            <p>Покупатель согласен с <a href="/privacy" className="text-primary hover:underline">Политикой конфиденциальности</a>
              персональных данных, доступной на Сайте.</p>

            <h2 className="text-2xl font-bold text-foreground mt-8">9. Прочие условия</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Все споры решаются посредством переговоров, в случае недостижимости
                  соглашения — в суде по месту нахождения Оperatона;</li>
              <li>Действующая версия оферты доступна по адресу: https://cleanhousednr.ru/offer;</li>
              <li>Operator оставляет за собой право вносить изменения в оферту,
                которые вступают в силу с момента размещения на Сайте;</li>
              <li>Услуги оказываются на территории: г. Донецк, ДНР.</li>
            </ul>

            <div className="mt-12 pt-8 border-t border-border bg-secondary/20 p-6 rounded-xl">
              <p className="font-medium">Реквизиты ООО «Clean House»:</p>
              <p className="text-muted-foreground">
                ИНН: __________<br />
                ОГРН: __________<br />
                Юридический адрес: __________<br />
                Телефон: +7 949 501 57 51<br />
                Email: info@cleanhousednr.ru<br />
                Работаем: Пн–Сб 8:00–20:00
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Offer;
