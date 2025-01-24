using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Category{
    public class CreateCategoryDto
    {
        [Required]
        public string category_name {get; set;}
    }
}