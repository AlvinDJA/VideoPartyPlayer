using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatDefinitivo.Client.Utilies
{
    public class VideoManager
    {
        public IJSObjectReference _jsModule;
        public string Id { get; set; } = "video";
        public string Name { get; set; } = "";
        public bool isPlaying { get; set; } = false;
        public int currentTime { get; set; } = 0;
        public int Duration { get; set; } = 0;


        public VideoManager(IJSObjectReference jsModule)
        {
            _jsModule = jsModule;
        }
        public async Task Iniciar()
        {
            await _jsModule.InvokeVoidAsync("Inicializar");
            await GetName();
        }
        private async Task UpdateVideo()
        {
            await _jsModule.InvokeVoidAsync("updateVideo");
        }

        public async Task PlayClick()
        {
            await _jsModule.InvokeVoidAsync("togglePlay");
        }
        public async Task Pause()
        {
            await _jsModule.InvokeVoidAsync("pauseVideo");
        }
        public async Task VolumeClick()
        {
            await _jsModule.InvokeVoidAsync("updateVolume");
        }

        public async Task<int> GetCurrentTime()
        {
            return await _jsModule.InvokeAsync<int>("getCurrentTime");
        }
        public async Task<bool> isVideoOk()
        {
            return await _jsModule.InvokeAsync<bool>("videoWorks");
        }
        public async Task GetName()
        {
            Name = await _jsModule.InvokeAsync<string>("getName");
        }
        public async Task SkipTo(string mensaje)
        {
            await _jsModule.InvokeVoidAsync("skipTo", int.Parse(mensaje));
        }
        public async Task Reload()
        {
            await _jsModule.InvokeVoidAsync("reload");
        }
    }
}
