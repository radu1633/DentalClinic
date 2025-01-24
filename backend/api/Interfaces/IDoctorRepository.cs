using api.DataLayer.Models;
using api.Dtos.Category;
using api.Dtos.Doctor;

namespace api.Interfaces
{
    public interface IDoctorRepository
    {
        Task<IEnumerable<DoctorDto>> GetDoctors(HttpRequest request);
        Task<Doctor> GetDoctor(int id, HttpRequest request);
        Task<Doctor> AddDoctor(Doctor doctor);
        Task<Doctor> UpdateDoctorData(int id, UpdateDoctorData doctor);
        Task<Doctor> UpdateDoctorImage(int id, UpdateDoctorImage image);
        Task<Doctor> DeleteDoctor(int id);
    }
}