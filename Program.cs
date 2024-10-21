using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Telegram.Bot.Types.ReplyMarkups;
using System.Threading;
using MailKit;

namespace TelegramBot
{

    internal class Program
    {
        public static string token { get; set; } = "8154548227:AAFtMDnLWGEDrsJZzkNuFFR-GuzeBUW13t8";
        private static TelegramBotClient client;

        [Obsolete]
        static async Task Main(string[] args)
        {
          
            // Подписка на событие получения сообщения
            client = new  TelegramBotClient(token);
            client.StartReceiving();
            client.OnMessage += Bot_OnMessage;
            Console.ReadKey();
            client.StopReceiving(); // Остановка получения обновлений

        }

        [Obsolete]
        private static async void Bot_OnMessage(object sender, Telegram.Bot.Args.MessageEventArgs e)
        {
            var message = e.Message; // Получение сообщения из события

            // Проверка, если сообщение - это команда /start
            if (message.Text.ToLower() == "/start") 
            { 
                // Отправка приветственного сообщения
                await client.SendTextMessageAsync(message.Chat.Id, "Привет! Используй команду /play для запуска игры."); 
            } 
            // Проверка, если сообщение - это команда /play
            else if (message.Text.ToLower() == "/play") 
            { 
                string webAppUrl = "https://vtgoodgame.github.io/Game/"; 
                // Создание разметки клавиатуры с кнопкой, которая открывает Web App
                var replyMarkup = new InlineKeyboardMarkup( 
                    InlineKeyboardButton.WithUrl("Начать игру", webAppUrl)); 
                 
                // Отправка сообщения с кнопкой для запуска игры
                await client.SendTextMessageAsync(message.Chat.Id, "Запусти игру по ссылке ниже:", replyMarkup: replyMarkup); 
            } 
        } 
    } 
}
       


          
       
    

