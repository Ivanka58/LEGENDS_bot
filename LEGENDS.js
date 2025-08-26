const TelegramBot = require('node-telegram-bot-api');

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const token = '8299314755:AAESNdu1xDWV3CkjGRwgHs07xyPc3h2tZb8';

const bot = new TelegramBot(token, { polling: true });

// Тексты для кнопок
const welcomeText = "Добро пожаловать в LEGENDS! Здесь вы можете узнать о нашем автопарке и условиях вступления.";
const autoparkText = "Наш автопарк состоит из ... (описание автопарка)";
const requirementsText = "Для вступления в LEGENDS необходимо ... (требования)";

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
                [{ text: 'Что нужно для вступления', callback_data: CALLBACK_REQUIREMENTS }],
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
        parse_mode: 'HTML'
    };
    if (messageId) {
        options.message_id = messageId;
        options.reply_markup = keyboard.reply_markup;
        bot.editMessageText(text, options).catch(error => {
            console.error('Ошибка редактирования сообщения:', error);
        });
    } else {
        bot.sendMessage(chatId, text, keyboard).catch(error => {
            console.error('Ошибка отправки сообщения:', error);
        });
    }

}
// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Начать', callback_data: CALLBACK_START }],
            ]
        }
    };

    sendMessage(chatId, null,'Приветствуем в LEGENDS!', keyboard);

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
