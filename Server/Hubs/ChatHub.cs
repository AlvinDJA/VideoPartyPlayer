using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ChatDefinitivo.Server.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnDisconnectedAsync(Exception e)
        {
            await Clients.All.SendAsync("ReceiveMessage", "", "##pause");
            Console.WriteLine($"Disconnected {e?.Message} {Context.ConnectionId}");
            await base.OnDisconnectedAsync(e);
        }
    }
}
