using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using api.DataLayer.Models;
using api.Dtos.Service;
using api.Mappers;

namespace api.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase{
        private readonly IServiceRepository _serviceRepository;

        public ServiceController(IServiceRepository serviceRepository){
            _serviceRepository = serviceRepository;
        }

        [HttpGet]
        public async Task<IEnumerable<ServiceDto>> GetServices(){
            return await _serviceRepository.GetServices();
        }

        [HttpGet("{id:int}")]
        public async Task<Service> GetService(int id){
            return await _serviceRepository.GetService(id);
        }

        [HttpPost]
        public async Task<Service> AddService(CreateServiceDto service){
            var serviceModel = service.ToServiceFromCreateDto();
            return await _serviceRepository.AddService(serviceModel);
        }

        [HttpPut("{id:int}")]
        public async Task<Service> UpdateService(int id, UpdateServiceDto service){
            return await _serviceRepository.UpdateService(id, service);
        }

        [HttpDelete("{id:int}")]
        public async Task<Service> DeleteService(int id){
            return await _serviceRepository.DeleteService(id);
        }
    }
}