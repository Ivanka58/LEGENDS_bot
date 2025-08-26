const TelegramBot = require('node-telegram-bot-api');

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const token = '8299314755:AAESNdu1xDWV3CkjGRwgHs07xyPc3h2tZb8';

// ID вашего чата (замените на ваш реальный ID)
const ownerChatId = 6749286679;  // <--- Замените!

const bot = new TelegramBot(token, { polling: true });

// Тексты для кнопок
const welcomeText = "Добро пожаловать в LEGENDS! Здесь вы можете узнать о нашем автопарке и условиях вступления.";
const autoparkText = "Наш автопарк состоит из ... (описание автопарка)"; // Замените описание автопарка!
const requirementsText = 🎯Привет! Ты попал в нашего бота,который принадлежит фаме LEGENDS, на сервере AQUA. Что бы вступить в семью тебе нужно.🎯
1. Иметь 4 уровень
2. Уметь стрелять
3. Быть свободным во времени.
Если тебе это подходит,то мы тебя ждём!🎯
Наша связь: ТГ основателя фамы @FriezZ0 тел в игре 300858 на сервере AQUA; // Текст для кнопки "Как вступить"

// Константы для callback_data
const CALLBACK_START = 'start';
const CALLBACK_AUTOPARK = 'autopark';
const CALLBACK_REQUIREMENTS = 'requirements';
const CALLBACK_BACK = 'back';

// Функция для создания клавиатуры главного меню
function createMainMenuKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Наш автопарк', callback_data: CALLBACK_AUTOPARK }],
                [{ text: 'Как вступить', callback_data: CALLBACK_REQUIREMENTS }], // Изменено название кнопки
            ]
        }
    };
}

// Функция для создания клавиатуры с кнопкой "Назад"
function createBackButtonKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Назад', callback_data: CALLBACK_BACK }]
            ]
        }
    };
}

// Функция для отправки/редактирования сообщения
function sendMessage(chatId, messageId, text, keyboard) {
    const options = {
        chat_id: chatId,
    };

    if (keyboard) {
        options.reply_markup = keyboard.reply_markup;
    }

    if (messageId) {
        options.message_id = messageId;
        bot.editMessageText(text, options).catch(error => {
            console.error('Ошибка редактирования сообщения:', error);
        });
    } else {
        bot.sendMessage(chatId, text, options).catch(error => {
            console.error('Ошибка отправки сообщения:', error);
        });
    }
}

// Функция для отправки сообщения "Я жив"
function sendIAmAlive() {
    bot.sendMessage(ownerChatId, 'Я жив!')
        .catch(error => {
            console.error('Ошибка при отправке сообщения "Я жив":', error);
        });
}

// Запускаем отправку сообщения "Я жив" каждые 10 минут
setInterval(sendIAmAlive, 10 * 60 * 1000);

// Обработчик команды /start
bot.onText(//start/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Начать', callback_data: CALLBACK_START }],
            ]
        }
    };

    sendMessage(chatId, null, 'Приветствуем в LEGENDS!', keyboard);
});

// Обработчик нажатий на кнопки
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const messageId = query.message.message_id;

    if (data === CALLBACK_START) {
        sendMessage(chatId, messageId, welcomeText, createMainMenuKeyboard());
    } else if (data === CALLBACK_AUTOPARK) {
        sendMessage(chatId, messageId, autoparkText, createBackButtonKeyboard());
    } else if (data === CALLBACK_REQUIREMENTS) {
        sendMessage(chatId, messageId, requirementsText, createBackButtonKeyboard());
    } else if (data === CALLBACK_BACK) {
        sendMessage(chatId, messageId, welcomeText, createMainMenuKeyboard());
    }

    // Отправляем уведомление о том, что кнопка обработана
    bot.answerCallbackQuery(query.id);
});

console.log('Бот запущен...');
