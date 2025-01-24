using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Category{
    public class UpdateCategoryDto
    {   
        [Required]
        public string category_name {get; set;}
    }
}