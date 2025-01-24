using api.Interfaces;
using api.DataLayer.Models;
using api.DataLayer;
using Microsoft.AspNetCore.Mvc;
using api.Dtos.Doctor;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using api.Mappers;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorRepository _doctorRepository;
        private readonly UserManager<User> _userManager;
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public DoctorController(IDoctorRepository doctorRepository, UserManager<User> userManager, AppDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _doctorRepository = doctorRepository;
            _userManager = userManager;
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet]
        public async Task<IEnumerable<DoctorDto>> GetDoctors()
        {
            return await _doctorRepository.GetDoctors(Request);
        }

        [HttpGet("{id:int}")]
        public async Task<Doctor> GetDoctor(int id)
        {
            return await _doctorRepository.GetDoctor(id, Request);
        }

        [HttpPost]
        public async Task<Doctor> AddDoctor([FromForm]CreateDoctorDto doctorDto)
        {
            doctorDto.ImageName = await SaveImage(doctorDto.ImageFile);
            var user = await _context.Users.FirstOrDefaultAsync(c => c.FirstName == doctorDto.FirstName && c.LastName == doctorDto.LastName);
            var doctor = doctorDto.MapToDoctor(user.Id);
            return await _doctorRepository.AddDoctor(doctor);
        }

        [HttpPut("data/{id:int}")]
        public async Task<Doctor> UpdateDoctorData(int id, [FromForm]UpdateDoctorData doctorDto)
        {   
            return await _doctorRepository.UpdateDoctorData(id, doctorDto);
        }

        [HttpPut("image/{id:int}")]
        public async Task<Doctor> UpdateDoctorImage(int id, [FromForm]UpdateDoctorImage image)
        {   
            if (image.ImageFile != null){
                image.ImageName = await SaveImage(image.ImageFile);
            }
            return await _doctorRepository.UpdateDoctorImage(id, image);
        }

        [HttpDelete("{id}")]
        public async Task<Doctor> DeleteDoctor(int id)
        {
            return await _doctorRepository.DeleteDoctor(id);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
               await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}