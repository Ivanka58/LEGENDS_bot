const TelegramBot = require('node-telegram-bot-api');

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const token = '8299314755:AAESNdu1xDWV3CkjGRwgHs07xyPc3h2tZb8';

const bot = new TelegramBot(token, { polling: true });

// Тексты для кнопок
const welcomeText = "Добро пожаловать в LEGENDS! Здесь вы можете узнать о нашем автопарке и условиях вступления.";
const autoparkText = "Наш автопарк состоит из ... (описание автопарка)";
const requirementsText = "Для вступления в LEGENDS необходимо ... (требования)";

// Функция для создания клавиатуры с кнопкой "Назад"
function createMainMenuKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Наш автопарк', callback_data: 'autopark' }],
                [{ text: 'Что нужно для вступления', callback_data: 'requirements' }],
            ]
        }
    };
}

// Функция для создания клавиатуры с кнопкой "Назад"
function createBackButtonKeyboard() {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Назад', callback_data: 'back' }]
            ]
        }
    };
}

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Начать', callback_data: 'start' }],
            ]
        }
    };

    bot.sendMessage(chatId, 'Приветствуем в LEGENDS!', keyboard);
});

// Обработчик нажатий на кнопки
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const messageId = query.message.message_id;

    if (data === 'start') {
        bot.editMessageText(welcomeText, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: createMainMenuKeyboard().reply_markup
        });
    } else if (data === 'autopark') {
        bot.editMessageText(autoparkText, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: createBackButtonKeyboard().reply_markup
        });
    } else if (data === 'requirements') {
        bot.editMessageText(requirementsText, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: createBackButtonKeyboard().reply_markup
        });
    } else if (data === 'back') {
        bot.editMessageText(welcomeText, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: createMainMenuKeyboard().reply_markup
        });
    }

    // Отправляем уведомление о том, что кнопка обработана
    bot.answerCallbackQuery(query.id);
});

console.log('Бот запущен...');
