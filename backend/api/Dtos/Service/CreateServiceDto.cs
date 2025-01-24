using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;

namespace api.Dtos.Service
{
    public class CreateServiceDto
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public decimal price { get; set; }
        [Required]
        public int duration { get; set; }
        [Required]
        public int category_id { get; set; }
    }
}