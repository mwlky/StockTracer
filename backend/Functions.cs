using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace StockTracer.Backend
{
    public class Functions(StockService _stockService)
    {
        [Function("GetStock")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "stock")]
            HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger("GetStock");

            var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
            var symbol = query["symbol"];

            if (string.IsNullOrWhiteSpace(symbol))
            {
                var badResponse = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
                await badResponse.WriteStringAsync("Missing 'symbol' query param");
                return badResponse;
            }

            var stock = await _stockService.GetStockAsync(symbol);
            if (stock == null)
            {
                var notFound = req.CreateResponse(System.Net.HttpStatusCode.NotFound);
                await notFound.WriteStringAsync("Stock not found or error from API");
                return notFound;
            }

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);

            response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:5173");
            response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
            response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            await response.WriteAsJsonAsync(stock);
            return response;
                
        }
    }
}
