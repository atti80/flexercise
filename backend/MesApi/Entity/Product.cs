public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public ProductType ProductType { get; set; }
    public string? Description { get; set; }
    public DateTime Created { get; set; }
    public ProductStatus Status { get; set; }
    public DateTime? ModifiedTime { get; set; }
    public string? LastUpdate { get; set; }
}