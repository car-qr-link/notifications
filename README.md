# Сервис уведомлений

Отвечает за уведомдление пользователей о вызовах и прием обратной связи. Имя пакета `@car-qr-link/notifications`.

## Используемые технологии, библиотеки

- [NestJS](https://nestjs.com)
- [Pino](https://getpino.io)
- [Redis](https://redis.io)

## Настройки

Для настройки сервиса используются переменные окружения:

| Название                            | Описание                                | По умолчанию                            |
| ----------------------------------- | --------------------------------------- | --------------------------------------- |
| `STORAGE__URL`                      | Адрес KV-хранилища (Redis)              | `redis://localhost:6379/0`              |
| `MESSAGING__BROKER_URL`             | Адрес брокера сообщений (Redis)         | `redis://localhost:6379/0`              |
| `MESSAGING__SEND__PREFIX`           | Префикс очереди отправки сообщений      | `messages:send:`                        |
| `MESSAGING__RECEIVE__NAME`          | Имя очереди получения сообщений         | `messages:received`                     |
| `NOTIFICATIONS__DEDUPLICATION__TTL` | Время до повторной отправки уведомления | `300`                                   |
| `NOTIFICATIONS__TTL`                | Время до удаления уведомления           | `3 * NOTIFICATIONS__DEDUPLICATION__TTL` |

## Сущности

- Уведомление: ИД учетной записи, дата отправки, канал
- Ответ: ИД учетной записи, дата получения, текст

## Входящие взаимодействия

### HTTP

Сервис должен предоставлять REST API с общим префиксом `/api/v1`:

| Метод                         | Запрос                    | Ответ                              | Описание                              |
| ----------------------------- | ------------------------- | ---------------------------------- | ------------------------------------- |
| `GET  /notifications/reasons` | -                         | `200` - `GetReasonsResponse`       | Получение причин отправки уведомления |
| `POST /notifications`         | `SendNotificationRequest` | `202` - `SendNotificationResponse` | Отправка уведомления                  |

Названия типов из пакета `@car-qr-link/apis`.

Все ошибки должны возвращаться в виде интерфейса `ErrorResponse`. Непредвиденные ошибки (код 5xx) должны журналироваться в консоль.

### Сообщения

Принимает ответы от пользователей через брокер сообщений.

## Исходящие взаимодействия

Передает сообщения на отправку в сервисы сообщений.
