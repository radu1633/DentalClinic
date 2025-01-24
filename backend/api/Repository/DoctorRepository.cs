using api.DataLayer;
using api.DataLayer.Models;
using Microsoft.EntityFrameworkCore;
using api.Interfaces;
using api.Dtos.Doctor;
using Azure.Core;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace api.Repository
{
    public class DoctorRepository : IDoctorRepository
    {
        private readonly AppDbContext _context;

        public DoctorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DoctorDto>> GetDoctors(HttpRequest request)
        {
            return await _context.Doctors
                .Select(x => new DoctorDto
                {
                    Id = x.DoctorId,
                    FirstName = _context.Users.FirstOrDefault(c => c.Id == x.UserId).FirstName,
                    LastName = _context.Users.FirstOrDefault(c => c.Id == x.UserId).LastName,
                    Specialization = x.Specialization,
                    ExperienceYears = x.ExperienceYears,
                    ImageSrc = String.Format("{0}://{1}{2}/images/{3}", request.Scheme, request.Host, request.PathBase, x.ImageName)
                })
                .ToListAsync();
        }

        public async Task<Doctor> GetDoctor(int id, HttpRequest request)
        {
            return await _context.Doctors.FirstOrDefaultAsync(x => x.DoctorId == id);
        }

        public async Task<Doctor> AddDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task<Doctor> UpdateDoctorData(int id, UpdateDoctorData doctorDto)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(c => c.DoctorId == id);
            var user = await _context.Users.FirstOrDefaultAsync(c => c.Id == doctor.UserId);
            if (doctor == null)
            {
                return null;
            }

            user.FirstName = doctorDto.FirstName;
            user.LastName = doctorDto.LastName;
            doctor.Specialization = doctorDto.Specialization;
            doctor.ExperienceYears = doctorDto.ExperienceYears;
            
            await _context.SaveChangesAsync();
            return doctor;
        }

         public async Task<Doctor> UpdateDoctorImage(int id, UpdateDoctorImage image)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(c => c.DoctorId == id);
            if (doctor == null)
            {
                return null;
            }

            doctor.ImageName = image.ImageName;

            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task<Doctor> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(x => x.DoctorId == id);
            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

       
    }
}