
using api.DataLayer.Models;
using api.DataLayer;
using api.Interfaces;
using Microsoft.EntityFrameworkCore;
using api.Dtos.Service;
using api.Mappers;

namespace api.Repository{
    
    public class ServiceRepository : IServiceRepository{
        private readonly AppDbContext _context;

        public ServiceRepository(AppDbContext context){
            _context = context;
        }

        public async Task<IEnumerable<ServiceDto>> GetServices(){
            return await _context.Services
                .Include(s => s.category)
                .Select(s => s.ToServiceDto())
                .ToListAsync();
        }

        public async Task<Service> GetService(int id){
            return await _context.Services.FirstOrDefaultAsync(s => s.service_id == id);
        }

        public async Task<Service> AddService(Service service){
            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<Service> UpdateService(int id, UpdateServiceDto service){
            var existingService = await _context.Services.FirstOrDefaultAsync(s => s.service_id == id);
            if(existingService == null){
                return null;
            }

            existingService.name = service.name;
            existingService.description = service.description;
            existingService.price = service.price;
            existingService.duration = service.duration;
            existingService.active = true;

            await _context.SaveChangesAsync();
            return existingService;
        }

        public async Task<Service> DeleteService(int id){
            var service = await _context.Services.FirstOrDefaultAsync(s => s.service_id == id);
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return service;
        }
    }
}