# WEB-ларёк

Интернет-магазин товаров для веб-разработчиков с возможностью просмотра каталога, добавления товаров в корзину и оформления заказа.

## Используемый стек

- TypeScript — типизированный JavaScript
- Webpack — сборщик модулей
- SCSS — препроцессор CSS
- HTML5 — разметка
- MVP архитектура (Model-View-Presenter)
- Event-driven architecture — событийно-ориентированная архитектура

## Инструкция по сборке и запуску

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```
API_ORIGIN=https://larek-api.nomoreparties.co
```

3. Запустите проект в режиме разработки:
```bash
npm start
```

4. Для сборки проекта:
```bash
npm run build
```

## Основной функционал

### Каталог товаров
- Отображение товаров в виде карточек с изображениями, названиями, категориями и ценами
- Поддержка различных категорий товаров: софт-скил, хард-скил, другое, дополнительное, кнопка
- Обработка бесценных товаров (price: null) — отображение "Бесценно" и кнопка "Недоступно"
- Динамическое назначение CSS классов для категорий товаров
- Клик по карточке открывает детальное превью товара

### Корзина
- Добавление/удаление товаров из корзины
- **Счётчик товаров в корзине всегда отображается, даже если товаров 0**
- Модальное окно корзины с полным списком товаров
- Сообщение "Корзина пуста" при отсутствии товаров
- Автоматический пересчет общей стоимости
- Возможность удаления товаров из корзины

### Оформление заказа
- Двухэтапная форма оформления заказа
- Выбор способа оплаты (Онлайн/При получении)
- Ввод адреса доставки и контактных данных (email, телефон)
- **Валидация всех полей формы с отображением ошибок только после первой попытки отправки**
- Блокировка кнопок отправки при невалидных данных
- При успешной оплате — сообщение об успехе и очистка корзины

### Модальные окна
- Универсальная система модальных окон
- Превью товара с детальной информацией
- Корзина с товарами
- Формы оплаты и контактов
- Сообщение об успешном оформлении заказа
- Автоматическое закрытие по клику вне окна или по кнопке
- **Только класс AppModalView управляет открытием/закрытием модалок. Остальные View — только контент для модалки.**

### Обработка изображений
- Автоматическая замена .svg на .png для лучшего отображения
- Использование CDN для загрузки изображений
- Responsive изображения с object-fit: contain
- Обработка отсутствующих изображений

## Архитектура проекта

Проект построен на основе MVP (Model-View-Presenter) с событийно-ориентированным взаимодействием между слоями.

### Основные принципы

- **Инверсия зависимостей:** Все зависимости внедряются через конструктор. Экземпляры классов создаются в точке входа (`index.ts`).
- **Разделение ответственности:** 
  - Model — только бизнес-логика и валидация.
  - View — только отображение и работа с DOM внутри своего контейнера.
  - Presenter — посредник между Model и View, не работает с DOM напрямую.
- **События:** Все взаимодействие между слоями реализовано через EventEmitter. Для каждого действия используется только одно событие (например, открытие корзины, оформление заказа).
- **Модальные окна:** Только класс AppModalView управляет открытием/закрытием модалок. Остальные View — только контент для модалки.
- **Корзина:** Счётчик товаров всегда отображается, даже если товаров 0. После оформления заказа корзина очищается, счётчик обновляется на 0.
- **Валидация:** 
  - UX-валидация (блокировка кнопок, подсказки) — во View.
  - Бизнес-валидация — только в Model.
  - Ошибки в формах отображаются только после первой попытки отправки.
- **Работа с DOM:** Только View-компоненты работают с DOM и шаблонами. Презентер и Model не работают с DOM напрямую.
- **MVP:** Презентер управляет связью между Model и View, не нарушая инкапсуляцию. View не предоставляет наружу данные, только отображает их и эмитит события.

### Пример инициализации зависимостей

```ts
// index.ts
const events = new EventEmitter();
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);
const productService = new ProductService(API_URL, orderModel);

const modal = new AppModalView('#modal-container', events);
const cartElement = createElementFromTemplate('basket');
const cartView = new CartView(cartElement, events);
const headerElement = document.querySelector('header') as HTMLElement;
const headerBasketView = new HeaderBasketView(headerElement, events);
const galleryElement = document.querySelector('.gallery') as HTMLElement;
const productGalleryView = new ProductGalleryView(galleryElement, events);

new App(
  events,
  productService,
  productModel,
  cartModel,
  orderModel,
  modal,
  cartView,
  headerBasketView,
  productGalleryView
);
```

---

## Валидация

- Валидация данных заказа происходит только в OrderModel.
- View-компоненты отвечают только за UX-валидацию (блокировка кнопок, подсказки).
- Ошибки в формах оплаты и контактов отображаются только после первой попытки отправки.

---

## Работа с DOM

- Только View-компоненты работают с DOM и шаблонами.
- Презентер и Model не работают с DOM напрямую.

---

## События

- Для каждого действия используется только одно событие (например, открытие корзины, оформление заказа).
- Взаимодействие между слоями реализовано через EventEmitter.

---

## MVP

- Презентер управляет связью между Model и View, не нарушая инкапсуляцию.
- View не предоставляет наружу данные, только отображает их и эмитит события.

---

## Архитектура и основные части

### Основные части:
- **Model** — хранение и валидация данных (ProductModel, CartModel, OrderModel)
- **View** — отображение данных и работа с DOM (ProductCardView, CartView, AppModalView и др.)
- **Presenter** — координация между Model и View, обработка событий (AppPresenter)
- **Service** — работа с API (ProductService)

### Взаимодействие:
- Все взаимодействие между слоями реализовано через события (EventEmitter).
- Презентер получает все зависимости через конструктор (инверсия зависимостей).
- View не работает с Model напрямую, только через Presenter.

## Описание базовых классов

- **EventEmitter** — обеспечивает работу событий: установка/снятие слушателей, вызов слушателей при возникновении события.
- **ProductModel** — управляет данными о товарах, хранит массив товаров, предоставляет методы для получения и установки.
- **CartModel** — управляет состоянием корзины, добавляет/удаляет товары, считает итоговую сумму.
- **OrderModel** — управляет данными заказа, валидирует поля формы, хранит ошибки.
- **ProductService** — взаимодействует с API для получения товаров и оформления заказа.
- **AppModalView** — управляет модальными окнами, отображает различные представления.
- **CartView** — отображает содержимое корзины.
- **ProductCardView** — отображает карточку товара.
- **AppPresenter** — координирует взаимодействие между моделями, представлениями и сервисами через события.
- **App** — точка сборки приложения, инициализирует все зависимости.

## Описание компонентов и их связей

- **ProductCardView** — отображает карточку товара, взаимодействует с AppPresenter через события.
- **CartView** — отображает корзину, взаимодействует с AppPresenter через события.
- **AppModalView** — отображает модальные окна, получает контент от других View.
- **HeaderBasketView** — отображает кнопку корзины и счётчик, обновляется через события от AppPresenter.
- **ProductGalleryView** — отображает галерею товаров, управляет карточками.

## Основные типы данных

- **IProduct** — товар (id, title, description, image, category, price)
- **ICartItem** — товар в корзине (id, title, price, index)
- **IOrderForm** — данные формы заказа (payment, address, email, phone)
- **IOrder** — данные для отправки заказа (total, items)

## Примеры процессов

- **Добавление товара в корзину:**  
  1. Пользователь кликает по кнопке "В корзину" (ProductCardView).
  2. View эмитит событие, AppPresenter вызывает CartModel.addItem().
  3. CartModel обновляет данные, эмитит событие, AppPresenter обновляет View.

- **Оформление заказа:**  
  1. Пользователь заполняет форму, сабмитит (PaymentFormView/ContactsFormView).
  2. View эмитит событие, AppPresenter вызывает методы OrderModel.
  3. OrderModel валидирует данные, эмитит событие с ошибками, AppPresenter обновляет View.
  4. При успешной валидации AppPresenter вызывает ProductService.createOrder().

