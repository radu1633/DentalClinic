using api.DataLayer.Models;
using api.Dtos.Doctor;

namespace api.Mappers
{
    public static class DoctorMappers
    {
        public static Doctor MapToDoctor(this CreateDoctorDto createDoctorDto, string userId)
        {
            return new Doctor
            {
                UserId = userId,
                Specialization = createDoctorDto.Specialization,
                ExperienceYears = createDoctorDto.ExperienceYears,
                ImageName = createDoctorDto.ImageName
            };
        }
    }
}