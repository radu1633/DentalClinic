using api.DataLayer.Models;
using api.Dtos.Service;

namespace api.Interfaces{

    public interface IServiceRepository{
        Task<IEnumerable<ServiceDto>> GetServices();
        Task<Service> GetService(int id);
        Task<Service> AddService(Service service);
        Task<Service> UpdateService(int id, UpdateServiceDto service);
        Task<Service> DeleteService(int id);
    }
}