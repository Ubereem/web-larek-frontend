# WEB-ларёк

Интернет-магазин товаров для веб-разработчиков с возможностью просмотра каталога, добавления товаров в корзину и оформления заказа.

## Используемый стек

- TypeScript - типизированный JavaScript
- Webpack - сборщик модулей
- SCSS - препроцессор CSS
- HTML5 - разметка
- MVP архитектура - Model-View-Presenter
- Event-driven architecture - событийно-ориентированная архитектура

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
- Обработка бесценных товаров (price: null) - отображение "Бесценно" и кнопка "Недоступно"
- Динамическое назначение CSS классов для категорий товаров
- Клик по карточке открывает детальное превью товара

### Корзина
- Добавление/удаление товаров из корзины
- Отображение количества товаров в корзине в шапке сайта
- Модальное окно корзины с полным списком товаров
- Сообщение "Корзина пуста" при отсутствии товаров
- Автоматический пересчет общей стоимости
- Возможность удаления товаров из корзины

### Оформление заказа
- Двухэтапная форма оформления заказа
- Выбор способа оплаты (Онлайн/При получении)
- Ввод адреса доставки и контактных данных (email, телефон)
- Валидация всех полей формы с отображением ошибок
- Блокировка кнопок отправки при невалидных данных
- При успешной оплате - сообщение об успехе и очистка корзины

### Модальные окна
- Универсальная система модальных окон
- Превью товара с детальной информацией
- Корзина с товарами
- Формы оплаты и контактов
- Сообщение об успешном оформлении заказа
- Автоматическое закрытие по клику вне окна или по кнопке

### Обработка изображений
- Автоматическая замена .svg на .png для лучшего отображения
- Использование CDN для загрузки изображений
- Responsive изображения с object-fit: contain
- Обработка отсутствующих изображений

## Архитектура проекта

Проект построен на основе MVP (Model-View-Presenter) архитектуры с использованием событийно-ориентированного подхода для взаимодействия между компонентами.

### Основные принципы архитектуры

- **Разделение ответственности** - каждый компонент отвечает за свою область
- **Инверсия зависимостей** - компоненты получают зависимости через конструктор
- **Событийно-ориентированное взаимодействие** - компоненты общаются через события
- **Использование темплейтов** - все компоненты создаются из HTML-темплейтов
- **Валидация в модели** - только модель принимает решения о валидности данных

### СЛОЙ МОДЕЛЬ

#### Класс ProductService
Назначение: Обеспечивает взаимодействие с сервером для получения данных о товарах.

Конструктор: 
- Принимает базовый URL для API и OrderModel для передачи данных

Поля класса:
- api: Api - клиент для работы с API
- orderModel: OrderModel - модель заказа

Методы:
- getProducts(): Promise<IProduct[]> - загружает товары с сервера
- createOrder(order: IOrder): Promise<{ total: number; items: string[] }> - создает заказ на сервере

#### Класс ProductModel
Назначение: Управляет данными о товарах.

Конструктор: 
- Принимает EventEmitter для эмита событий

Поля класса:
- items: IProduct[] - массив товаров
- events: EventEmitter - система событий

Методы:
- setItems(items: IProduct[]): void - устанавливает массив товаров и эмитит событие PRODUCTS_LOADED
- getProductById(id: string): IProduct | undefined - возвращает товар по ID из поля items
- getItems(): IProduct[] - возвращает весь массив товаров для отрисовки карточек в каталоге

#### Класс CartModel
Назначение: Управляет состоянием корзины пользователя.

Конструктор: 
- Принимает EventEmitter для эмита событий

Поля класса:
- items: ICartItem[] - массив товаров в корзине
- events: EventEmitter - система событий

Методы:
- addItem(product: IProduct): void - добавляет товар в корзину, создавая ICartItem с индексом, эмитит CART_ITEM_ADDED
- removeItem(id: string): void - удаляет товар из корзины по ID, эмитит CART_ITEM_REMOVED
- clear(): void - очищает корзину
- getItems(): ICartItem[] - возвращает массив товаров в корзине
- getTotal(): number - вычисляет и возвращает общую стоимость корзины на основе цен товаров в items
- isInCart(id: string): boolean - проверяет, есть ли товар в корзине

#### Класс OrderModel
Назначение: Управляет данными формы заказа и валидацией.

Конструктор: 
- Принимает EventEmitter для эмита событий

Поля класса:
- form: Partial<IOrderForm> - данные формы заказа (способ оплаты, адрес, email, телефон)
- formErrors: Partial<Record<keyof IOrderForm, string>> - ошибки валидации
- events: EventEmitter - система событий

Методы:
- setPayment(payment: 'card' | 'cash'): void - устанавливает способ оплаты и валидирует форму
- setAddress(address: string): void - устанавливает адрес доставки и валидирует форму
- setEmail(email: string): void - устанавливает email и валидирует форму
- setPhone(phone: string): void - устанавливает телефон и валидирует форму
- getForm(): Partial<IOrderForm> - возвращает данные формы заказа
- getFormErrors(): Partial<Record<keyof IOrderForm, string>> - возвращает ошибки валидации
- reset(): void - сбрасывает форму и ошибки
- isValid(): boolean - проверяет валидность формы
- validateForm(): void - приватный метод валидации, эмитит formErrors:change и order:ready

### СЛОЙ ПРЕДСТАВЛЕНИЯ

#### Базовый класс Component
Назначение: Базовый класс для всех компонентов представления.

Конструктор: 
- Принимает готовый DOM элемент

Поля класса:
- container: HTMLElement - DOM элемент компонента

Методы:
- render(data?: Partial<T>): HTMLElement - рендерит компонент с переданными данными
- setText(element: HTMLElement, value: unknown): void - устанавливает текстовое содержимое
- setDisabled(element: HTMLElement, state: boolean): void - блокирует/разблокирует элемент
- setHidden(element: HTMLElement): void - скрывает элемент
- setVisible(element: HTMLElement): void - показывает элемент
- setImage(element: HTMLImageElement, src: string, alt?: string): void - устанавливает изображение

#### Базовый класс ProductView
Назначение: Базовый класс для всех представлений товаров, содержащий только общий функционал.

Конструктор: 
- Принимает готовый DOM элемент товара (клон шаблона)

Поля класса:
- container: HTMLElement - DOM элемент товара
- _title: HTMLElement - заголовок товара
- _price: HTMLElement - цена товара

Сеттеры:
- set title(value: string) - устанавливает заголовок товара
- set price(value: number | null) - устанавливает цену товара (null для бесценных товаров отображается как "Бесценно")

Методы:
- render(data?: Partial<IProduct>): HTMLElement - рендерит товар с переданными данными

#### Класс AppModalView
Назначение: Управляет модальными окнами приложения.

Конструктор: 
- Принимает селектор контейнера модального окна и EventEmitter

Поля класса:
- container: HTMLElement - контейнер модального окна
- events: EventEmitter - система событий

Методы:
- showBasket(items: ICartItem[], total: number): void - показывает корзину
- showPaymentForm(): void - показывает форму оплаты с валидацией
- showContactsForm(): void - показывает форму контактов с валидацией
- showSuccess(total: number): void - показывает сообщение об успехе
- render(content: HTMLElement): void - рендерит переданный контент
- isOpen(): boolean - проверяет, открыто ли модальное окно

**Особенности валидации в модальных окнах:**
- Валидация в реальном времени при вводе данных
- Отображение ошибок в элементе `.form__errors`
- Блокировка кнопок отправки при невалидных данных

#### Класс ProductCardView
Назначение: Отображает карточку товара в каталоге.

Конструктор: 
- Наследует от ProductView, принимает DOM элемент и EventEmitter

Поля класса:
- _image: HTMLImageElement - изображение товара
- _category: HTMLElement - категория товара
- _button: HTMLButtonElement - кнопка действия
- events: EventEmitter - система событий

Сеттеры:
- set image(value: string) - устанавливает изображение товара
- set category(value: ProductCategory) - устанавливает категорию товара с динамическим назначением CSS классов
- set inCart(value: boolean) - изменяет состояние кнопки в зависимости от наличия в корзине

Методы:
- render(data?: Partial<IProduct>): HTMLElement - рендерит карточку с переданными данными
- bindEvents(): void - привязывает обработчики событий

#### Класс ProductPreviewView
Назначение: Отображает детальную информацию о товаре в модальном окне.

Конструктор: 
- Наследует от ProductView, принимает DOM элемент и EventEmitter

Поля класса:
- _image: HTMLImageElement - изображение товара
- _category: HTMLElement - категория товара
- _description: HTMLElement - описание товара
- _button: HTMLButtonElement - кнопка покупки
- events: EventEmitter - система событий

Сеттеры:
- set image(value: string) - устанавливает изображение товара
- set category(value: ProductCategory) - устанавливает категорию товара
- set description(value: string) - устанавливает описание товара
- set inCart(value: boolean) - изменяет текст кнопки в зависимости от состояния корзины

Методы:
- render(data?: Partial<IProduct>): HTMLElement - рендерит превью с переданными данными

#### Класс CartItemView
Назначение: Отображает товар в корзине.

Конструктор: 
- Наследует от ProductView, принимает DOM элемент и EventEmitter

Поля класса:
- _index: HTMLElement - номер товара в корзине
- _deleteButton: HTMLButtonElement - кнопка удаления
- events: EventEmitter - система событий

Сеттеры:
- set index(value: number) - устанавливает номер товара

Методы:
- render(data?: Partial<ICartItem>): HTMLElement - рендерит товар в корзине с переданными данными

#### Класс CartView
Назначение: Отображает содержимое корзины.

Конструктор: 
- Принимает готовый DOM элемент корзины (клон шаблона) и EventEmitter

Поля класса:
- container: HTMLElement - DOM элемент корзины
- _list: HTMLElement - список товаров
- _total: HTMLElement - общая стоимость
- _button: HTMLButtonElement - кнопка оформления заказа
- events: EventEmitter - система событий

Методы:
- render(data?: Partial<{ items: ICartItem[], total: number }>): HTMLElement - рендерит корзину с переданными данными

#### Класс HeaderBasketView
Назначение: Управляет кнопкой корзины в шапке сайта.

Конструктор: 
- Принимает DOM элемент шапки и EventEmitter

Поля класса:
- container: HTMLElement - DOM элемент шапки
- basketButton: HTMLElement - кнопка корзины
- counter: HTMLElement - счетчик товаров
- events: EventEmitter - система событий

Методы:
- updateCounter(count: number): void - обновляет счетчик товаров
- bindEvents(): void - привязывает обработчики событий

#### Класс ProductGalleryView
Назначение: Управляет галерией товаров.

Конструктор: 
- Принимает DOM элемент галерии и EventEmitter

Поля класса:
- container: HTMLElement - DOM элемент галерии
- productCardViews: ProductCardView[] - массив карточек товаров
- events: EventEmitter - система событий

Методы:
- render(products: IProduct[], inCartItems: string[]): void - рендерит галерию товаров
- updateCartStatus(inCartItems: string[]): void - обновляет состояние корзин в карточках
- getProductCardViews(): ProductCardView[] - возвращает массив карточек

#### Базовый класс FormView
Назначение: Базовый класс для всех форм, содержащий общий функционал.

Конструктор: 
- Принимает готовый DOM элемент формы (клон шаблона)

Поля класса:
- container: HTMLElement - DOM элемент формы
- _submitButton: HTMLButtonElement - кнопка отправки
- _errorsContainer: HTMLElement - контейнер для ошибок

Сеттеры:
- set errors(value: string[]) - отображает ошибки валидации
- set disabled(value: boolean) - блокирует/разблокирует форму

Методы:
- render(data?: Partial<{ errors: string[] }>): HTMLElement - рендерит форму с переданными данными
- clearErrors(): void - очищает ошибки

#### Класс PaymentFormView
Назначение: Отображает форму выбора способа оплаты и ввода адреса доставки.

Конструктор: 
- Наследует от FormView, принимает DOM элемент и EventEmitter

Поля класса:
- _paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты
- _addressInput: HTMLInputElement - поле ввода адреса
- events: EventEmitter - система событий

Сеттеры:
- set payment(value: 'card' | 'cash') - устанавливает выбранный способ оплаты
- set address(value: string) - устанавливает адрес
- set valid(value: boolean) - устанавливает валидность формы

Методы:
- render(data?: Partial<IPaymentFormData>): HTMLElement - рендерит форму с переданными данными
- bindEvents(): void - привязывает обработчики событий

#### Класс ContactsFormView
Назначение: Отображает форму ввода контактных данных.

Конструктор: 
- Наследует от FormView, принимает DOM элемент и EventEmitter

Поля класса:
- _emailInput: HTMLInputElement - поле ввода email
- _phoneInput: HTMLInputElement - поле ввода телефона
- events: EventEmitter - система событий

Сеттеры:
- set email(value: string) - устанавливает email
- set phone(value: string) - устанавливает телефон
- set valid(value: boolean) - устанавливает валидность формы

Методы:
- render(data?: Partial<IContactsFormData>): HTMLElement - рендерит форму с переданными данными
- bindEvents(): void - привязывает обработчики событий

### СЛОЙ ПРЕЗЕНТЕРА

#### Класс AppPresenter
Назначение: Координирует взаимодействие между моделями, представлениями и API через систему событий.

Конструктор: 
- Принимает все зависимости: EventEmitter, ProductService, модели и представления

Поля класса:
- events: EventEmitter - система событий
- productService: ProductService - сервис для работы с API
- productModel: ProductModel - модель товаров
- cartModel: CartModel - модель корзины
- orderModel: OrderModel - модель заказа
- modal: AppModalView - модальное окно
- cartView: CartView - представление корзины
- headerBasketView: HeaderBasketView - представление кнопки корзины
- productGalleryView: ProductGalleryView - представление галерии товаров

Методы:
- bindEvents(): void - привязывает обработчики событий
- loadProducts(): Promise<void> - загружает товары с сервера
- renderProducts(): void - рендерит товары в галерии
- updateCartView(): void - обновляет представление корзины
- updateProductCards(): void - обновляет карточки товаров
- updateCartCounter(): void - обновляет счетчик в шапке
- openCartModal(): void - открывает модальное окно корзины
- openPaymentForm(): void - открывает форму оплаты
- openContactsForm(): void - открывает форму контактов
- handleOrderSubmission(): void - обрабатывает отправку заказа
- submitOrder(): Promise<void> - отправляет заказ на сервер
- showSuccess(total: number): void - показывает сообщение об успехе
- updateFormValidation(errors: Partial<Record<string, string>>): void - обновляет валидацию форм

#### Класс App
Назначение: Главный класс приложения, инициализирует все компоненты.

Конструктор: 
- Создает все базовые сервисы и компоненты

Поля класса:
- events: EventEmitter - система событий
- productService: ProductService - сервис для работы с API
- productModel: ProductModel - модель товаров
- cartModel: CartModel - модель корзины
- orderModel: OrderModel - модель заказа
- modal: AppModalView - модальное окно
- cartView: CartView - представление корзины
- headerBasketView: HeaderBasketView - представление кнопки корзины
- productGalleryView: ProductGalleryView - представление галерии товаров
- presenter: AppPresenter - презентер приложения

Методы:
- initializeViews(): void - инициализирует все представления
- initializePresenter(): void - инициализирует презентер

### Базовые классы

#### Класс EventEmitter
Назначение: Обеспечивает работу событий в приложении.

Функции:
- Возможность установить и снять слушателей событий
- Вызов слушателей при возникновении события
- Поддержка регулярных выражений для фильтрации событий
- Возможность слушать все события

#### Класс Api
Назначение: Обеспечивает взаимодействие с сервером.

Функции:
- Выполнение GET и POST запросов
- Обработка ответов сервера
- Обработка ошибок
- Настройка заголовков запросов

#### Утилита template
Назначение: Создает элементы из HTML-темплейтов.

Функции:
- createElementFromTemplate(templateId: string): HTMLElement - создает элемент из темплейта по ID

### Событийно-ориентированное взаимодействие

Приложение использует событийно-ориентированный подход для взаимодействия между компонентами.

#### Основные события:

**От моделей:**
- `PRODUCTS_LOADED` - товары загружены
- `CART_ITEM_ADDED` - товар добавлен в корзину
- `CART_ITEM_REMOVED` - товар удален из корзины
- `formErrors:change` - изменились ошибки валидации
- `order:ready` - заказ готов к отправке

**От представлений:**
- `PRODUCT_SELECTED` - выбран товар
- `MODAL_OPENED` - открыто модальное окно
- `header:basket-clicked` - клик по кнопке корзины в шапке
- `payment:method-selected` - выбран способ оплаты
- `payment:address-changed` - изменился адрес
- `payment:next` - переход к следующему шагу оплаты
- `contacts:email-changed` - изменился email
- `contacts:phone-changed` - изменился телефон
- `contacts:submit` - отправлена форма контактов
- `basket:checkout` - оформление заказа из корзины
- `basket:remove` - удаление товара из корзины

#### Пример взаимодействия при загрузке товаров:

1. При инициализации приложения AppPresenter вызывает ProductService.getProducts()
2. ProductService выполняет запрос к серверу через Api
3. Полученные данные AppPresenter передает в ProductModel через метод setItems()
4. ProductModel сохраняет данные и генерирует событие PRODUCTS_LOADED
5. AppPresenter обрабатывает событие PRODUCTS_LOADED и вызывает ProductGalleryView.render()

#### Пример взаимодействия при добавлении товара в корзину:

1. ProductCardView реагирует на клик пользователя по кнопке "В корзину" и генерирует событие PRODUCT_SELECTED с данными товара
2. AppPresenter обрабатывает событие PRODUCT_SELECTED и вызывает метод addItem() модели CartModel
3. CartModel изменяет данные в поле items и генерирует событие CART_ITEM_ADDED
4. AppPresenter обрабатывает событие CART_ITEM_ADDED и обновляет все представления
5. HeaderBasketView обновляет счетчик товаров в шапке сайта

#### Пример взаимодействия при валидации формы:

1. Пользователь вводит данные в форму (PaymentFormView или ContactsFormView)
2. Форма эмитит событие изменения поля (например, `payment:address-changed`)
3. AppPresenter обрабатывает событие и вызывает соответствующий метод OrderModel
4. OrderModel валидирует данные и эмитит событие `formErrors:change`
5. AppPresenter обрабатывает событие и обновляет форму с данными о валидности

### Компоненты и их связи

- **App** ↔ **AppPresenter** - главный класс создает и передает зависимости презентеру
- **AppPresenter** ↔ **ProductService** - получает данные о товарах с сервера и отправляет заказы
- **AppPresenter** ↔ **ProductModel** - передает данные о товарах и получает их для отображения
- **AppPresenter** ↔ **CartModel** - получает данные корзины
- **AppPresenter** ↔ **OrderModel** - получает данные формы заказа и ошибки валидации
- **ProductService** ↔ **Api** - выполняет запросы к серверу
- **AppModalView** ↔ **CartView/PaymentFormView/ContactsFormView** - модальное окно отображает различные представления
- **ProductGalleryView** ↔ **ProductCardView** - галерия управляет карточками товаров
- **HeaderBasketView** ↔ **AppPresenter** - кнопка корзины уведомляет о кликах

### Данные в приложении

- **IProduct** - данные товара (id, title, description, image, category, price)
- **ICartItem** - товар в корзине (id, title, price, index)
- **IOrderForm** - данные формы заказа (payment, address, email, phone)
- **IOrder** - данные для отправки заказа (total, items)

### Процессы в приложении

Все процессы реализованы через события и следуют принципам MVP:

**Загрузка товаров:**
1. AppPresenter → ProductService.getProducts()
2. ProductService → Api.get()
3. ProductService → ProductModel.setItems()
4. ProductModel → событие PRODUCTS_LOADED
5. AppPresenter → ProductGalleryView.render()

**Добавление в корзину:**
1. ProductCardView → событие PRODUCT_SELECTED
2. AppPresenter → CartModel.addItem()
3. CartModel → событие CART_ITEM_ADDED
4. AppPresenter → обновление всех представлений

**Валидация формы:**
1. FormView → событие изменения поля
2. AppPresenter → OrderModel.setField()
3. OrderModel → валидация → событие formErrors:change
4. AppPresenter → обновление формы с данными о валидности

**Оформление заказа:**
1. FormView → событие отправки формы
2. AppPresenter → сбор данных из моделей
3. AppPresenter → ProductService.createOrder()
4. AppPresenter → очистка корзины и показ успеха

### Валидация форм

Валидация происходит на двух уровнях:

#### Валидация в модели OrderModel:
- **Модель** принимает решения о валидности данных
- **Модель** эмитит события с ошибками валидации
- **Презентер** связывает модель и представления через события

Метод `validateForm()` в OrderModel:
- Проверяет все поля формы
- Сохраняет ошибки в поле formErrors
- Эмитит событие `formErrors:change` с ошибками
- Эмитит событие `order:ready` если форма валидна

#### Валидация в модальных окнах (AppModalView):
- **Реальная валидация** в формах оплаты и контактов
- **Отображение ошибок** в элементе `.form__errors`
- **Блокировка кнопок** при невалидных данных
- **Валидация в реальном времени** при вводе данных

**Сообщения об ошибках:**
- Проверка выбора способа оплаты и заполнения адреса
- Проверка заполнения email и телефона

### Особенности реализации

#### Использование темплейтов
- Все компоненты создаются из HTML-темплейтов через `createElementFromTemplate()`
- Модальное окно не создает контент самостоятельно, а получает его через render()
- Каждый компонент отвечает только за отображение переданных ему данных

#### Инверсия зависимостей
- Все компоненты получают зависимости через конструктор
- App создает базовые сервисы и передает их презентеру
- Презентер получает все модели и представления как зависимости

#### Разделение ответственности
- **Модели** - управление данными и валидация
- **Представления** - отображение данных и эмит событий пользовательских действий
- **Презентер** - координация между моделями и представлениями
- **Сервисы** - взаимодействие с внешними API

#### Обработка бесценных товаров
- Товары с `price: null` отображаются как "Бесценно"
- Кнопки для таких товаров становятся неактивными с текстом "Недоступно"
- Бесценные товары не могут быть добавлены в корзину

#### Обработка изображений
- Автоматическая замена `.svg` на `.png` для лучшего отображения
- Использование CDN_URL для загрузки изображений
- Responsive изображения с `object-fit: contain`
- Обработка отсутствующих изображений

#### Сообщения пользователю
- "Корзина пуста" при отсутствии товаров в корзине
- "Бесценно" для товаров без цены
- "Недоступно" для кнопок бесценных товаров
- "Заказ оформлен" с суммой списания при успешном оформлении
- Ошибки валидации форм с соответствующими сообщениями
