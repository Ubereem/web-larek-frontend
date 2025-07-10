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

#### Класс ProductModel
Назначение: Управляет данными о товарах, полученными с сервера.

Конструктор: 
- Принимает экземпляр ApiClient для работы с API

Поля класса:
- items: IProduct[] - массив товаров, полученных с сервера
- api: IApiClient - клиент для работы с API

Методы:
- getProducts(): Promise<IProduct[]> - загружает товары с сервера и сохраняет в поле items
- getProductById(id: string): IProduct | undefined - возвращает товар по ID из поля items

#### Класс CartModel
Назначение: Управляет состоянием корзины пользователя.

Конструктор: 
- Не принимает параметров

Поля класса:
- items: ICartItem[] - массив товаров в корзине
- total: number - общая стоимость корзины

Методы:
- addItem(product: IProduct): void - добавляет товар в корзину, создавая ICartItem с индексом
- removeItem(id: string): void - удаляет товар из корзины по ID
- clear(): void - очищает корзину
- getItems(): ICartItem[] - возвращает массив товаров в корзине
- getTotal(): number - возвращает общую стоимость корзины
- isInCart(id: string): boolean - проверяет, есть ли товар в корзине

#### Класс OrderModel
Назначение: Управляет данными формы заказа и валидацией.

Конструктор: 
- Принимает экземпляр ApiClient для отправки заказа

Поля класса:
- form: Partial<IOrderForm> - данные формы заказа (способ оплаты, адрес, email, телефон)
- api: IApiClient - клиент для работы с API

Методы:
- setPayment(payment: 'card' | 'cash'): void - устанавливает способ оплаты
- setAddress(address: string): void - устанавливает адрес доставки
- setEmail(email: string): void - устанавливает email
- setPhone(phone: string): void - устанавливает телефон
- submit(cart: ICart): Promise<void> - отправляет заказ на сервер
- reset(): void - сбрасывает форму
- isValid(): boolean - проверяет валидность формы

### СЛОЙ ПРЕДСТАВЛЕНИЯ

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
- Принимает шаблон карточки товара

Поля класса:
- template: HTMLTemplateElement - шаблон карточки
- element: HTMLElement - DOM элемент карточки
- title: HTMLElement - заголовок товара
- image: HTMLImageElement - изображение товара
- price: HTMLElement - цена товара
- category: HTMLElement - категория товара
- button: HTMLButtonElement - кнопка действия

Методы:
- render(product: IProduct): void - рендерит карточку с данными товара
- setInCart(inCart: boolean): void - изменяет состояние кнопки в зависимости от наличия в корзине
- setPrice(price: number | null): void - устанавливает цену товара
- setDisabled(disabled: boolean): void - блокирует/разблокирует карточку

#### Класс ProductPreviewView
Назначение: Отображает детальную информацию о товаре в модальном окне.

Конструктор: 
- Принимает шаблон превью товара

Поля класса:
- template: HTMLTemplateElement - шаблон превью
- element: HTMLElement - DOM элемент превью
- title: HTMLElement - заголовок товара
- description: HTMLElement - описание товара
- image: HTMLImageElement - изображение товара
- price: HTMLElement - цена товара
- category: HTMLElement - категория товара
- button: HTMLButtonElement - кнопка покупки

Методы:
- render(product: IProduct): void - рендерит превью с данными товара
- setInCart(inCart: boolean): void - изменяет текст кнопки в зависимости от состояния корзины
- setPrice(price: number | null): void - устанавливает цену товара
- setDisabled(disabled: boolean): void - блокирует/разблокирует кнопку

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

#### Класс OrderFormView
Назначение: Отображает форму оформления заказа.

Конструктор: 
- Принимает шаблон формы заказа

Поля класса:
- template: HTMLTemplateElement - шаблон формы
- element: HTMLElement - DOM элемент формы
- paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты
- addressInput: HTMLInputElement - поле ввода адреса
- emailInput: HTMLInputElement - поле ввода email
- phoneInput: HTMLInputElement - поле ввода телефона
- submitButton: HTMLButtonElement - кнопка отправки
- errorsContainer: HTMLElement - контейнер для ошибок

Методы:
- render(): void - рендерит форму
- setPayment(payment: 'card' | 'cash'): void - устанавливает выбранный способ оплаты
- setAddress(address: string): void - устанавливает адрес
- setEmail(email: string): void - устанавливает email
- setPhone(phone: string): void - устанавливает телефон
- setErrors(errors: string[]): void - отображает ошибки валидации
- clearErrors(): void - очищает ошибки
- setDisabled(disabled: boolean): void - блокирует/разблокирует форму

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

Код презентера размещен в основном скрипте приложения (src/index.ts) и не выделен в отдельные классы. Презентер координирует взаимодействие между моделями и представлениями через систему событий.

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

#### Пример взаимодействия при добавлении товара в корзину:

1. ProductCardView реагирует на клик пользователя по кнопке "В корзину" и генерирует событие PRODUCT_SELECTED с данными товара
2. Презентер обрабатывает событие PRODUCT_SELECTED и вызывает метод addItem() модели CartModel
3. CartModel изменяет данные в поле items и генерирует событие CART_ITEM_ADDED
4. Презентер обрабатывает событие CART_ITEM_ADDED и вызывает метод render() у CartView и ProductCardView
5. CartView перерисовывается, отображая обновленный список товаров, а ProductCardView изменяет состояние кнопки на "Убрать из корзины"

### Компоненты и их связи

- ProductModel ↔ Api - модель получает данные через API клиент
- CartModel ↔ ProductModel - корзина работает с товарами из модели
- OrderModel ↔ Api - модель заказа отправляет данные через API клиент
- ModalView ↔ ProductPreviewView/CartView/OrderFormView/SuccessView - модальное окно отображает различные представления
- ProductCardView ↔ ProductPreviewView - карточка товара может открыть превью
- CartView ↔ OrderFormView - корзина может открыть форму заказа
- OrderFormView ↔ SuccessView - форма заказа может показать успех

### Данные в приложении

- IProduct - данные товара (id, title, description, image, category, price)
- ICartItem - товар в корзине (id, title, price, index)
- ICart - состояние корзины (items, total)
- IOrderForm - данные формы заказа (payment, address, email, phone)
- IOrder - данные для отправки заказа (total, items)

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
