using api.DataLayer.Models;
using api.Dtos.Service;

namespace api.Mappers
{
    public static class ServiceMappers
    { 
        public static Service ToServiceFromCreateDto(this CreateServiceDto createServiceDto)
        {
            return new Service
            {
                name = createServiceDto.name,
                description = createServiceDto.description,
                price = createServiceDto.price,
                duration = createServiceDto.duration,
                active = true,
                category_id = createServiceDto.category_id
            };
        }

        public static ServiceDto ToServiceDto(this Service service)
        {
            return new ServiceDto
            {
                service_id = service.service_id,
                name = service.name,
                description = service.description,
                price = service.price,
                duration = service.duration,
                category = service.category.category_name,
            };
        }
    }
}