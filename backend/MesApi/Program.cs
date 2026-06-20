var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).IsLoopback)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddDbContext<ApplicationDbContext>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

app.MapGet("/api/products", (ApplicationDbContext context) =>
{
    return context.Products.ToList();
})
.WithName("GetProducts")
.WithOpenApi();

app.MapPost("/api/products", (ApplicationDbContext context, Product product) =>
{
    product.Created = DateTime.Now;
    context.Products.Add(product);
    context.SaveChanges();
    return Results.Created($"/api/products/{product.Id}", product);
})
.WithName("CreateProduct")
.WithOpenApi();

app.MapPut("/api/products/{id}", (int id, Product updatedProduct, ApplicationDbContext context) =>
{
    var product = context.Products.Find(id);
    if (product is null) return Results.NotFound();

    var changes = new List<string>();

    if (product.Name != updatedProduct.Name)
        changes.Add($"Name: {product.Name}");

    if (product.Description != updatedProduct.Description)
        changes.Add($"Description: {product.Description}");

    if (product.ProductType != updatedProduct.ProductType)
        changes.Add($"ProductType: {product.ProductType}");

    if (product.Status != updatedProduct.Status)
        changes.Add($"Status: {product.Status}");

    product.Name = updatedProduct.Name;
    product.Description = updatedProduct.Description;
    product.ProductType = updatedProduct.ProductType;
    product.Status = updatedProduct.Status;

    if (changes.Count > 0)
    {
        product.ModifiedTime = DateTime.Now;
        product.LastUpdate = string.Join(", ", changes);
    }

    context.SaveChanges();

    return Results.Ok(product);
})
.WithName("UpdateProduct")
.WithOpenApi();

app.MapDelete("/api/products/{id}", (int id, ApplicationDbContext context) =>
{
    var product = context.Products.Find(id);
    if (product is null) return Results.NotFound();

    context.Products.Remove(product);
    context.SaveChanges();

    return Results.NoContent();
})
.WithName("DeleteProduct")
.WithOpenApi();

app.Run();
