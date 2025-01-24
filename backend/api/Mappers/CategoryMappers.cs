using api.Dtos.Category;
using api.DataLayer.Models;
using api.Dtos.Service;

namespace api.Mappers{
    public static class CategoryMappers
    {
        public static Category ToCategoryFromCreateDto(this CreateCategoryDto createCategoryDto)
        {
            return new Category
            {
                category_name = createCategoryDto.category_name
            };
        }

        public static CategoryDto ToCategoryDto(this Category category)
        {
            return new CategoryDto
            {
                category_name = category.category_name,
                services = category.services.Select(s => s.ToServiceDto()).ToList()
            };
        }
    }
    
}