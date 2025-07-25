using Microsoft.Azure.Functions.Worker.Builder;
using StockTracer.Backend;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddSingleton<StockService>();

var app = builder.Build();
app.Run();
