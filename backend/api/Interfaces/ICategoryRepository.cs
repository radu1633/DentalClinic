using api.DataLayer.Models;
using api.Dtos.Category;

namespace api.Interfaces{

    public interface ICategoryRepository
    {
        public Task<IEnumerable<Category>> GetOnlyCategories();
        public Task<IEnumerable<Category>> GetCategories();

        public Task<Category> GetCategory(int id);

        public Task<Category> AddCategory(Category category);

        public Task<Category> UpdateCategory(int id, UpdateCategoryDto category);

        public Task<Category> DeleteCategory(int id);
    }
}