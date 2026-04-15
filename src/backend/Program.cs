using System.Text.Json;
using Microsoft.AspNetCore.Http.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddHttpClient("NHTSA", client => 
{
    client.BaseAddress = new Uri("https://vpic.nhtsa.dot.gov/api/");
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

// Configure JSON options to CamelCase per project standards
var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    PropertyNameCaseInsensitive = true
};
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.PropertyNameCaseInsensitive = true;
});

var app = builder.Build();

app.UseCors("AllowAll");

// Exception handling middleware with exact JSON options
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (Exception ex)
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var response = JsonSerializer.Serialize(new { message = ex.Message }, jsonOptions);
        await context.Response.WriteAsync(response);
    }
});

// Proxy Endpoints

app.MapGet("/api/vehicles/makes", async (IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient("NHTSA");
    var response = await client.GetAsync("vehicles/getallmakes?format=json");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.MapGet("/api/vehicles/makes/{makeId}/types", async (int makeId, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient("NHTSA");
    var response = await client.GetAsync($"vehicles/GetVehicleTypesForMakeId/{makeId}?format=json");
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.MapGet("/api/vehicles/makes/{makeId}/years/{year}/models", async (int makeId, int year, string? vehicleType, IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient("NHTSA");
    var url = $"vehicles/GetModelsForMakeIdYear/makeId/{makeId}/modelyear/{year}";
    if (!string.IsNullOrEmpty(vehicleType))
    {
        url += $"/vehicletype/{Uri.EscapeDataString(vehicleType)}";
    }
    url += "?format=json";
    
    var response = await client.GetAsync(url);
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    return Results.Content(content, "application/json");
});

app.Run();
