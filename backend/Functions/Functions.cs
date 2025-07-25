using System.Net;
using StockTracer.Backend;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

public class Functions
{
    private readonly StockService _stockService;

    private static readonly string[] AllowedOrigins = new[]
    {
        "http://localhost:5173",
        "https://zealous-pond-004f41403.1.azurestaticapps.net"
    };

    public Functions(StockService stockService)
    {
        _stockService = stockService;
    }

    [Function("GetStock")]
    public async Task<HttpResponseData> RunAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "stock")]
        HttpRequestData req,
        FunctionContext context)
    {
        var logger = context.GetLogger("GetStock");

        try
        {
            string? origin = req.Headers.TryGetValues("Origin", out var originValues)
                ? originValues.FirstOrDefault()
                : null;

            bool isAllowedOrigin = origin != null && AllowedOrigins.Contains(origin);

            // Preflight request (OPTIONS request)
            if (req.Method == "OPTIONS")
            {
                var preflight = req.CreateResponse(HttpStatusCode.OK);
                AddCorsHeaders(preflight, origin);
                return preflight;
            }

            // Handling GET request
            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var symbol = query["symbol"];

            if (string.IsNullOrWhiteSpace(symbol))
            {
                var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                AddCorsHeaders(badResponse, origin);
                await badResponse.WriteStringAsync("Missing 'symbol' query param");
                return badResponse;
            }

            logger.LogInformation($"Received request from origin: {origin}, symbol: {symbol}");
            var stock = await _stockService.GetStockAsync(symbol);

            if (stock == null)
            {
                var notFound = req.CreateResponse(HttpStatusCode.NotFound);
                AddCorsHeaders(notFound, origin);
                await notFound.WriteStringAsync("Stock not found or error from API");
                return notFound;
            }

            var response = req.CreateResponse(HttpStatusCode.OK);
            AddCorsHeaders(response, origin);
            await response.WriteAsJsonAsync(stock);
            return response;
        }

        catch (Exception ex)
        {

            logger.LogError($"An error occurred: {ex.Message}");
            var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
            await errorResponse.WriteStringAsync($"An error occurred: {ex.Message}");
            return errorResponse;
        }
    }

    private static void AddCorsHeaders(HttpResponseData response, string? origin)
    {
        response.Headers.Add("Access-Control-Allow-Origin", origin ?? "*");
        response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
    }
}
