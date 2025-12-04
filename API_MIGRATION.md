# Міграція на ASP.NET Core API

## Зміни в проекті

Клієнт Next.js повністю переробний для роботи з ASP.NET Core сервером.

### Нова структура проекту

```
src/
├── types/
│   └── api.types.ts          # TypeScript типи для API (UserDto, DrillDto, UserDrillDto)
├── api/
│   ├── client.ts             # Базовий axios клієнт
│   ├── user.api.ts           # User API ендпоінти
│   ├── drill.api.ts          # Drill API ендпоінти
│   ├── userDrill.api.ts      # UserDrill API ендпоінти
│   └── index.ts              # Експорт всіх API функцій
├── utils/
│   └── date.utils.ts         # Утиліти для роботи з датами та конвертацією UTC+2
├── hooks/
│   ├── useTimer.ts           # Hook для real-time таймерів
│   ├── useUsers.ts           # Hook для роботи з користувачами
│   ├── useDrills.ts          # Hook для роботи з drills
│   └── useUserDrills.ts      # Hook для роботи з історією (Reports)
├── components/
│   ├── StatusBadge.tsx       # Бейдж статусу (active/stopped)
│   ├── UserTimer.tsx         # Таймер для користувача
│   ├── UserSelector.tsx      # Мультиселект для вибору користувачів
│   ├── DrillCard.tsx         # Карточка Drill з Start/Stop
│   ├── modals/
│   │   ├── CreateWorkerModal.tsx  # Модалка створення користувача (firstName, lastName, email)
│   │   └── CreateDrillModal.tsx   # Модалка створення Drill (title, pricePerMinute)
│   └── reports/
│       ├── ReportsTable.tsx      # Таблиця з історією сесій
│       └── ReportsSummary.tsx    # Підсумкова статистика по Drill
└── app/
    ├── (home)/page.tsx       # Головна сторінка зі списком Drill
    └── reports/page.tsx      # Сторінка Reports з історією

```

### Основні API ендпоінти

#### User API
- `POST /user` - створити користувача
- `GET /user/list` - отримати всіх користувачів

#### Drill API
- `POST /drill` - створити drill
- `POST /drill/start` - запустити drill для списку користувачів
- `POST /drill/stop` - зупинити drill для списку користувачів
- `GET /drill/list` - отримати всі drill з активними користувачами

#### UserDrill API
- `GET /userdrill/list` - всі записи UserDrill
- `GET /userdrill/active` - активні drill (StoppedAt == null)
- `GET /userdrill/completed` - завершені drill (StoppedAt != null)

### Основні зміни

1. **Типи даних**:
   - `Worker` → `UserDto` (firstName, lastName, email)
   - `Drill` → `DrillDto` (title замість name)
   - Додано `UserDrillDto` для історії сесій
   - Всі дати у форматі Unix timestamp (мілісекунди)

2. **Start/Stop логіка**:
   - Для старту drill обирається список користувачів
   - Для кожного користувача створюється новий запис UserDrill
   - При Stop оновлюється stoppedAt для активних записів
   - DrillDto.users містить тільки активних користувачів (StoppedAt == null)

3. **Timezone**:
   - Всі timestamp конвертуються в UTC+2 (Europe/Kiev)
   - Використовується date-fns-tz для конвертації
   - Формат відображення: ДД.ММ.РРРР ГГ:ХХ:СС

4. **Real-time оновлення**:
   - Таймери оновлюються кожну секунду для активних drill
   - Синхронізація з сервером кожні 5 секунд для Drill
   - Синхронізація з сервером кожні 10 секунд для Reports
   - Оптимізовані ре-рендери з React.memo та useMemo

5. **Сторінка Reports**:
   - Фільтр "Всі записи" / "Тільки активні"
   - Детальна таблиця з історією всіх сесій
   - Підсумкова статистика по Drill
   - Загальний підсумок з тривалістю та вартістю
   - Real-time таймери для активних сесій

## Налаштування

### 1. Встановити залежності
```bash
npm install
```

### 2. Налаштувати .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Запустити сервер ASP.NET Core
Переконайтесь що сервер запущений на `http://localhost:5000`

### 4. Запустити Next.js клієнт
```bash
npm run dev
```

Клієнт буде доступний на `http://localhost:3000`

## Білд проекту

```bash
npm run build
npm run start
```

## Структура компонентів

### Головна сторінка
- Список всіх Drill у вигляді карточок
- Кожна карточка показує:
  - Назву Drill та ціну за хвилину
  - Список активних користувачів з таймерами
  - Селектор для вибору користувачів
  - Кнопки START та STOP
- Floating Action Buttons для створення користувачів та Drill

### Сторінка Reports
- Фільтр для перемикання між всіма та активними записами
- Підсумкова статистика:
  - Групування по Drill
  - Кількість сесій, загальний час, загальна вартість
  - Загальний підсумок
- Детальна таблиця:
  - Всі сесії з інформацією про користувача, drill, час початку/зупинки
  - Real-time таймери для активних сесій
  - Обчислення тривалості та вартості

## Оптимізації

- **React.memo** для всіх основних компонентів
- **useMemo** для обчислень підсумків та групування
- **useCallback** для стабільності колбеків
- **Окремі компоненти** для активних та завершених рядків таблиці
- **Автоматична синхронізація** з мінімальними запитами

## Важливо

- Всі запити йдуть через axios з автоматичною обробкою помилок
- Toast notifications для всіх операцій
- Валідація форм на клієнті перед відправкою
- Оптимістичне оновлення UI після операцій
- Мінімізація ре-рендерів через правильне використання хуків
