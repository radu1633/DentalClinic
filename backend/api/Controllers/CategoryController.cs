using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using api.DataLayer.Models;
using api.Dtos.Category;
using api.Mappers;

namespace api.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase{
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository){
            _categoryRepository = categoryRepository;
        }

        [HttpGet("only")]
        public async Task<IEnumerable<Category>> GetOnlyCategories(){
            return await _categoryRepository.GetOnlyCategories();
        }

        [HttpGet]
        public async Task<IEnumerable<Category>> GetCategories(){
            return await _categoryRepository.GetCategories();
        }

        [HttpGet("{id:int}")]
        public async Task<Category> GetCategory(int id){
            return await _categoryRepository.GetCategory(id);
        }

        [HttpPost]
        public async Task<Category> AddCategory(CreateCategoryDto category ){
            var categoryModel = category.ToCategoryFromCreateDto();
            return await _categoryRepository.AddCategory(categoryModel);
        }

        [HttpPut]
        public async Task<Category> UpdateCategory(int id, UpdateCategoryDto category){
            return await _categoryRepository.UpdateCategory(id, category);
        }

        [HttpDelete("{id:int}")]
        public async Task<Category> DeleteCategory(int id){
            return await _categoryRepository.DeleteCategory(id);
        }
    }
}