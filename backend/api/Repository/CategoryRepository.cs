using api.DataLayer;
using api.DataLayer.Models;
using api.Dtos.Category;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace api.Repository{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Category> AddCategory(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> DeleteCategory(int id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.category_id == id);
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _context.Categories.Include(c => c.services).ToListAsync();
        }

        public async Task<Category> GetCategory(int id)
        {
            return await _context.Categories.Include(c => c.services).FirstOrDefaultAsync(c => c.category_id == id);
        }

        public async Task<IEnumerable<Category>> GetOnlyCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> UpdateCategory(int id, UpdateCategoryDto category)
        {
            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.category_id == id);
            if(existingCategory == null){
                return null;
            }

            existingCategory.category_name = category.category_name;

            await _context.SaveChangesAsync();
            return existingCategory;
        }
    }
}