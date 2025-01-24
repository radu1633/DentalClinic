using System.ComponentModel.DataAnnotations;

public class UpdateServiceDto
{
    [Required]
    public string name { get; set; }
    [Required]
    public string description { get; set; }
    [Required]
    public decimal price { get; set; }
    [Required]
    public int duration { get; set; }
}