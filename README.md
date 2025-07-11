# WEB-ларёк

Интернет-магазин товаров для веб-разработчиков с возможностью просмотра каталога, добавления товаров в корзину и оформления заказа.

## Используемый стек

- TypeScript - типизированный JavaScript
- Webpack - сборщик модулей
- SCSS - препроцессор CSS
- HTML5 - разметка
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

## Архитектура проекта

Проект построен на основе MVP (Model-View-Presenter) архитектуры с использованием событийно-ориентированного подхода для взаимодействия между компонентами.

### Основные принципы архитектуры

- Изолированность - каждый компонент может работать независимо
- Единственная ответственность - каждый класс решает одну конкретную задачу
- Масштабируемость - возможность расширения функциональности без изменения базового кода
- Событийно-ориентированное взаимодействие - компоненты общаются через события

### СЛОЙ МОДЕЛЬ

#### Класс ProductService
Назначение: Обеспечивает взаимодействие с сервером для получения данных о товарах.

Конструктор: 
- Принимает базовый URL для API

Поля класса:
- api: Api - клиент для работы с API

Методы:
- getProducts(): Promise<IProduct[]> - загружает товары с сервера
- createOrder(order: IOrder): Promise<{ total: number; items: string[] }> - создает заказ на сервере

#### Класс ProductModel
Назначение: Управляет данными о товарах.

Конструктор: 
- Не принимает параметров

Поля класса:
- items: IProduct[] - массив товаров

Методы:
- setItems(items: IProduct[]): void - устанавливает массив товаров (вызывается презентером)
- getProductById(id: string): IProduct | undefined - возвращает товар по ID из поля items

#### Класс CartModel
Назначение: Управляет состоянием корзины пользователя.

Конструктор: 
- Не принимает параметров

Поля класса:
- items: ICartItem[] - массив товаров в корзине

Методы:
- addItem(product: IProduct): void - добавляет товар в корзину, создавая ICartItem с индексом
- removeItem(id: string): void - удаляет товар из корзины по ID
- clear(): void - очищает корзину
- getItems(): ICartItem[] - возвращает массив товаров в корзине
- getTotal(): number - вычисляет и возвращает общую стоимость корзины на основе цен товаров в items
- isInCart(id: string): boolean - проверяет, есть ли товар в корзине

#### Класс OrderModel
Назначение: Управляет данными формы заказа и валидацией.

Конструктор: 
- Не принимает параметров

Поля класса:
- form: Partial<IOrderForm> - данные формы заказа (способ оплаты, адрес, email, телефон)

Методы:
- setPayment(payment: 'card' | 'cash'): void - устанавливает способ оплаты
- setAddress(address: string): void - устанавливает адрес доставки
- setEmail(email: string): void - устанавливает email
- setPhone(phone: string): void - устанавливает телефон
- getForm(): Partial<IOrderForm> - возвращает данные формы заказа
- reset(): void - сбрасывает форму
- isValid(): boolean - проверяет валидность формы

### СЛОЙ ПРЕДСТАВЛЕНИЯ

#### Базовый класс ProductView
Назначение: Базовый класс для всех представлений товаров, содержащий общий функционал.

Конструктор: 
- Принимает шаблон товара

Поля класса:
- template: HTMLTemplateElement - шаблон товара
- element: HTMLElement - DOM элемент товара
- title: HTMLElement - заголовок товара
- image: HTMLImageElement - изображение товара
- price: HTMLElement - цена товара
- category: HTMLElement - категория товара

Методы:
- setTitle(title: string): void - устанавливает заголовок товара
- setImage(src: string): void - устанавливает изображение товара
- setPrice(price: number | null): void - устанавливает цену товара
- setCategory(category: ProductCategory): void - устанавливает категорию товара
- setDisabled(disabled: boolean): void - блокирует/разблокирует товар

#### Класс ModalView
Назначение: Управляет модальными окнами приложения.

Конструктор: 
- Принимает селектор контейнера модального окна

Поля класса:
- container: HTMLElement - контейнер модального окна
- content: HTMLElement - элемент для контента
- closeButton: HTMLElement - кнопка закрытия

Методы:
- open(): void - открывает модальное окно
- close(): void - закрывает модальное окно
- setContent(content: HTMLElement): void - устанавливает контент в модальное окно
- render() - рендерит модальное окно
- setDisabled(disabled: boolean): void - блокирует/разблокирует модальное окно

#### Класс ProductCardView
Назначение: Отображает карточку товара в каталоге.

Конструктор: 
- Наследует от ProductView

Поля класса:
- button: HTMLButtonElement - кнопка действия

Методы:
- render(product: IProduct): void - рендерит карточку с данными товара
- setInCart(inCart: boolean): void - изменяет состояние кнопки в зависимости от наличия в корзине

#### Класс ProductPreviewView
Назначение: Отображает детальную информацию о товаре в модальном окне.

Конструктор: 
- Наследует от ProductView

Поля класса:
- description: HTMLElement - описание товара
- button: HTMLButtonElement - кнопка покупки

Методы:
- render(product: IProduct): void - рендерит превью с данными товара
- setDescription(description: string): void - устанавливает описание товара
- setInCart(inCart: boolean): void - изменяет текст кнопки в зависимости от состояния корзины

#### Класс CartItemView
Назначение: Отображает товар в корзине.

Конструктор: 
- Наследует от ProductView

Поля класса:
- index: HTMLElement - номер товара в корзине
- deleteButton: HTMLButtonElement - кнопка удаления

Методы:
- render(item: ICartItem): void - рендерит товар в корзине
- setIndex(index: number): void - устанавливает номер товара
- setDeleteHandler(handler: () => void): void - устанавливает обработчик удаления

#### Класс CartView
Назначение: Отображает содержимое корзины.

Конструктор: 
- Принимает шаблон корзины

Поля класса:
- template: HTMLTemplateElement - шаблон корзины
- element: HTMLElement - DOM элемент корзины
- list: HTMLElement - список товаров
- total: HTMLElement - общая стоимость
- button: HTMLButtonElement - кнопка оформления заказа

Методы:
- render(): void - рендерит корзину
- setItems(items: ICartItem[]): void - устанавливает список товаров
- setTotal(total: number): void - устанавливает общую стоимость
- setDisabled(disabled: boolean): void - блокирует/разблокирует кнопку оформления

#### Базовый класс FormView
Назначение: Базовый класс для всех форм, содержащий общий функционал.

Конструктор: 
- Принимает шаблон формы

Поля класса:
- template: HTMLTemplateElement - шаблон формы
- element: HTMLElement - DOM элемент формы
- submitButton: HTMLButtonElement - кнопка отправки
- errorsContainer: HTMLElement - контейнер для ошибок

Методы:
- render(): void - рендерит форму
- setErrors(errors: string[]): void - отображает ошибки валидации
- clearErrors(): void - очищает ошибки
- setDisabled(disabled: boolean): void - блокирует/разблокирует форму

#### Класс PaymentFormView
Назначение: Отображает форму выбора способа оплаты и ввода адреса доставки.

Конструктор: 
- Наследует от FormView

Поля класса:
- paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты
- addressInput: HTMLInputElement - поле ввода адреса

Методы:
- setPayment(payment: 'card' | 'cash'): void - устанавливает выбранный способ оплаты
- setAddress(address: string): void - устанавливает адрес

#### Класс ContactsFormView
Назначение: Отображает форму ввода контактных данных.

Конструктор: 
- Наследует от FormView

Поля класса:
- emailInput: HTMLInputElement - поле ввода email
- phoneInput: HTMLInputElement - поле ввода телефона

Методы:
- setEmail(email: string): void - устанавливает email
- setPhone(phone: string): void - устанавливает телефон

#### Класс SuccessView
Назначение: Отображает сообщение об успешном оформлении заказа.

Конструктор: 
- Принимает шаблон успешного заказа

Поля класса:
- template: HTMLTemplateElement - шаблон успеха
- element: HTMLElement - DOM элемент сообщения
- title: HTMLElement - заголовок
- description: HTMLElement - описание
- button: HTMLButtonElement - кнопка закрытия

Методы:
- render(total: number): void - рендерит сообщение с суммой заказа
- setDisabled(disabled: boolean): void - блокирует/разблокирует кнопку

### СЛОЙ ПРЕЗЕНТЕРА

Код презентера размещен в основном скрипте приложения (src/index.ts) и не выделен в отдельные классы. Презентер координирует взаимодействие между моделями, представлениями и API через систему событий.

**Роль презентера в работе с API:**
- Использует ProductService для получения данных о товарах с сервера
- Передает полученные данные в ProductModel через метод setItems()
- Получает данные из моделей (ProductModel, CartModel, OrderModel)
- Собирает необходимые объекты для отправки на сервер
- Использует ProductService для выполнения запросов к серверу
- Обрабатывает ответы сервера и обновляет модели и представления

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

### Событийно-ориентированное взаимодействие

Приложение использует событийно-ориентированный подход для взаимодействия между компонентами. Все события определены в перечислении AppEvents.

#### Пример взаимодействия при загрузке товаров:

1. При инициализации приложения презентер вызывает ProductService.getProducts()
2. ProductService выполняет запрос к серверу через Api
3. Полученные данные презентер передает в ProductModel через метод setItems()
4. ProductModel сохраняет данные и генерирует событие PRODUCTS_LOADED
5. Презентер обрабатывает событие PRODUCTS_LOADED и обновляет представления

#### Пример взаимодействия при добавлении товара в корзину:

1. ProductCardView реагирует на клик пользователя по кнопке "В корзину" и генерирует событие PRODUCT_SELECTED с данными товара
2. Презентер обрабатывает событие PRODUCT_SELECTED и вызывает метод addItem() модели CartModel
3. CartModel изменяет данные в поле items и генерирует событие CART_ITEM_ADDED
4. Презентер обрабатывает событие CART_ITEM_ADDED и вызывает метод render() у CartView и ProductCardView
5. CartView перерисовывается, отображая обновленный список товаров, а ProductCardView изменяет состояние кнопки на "Убрать из корзины"

#### Пример взаимодействия при отправке заказа:

1. PaymentFormView реагирует на отправку формы и генерирует событие ORDER_PAYMENT_CHANGED
2. Презентер обрабатывает событие и получает данные формы через OrderModel.getForm()
3. Презентер переключается на ContactsFormView для ввода контактных данных
4. ContactsFormView реагирует на отправку формы и генерирует событие ORDER_SUBMITTED
5. Презентер обрабатывает событие ORDER_SUBMITTED и получает полные данные формы
6. Презентер получает данные корзины через CartModel.getItems() и CartModel.getTotal()
7. Презентер формирует объект IOrder из полученных данных
8. Презентер использует ProductService.createOrder() для отправки заказа на сервер
9. При успешном ответе сервера презентер генерирует событие ORDER_SUCCESS и обновляет представления

### Компоненты и их связи

- Презентер ↔ ProductService - получает данные о товарах с сервера и отправляет заказы
- Презентер ↔ ProductModel - передает данные о товарах и получает их для отображения
- Презентер ↔ CartModel - получает данные корзины
- Презентер ↔ OrderModel - получает данные формы заказа
- ProductService ↔ Api - выполняет запросы к серверу для получения товаров и создания заказов
- CartModel ↔ ProductModel - корзина работает с товарами из модели
- ModalView ↔ ProductPreviewView/CartView/PaymentFormView/ContactsFormView/SuccessView - модальное окно отображает различные представления
- ProductCardView ↔ ProductPreviewView - карточка товара может открыть превью
- CartView ↔ PaymentFormView - корзина может открыть форму оплаты
- PaymentFormView ↔ ContactsFormView - форма оплаты может перейти к форме контактов
- ContactsFormView ↔ SuccessView - форма контактов может показать успех

### Данные в приложении

- IProduct - данные товара (id, title, description, image, category, price)
- ICartItem - товар в корзине (id, title, price, index)
- IOrderForm - данные формы заказа (payment, address, email, phone)
- IOrder - данные для отправки заказа (total, items)

**Примечание:** Данные корзины (items, total) не хранятся в отдельном интерфейсе ICart, а получаются через методы CartModel.getItems() и CartModel.getTotal() перед отправкой заказа на сервер. Презентер собирает объект IOrder из данных CartModel и OrderModel, затем использует ProductService для отправки заказа.

### Процессы в приложении

Все процессы реализованы через события:
- Загрузка товаров: PRODUCTS_LOADED
- Выбор товара: PRODUCT_SELECTED
- Добавление в корзину: CART_ITEM_ADDED
- Удаление из корзины: CART_ITEM_REMOVED
- Открытие корзины: CART_OPENED
- Изменение формы заказа: ORDER_PAYMENT_CHANGED, ORDER_ADDRESS_CHANGED, etc.
- Отправка заказа: ORDER_SUBMITTED
- Успешное оформление: ORDER_SUCCESS
- Открытие/закрытие модальных окон: MODAL_OPENED, MODAL_CLOSED
- Валидация форм: FORM_VALIDATED, FORM_ERRORS
