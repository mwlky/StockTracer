using StockTracer.Backend;
using Microsoft.Azure.Functions.Worker.Builder;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddSingleton<StockService>();


var app = builder.Build();
app.Run();
