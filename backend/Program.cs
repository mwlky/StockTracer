using Microsoft.Azure.Functions.Worker.Builder;
using StockTracer.Backend;

//var host = new HostBuilder()
//    .ConfigureServices(services =>
//    {
//        services.AddSingleton<StockService>();
//    })
//    .Build();

//host.Run();

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddSingleton<StockService>();

var app = builder.Build();
app.Run();
