using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using StockTracer.Backend;
using System.Net;

public class Functions
{
    private readonly StockService _stockService;

    public Functions(StockService stockService)
    {
        _stockService = stockService;
    }

    //private static readonly string[] AllowedOrigins = new[]
    //{
    //    "http://localhost:5173",
    //    "https://zealous-pond-004f41403.1.azurestaticapps.net"
    //};

    [Function("GetStock")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "stock")]
        HttpRequestData req,
        FunctionContext context)
    {
        var logger = context.GetLogger("GetStock");


        //string? origin = req.Headers.TryGetValues("Origin", out var originValues)
        //    ? originValues.FirstOrDefault()
        //    : null;

        //bool isAllowedOrigin = origin != null && AllowedOrigins.Contains(origin);

        if (req.Method == "OPTIONS")
        {
            var preflight = req.CreateResponse(HttpStatusCode.OK);
            //AddCorsHeaders(preflight, origin);
            return preflight;
        }

        var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
        var symbol = query["symbol"];

        if (string.IsNullOrWhiteSpace(symbol))
        {
            var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            //AddCorsHeaders(badResponse, origin);
            await badResponse.WriteStringAsync("Missing 'symbol' query param");
            return badResponse;
        }

        //logger.LogInformation($"Received request from origin: {origin}, symbol: {symbol}");
        var stock = await _stockService.GetStockAsync(symbol);
        if (stock == null)
        {
            var notFound = req.CreateResponse(HttpStatusCode.NotFound);
            //AddCorsHeaders(notFound, origin);
            await notFound.WriteStringAsync("Stock not found or error from API");
            return notFound;
        }

        var response = req.CreateResponse(HttpStatusCode.OK);
        //AddCorsHeaders(response, origin);
        await response.WriteAsJsonAsync(stock);
        return response;
    }

    //private static void AddCorsHeaders(HttpResponseData response, string? origin)
    //{
    //    response.Headers.Add("Access-Control-Allow-Origin", origin ?? "*");
    //    response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
    //    response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
    //}
}
