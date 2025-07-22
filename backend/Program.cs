using Microsoft.Azure.Functions.Worker.Builder;
using StockTracer.Backend;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        //services.AddHttpClient();
        services.AddSingleton<StockService>();
    })
    .Build();

host.Run();
